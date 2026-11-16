import {
  extendEntityDefinition,
  type EntityDefinition,
  type LookupAdapter,
} from "@/core/entity";
import { definitionOverrides } from "../Keyword.extension";
import UserLookupService from "@/Models/User/UserService";
const base = {
  schemaVersion: 1,
  name: "Keyword",
  endpoint: "/keyword",
  displayName: "کلمه کلیدی",
  pluralDisplayName: "کلمات کلیدی",
  displayField: "keywordText",
  idType: "number",
  fields: {
    keywordText: {
      label: "متن کلمه کلیدی",
      type: "text",
      dataType: "string",
      placeholder: "کلمه کلیدی را وارد کنید",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: true,
      sortable: true,
      order: 0,
      maxLength: 100,
    },
    coreUser: {
      label: "کاربر",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 1,
      displayField: "username",
      relation: {
        entity: "User",
        endpoint: "/auth/users",
        displayField: "username",
        multiple: false,
        valueMode: "object",
      },
      multiple: false,
    },
    channel: {
      label: "کانال",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 2,
      displayField: "channelName",
      relation: {
        entity: "Channel",
        endpoint: "/channel",
        displayField: "channelName",
        multiple: false,
        valueMode: "object",
      },
      multiple: false,
    },
    messages: {
      label: "پیام‌ها",
      type: "autocomplete",
      dataType: "reference",
      required: false,
      list: false,
      detail: true,
      sortable: false,
      order: 3,
      displayField: "platformName",
      relation: {
        entity: "MessagingPlatform",
        endpoint: "/messagingplatform",
        displayField: "platformName",
        multiple: true,
        valueMode: "object",
      },
      multiple: true,
    },
  },
  routing: {
    basePath: "/dashboard/portal/keywords",
    menuLabel: "کلمات کلیدی",
    menuIcon: "Hash",
    menuParent: "/dashboard/portal",
    showInMenu: true,
    menuOrder: 40,
  },
  permissions: {
    read: "keyword:read",
    create: "keyword:create",
    update: "keyword:update",
    delete: "keyword:delete",
  },
} satisfies EntityDefinition;
export const KeywordDefinition: EntityDefinition = extendEntityDefinition(
  base,
  definitionOverrides,
);
export const KeywordLookups: Record<string, LookupAdapter> = {
  User: {
    getAll: async (params) => {
      const page = await UserLookupService.getAll(params);
      return { ...page, data: page.data.map((record) => ({ ...record })) };
    },
    getById: async (id, options) => ({
      ...(await UserLookupService.getById(id, options)),
    }),
  },
};
