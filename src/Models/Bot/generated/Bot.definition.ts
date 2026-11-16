import {
  extendEntityDefinition,
  type EntityDefinition,
  type LookupAdapter,
} from "@/core/entity";
import { definitionOverrides } from "../Bot.extension";

const base = {
  schemaVersion: 1,
  name: "Bot",
  endpoint: "/bot",
  displayName: "ربات",
  pluralDisplayName: "ربات‌ها",
  displayField: "token",
  idType: "number",
  fields: {
    token: {
      label: "توکن",
      type: "text",
      dataType: "string",
      placeholder: "توکن ربات را وارد کنید",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: false,
      sortable: true,
      order: 0,
      maxLength: 255,
    },
    status: {
      label: "وضعیت",
      type: "select",
      dataType: "enum",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: false,
      sortable: true,
      order: 1,
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
    platform: {
      label: "پلتفرم",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 2,
      displayField: "platformName",
      relation: {
        entity: "MessagingPlatform",
        endpoint: "/messagingplatform",
        displayField: "platformName",
        multiple: false,
        valueMode: "object",
      },
      multiple: false,
    },
  },
  routing: {
    basePath: "/dashboard/portal/bots",
    menuLabel: "ربات‌ها",
    menuIcon: "Bot",
    menuParent: "/dashboard/portal",
    showInMenu: true,
    menuOrder: 20,
  },
  permissions: {
    read: "bot:read",
    create: "bot:create",
    update: "bot:update",
    delete: "bot:delete",
  },
} satisfies EntityDefinition;
export const BotDefinition: EntityDefinition = extendEntityDefinition(
  base,
  definitionOverrides,
);
export const BotLookups: Record<string, LookupAdapter> = {};
