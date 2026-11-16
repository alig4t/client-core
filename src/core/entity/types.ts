import type { FormFieldMetadata } from "../forms/FieldFormTypes";
import type { EntityId } from "../service/contracts";
import type {
  ServiceOperation,
  ServiceOperationName,
} from "../service/contracts";
export type EntityRecord = Record<string, unknown> & { id: EntityId };
export type EntityInput = Record<string, unknown>;
export type EntityOperation = "read" | "create" | "update" | "delete";
export interface EntityRouting {
  basePath: string;
  menuLabel?: string;
  menuIcon?: string;
  menuParent?: string;
  showInMenu?: boolean;
  menuOrder?: number;
}
export interface EntityDefinition {
  schemaVersion: 1;
  name: string;
  endpoint: string;
  displayName: string;
  pluralDisplayName: string;
  displayField: string;
  idType?: "number" | "string";
  fields: Record<string, FormFieldMetadata>;
  routing?: EntityRouting;
  permissions?: Partial<Record<EntityOperation, string>>;
  operations?: Partial<Record<ServiceOperationName, ServiceOperation>>;
}
export interface EntityTransforms<TResponse, TCreate, TUpdate> {
  fromApi?: (record: TResponse) => EntityInput;
  toCreate?: (values: EntityInput) => TCreate;
  toUpdate?: (values: EntityInput) => TUpdate;
}
export type EntityDefinitionOverrides = Omit<
  Partial<EntityDefinition>,
  "fields"
> & { fields?: Record<string, Partial<FormFieldMetadata>> };
