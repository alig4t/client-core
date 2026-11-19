import {
  BaseService,
  type ServerSideParams,
} from "../../../core/service/BaseService";
import type { EntityDefinition, EntityInput } from "../../../core/entity/types";
import type { EntityId, Page } from "../../../core/service/contracts";
import type { UploadAdapter } from "../../../core/entity/CoreProvider";

export function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      reject(new DOMException("Aborted", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, ms);
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
  });
}
const image = () =>
  new Blob(
    [
      '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" rx="16" fill="#0f766e"/><circle cx="44" cy="42" r="18" fill="#99f6e4"/><path d="M15 105 70 55 105 85 140 45 160 120H0" fill="#ccfbf1"/><text x="80" y="26" text-anchor="middle" fill="white" font-family="sans-serif">CORE</text></svg>',
    ],
    { type: "image/svg+xml" },
  );

export function createUploads(): UploadAdapter {
  let nextId = 100;
  const files = new Map<EntityId, Blob>();
  return {
    async upload(file, options) {
      for (const progress of [15, 45, 75, 100]) {
        await delay(120, options?.signal);
        options?.onProgress?.(progress);
      }
      const id = nextId++;
      files.set(id, file);
      return { id, name: file.name, mimeType: file.type, size: file.size };
    },
    async preview(id, signal) {
      await delay(id === "pending" ? 1200 : 80, signal);
      if (id === "error")
        throw new Error("Preview unavailable / پیش‌نمایش ناموفق");
      return (
        files.get(id) ??
        (id === "document"
          ? new Blob(["Core catalog sample document"], { type: "text/plain" })
          : image())
      );
    },
    async download(id) {
      return files.get(id) ?? image();
    },
  };
}
export type DemoRecord = {
  id: EntityId;
  title: string;
  active: boolean;
  amount: string;
};
export type DataState = "ready" | "empty" | "error" | "loading";
export class CatalogService extends BaseService<
  DemoRecord,
  EntityInput,
  EntityInput
> {
  private nextId = 14;
  rows: DemoRecord[];
  state: DataState = "ready";
  constructor(language: "fa" | "en") {
    super("/catalog-local-only");
    this.rows = Array.from({ length: 13 }, (_, index) => ({
      id: index + 1,
      title:
        language === "fa"
          ? `رکورد نمونهٔ ${index + 1}`
          : `Sample record ${index + 1}`,
      active: index % 2 === 0,
      amount: "9007199254740993",
    }));
  }
  async getAll(
    params: ServerSideParams<DemoRecord> = {},
  ): Promise<Page<DemoRecord>> {
    await delay(this.state === "loading" ? 3000 : 150, params.signal);
    if (this.state === "error")
      throw new Error("دریافت داده ناموفق بود / Could not load records");
    const filter = String(params.filters?.title_like ?? "").toLowerCase();
    let rows =
      this.state === "empty"
        ? []
        : this.rows.filter((row) => row.title.toLowerCase().includes(filter));
    if (params.sort?.endsWith("desc")) rows = [...rows].reverse();
    if (params.filters?.active_eq !== undefined)
      rows = rows.filter(
        (row) => row.active === (String(params.filters?.active_eq) === "true"),
      );
    const page = params.page ?? 0,
      size = params.size ?? 5;
    return {
      data: rows.slice(page * size, (page + 1) * size),
      meta: {
        totalItems: rows.length,
        totalPages: Math.ceil(rows.length / size),
        currentPage: page,
        pageSize: size,
        isLastPage: (page + 1) * size >= rows.length,
      },
    };
  }
  async getById(id: EntityId, options?: { signal?: AbortSignal }) {
    await delay(this.state === "loading" ? 3000 : 150, options?.signal);
    if (this.state === "error")
      throw new Error("دریافت رکورد ناموفق بود / Could not load record");
    const row = this.rows.find((row) => String(row.id) === String(id));
    if (!row) throw new Error("رکورد پیدا نشد / Record not found");
    return { ...row };
  }
  async create(values: EntityInput) {
    await delay(250);
    const record = {
      id: this.nextId++,
      title: String(values.title ?? ""),
      active: Boolean(values.active),
      amount: String(values.amount ?? "0"),
    };
    this.rows = [...this.rows, record];
    return record;
  }
  async update(id: EntityId, values: EntityInput) {
    const record = { ...(await this.getById(id)), ...values, id } as DemoRecord;
    this.rows = this.rows.map((row) =>
      row.id === id || String(row.id) === String(id) ? record : row,
    );
    return record;
  }
  async delete(id: EntityId) {
    await delay(150);
    this.rows = this.rows.filter((row) => String(row.id) !== String(id));
  }
}
export function definition(language: "fa" | "en"): EntityDefinition {
  const fa = language === "fa";
  return {
    schemaVersion: 1,
    name: "CatalogRecord",
    endpoint: "/catalog-local-only",
    displayName: fa ? "رکورد" : "Record",
    pluralDisplayName: fa ? "رکوردها" : "Records",
    displayField: "title",
    routing: { basePath: "/catalog" },
    fields: {
      title: {
        type: "text",
        dataType: "string",
        label: fa ? "عنوان" : "Title",
        required: true,
        searchable: true,
        sortable: true,
      },
      active: {
        type: "checkbox",
        dataType: "boolean",
        label: fa ? "فعال" : "Active",
        searchable: true,
      },
      amount: {
        type: "long",
        dataType: "long",
        label: fa ? "عدد دقیق" : "Precise number",
        defaultValue: "9007199254740993",
      },
    },
  };
}
