// src/models/permission/PermissionModel.meta.ts

import type { FormFieldMetadata } from "@/core/forms/FieldTypes";
import type { BaseModel } from "@/core/models/BaseModel";
import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { PermissionModel } from "./PermissionModel";

export const permissionModelMeta = createModelMeta<PermissionModel, FormFieldMetadata>(
  {
    name: {
      label: "نام سیستمی",
      type: "text",
      placeholder: "مثلاً manage-users",
      sortable: true,
    },
    showName: {
      label: "نام نمایشی",
      type: "text",
      placeholder: "مثلاً مدیریت کاربران",
      sortable: true,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD() : keyof PermissionModel{
    return "showName"
}


// import { createModelMeta } from "@/core/models/modelMetaUtils";
// import type { PermissionModel } from "./PermissionModel";


// const DISPLAY_FIELD_AUTOCOMPLETE = "showName" as const; 


// export const permissionModelMeta = createModelMeta<PermissionModel>(
//     {
//         name: {
//             label: "نام فنی",
//             sortable: true,
//         },
//         showName: {
//             label: "نام نمایشی",
//             sortable: true,
//         },
//     },
//     DISPLAY_FIELD_AUTOCOMPLETE 
// );


// export { DISPLAY_FIELD_AUTOCOMPLETE as PERMISSION_DISPLAY_FIELD };