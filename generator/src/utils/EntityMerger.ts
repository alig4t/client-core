import { entityDefinitionSchema } from "../../../src/core/entity/definitionSchema";
import type {
  DataType,
  FormFieldMetadata,
} from "../../../src/core/forms/FieldFormTypes";
import type {
  Entity,
  EntityMeta,
  EnhancedEntity,
  GeneratorConfig,
} from "../types/EntityTypes.js";
const kinds: Record<string, DataType> = {
  STRING: "string",
  INTEGER: "integer",
  LONG: "long",
  DOUBLE: "double",
  BIG_DECIMAL: "decimal",
  BOOLEAN: "boolean",
  DATE: "instant",
  LOCAL_DATE: "date",
  LOCAL_DATE_TIME: "datetime",
  ENUM: "enum",
};
export class EntityMerger {
  constructor(private config: GeneratorConfig) {}
  merge(entity: Entity, meta: EntityMeta | null): EnhancedEntity {
    const effective = meta ?? { fields: {}, relationships: {} };
    const names = new Set(
      [...entity.fields, ...entity.relationships].map((field) => field.name),
    );
    for (const name of [
      ...Object.keys(effective.fields),
      ...Object.keys(effective.relationships ?? {}),
    ])
      if (!names.has(name))
        throw new Error(
          entity.name + ": metadata references unknown field " + name,
        );
    const fields: Record<string, FormFieldMetadata> = {};
    entity.fields.forEach((field, index) => {
      const override = effective.fields[field.name] ?? {};
      fields[field.name] = {
        label: field.name,
        type: this.config.formTypeMapping[field.type],
        dataType: kinds[field.type],
        required: field.required,
        unique: field.unique,
        indexed: field.indexed,
        searchable: field.searchable,
        sortable: field.searchable,
        list: true,
        detail: true,
        order: index,
        min: field.min,
        max: field.max,
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        ...(["long", "decimal"].includes(kinds[field.type])
          ? {
              numericEncoding:
                this.config.fieldTypeMapping[field.type] === "number"
                  ? "number"
                  : "string",
            }
          : {}),
        ...override,
        ...(field.enums
          ? {
              options: field.enums.map((value) => ({
                value: value.name,
                label:
                  override.options?.find(
                    (option) => option.value === value.name,
                  )?.label ?? value.value,
              })),
            }
          : {}),
      };
    });
    entity.relationships.forEach((relation, index) => {
      const override = effective.relationships?.[relation.name] ?? {};
      const core = this.config.coreEntities[relation.relatedEntityName];
      const multiple =
        relation.relationshipType === "ONE_TO_MANY" ||
        relation.relationshipType === "MANY_TO_MANY";
      fields[relation.name] = {
        label: relation.name,
        type: relation.document ? "File" : "autocomplete",
        dataType: relation.document ? "file" : "reference",
        required: relation.required,
        list: false,
        detail: true,
        order: entity.fields.length + index,
        ...override,
        multiple,
        ...(relation.document
          ? { valueMode: override.valueMode ?? "object" }
          : {
              relation: {
                entity: relation.relatedEntityName,
                endpoint:
                  core?.endpoint ??
                  "/" + relation.relatedEntityName.toLowerCase(),
                displayField:
                  override.displayField ?? core?.displayField ?? "id",
                multiple,
                valueMode: "object",
                ...override.relation,
              },
            }),
      };
    });
    const definition = entityDefinitionSchema.parse({
      schemaVersion: 1,
      name: entity.name,
      endpoint: effective.endpoint ?? "/" + entity.name.toLowerCase(),
      displayName: effective.displayName ?? entity.name,
      pluralDisplayName: effective.displayNamePlural ?? entity.name + "s",
      displayField:
        effective.autocompleteField ?? entity.fields[0]?.name ?? "id",
      idType: effective.idType ?? "number",
      fields,
      operations: effective.operations,
      routing: effective.routing
        ? {
            menuLabel: effective.displayNamePlural ?? entity.name,
            menuIcon: "Database",
            showInMenu: true,
            ...effective.routing,
          }
        : undefined,
      ...(this.config.generation.generatePermissions
        ? {
            permissions: Object.fromEntries(
              ["read", "create", "update", "delete"].map((operation) => [
                operation,
                entity.name.toLowerCase() + ":" + operation,
              ]),
            ),
          }
        : {}),
    });
    return {
      ...entity,
      meta: effective,
      definition,
      isCore: this.config.coreEntities[entity.name]?.isCore ?? false,
      coreImportPath: this.config.coreEntities[entity.name]?.importPath,
    };
  }
}
