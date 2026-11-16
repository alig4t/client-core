import {
  extendEntityDefinition,
  type EntityDefinition,
  type LookupAdapter,
} from "@/core/entity";
import { definitionOverrides } from "../UserChannel.extension";
import UserLookupService from "@/Models/User/UserService";
const base = {
  schemaVersion: 1,
  name: "UserChannel",
  endpoint: "/userchannel",
  displayName: "کاربر-کانال",
  pluralDisplayName: "کاربران-کانال",
  displayField: "role",
  idType: "number",
  fields: {
    role: {
      label: "نقش",
      type: "select",
      dataType: "enum",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: false,
      sortable: true,
      order: 0,
      options: [
        { value: "OWNER", label: "مالک" },
        { value: "MEMBER", label: "عضو" },
      ],
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
  },
  routing: {
    basePath: "/dashboard/portal/user-channels",
    menuLabel: "کاربران کانال",
    menuIcon: "UserCheck",
    menuParent: "/dashboard/portal",
    showInMenu: true,
    menuOrder: 70,
  },
  permissions: {
    read: "userchannel:read",
    create: "userchannel:create",
    update: "userchannel:update",
    delete: "userchannel:delete",
  },
} satisfies EntityDefinition;
export const UserChannelDefinition: EntityDefinition = extendEntityDefinition(
  base,
  definitionOverrides,
);
export const UserChannelLookups: Record<string, LookupAdapter> = {
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
