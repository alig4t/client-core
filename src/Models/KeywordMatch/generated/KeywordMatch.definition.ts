import {
  extendEntityDefinition,
  type EntityDefinition,
  type LookupAdapter,
} from "@/core/entity";
import { definitionOverrides } from "../KeywordMatch.extension";
import UserLookupService from "@/Models/User/UserService";
const base = {
  schemaVersion: 1,
  name: "KeywordMatch",
  endpoint: "/keywordmatch",
  displayName: "تطابق کلمه کلیدی",
  pluralDisplayName: "تطابق‌های کلمه کلیدی",
  displayField: "matchedAt",
  idType: "number",
  fields: {
    matchedAt: {
      label: "زمان تطابق",
      type: "datetime-local",
      dataType: "datetime",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: false,
      sortable: true,
      order: 0,
    },
    messagingPlatform: {
      label: "پیام",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 1,
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
    keyword: {
      label: "کلمه کلیدی",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 2,
      displayField: "keywordText",
      relation: {
        entity: "Keyword",
        endpoint: "/keyword",
        displayField: "keywordText",
        multiple: false,
        valueMode: "object",
      },
      multiple: false,
    },
    coreUser: {
      label: "کاربر",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 3,
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
  },
  routing: {
    basePath: "/dashboard/portal/keyword-matches",
    menuLabel: "تطابق‌های کلمات",
    menuIcon: "Database",
    menuParent: "/dashboard/portal",
    showInMenu: true,
    menuOrder: 50,
  },
  permissions: {
    read: "keywordmatch:read",
    create: "keywordmatch:create",
    update: "keywordmatch:update",
    delete: "keywordmatch:delete",
  },
} satisfies EntityDefinition;
export const KeywordMatchDefinition: EntityDefinition = extendEntityDefinition(
  base,
  definitionOverrides,
);
export const KeywordMatchLookups: Record<string, LookupAdapter> = {
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
