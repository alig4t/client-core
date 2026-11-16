import Handlebars from "handlebars";
import { readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import prettier from "prettier";
import ts from "typescript";
import type { EnhancedEntity, GeneratorConfig } from "../types/EntityTypes.js";
import { resolvePathFromGenerator } from "../config.js";
import { registerHelpers } from "../utils/TemplateHelpers.js";
import { dataTypeOf } from "../../../src/core/entity/fields";
import type { FormFieldMetadata } from "../../../src/core/forms/FieldFormTypes";
export interface PlannedFile {
  path: string;
  content: string;
  owned: boolean;
}
const literal = (value: unknown) => JSON.stringify(value) ?? "undefined";
export const snakeCase = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
export class FrontendGenerator {
  private templates = new Map<string, Handlebars.TemplateDelegate>();
  constructor(private config: GeneratorConfig) {
    const engine = Handlebars.create();
    registerHelpers(engine);
    for (const [name, path] of Object.entries(config.templates))
      this.templates.set(
        name,
        engine.compile(
          readFileSync(resolvePathFromGenerator(path, config), "utf8"),
          { noEscape: true, strict: true },
        ),
      );
  }
  async plan(entity: EnhancedEntity): Promise<PlannedFile[]> {
    if (entity.isCore) return [];
    const output = resolvePathFromGenerator(
        this.config.paths.outputBase,
        this.config,
      ),
      root = join(output, entity.name),
      generated = join(root, "generated");
    const definition = entity.definition,
      fields = definition.fields,
      imports = new Map<string, string>();
    const projectSource = join(
      resolvePathFromGenerator(
        this.config.paths.projectRoot ?? "..",
        this.config,
      ),
      "src",
    );
    const alias = (path: string, fallback: string) => {
      const name = relative(projectSource, path).replace(/\\/g, "/");
      return name.startsWith("..") ? fallback : "@/" + name;
    };
    const modelAlias = alias(output, "@/Models"),
      coreAlias = alias(
        resolvePathFromGenerator(this.config.paths.coreComponents, this.config),
        "@/core",
      );
    const typeOf = (name: string) => {
      const relationship = entity.relationships.find(
          (value) => value.name === name,
        ),
        field = fields[name];
      if (relationship) {
        const core = this.config.coreEntities[relationship.relatedEntityName];
        const type = relationship.relatedEntityName + "Model";
        const importPath =
          core?.importPath ??
          modelAlias + "/" + relationship.relatedEntityName + "/" + type;
        if (!core?.skipImport) imports.set(type, importPath);
        const base = core?.skipImport ? "{ id: EntityId }" : type;
        return (
          (field.multiple ? base + "[]" : base) +
          (field.nullable ? " | null" : "")
        );
      }
      const original = entity.fields.find((value) => value.name === name)!;
      let base = original.enums?.length
        ? original.enums.map((value) => literal(value.name)).join(" | ")
        : this.config.fieldTypeMapping[original.type];
      if (original.type === "LONG" || original.type === "BIG_DECIMAL")
        base = field.numericEncoding === "number" ? "number" : "string";
      return (
        (field.multiple ? "(" + base + ")[]" : base) +
        (field.nullable ? " | null" : "")
      );
    };
    const responseFields = Object.entries(fields)
      .map(
        ([name, field]) =>
          "  " +
          literal(name) +
          (field.required ? "" : "?") +
          ": " +
          typeOf(name) +
          ";",
      )
      .join("\n");
    const nestedInputType = (
      field: FormFieldMetadata,
      mode: "create" | "edit",
    ): string => {
      const kind = dataTypeOf(field);
      let type: string;
      if (kind === "object" || kind === "array")
        type =
          "{ " +
          Object.entries(field.fields ?? {})
            .filter(
              ([, child]) =>
                !child.readOnly && !child.hidden && child[mode] !== false,
            )
            .map(
              ([name, child]) =>
                literal(name) +
                (child.required ? "" : "?") +
                ": " +
                nestedInputType(child, mode) +
                ";",
            )
            .join(" ") +
          " }" +
          (kind === "array" ? "[]" : "");
      else if (kind === "integer" || kind === "double") type = "number";
      else if (kind === "long" || kind === "decimal")
        type = field.numericEncoding === "number" ? "number" : "string";
      else if (kind === "boolean") type = "boolean";
      else if (kind === "enum")
        type =
          field.options?.map((option) => literal(option.value)).join(" | ") ||
          "string";
      else if (kind === "file" || kind === "reference")
        type =
          field.valueMode === "id" || field.relation?.valueMode === "id"
            ? "EntityId"
            : "{ id: EntityId }";
      else type = "string";
      if (field.multiple && kind !== "array") type = "(" + type + ")[]";
      return type + (field.nullable ? " | null" : "");
    };
    const inputFields = (mode: "create" | "edit") =>
      Object.entries(fields)
        .filter(
          ([, field]) =>
            !field.readOnly && !field.hidden && field[mode] !== false,
        )
        .map(([name, field]) => {
          const relationship = entity.relationships.find(
            (value) => value.name === name,
          );
          let type = typeOf(name);
          if (relationship) {
            const base =
              field.valueMode === "id" || field.relation?.valueMode === "id"
                ? "EntityId"
                : "{ id: EntityId }";
            type =
              (field.multiple ? base + "[]" : base) +
              (field.nullable ? " | null" : "");
          }
          if (dataTypeOf(field) === "object" || dataTypeOf(field) === "array")
            type = nestedInputType(field, mode);
          return (
            "  " +
            literal(name) +
            (mode === "edit" || !field.required ? "?" : "") +
            ": " +
            type +
            ";"
          );
        })
        .join("\n");
    const prefix = snakeCase(entity.name),
      routing = definition.routing;
    const context = {
      entityName: entity.name,
      usesEntityId: entity.relationships.length > 0,
      modelImports: Array.from(
        imports,
        ([name, path]) =>
          "import type { " + name + " } from " + literal(path) + ";",
      ).join("\n"),
      responseFields,
      createFields: inputFields("create"),
      updateFields: inputFields("edit"),
      idTsType: definition.idType === "string" ? "string" : "number",
      displayFieldLiteral: literal(definition.displayField),
      displayNameLiteral: literal(definition.displayName),
      pluralDisplayNameLiteral: literal(definition.pluralDisplayName),
      endpointLiteral: literal(definition.endpoint),
      columnsLiteral: literal(
        Object.entries(fields)
          .filter(
            ([, field]) =>
              field.list !== false && !field.hidden && !field.writeOnly,
          )
          .map(([name, field]) => ({
            name,
            label: field.label,
            sortable: field.sortable ?? false,
          })),
      ),
      viewnamePrefix: prefix,
      viewnamesConstant: prefix + "_VIEWNAMES",
      iconName: routing?.menuIcon ?? "Database",
      basePathLiteral: literal(routing?.basePath),
      createPathLiteral: literal(routing?.basePath + "/create"),
      detailPathLiteral: literal(routing?.basePath + "/:id"),
      editPathLiteral: literal(routing?.basePath + "/:id/edit"),
      menuLabelLiteral: literal(
        routing?.menuLabel ?? definition.pluralDisplayName,
      ),
      parentLiteral: literal(routing?.menuParent),
      showInMenu: literal(routing?.showInMenu ?? false),
      menuOrder: literal(routing?.menuOrder ?? 0),
      createLabelLiteral: literal("ایجاد " + definition.displayName),
      detailLabelLiteral: literal("جزئیات " + definition.displayName),
      editLabelLiteral: literal("ویرایش " + definition.displayName),
    };
    const planned: PlannedFile[] = [];
    const add = async (path: string, content: string, owned = true) => {
      content = content.replaceAll('"@/core/', '"' + coreAlias + "/");
      const formatted = this.config.generation.formatWithPrettier
        ? await prettier.format(content, {
            parser: "typescript",
            semi: true,
            singleQuote: false,
          })
        : content;
      const check = ts.transpileModule(formatted, {
        fileName: path,
        reportDiagnostics: true,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2022,
        },
      });
      const diagnostics = (check.diagnostics ?? []).filter(
        (value) => value.category === ts.DiagnosticCategory.Error,
      );
      if (diagnostics.length)
        throw new Error(
          path +
            ": " +
            ts.flattenDiagnosticMessageText(diagnostics[0].messageText, "\n"),
        );
      planned.push({ path, content: formatted, owned });
    };
    const lookupServices = new Map<string, string>();
    for (const relationship of entity.relationships) {
      const core = this.config.coreEntities[relationship.relatedEntityName];
      if (core?.servicePath && !core.skipImport && !relationship.document)
        lookupServices.set(relationship.relatedEntityName, core.servicePath);
    }
    const lookupImports = Array.from(
      lookupServices,
      ([name, path]) =>
        "import " + name + "LookupService from " + literal(path) + ";",
    ).join("\n");
    const lookupEntries = Array.from(
      lookupServices,
      ([name]) =>
        literal(name) +
        ": { getAll: async params => { const page = await " +
        name +
        "LookupService.getAll(params); return { ...page, data: page.data.map(record => ({ ...record })) }; }, getById: async (id, options) => ({ ...await " +
        name +
        "LookupService.getById(id, options) }) }",
    ).join(",");
    await add(
      join(generated, entity.name + ".definition.ts"),
      'import { extendEntityDefinition, type EntityDefinition, type LookupAdapter } from "@/core/entity";\nimport { definitionOverrides } from "../' +
        entity.name +
        '.extension";\n' +
        lookupImports +
        "\nconst base = " +
        literal(definition) +
        " satisfies EntityDefinition;\nexport const " +
        entity.name +
        "Definition: EntityDefinition = extendEntityDefinition(base, definitionOverrides);\nexport const " +
        entity.name +
        "Lookups: Record<string, LookupAdapter> = {" +
        lookupEntries +
        "};\n",
    );
    const extension = join(root, entity.name + ".extension.ts");
    if (!existsSync(extension))
      await add(
        extension,
        'import type { EntityDefinitionOverrides, EntityPageProps } from "@/core/entity";\nimport type { ' +
          entity.name +
          "Model, " +
          entity.name +
          "CreateInput, " +
          entity.name +
          'UpdateInput } from "./generated/' +
          entity.name +
          'Model";\nexport const definitionOverrides: EntityDefinitionOverrides = {};\nexport const entityExtension: Partial<Omit<EntityPageProps<' +
          entity.name +
          "Model, " +
          entity.name +
          "CreateInput, " +
          entity.name +
          'UpdateInput>, "definition">> = {};\n',
        false,
      );
    const files: Record<string, string> = {
      Model: entity.name + "Model.ts",
      ModelMeta: entity.name + "Model.meta.ts",
      Service: entity.name + "Service.ts",
      Page: entity.name + "Page.tsx",
      Create: entity.name + "Create.tsx",
      Display: entity.name + "Display.tsx",
      Search: entity.name + "Search.tsx",
      Table: entity.name + "Table.tsx",
      TableColumns: entity.name + "TableColumns.tsx",
    };
    if (routing && this.config.generation.generateRoutes) {
      files.ModuleRoutes = entity.name + ".routes.tsx";
      files.ModuleViewNames = entity.name + ".viewnames.ts";
    }
    for (const [templateName, fileName] of Object.entries(files)) {
      const template = this.templates.get(templateName);
      if (!template) throw new Error("Missing template: " + templateName);
      const generatedName =
        templateName === "TableColumns"
          ? entity.name + ".columns.ts"
          : fileName;
      await add(join(generated, generatedName), template(context));
      const wrapper = join(root, fileName);
      if (!existsSync(wrapper)) {
        const module = "./generated/" + generatedName.replace(/\.tsx?$/, "");
        const named = [
          "Model",
          "ModelMeta",
          "TableColumns",
          "ModuleRoutes",
          "ModuleViewNames",
        ].includes(templateName);
        await add(
          wrapper,
          (named ? "export * from " : "export { default } from ") +
            literal(module) +
            ";\n",
          false,
        );
      }
    }
    for (const field of entity.fields)
      if (field.enums?.length) {
        const name =
          entity.name +
          field.name[0].toUpperCase() +
          field.name.slice(1) +
          "Enum";
        const values = Object.fromEntries(
            field.enums.map((value) => [value.name, value.name]),
          ),
          labels = Object.fromEntries(
            fields[field.name].options!.map((value) => [
              value.value,
              value.label,
            ]),
          );
        await add(
          join(generated, name + ".ts"),
          "export const " +
            name +
            " = " +
            literal(values) +
            " as const;\nexport type " +
            name +
            " = typeof " +
            name +
            "[keyof typeof " +
            name +
            "];\nexport const " +
            name +
            "Labels = " +
            literal(labels) +
            ";\n",
        );
        if (!existsSync(join(root, name + ".ts")))
          await add(
            join(root, name + ".ts"),
            "export * from " + literal("./generated/" + name) + ";\n",
            false,
          );
      }
    return planned;
  }
}
