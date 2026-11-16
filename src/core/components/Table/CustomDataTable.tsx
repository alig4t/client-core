// Compatibility export: both service and custom fetch use the same table implementation.
export { default } from "./BaseDataTable";
export type {
  BaseDataTableProps as CustomDataTableProps,
  RenderRowFunction,
} from "./BaseDataTable";
