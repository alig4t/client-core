import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { UserModel } from "./UserModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const UserModelMeta = createModelMeta<UserModel, FormFieldMetadata>(
  {
    name: {
      label: "نام",
      type: "text",
      placeholder: "مثلاً علی قاسمی",
      sortable: true,
      required: true,
    },
    username: {
      label: "نام کاربری",
      type: "text",
      placeholder: "مثلاً admin",
      sortable: true,
      required: true,
    },
    roles: {
      label: "نقش‌ها",
      type: "autocomplete",
      displayField: "name",
      sortable: false,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof UserModel {
  return "username";
}

function GET_DISPLAY_NAME(): string {
  return "کاربر";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "کاربران";
}
