// Generator Type Definitions

export type FieldType =
  | 'STRING'
  | 'INTEGER'
  | 'LONG'
  | 'DOUBLE'
  | 'BIG_DECIMAL'
  | 'BOOLEAN'
  | 'DATE'
  | 'LOCAL_DATE'
  | 'LOCAL_DATE_TIME'
  | 'ENUM';

export type RelationshipType =
  | 'ONE_TO_ONE'
  | 'ONE_TO_MANY'
  | 'MANY_TO_ONE'
  | 'MANY_TO_MANY';

export type FormFieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime-local'
  | 'select'
  | 'autocomplete'
  | 'File';

export interface EnumValue {
  name: string;
  value: string;
  label?: string; // From meta file
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
  min?: number;
  max?: number;
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
  fetch?: 'LAZY' | 'EAGER';
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

// Frontend Metadata (from .meta.yaml)
export interface FieldMeta {
  label: string;
  placeholder?: string;
  sortable?: boolean;
  type?: FormFieldType;
  displayField?: string; // For relationships
  options?: Array<{ value: string; label: string }>; // For enums
}

export interface RoutingMeta {
  basePath: string;
  menuLabel: string;
  menuIcon?: string;
  menuParent?: string;
  showInMenu: boolean;
  menuOrder?: number;
}

export interface EntityMeta {
  displayName: string;
  displayNamePlural: string;
  autocompleteField: string;
  routing?: RoutingMeta;
  fields: Record<string, FieldMeta>;
  relationships?: Record<string, FieldMeta>;
}

// Merged Entity (XML + Meta)
export interface EnhancedEntity extends Entity {
  meta: EntityMeta;
  isCore: boolean;
  coreImportPath?: string;
}

// Menu Configuration
export interface MenuConfig {
  entities: Record<string, RoutingMeta>;
}

// Generator Configuration
export interface GeneratorConfig {
  paths: {
    entityDefinitions: string;
    outputBase: string;
    coreComponents: string;
    menuConfig: string;
  };
  generation: {
    formatWithPrettier: boolean;
    generateRoutes: boolean;
    generatePermissions: boolean;
    overwriteExisting: boolean;
  };
  coreEntities: Record<string, {
    isCore: boolean;
    importPath?: string;
    servicePath?: string;
    skipImport?: boolean;
  }>;
  templates: Record<string, string>;
  fieldTypeMapping: Record<FieldType, string>;
  formTypeMapping: Record<FieldType, FormFieldType>;
}
