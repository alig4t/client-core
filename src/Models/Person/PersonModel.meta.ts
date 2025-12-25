import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { PersonModel } from "./PersonModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const PersonModelMeta = createModelMeta<PersonModel, FormFieldMetadata>(
  {
    firstName: {
      label: "نام",
      type: "text",
      placeholder: "نام را وارد کنید",
      sortable: true,
      required: true,
    },
    lastName: {
      label: "نام خانوادگی",
      type: "text",
      placeholder: "نام خانوادگی را وارد کنید",
      sortable: true,
      required: true,
    },
    nationalId: {
      label: "کد ملی",
      type: "text",
      placeholder: "کد ملی 10 رقمی",
      sortable: false,
      required: false,
    },
    birthDate: {
      label: "تاریخ تولد",
      type: "date",
      sortable: false,
      required: false,
    },
    coreUser: {
      label: "کاربر سیستم",
      type: "autocomplete",
      displayField: "username",
      sortable: false,
      required: true,
    },
    city: {
      label: "شهر",
      type: "autocomplete",
      displayField: "cityName",
      sortable: false,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof PersonModel {
  return "firstName";
}

function GET_DISPLAY_NAME(): string {
  return "شخص";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "اشخاص";
}
