// @vitest-environment node
import { afterEach, describe, it, expect } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { resolve, join, sep } from "node:path";
import { generate } from "../generator/src/generate";
import { loadConfig } from "../generator/src/config";
import { MetaParser } from "../generator/src/parsers/MetaParser";
import { XmlEntityParser } from "../generator/src/parsers/XmlParser";
import { EntityMerger } from "../generator/src/utils/EntityMerger";
import ts from "typescript";
const fixtureBase = resolve(".tmp/generator-fixtures"),
  directories: string[] = [];
function fixture() {
  mkdirSync(fixtureBase, { recursive: true });
  const root = mkdtempSync(join(fixtureBase, "case-"));
  directories.push(root);
  const definitions = join(root, "definitions");
  mkdirSync(definitions);
  const config = loadConfig(resolve("generator/config.json"));
  config.paths = {
    entityDefinitions: definitions,
    outputBase: join(root, "src/Models"),
    coreComponents: resolve("src/core"),
    menuConfig: join(root, "menu.yaml"),
    routerOutput: join(root, "src/router"),
    projectRoot: root,
  };
  config.coreEntities = {};
  config.generation.typecheck = false;
  return { root, definitions, config };
}
afterEach(() => {
  for (const directory of directories.splice(0)) {
    const target = resolve(directory);
    if (!target.startsWith(fixtureBase + sep))
      throw new Error("Unsafe fixture cleanup");
    rmSync(target, { recursive: true, force: true });
  }
});
const xml = (name: string, fields: string, relationships = "") =>
  "<entity><name>" +
  name +
  "</name><generate>true</generate><fields>" +
  fields +
  "</fields><relationships>" +
  relationships +
  "</relationships></entity>";
const boolean =
  "<field><name>enabled</name><type>BOOLEAN</type><searchable>true</searchable></field>";
