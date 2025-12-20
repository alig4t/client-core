import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";
import type { RoleModel } from "./RoleModel";

export const RoleModelMeta = createModelMeta<RoleModel, FormFieldMetadata>(
  {
    name: {
      label: "عنوان",
      type: "text",
      placeholder: "عنوان نقش",
      sortable: true,
      required: true,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof RoleModel {
  return "name";
}

function GET_DISPLAY_NAME(): string {
  return "نقش";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "نقش ها";
}
