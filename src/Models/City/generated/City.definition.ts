import {
  extendEntityDefinition,
  type EntityDefinition,
  type LookupAdapter,
} from "@/core/entity";
import { definitionOverrides } from "../City.extension";

const base = {
  schemaVersion: 1,
  name: "City",
  endpoint: "/city",
  displayName: "شهر",
  pluralDisplayName: "شهرها",
  displayField: "cityName",
  idType: "number",
  fields: {
    cityName: {
      label: "نام شهر",
      type: "text",
      dataType: "string",
      placeholder: "نام شهر را وارد کنید",
      required: true,
      unique: true,
      indexed: false,
      list: true,
      detail: true,
      searchable: true,
      sortable: true,
      order: 0,
      maxLength: 100,
    },
    country: {
      label: "کشور",
      type: "text",
      dataType: "string",
      placeholder: "نام کشور را وارد کنید",
      required: true,
      unique: false,
      indexed: false,
      list: true,
      detail: true,
      searchable: false,
      sortable: true,
      order: 1,
      maxLength: 100,
    },
  },
  routing: {
    basePath: "/dashboard/portal/cities",
    menuLabel: "شهرها",
    menuIcon: "MapPin",
    menuParent: "/dashboard/portal",
    showInMenu: true,
    menuOrder: 30,
  },
  permissions: {
    read: "city:read",
    create: "city:create",
    update: "city:update",
    delete: "city:delete",
  },
} satisfies EntityDefinition;
export const CityDefinition: EntityDefinition = extendEntityDefinition(
  base,
  definitionOverrides,
);
export const CityLookups: Record<string, LookupAdapter> = {};
