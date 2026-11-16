import type { EntityDefinition } from "../../../src/core/entity/types";
import type {
  FormFieldMetadata,
  FieldType as WidgetType,
} from "../../../src/core/forms/FieldFormTypes";
export type FieldType =
  | "STRING"
  | "INTEGER"
  | "LONG"
  | "DOUBLE"
  | "BIG_DECIMAL"
  | "BOOLEAN"
  | "DATE"
  | "LOCAL_DATE"
  | "LOCAL_DATE_TIME"
  | "ENUM";
export type RelationshipType =
  | "ONE_TO_ONE"
  | "ONE_TO_MANY"
  | "MANY_TO_ONE"
  | "MANY_TO_MANY";
export type FormFieldType = WidgetType;
export interface EnumValue {
  name: string;
  value: string;
  label?: string;
}
export interface Field {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  searchable?: boolean;
  indexed?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  enums?: EnumValue[];
}
export interface Relationship {
  name: string;
  relationshipType: RelationshipType;
  relatedEntityName: string;
  joinColumnName?: string;
  joinTableName?: string;
  required?: boolean;
  unique?: boolean;
  fetch?: "LAZY" | "EAGER";
  mappedBy?: string;
  coreUser?: boolean;
  document?: boolean;
}
export interface Entity {
  name: string;
  tableName?: string;
  generate: boolean;
  fields: Field[];
  relationships: Relationship[];
}
export type FieldMeta = FormFieldMetadata;
export interface RoutingMeta {
  basePath: string;
  menuLabel: string;
  menuIcon?: string;
  menuParent?: string;
  showInMenu: boolean;
  menuOrder?: number;
}
export interface EntityMeta {
  displayName?: string;
  displayNamePlural?: string;
  autocompleteField?: string;
  endpoint?: string;
  idType?: "number" | "string";
  routing?: Partial<RoutingMeta>;
  operations?: EntityDefinition["operations"];
  fields: Record<string, Partial<FieldMeta>>;
  relationships?: Record<string, Partial<FieldMeta>>;
}
export interface EnhancedEntity extends Entity {
  meta: EntityMeta;
  definition: EntityDefinition;
  isCore: boolean;
  coreImportPath?: string;
}
export interface MenuConfig {
  entities: Record<string, RoutingMeta>;
}
export interface CoreEntityInfo {
  isCore: boolean;
  importPath?: string;
  servicePath?: string;
  skipImport?: boolean;
  endpoint?: string;
  displayField?: string;
}
export interface GeneratorConfig {
  baseDir?: string;
  paths: {
    entityDefinitions: string;
    outputBase: string;
    coreComponents: string;
    menuConfig: string;
    routerOutput?: string;
    projectRoot?: string;
  };
  generation: {
    formatWithPrettier: boolean;
    generateRoutes: boolean;
    generatePermissions: boolean;
    overwriteExisting: boolean;
    typecheck?: boolean;
  };
  coreEntities: Record<string, CoreEntityInfo>;
  templates: Record<string, string>;
  fieldTypeMapping: Record<FieldType, string>;
  formTypeMapping: Record<FieldType, FormFieldType>;
}