describe("generator pipeline", () => {
  it("generates boolean-only and to-many-only entities, partial metadata and safe quoted labels; registers and typechecks them", async () => {
    const { root, definitions, config } = fixture();
    writeFileSync(join(definitions, "Flag.xml"), xml("Flag", boolean));
    writeFileSync(
      join(definitions, "Flag.meta.yaml"),
      "displayName: Flag\nrouting:\n  basePath: /flags\nfields:\n  enabled:\n    label: Enabled\n",
    );
    writeFileSync(
      join(definitions, "Group.xml"),
      xml(
        "Group",
        "",
        "<relationship><name>flags</name><relationshipType>ONE_TO_MANY</relationshipType><relatedEntityName>Flag</relatedEntityName></relationship>",
      ),
    );
    writeFileSync(
      join(definitions, "Group.meta.yaml"),
      "routing:\n  basePath: /groups\nrelationships:\n  flags:\n    label: 'A \"quoted\" label'\n",
    );
    const result = await generate(config);
    expect(result.changed.length).toBeGreaterThan(10);
    const definition = readFileSync(
      join(root, "src/Models/Group/generated/Group.definition.ts"),
      "utf8",
    );
    expect(definition).toContain("multiple: true");
    expect(definition).toContain("quoted");
    expect(
      readFileSync(join(root, "src/router/generated.routes.ts"), "utf8"),
    ).toContain("GroupRoutes");
    expect(
      readFileSync(join(root, "src/router/generated.permissions.ts"), "utf8"),
    ).toContain("Group_Create");
    const types = readFileSync(
      join(root, "src/Models/Flag/generated/FlagModel.ts"),
      "utf8",
    );
    expect(types).toContain("enabled?: boolean");
    mkdirSync(join(root, "src/router"), { recursive: true });
    writeFileSync(
      join(root, "src/router/path.types.ts"),
      "export type { RouteConfig } from " +
        JSON.stringify(resolve("src/router/path.types").replace(/\\/g, "/")) +
        ";",
    );
    const compiler: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
      skipLibCheck: true,
      noEmit: true,
      esModuleInterop: true,
      baseUrl: root,
      paths: {
        "@/core/*": [resolve("src/core/*")],
        "@/Models/*": [join(root, "src/Models/*")],
        "@/router/*": [join(root, "src/router/*")],
      },
    };
    const program = ts.createProgram(
      result.changed.filter((path) => /\.tsx?$/.test(path)),
      compiler,
    );
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .filter((value) => value.category === ts.DiagnosticCategory.Error);
    expect(
      diagnostics.map((error) =>
        ts.flattenDiagnosticMessageText(error.messageText, "\n"),
      ),
    ).toEqual([]);
  });
  it("is idempotent and preserves handwritten wrappers and extensions", async () => {
    const { root, definitions, config } = fixture();
    writeFileSync(join(definitions, "Flag.xml"), xml("Flag", boolean));
    await generate(config);
    const wrapper = join(root, "src/Models/Flag/FlagCreate.tsx"),
      extension = join(root, "src/Models/Flag/Flag.extension.ts");
    const model = join(root, "src/Models/Flag/generated/FlagModel.ts");
    writeFileSync(model, readFileSync(model, "utf8").replace(/\n/g, "\r\n"));
    writeFileSync(wrapper, "// handwritten wrapper\n");
    writeFileSync(extension, "// handwritten extension\n");
    expect((await generate(config)).changed).toEqual([]);
    expect(readFileSync(wrapper, "utf8")).toContain("handwritten");
    expect(readFileSync(extension, "utf8")).toContain("handwritten");
  });
  it("does not write on dry-run or invalid reference", async () => {
    const { root, definitions, config } = fixture();
    writeFileSync(join(definitions, "Flag.xml"), xml("Flag", boolean));
    expect(
      (await generate(config, undefined, { dryRun: true })).changed.length,
    ).toBeGreaterThan(0);
    expect(existsSync(join(root, "src"))).toBe(false);
    writeFileSync(
      join(definitions, "Broken.xml"),
      xml(
        "Broken",
        "",
        "<relationship><name>missing</name><relationshipType>MANY_TO_ONE</relationshipType><relatedEntityName>Missing</relatedEntityName></relationship>",
      ),
    );
    await expect(generate(config)).rejects.toThrow("unknown entity");
    expect(existsSync(join(root, "src"))).toBe(false);
  });
  it("detects edits to generated files and keeps all files intact on syntax failure", async () => {
    const { root, definitions, config } = fixture();
    writeFileSync(join(definitions, "Flag.xml"), xml("Flag", boolean));
    await generate(config);
    const path = join(root, "src/Models/Flag/generated/FlagModel.ts");
    writeFileSync(path, readFileSync(path, "utf8") + "\n// manual edit\n");
    await expect(generate(config)).rejects.toThrow("Generated file was edited");
    const bad = join(root, "bad.hbs");
    writeFileSync(bad, "const = invalid syntax");
    config.templates.Model = bad;
    await expect(generate(config)).rejects.toThrow();
    expect(readFileSync(path, "utf8")).toContain("// manual edit");
  });
  it("honors route and permission switches and enum overwrite protection", async () => {
    const { root, definitions, config } = fixture();
    config.generation.generateRoutes = false;
    config.generation.generatePermissions = false;
    writeFileSync(
      join(definitions, "Flag.xml"),
      xml(
        "Flag",
        boolean +
          "<field><name>status</name><type>ENUM</type><enums><enum><name>A</name><value>A label</value></enum></enums></field>",
      ),
    );
    await generate(config);
    expect(existsSync(join(root, "src/router"))).toBe(false);
    const enumPath = join(root, "src/Models/Flag/generated/FlagStatusEnum.ts"),
      before = readFileSync(enumPath, "utf8");
    config.generation.overwriteExisting = false;
    writeFileSync(
      join(definitions, "Flag.meta.yaml"),
      "displayName: Changed\nfields:\n  status:\n    enums:\n      A: Changed label\n",
    );
    const result = await generate(config);
    expect(result.preserved).toContain(enumPath);
    expect(readFileSync(enumPath, "utf8")).toBe(before);
  });
  it("validates input types and merges individual field defaults", () => {
    const { config } = fixture(),
      entity = new XmlEntityParser().parse(xml("Flag", boolean));
    const partial = new MetaParser().parse(
      "fields:\n  enabled:\n    label: Flag\n",
    );
    const merged = new EntityMerger(config).merge(entity, partial);
    expect(merged.definition.fields.enabled).toMatchObject({
      type: "boolean",
      dataType: "boolean",
      label: "Flag",
      searchable: true,
    });
    expect(() =>
      new MetaParser().parse("fields:\n  enabled:\n    type: not-a-widget"),
    ).toThrow();
    expect(() =>
      new XmlEntityParser().parse(
        xml("Bad", "<field><name>bad</name><type>UNKNOWN</type></field>"),
      ),
    ).toThrow();
  });
});
