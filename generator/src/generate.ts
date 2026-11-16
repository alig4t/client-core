import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  renameSync,
  unlinkSync,
} from "node:fs";
import { resolve, join, dirname, relative, isAbsolute } from "node:path";
import prettier from "prettier";
import ts from "typescript";
import yaml from "js-yaml";
import { XmlEntityParser } from "./parsers/XmlParser.js";
import { MetaParser } from "./parsers/MetaParser.js";
import { EntityMerger } from "./utils/EntityMerger.js";
import {
  FrontendGenerator,
  snakeCase,
  type PlannedFile,
} from "./generators/FrontendGenerator.js";
import { resolvePathFromGenerator } from "./config.js";
import type {
  GeneratorConfig,
  EnhancedEntity,
  MenuConfig,
} from "./types/EntityTypes.js";
interface Manifest {
  version: 1;
  files: Record<string, string>;
}
export interface GenerationResult {
  changed: string[];
  preserved: string[];
  entities: string[];
}
const normalizeText = (value: string) => value.replace(/\r\n/g, "\n");
const hash = (value: string) =>
  createHash("sha256").update(normalizeText(value)).digest("hex");
const normalized = (path: string) =>
  resolve(path).replace(/\\/g, "/").toLowerCase();
function assertInside(path: string, root: string) {
  const rel = relative(root, path);
  if (rel.startsWith("..") || isAbsolute(rel))
    throw new Error("Output escapes configured root: " + path);
}
function checkTypes(files: PlannedFile[], config: GeneratorConfig) {
  const project = resolvePathFromGenerator(
      config.paths.projectRoot ?? "..",
      config,
    ),
    path = join(project, "tsconfig.app.json");
  if (!config.generation.typecheck) return;
  if (!existsSync(path))
    throw new Error(
      "Typecheck is enabled but tsconfig.app.json was not found: " + path,
    );
  const read = ts.readConfigFile(path, ts.sys.readFile);
  if (read.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(read.error.messageText, "\n"),
    );
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, project);
  const virtual = new Map(
    files
      .filter((file) => /\.tsx?$/.test(file.path))
      .map((file) => [normalized(file.path), file.content]),
  );
  const directories = new Set<string>();
  for (const file of files) {
    let path = dirname(file.path);
    while (path !== dirname(path)) {
      directories.add(normalized(path));
      path = dirname(path);
    }
  }
  const host = ts.createCompilerHost(parsed.options),
    readFile = host.readFile.bind(host),
    fileExists = host.fileExists.bind(host),
    directoryExists = host.directoryExists?.bind(host);
  host.fileExists = (path) => virtual.has(normalized(path)) || fileExists(path);
  host.readFile = (path) => virtual.get(normalized(path)) ?? readFile(path);
  host.directoryExists = (path) =>
    directories.has(normalized(path)) || Boolean(directoryExists?.(path));
  host.getSourceFile = (fileName, languageVersion) => {
    const content = host.readFile(fileName);
    return content === undefined
      ? undefined
      : ts.createSourceFile(fileName, content, languageVersion, true);
  };
  const program = ts.createProgram(
    [
      ...new Set([
        ...parsed.fileNames,
        ...files
          .filter((file) => /\.tsx?$/.test(file.path))
          .map((file) => file.path),
      ]),
    ],
    { ...parsed.options, noEmit: true },
    host,
  );
  const errors = ts
    .getPreEmitDiagnostics(program)
    .filter((error) => error.category === ts.DiagnosticCategory.Error);
  if (errors.length)
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(errors, {
        getCanonicalFileName: (path) => path,
        getCurrentDirectory: () => project,
        getNewLine: () => "\n",
      }),
    );
}
function validateGraph(entities: EnhancedEntity[], config: GeneratorConfig) {
  const byName = new Map(entities.map((entity) => [entity.name, entity]));
  for (const entity of entities)
    for (const relationship of entity.relationships) {
      const target = byName.get(relationship.relatedEntityName),
        core = config.coreEntities[relationship.relatedEntityName];
      if (!target && !core?.isCore)
        throw new Error(
          entity.name +
            "." +
            relationship.name +
            ": unknown entity " +
            relationship.relatedEntityName,
        );
      const display =
        entity.definition.fields[relationship.name].relation?.displayField;
      if (
        target &&
        display &&
        display !== "id" &&
        !target.definition.fields[display]
      )
        throw new Error(
          entity.name +
            "." +
            relationship.name +
            ": unknown display field " +
            display +
            " on " +
            target.name,
        );
      if (core?.isCore && !core.skipImport && !core.importPath)
        throw new Error(
          "Core entity importPath required: " + relationship.relatedEntityName,
        );
    }
}
export async function generate(
  config: GeneratorConfig,
  entityName?: string,
  options: { dryRun?: boolean; check?: boolean } = {},
): Promise<GenerationResult> {
  const directory = resolvePathFromGenerator(
    config.paths.entityDefinitions,
    config,
  );
  const parser = new XmlEntityParser(),
    metaParser = new MetaParser(),
    merger = new EntityMerger(config);
  const menuPath = resolvePathFromGenerator(config.paths.menuConfig, config);
  const menu = existsSync(menuPath)
    ? (yaml.load(readFileSync(menuPath, "utf8")) as MenuConfig)
    : { entities: {} };
  if (!menu || !menu.entities || typeof menu.entities !== "object")
    throw new Error("Invalid menu configuration");
  const entities = readdirSync(directory)
    .filter((file) => file.endsWith(".xml"))
    .sort()
    .map((file) => {
      const entity = parser.parseFile(join(directory, file)),
        meta = metaParser.parseFile(
          join(directory, file.replace(/\.xml$/, ".meta.yaml")),
        );
      const entry = menu.entities[entity.name];
      return merger.merge(
        entity,
        entry
          ? {
              ...(meta ?? { fields: {} }),
              routing: { ...entry, ...meta?.routing },
            }
          : meta,
      );
    });
  if (!entities.length) throw new Error("No entity definitions found");
  validateGraph(entities, config);
  const selected = entities.filter(
    (entity) =>
      entity.generate &&
      (!entityName || entity.name.toLowerCase() === entityName.toLowerCase()),
  );
  if (entityName && !selected.length)
    throw new Error("Entity not found or generate=false: " + entityName);
  const renderer = new FrontendGenerator(config);
  const planned = (
    await Promise.all(selected.map((entity) => renderer.plan(entity)))
  ).flat();
  const output = resolvePathFromGenerator(config.paths.outputBase, config),
    router = resolvePathFromGenerator(
      config.paths.routerOutput ?? "../src/router",
      config,
    );
  if (config.generation.generateRoutes) {
    const names = new Set<string>(
      existsSync(output)
        ? readdirSync(output, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
        : [],
    );
    selected
      .filter((entity) => entity.definition.routing && !entity.isCore)
      .forEach((entity) => names.add(entity.name));
    const imports: string[] = [],
      routeNames: string[] = [],
      viewImports: string[] = [],
      viewNames: string[] = [];
    const available = (path: string) =>
      existsSync(path) || planned.some((file) => file.path === path);
    for (const name of Array.from(names)
      .filter((name) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(name))
      .sort()) {
      const routes = join(output, name, name + ".routes.tsx"),
        views = join(output, name, name + ".viewnames.ts");
      const importPath = (path: string) =>
        JSON.stringify(
          "./" +
            relative(router, path)
              .replace(/\\/g, "/")
              .replace(/\.tsx?$/, ""),
        );
      if (available(routes)) {
        imports.push(
          "import { " + name + "Routes } from " + importPath(routes) + ";",
        );
        routeNames.push("..." + name + "Routes");
      }
      if (available(views)) {
        const constant = snakeCase(name) + "_VIEWNAMES";
        viewImports.push(
          "import { " + constant + " } from " + importPath(views) + ";",
        );
        viewNames.push("..." + constant);
      }
    }
    planned.push({
      path: join(router, "generated.routes.ts"),
      content:
        imports.join("\n") +
        "\nexport const generatedRoutes = [" +
        routeNames.join(",") +
        "];\n",
      owned: true,
    });
    planned.push({
      path: join(router, "generated.viewnames.ts"),
      content:
        viewImports.join("\n") +
        "\nexport const GENERATED_VIEWNAMES = {" +
        viewNames.join(",") +
        "} as const;\n",
      owned: true,
    });
    for (const entity of selected)
      if (entity.definition.routing)
        menu.entities[entity.name] = entity.definition
          .routing as MenuConfig["entities"][string];
    planned.push({
      path: menuPath,
      content: yaml.dump(menu, {
        sortKeys: true,
        lineWidth: 120,
        noRefs: true,
      }),
      owned: false,
    });
  }
  if (config.generation.generatePermissions) {
    const values: Record<string, string> = {};
    for (const entity of entities)
      for (const operation of [
        "root",
        "create",
        "read",
        "update",
        "delete",
        "search",
      ])
        values[
          entity.name + "_" + operation[0].toUpperCase() + operation.slice(1)
        ] = entity.name.toLowerCase() + ":" + operation;
    planned.push({
      path: join(router, "generated.permissions.ts"),
      content:
        "export const GENERATED_PERMISSIONS = " +
        JSON.stringify(values) +
        " as const;\n",
      owned: true,
    });
  }
  for (const file of planned)
    if (/\.tsx?$/.test(file.path) && config.generation.formatWithPrettier)
      file.content = await prettier.format(file.content, {
        parser: "typescript",
      });
  const manifestPath = join(output, ".generator-manifest.json");
  const manifest: Manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : { version: 1, files: {} };
  const changed: PlannedFile[] = [],
    preserved: string[] = [];
  for (const file of planned) {
    const root = file.path.startsWith(output)
      ? output
      : file.path.startsWith(router)
        ? router
        : dirname(menuPath);
    assertInside(file.path, root);
    const existing = existsSync(file.path)
      ? readFileSync(file.path, "utf8")
      : undefined;
    if (
      existing !== undefined &&
      normalizeText(existing) === normalizeText(file.content)
    )
      continue;
    const key = relative(output, file.path).replace(/\\/g, "/");
    if (
      existing !== undefined &&
      file.owned &&
      manifest.files[key] &&
      hash(existing) !== manifest.files[key]
    )
      throw new Error(
        "Generated file was edited; move changes into the extension: " +
          file.path,
      );
    if (
      existing !== undefined &&
      file.owned &&
      !config.generation.overwriteExisting
    ) {
      preserved.push(file.path);
      continue;
    }
    changed.push(file);
  }
  checkTypes(changed, config);
  if (!options.dryRun && !options.check) {
    const backup = new Map<string, string | undefined>();
    try {
      for (const file of changed) {
        backup.set(
          file.path,
          existsSync(file.path) ? readFileSync(file.path, "utf8") : undefined,
        );
        mkdirSync(dirname(file.path), { recursive: true });
        const temp = file.path + ".generator-tmp";
        writeFileSync(temp, file.content, "utf8");
        renameSync(temp, file.path);
      }
      for (const file of planned)
        if (file.owned && !preserved.includes(file.path))
          manifest.files[relative(output, file.path).replace(/\\/g, "/")] =
            hash(file.content);
      mkdirSync(output, { recursive: true });
      const manifestContent = JSON.stringify(manifest, null, 2) + "\n";
      if (
        !existsSync(manifestPath) ||
        readFileSync(manifestPath, "utf8") !== manifestContent
      )
        writeFileSync(manifestPath, manifestContent, "utf8");
    } catch (error) {
      for (const [path, content] of backup) {
        if (content === undefined) {
          if (existsSync(path)) unlinkSync(path);
        } else writeFileSync(path, content, "utf8");
      }
      throw error;
    }
  }
  return {
    changed: changed.map((file) => file.path),
    preserved,
    entities: selected.map((entity) => entity.name),
  };
}
