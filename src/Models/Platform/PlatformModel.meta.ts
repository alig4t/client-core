import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { PlatformModel } from "./PlatformModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const platformModelMeta = createModelMeta<PlatformModel, FormFieldMetadata>({
    platformName: {
        label: "نام پلتفرم",
        type: "text",
        placeholder: "مثلاً ایتا",
        sortable: true,
        required: true,
    },
    platformKey: {
        label: "کلید پلتفرم",
        type: "text",
        placeholder: "وارد نمایید",
        sortable: true,
        required: true,
    },
    apiEndpoint: {
        label: "آدرس API",
        type: "text",
        placeholder: "https://api.example.com",
        sortable: false,
        required: true,
    },
    authMethod: {
        label: "روش احراز هویت",
        type: "text",
        placeholder: "مثلاً Bearer Token",
        sortable: false,
        required: true,
    },
},
    GET_AUTOCOMPLETE_DISPLAY_FIELD(),
    GET_DISPLAY_NAME(),
    GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof PlatformModel {
    return "platformName";
}

function GET_DISPLAY_NAME(): string {
    return "پلتفرم";
}

function GET_PLURAL_DISPLAY_NAME(): string {
    return "پلتفرم‌ها";
}