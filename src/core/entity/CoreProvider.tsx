import {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react";
import type { FormFieldMetadata } from "../forms/FieldFormTypes";
import type { ServerSideParams } from "../service/BaseService";
import type { EntityId, Page } from "../service/contracts";
import type { EntityRecord } from "./types";
import { CoreUIProvider } from "../ui/CoreUIProvider";

export interface UploadFile {
  id: EntityId;
  name?: string;
  mimeType?: string;
  size?: number;
}
export interface UploadAdapter {
  upload(
    file: File,
    options?: {
      signal?: AbortSignal;
      onProgress?: (percentage: number) => void;
    },
  ): Promise<UploadFile>;
  preview?(id: EntityId, signal?: AbortSignal): Promise<Blob>;
  download?(id: EntityId, signal?: AbortSignal): Promise<Blob>;
}
export interface LookupAdapter {
  getAll(params?: ServerSideParams): Promise<Page<EntityRecord>>;
  getById?(
    id: EntityId,
    options?: { signal?: AbortSignal },
  ): Promise<EntityRecord>;
}
export interface WidgetProps {
  name: string;
  meta: FormFieldMetadata;
  disabled?: boolean;
}
export interface CoreRuntime {
  can(permission?: string, record?: EntityRecord): boolean;
  locale: string;
  direction: "rtl" | "ltr";
  calendar: "persian" | "gregorian";
  uploads?: UploadAdapter;
  lookups?: Record<string, LookupAdapter>;
  widgets?: Record<string, ComponentType<WidgetProps>>;
}
const defaults: CoreRuntime = {
  can: (permission) => !permission,
  locale: "fa-IR",
  direction: "rtl",
  calendar: "persian",
};
const CoreContext = createContext<CoreRuntime>(defaults);
export function CoreProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Partial<CoreRuntime>;
}) {
  const parent = useContext(CoreContext);
  return (
    <CoreContext.Provider
      value={{
        ...parent,
        ...value,
        lookups: { ...parent.lookups, ...value.lookups },
      }}
    >
      <CoreUIProvider value={{ direction: value.direction, locale: value.locale }}>
        {children}
      </CoreUIProvider>
    </CoreContext.Provider>
  );
}
export const useCore = () => useContext(CoreContext);
