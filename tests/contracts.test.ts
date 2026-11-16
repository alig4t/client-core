// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  BaseService,
  type ServiceTransport,
} from "../src/core/service/BaseService";
import {
  ApiError,
  BulkOperationError,
  normalizePage,
  serializeQuery,
  unwrapResponse,
  type ApiResponse,
} from "../src/core/service/contracts";
import {
  buildEntitySchema,
  entityToApi,
  entityFromApi,
  formatFieldValue,
} from "../src/core/entity/fields";
import type { EntityDefinition } from "../src/core/entity/types";
import { extendEntityDefinition } from "../src/core/entity/definitionSchema";
const definition: EntityDefinition = {
  schemaVersion: 1,
  name: "Example",
  endpoint: "/examples",
  displayName: "نمونه",
  pluralDisplayName: "نمونه‌ها",
  displayField: "title",
  fields: {
    title: {
      label: "عنوان",
      type: "text",
      required: true,
      minLength: 5,
      maxLength: 20,
      pattern: "^[a-zA-Z ]+$",
    },
    count: { label: "تعداد", type: "number", min: 0, max: 1000 },
    precise: {
      label: "دقیق",
      type: "bigDecimal",
      min: "-0.15",
      max: "999999999999999999.123456789",
    },
    long: { label: "بلند", type: "long" },
    enabled: { label: "فعال", type: "boolean", required: true },
    choice: {
      label: "گزینه",
      type: "select",
      options: [{ value: "A", label: "الف" }],
    },
    date: { label: "تاریخ", type: "date" },
    local: { label: "محلی", type: "datetime-local" },
    instant: { label: "زمان", type: "instant" },
    owner: {
      label: "مالک",
      type: "autocomplete",
      required: true,
      relation: { entity: "User", displayField: "name" },
    },
    tags: {
      label: "برچسب",
      type: "autocomplete",
      multiple: true,
      relation: { entity: "Tag", displayField: "name", multiple: true },
    },
    serverOnly: { label: "سرور", type: "text", readOnly: true },
  },
};
const valid = { title: "Hello", enabled: false, owner: { id: "user-uuid" } };
describe("entity field contracts", () => {
  it("preserves validation when an extension overrides a field label", () => {
    const extended = extendEntityDefinition(definition, {
      fields: { title: { label: "New title" } },
    });
    expect(extended.fields.title.minLength).toBe(5);
    expect(
      buildEntitySchema(extended).safeParse({ ...valid, title: "bad" }).success,
    ).toBe(false);
  });
  it("converts numeric form values and preserves zero and false", () => {
    expect(
      entityToApi(definition, { ...valid, count: "0" }, "create"),
    ).toMatchObject({ count: 0, enabled: false });
  });
  it.each([
    { title: "$" },
    { count: "1001" },
    { count: "1.2" },
    { choice: "INVALID" },
    { owner: "wrong" },
    { tags: { id: 1 } },
    { date: "2025-02-30" },
    { local: "2026-01-01T25:00" },
    { instant: "2026-01-01T10:00" },
    { long: 9007199254740992 },
    { long: "9223372036854775808" },
    { precise: "invalid" },
    { precise: "-0.16" },
  ])("rejects invalid input %j", (patch) => {
    expect(
      buildEntitySchema(definition).safeParse({ ...valid, ...patch }).success,
    ).toBe(false);
  });
  it("preserves full long and decimal precision", () => {
    const result = buildEntitySchema(definition).parse({
      ...valid,
      long: "9007199254740993",
      precise: "999999999999999999.123456789",
    });
    expect(result.long).toBe("9007199254740993");
    expect(result.precise).toBe("999999999999999999.123456789");
  });
  it("does not throw on malformed decimal input", () => {
    expect(() =>
      buildEntitySchema(definition).safeParse({ ...valid, precise: "bad" }),
    ).not.toThrow();
  });
  it("strips read-only and hidden conditional values before validation", () => {
    const schema = buildEntitySchema({
      ...definition,
      fields: {
        ...definition.fields,
        conditional: {
          label: "شرطی",
          type: "number",
          required: true,
          visibleWhen: { field: "enabled", value: true },
        },
      },
    });
    const output = schema.parse({
      ...valid,
      serverOnly: "injected",
      conditional: "not-a-number",
    });
    expect(output).not.toHaveProperty("serverOnly");
    expect(output).not.toHaveProperty("conditional");
  });
  it("validates nested arrays and nullable optional values", () => {
    const nested: EntityDefinition = {
      ...definition,
      fields: {
        ...definition.fields,
        nullable: { label: "خالی", type: "text", nullable: true },
        rows: {
          label: "ردیف",
          type: "array",
          fields: { count: { label: "عدد", type: "number", required: true } },
        },
      },
    };
    expect(
      buildEntitySchema(nested).parse({
        ...valid,
        nullable: null,
        rows: [{ count: "2" }],
      }),
    ).toMatchObject({ nullable: null, rows: [{ count: 2 }] });
    expect(
      buildEntitySchema(nested).safeParse({ ...valid, rows: [{}] }).success,
    ).toBe(false);
  });
  it("applies edit rules and API reference transforms recursively", () => {
    const nested: EntityDefinition = {
      ...definition,
      fields: {
        ...definition.fields,
        rows: {
          label: "Rows",
          type: "array",
          fields: {
            createOnly: {
              label: "Create only",
              type: "text",
              required: true,
              edit: false,
            },
            owner: {
              label: "Owner",
              type: "autocomplete",
              relation: { entity: "User", displayField: "name" },
            },
            tag: {
              label: "Tag",
              type: "autocomplete",
              relation: {
                entity: "Tag",
                displayField: "name",
                valueMode: "id",
              },
            },
          },
        },
      },
    };
    expect(
      buildEntitySchema(nested).safeParse({ ...valid, rows: [{}] }).success,
    ).toBe(false);
    expect(
      entityToApi(
        nested,
        {
          ...valid,
          rows: [
            {
              owner: { id: "uuid", name: "Private display data" },
              tag: "tag-id",
              createOnly: "omit",
            },
          ],
        },
        "edit",
      ).rows,
    ).toEqual([{ owner: { id: "uuid" }, tag: "tag-id" }]);
    expect(
      entityFromApi(nested, { rows: [{ tag: { id: "tag-id", name: "Tag" } }] })
        .rows,
    ).toEqual([{ tag: "tag-id" }]);
  });
  it("formats false and zero correctly", () => {
    expect(formatFieldValue(false, definition.fields.enabled)).toBe("خیر");
    expect(formatFieldValue(0, definition.fields.count)).toBe("0");
  });
});
describe("HTTP contracts", () => {
  it("keeps false, zero, repeated filter values and removes only empty values", () => {
    expect(
      serializeQuery({
        enabled: false,
        count: 0,
        tags: [1, 2],
        empty: "",
        missing: null,
      }).toString(),
    ).toBe("enabled=false&count=0&tags=1&tags=2");
  });
  it("normalizes envelopes, plain payloads and both pagination shapes", () => {
    expect(unwrapResponse({ id: "x" }, 200).data).toEqual({ id: "x" });
    expect(
      normalizePage({
        type: "data",
        status: 200,
        data: {
          content: [1],
          totalElements: 10,
          totalPages: 5,
          number: 1,
          size: 2,
        },
      }).meta.currentPage,
    ).toBe(1);
    expect(
      normalizePage({ type: "data", status: 200, data: [] }).meta.totalPages,
    ).toBe(0);
    expect(() =>
      unwrapResponse(
        {
          type: "error",
          status: 422,
          data: "invalid",
          fieldErrors: { title: "duplicate" },
        },
        200,
      ),
    ).toThrow(ApiError);
  });
  it("returns the entity consistently for create, get and update; preserves string IDs", async () => {
    const seen: unknown[] = [];
    const transport: ServiceTransport = {
      request: async <T>(options: unknown) => {
        seen.push(options);
        return { type: "data", status: 200, data: { id: "a/b" } as T };
      },
    };
    const service = new BaseService<{ id: string }>("/items", transport);
    expect((await service.create({ id: "a/b" })).id).toBe("a/b");
    expect((await service.update("a/b", {})).id).toBe("a/b");
    expect((await service.getById("a/b")).id).toBe("a/b");
    expect(seen).toContainEqual(
      expect.objectContaining({ url: "/items/a%2Fb" }),
    );
  });
  it("reports partial bulk results after every request settles", async () => {
    const transport: ServiceTransport = {
      request: async <T>(options: { url: string }) => {
        if (options.url.endsWith("/bad")) throw new ApiError("denied", 403);
        return {
          type: "data",
          status: 204,
          data: undefined as T,
        } satisfies ApiResponse<T>;
      },
    };
    const service = new BaseService("/items", transport);
    try {
      await service.deleteMany(["good", "bad"]);
      throw new Error("Expected rejection");
    } catch (error) {
      expect(error).toBeInstanceOf(BulkOperationError);
      expect((error as BulkOperationError).result.succeeded).toEqual(["good"]);
      expect((error as BulkOperationError).result.failed[0].id).toBe("bad");
    }
  });
});
