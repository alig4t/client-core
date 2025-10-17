import { createModelMeta } from "@/core/models/modelMetaUtils";

import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";
import type { UserModel } from "./UserModel";

export const UserModelMeta = createModelMeta<UserModel, FormFieldMetadata>(
  {
    name: {
      label: "نام",
      type: "text",
      placeholder: "مثلاً علی قاسمی",
      sortable: true,
    },
    username: {
      label: "نام کاربری",
      type: "text",
      placeholder: "مثلاً admin",
      sortable: true,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD() : keyof UserModel{
    return "username"
}
