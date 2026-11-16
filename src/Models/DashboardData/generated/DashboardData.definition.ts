import {
  extendEntityDefinition,
  type EntityDefinition,
  type LookupAdapter,
} from "@/core/entity";
import { definitionOverrides } from "../DashboardData.extension";
import UserLookupService from "@/Models/User/UserService";
const base = {
  schemaVersion: 1,
  name: "DashboardData",
  endpoint: "/dashboarddata",
  displayName: "داده داشبورد",
  pluralDisplayName: "داده‌های داشبورد",
  displayField: "frequencyCount",
  idType: "number",
  fields: {
    frequencyCount: {
      label: "تعداد تکرار",
      type: "number",
      dataType: "integer",
      placeholder: "تعداد",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: false,
      sortable: true,
      order: 0,
    },
    lastMatchedAt: {
      label: "آخرین تطابق",
      type: "datetime-local",
      dataType: "datetime",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: false,
      sortable: true,
      order: 1,
    },
    coreUser: {
      label: "کاربر",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 2,
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
    keyword: {
      label: "کلمه کلیدی",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 3,
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
    channel: {
      label: "کانال",
      type: "autocomplete",
      dataType: "reference",
      required: true,
      list: false,
      detail: true,
      sortable: false,
      order: 4,
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
  },
  routing: {
    basePath: "/dashboard/portal/dashboard-data",
    menuLabel: "داده‌های داشبورد",
    menuIcon: "NotebookPen",
    menuParent: "/dashboard/portal",
    showInMenu: false,
    menuOrder: 80,
  },
  permissions: {
    read: "dashboarddata:read",
    create: "dashboarddata:create",
    update: "dashboarddata:update",
    delete: "dashboarddata:delete",
  },
} satisfies EntityDefinition;
export const DashboardDataDefinition: EntityDefinition = extendEntityDefinition(
  base,
  definitionOverrides,
);
export const DashboardDataLookups: Record<string, LookupAdapter> = {
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
