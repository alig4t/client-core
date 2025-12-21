import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { CityModel } from "./CityModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const cityModelMeta = createModelMeta<CityModel, FormFieldMetadata>(
  {
    cityName: {
      label: "نام شهر",
      type: "text",
      placeholder: "نام شهر را وارد کنید",
      sortable: true,
      required: true,
    },
    country: {
      label: "کشور",
      type: "text",
      placeholder: "نام کشور را وارد کنید",
      sortable: true,
      required: true,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof CityModel {
  return "cityName";
}

function GET_DISPLAY_NAME(): string {
  return "شهر";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "شهرها";
}
