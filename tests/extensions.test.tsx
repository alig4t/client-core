import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormWrapper } from "../src/core/components/form/FormWrapper";
import { FormUploader } from "../src/core/components/form/FormUpload";
import { FormAutoComplete } from "../src/core/components/form/FormAutoComplete";
import { CoreProvider } from "../src/core/entity/CoreProvider";
import { DynamicFields } from "../src/core/forms/DynamicField";
import {
  BaseService,
  type ServiceTransport,
} from "../src/core/service/BaseService";
import type { ApiResponse } from "../src/core/service/contracts";
import { normalizePage } from "../src/core/service/contracts";
import { DateInput } from "../src/core/components/form/DateInput";
import Table from "../src/core/components/Table/DataTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EntityForm } from "../src/core/entity/EntityPages";
import type { EntityDefinition } from "../src/core/entity/types";
describe("extension contracts", () => {
  it("applies nested edit visibility and field policies to the generated form payload", async () => {
    const actor = userEvent.setup(),
      saved: unknown[] = [];
    const record = {
      id: "item",
      rows: [
        { createOnly: "legacy", title: "Old title", private: "secret value" },
      ],
    };
    const transport: ServiceTransport = {
      request: async <T,>(options: Parameters<ServiceTransport["request"]>[0]) => {
        if (options.method === "put") saved.push(options.data);
        return { type: "data", status: 200, data: record as T };
      },
    };
    const service = new BaseService<typeof record>("/items", transport);
    const definition: EntityDefinition = {
      schemaVersion: 1,
      name: "Item",
      endpoint: "/items",
      displayName: "Item",
      pluralDisplayName: "Items",
      displayField: "id",
      routing: { basePath: "/" },
      fields: {
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
            title: { label: "Title", type: "text", required: true },
            private: {
              label: "Private",
              type: "text",
              readPermission: "secret",
            },
          },
        },
      },
    };
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/items/item/edit"]}>
          <CoreProvider
            value={{ can: (permission) => permission !== "secret" }}
          >
            <Routes>
              <Route
                path="/items/:id/edit"
                element={
                  <EntityForm definition={definition} service={service} />
                }
              />
              <Route path="/" element={<p>Saved</p>} />
            </Routes>
          </CoreProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await screen.findByLabelText("Title");
    expect(screen.queryByLabelText("Create only")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Private")).not.toBeInTheDocument();
    await actor.clear(screen.getByLabelText("Title"));
    await actor.type(screen.getByLabelText("Title"), "Updated title");
    await actor.click(screen.getByText("ذخیره"));
    await screen.findByText("Saved");
    expect(saved).toEqual([{ rows: [{ title: "Updated title" }] }]);
    client.clear();
  });
  it("uses the configured Gregorian calendar for date input", () => {
    render(
      <CoreProvider value={{ calendar: "gregorian", direction: "ltr" }}>
        <DateInput
          name="date"
          label="Date"
          standalone
          kind="date"
          value="2026-03-21"
        />
      </CoreProvider>,
    );
    expect(screen.getByLabelText("Date")).toHaveValue("2026/03/21");
  });
  it("resolves conditions within a nested row", async () => {
    const actor = userEvent.setup();
    render(
      <FormWrapper
        defaultValues={{ rows: [{ enabled: false }] }}
        onSubmit={() => {}}
      >
        <DynamicFields
          fields={{
            rows: {
              label: "Rows",
              type: "array",
              fields: {
                enabled: { label: "Enabled", type: "boolean" },
                note: {
                  label: "Note",
                  type: "text",
                  visibleWhen: { field: "enabled", value: true },
                },
              },
            },
          }}
        />
      </FormWrapper>,
    );
    expect(screen.queryByLabelText("Note")).not.toBeInTheDocument();
    await actor.click(screen.getByLabelText("Enabled"));
    expect(screen.getByLabelText("Note")).toBeInTheDocument();
  });
  it("excludes forbidden rows from bulk selection", async () => {
    const actor = userEvent.setup(),
      remove = vi.fn();
    render(
      <Table
        data={[{ id: "allowed" }, { id: "denied" }]}
        dataIdKey="id"
        header={<th>ID</th>}
        renderRow={(item) => <td>{item.id}</td>}
        page={0}
        pageSize={10}
        totalPages={1}
        totalItems={2}
        sortValue=""
        sortOptions={[]}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onSortChange={() => {}}
        onSelectionChange={() => {}}
        onDeleteSelected={remove}
        isRowSelectable={(item) => item.id !== "denied"}
      />,
    );
    expect(screen.getByLabelText("انتخاب ردیف denied")).toBeDisabled();
    await actor.click(screen.getByLabelText("انتخاب همه ردیف‌ها"));
    await actor.click(screen.getByText(/حذف انتخاب‌شده‌ها/));
    expect(remove).toHaveBeenCalledWith(["allowed"]);
  });
  it("supports custom operation paths and HTTP verbs without coercing IDs", async () => {
    const requests: unknown[] = [];
    const transport: ServiceTransport = {
      request: async <T,>(options: unknown) => {
        requests.push(options);
        return { type: "data", status: 200, data: { id: "uuid" } as T };
      },
    };
    const service = new BaseService<{ id: string }>("/items", transport, {
      operations: { update: { path: "/v2/items/:id", method: "patch" } },
    });
    await service.update("id/with/slash", { id: "uuid" });
    expect(requests[0]).toMatchObject({
      url: "/v2/items/id%2Fwith%2Fslash",
      method: "patch",
    });
  });
  it("supports custom pagination adapters and unpaged array responses", async () => {
    const transport: ServiceTransport = {
      request: async <T,>() => ({
        type: "data",
        status: 200,
        data: { items: [{ id: 1 }], count: 1 } as T,
      }),
    };
    const service = new BaseService<{ id: number }>("/items", transport, {
      pageAdapter: (response) => {
        const payload = response.data as {
          items: { id: number }[];
          count: number;
        };
        return {
          data: payload.items,
          meta: {
            totalItems: payload.count,
            totalPages: 1,
            currentPage: 0,
            pageSize: 10,
          },
        };
      },
    });
    expect((await service.getAll()).data).toEqual([{ id: 1 }]);
    expect(
      normalizePage(
        {
          type: "data",
          status: 200,
          data: [0, 1, 2, 3, 4],
        } satisfies ApiResponse<number[]>,
        1,
        2,
      ),
    ).toMatchObject({ data: [2, 3], meta: { totalItems: 5, totalPages: 3 } });
  });
  it("blocks form submission until an upload finishes", async () => {
    const actor = userEvent.setup(),
      submit = vi.fn();
    let finish: (value: { id: number }) => void = () => {};
    const upload = vi.fn(
      () =>
        new Promise<{ id: number }>((resolve) => {
          finish = resolve;
        }),
    );
    render(
      <CoreProvider value={{ uploads: { upload } }}>
        <FormWrapper onSubmit={submit}>
          <FormUploader name="files" label="Files" />
          <button type="submit">Save</button>
        </FormWrapper>
      </CoreProvider>,
    );
    await actor.upload(
      screen.getByLabelText("Files"),
      new File(["pdf"], "test.pdf", { type: "application/pdf" }),
    );
    await actor.click(screen.getByText("Save"));
    expect(submit).not.toHaveBeenCalled();
    expect(
      await screen.findByText("منتظر پایان بارگذاری فایل بمانید"),
    ).toBeInTheDocument();
    await act(async () => finish({ id: 7 }));
    await actor.click(screen.getByText("Save"));
    await waitFor(() => expect(submit).toHaveBeenCalledWith({ files: 7 }));
  });
  it("hydrates a reference stored as an ID", async () => {
    const service = {
      getAll: async () => ({ data: [], meta: { totalPages: 0 } }),
      getById: vi.fn(async () => ({ id: "uuid", name: "Selected user" })),
    };
    render(
      <FormWrapper defaultValues={{ owner: "uuid" }} onSubmit={() => {}}>
        <FormAutoComplete
          name="owner"
          label="Owner"
          service={service}
          valueKey="id"
          labelKey="name"
          valueMode="id"
        />
      </FormWrapper>,
    );
    await waitFor(() =>
      expect(screen.getByRole("combobox")).toHaveTextContent("Selected user"),
    );
    expect(service.getById).toHaveBeenCalled();
  });
  it("renders custom widgets and hides fields without permission", () => {
    render(
      <CoreProvider
        value={{
          can: (permission) => permission !== "secret",
          widgets: { custom: ({ name }) => <span>Widget {name}</span> },
        }}
      >
        <FormWrapper onSubmit={() => {}}>
          <DynamicFields
            fields={{
              title: { label: "Title", type: "text", widget: "custom" },
              secret: {
                label: "Secret",
                type: "text",
                readPermission: "secret",
              },
            }}
          />
        </FormWrapper>
      </CoreProvider>,
    );
    expect(screen.getByText("Widget title")).toBeInTheDocument();
    expect(screen.queryByLabelText("Secret")).not.toBeInTheDocument();
  });
});
