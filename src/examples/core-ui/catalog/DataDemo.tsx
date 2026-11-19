import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Button, Table as CoreTable } from "../../../core/ui";
import Table, {
  PaginatedDataTable,
  THEAD,
  TBODY,
} from "../../../core/components/Table/DataTable";
import BaseDataTable from "../../../core/components/Table/BaseDataTable";
import CustomDataTable from "../../../core/components/Table/CustomDataTable";
import {
  EntityDetail,
  EntityForm,
  EntityList,
  EntitySearch,
} from "../../../core/entity/EntityPages";
import { CoreProvider } from "../../../core/entity/CoreProvider";
import type { EntityId } from "../../../core/service/contracts";
import {
  CatalogService,
  definition,
  type DemoRecord,
  type DataState,
} from "./fixtures";
import { Example, Message, type DemoProps } from "./shared";

function EntityExamples({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [service] = useState(() => new CatalogService(language));
  const [state, setState] = useState<DataState>("ready");
  const [permission, setPermission] = useState(true);
  const [mode, setMode] = useState("create");
  const [message, setMessage] = useState("");
  const [version, setVersion] = useState(0);
  const entity = useMemo(
    () => ({
      ...definition(language),
      name: `CatalogRecord-${version}`,
      permissions: {
        read: "catalog.read",
        create: "catalog.create",
        update: "catalog.update",
        delete: "catalog.delete",
      },
    }),
    [language, version],
  );
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false, gcTime: 0 },
        },
      }),
  );
  const currentPath =
    id === "entity-detail"
      ? "/catalog/1"
      : id === "entity-form"
        ? mode === "create"
          ? "/catalog/create"
          : "/catalog/1/edit"
        : "/catalog";
  if (id === "entity-search")
    return (
      <Example props="definition(searchable fields) · values · onApply">
        <EntitySearch
          definition={entity}
          onApply={(values) => setMessage(JSON.stringify(values))}
        />
        <Message>{message}</Message>
      </Example>
    );
  return (
    <>
      <div className="catalog-row">
        <label>
          {fa ? "وضعیت داده" : "Data state"}{" "}
          <select
            aria-label={`${id} data state`}
            value={state}
            onChange={(event) => {
              const next = event.target.value as DataState;
              service.state = next;
              setState(next);
              setVersion((value) => value + 1);
            }}
          >
            {["ready", "empty", "error", "loading"]
              .filter((value) => value !== "empty" || id === "entity-list")
              .map((value) => (
                <option key={value}>{value}</option>
              ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={permission}
            onChange={(event) => setPermission(event.target.checked)}
          />{" "}
          {fa ? "مجوز عملیات" : "Allow operations"}
        </label>
        {id === "entity-form" && (
          <select
            aria-label={fa ? "حالت فرم موجودیت" : "Entity form mode"}
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="create">create</option>
            <option value="edit">edit</option>
          </select>
        )}
      </div>
      <Example
        props={
          id === "entity-form"
            ? "definition · service · create/edit · permissions · transforms"
            : id === "entity-list"
              ? "definition · service · actions · renderField · filters · pagination"
              : "definition · service · renderField · read/update permission"
        }
      >
        <CoreProvider value={{ can: (name) => !name || permission }}>
          <QueryClientProvider client={client}>
            <MemoryRouter
              key={`${version}-${mode}`}
              initialEntries={[currentPath]}
            >
              <Routes>
                <Route
                  path="/catalog/create"
                  element={<EntityForm definition={entity} service={service} />}
                />
                <Route
                  path="/catalog/:id/edit"
                  element={<EntityForm definition={entity} service={service} />}
                />
                <Route
                  path="/catalog/:id"
                  element={
                    <EntityDetail
                      definition={entity}
                      service={service}
                      renderField={(name, value) =>
                        name === "active" ? (
                          <span>
                            {value
                              ? fa
                                ? "فعال"
                                : "Active"
                              : fa
                                ? "غیرفعال"
                                : "Inactive"}
                          </span>
                        ) : undefined
                      }
                    />
                  }
                />
                <Route
                  path="/catalog"
                  element={
                    <EntityList
                      definition={entity}
                      service={service}
                      actions={[
                        {
                          name: "inspect",
                          label: fa ? "اقدام سفارشی" : "Custom action",
                          execute: (record) => setMessage(String(record.title)),
                        },
                      ]}
                    />
                  }
                />
              </Routes>
            </MemoryRouter>
          </QueryClientProvider>
        </CoreProvider>
      </Example>
      <Message>{message}</Message>
    </>
  );
}

function ServiceTable({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [service] = useState(() => new CatalogService(language));
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false, gcTime: 0 },
        },
      }),
  );
  const [state, setState] = useState<DataState>("ready");
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState<EntityId[]>([]);
  const header = (
    <>
      <THEAD>ID</THEAD>
      <THEAD>{fa ? "عنوان" : "Title"}</THEAD>
      <THEAD>{fa ? "اقدام" : "Action"}</THEAD>
    </>
  );
  const renderRow = (
    record: DemoRecord,
    _index: number,
    onDelete?: (id: EntityId) => void,
  ) => (
    <>
      <TBODY>{record.id}</TBODY>
      <TBODY>{record.title}</TBODY>
      <TBODY>
        {onDelete && (
          <Button tone="danger" size="sm" onClick={() => onDelete(record.id)}>
            {fa ? "حذف" : "Delete"}
          </Button>
        )}
      </TBODY>
    </>
  );
  const queryKey = `catalog-${id}-${version}`;
  const DataComponent = id === "custom-table" ? CustomDataTable : BaseDataTable;
  return (
    <>
      <label className="catalog-row">
        {fa ? "وضعیت سرویس محلی" : "Local service state"}
        <select
          aria-label={`${id} data state`}
          value={state}
          onChange={(event) => {
            const next = event.target.value as DataState;
            service.state = next;
            setState(next);
            setVersion((value) => value + 1);
          }}
        >
          {["ready", "empty", "error", "loading"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <Example
        props={
          id === "paginated-table"
            ? "fetchPage · queryKey · filters · defaultPageSize · defaultSort"
            : id === "custom-table"
              ? "customFetchFn · service · queryKey · onSelectionChange (compatibility export)"
              : "service · enableDelete · deletePermission · renderRow · dataIdKey · onSelectionChange"
        }
      >
        <QueryClientProvider client={client}>
          {id === "paginated-table" ? (
            <PaginatedDataTable<DemoRecord>
              key={queryKey}
              queryKey={queryKey}
              fetchPage={(params) => service.getAll(params)}
              header={header}
              renderRow={(record, index) => renderRow(record, index)}
              sortOptions={[
                { value: "title,asc", label: "ASC" },
                { value: "title,desc", label: "DESC" },
              ]}
              dataIdKey="id"
              defaultPageSize={5}
              onSelectionChange={setSelected}
            />
          ) : (
            <DataComponent<DemoRecord>
              key={queryKey}
              queryKey={queryKey}
              service={service}
              customFetchFn={
                id === "custom-table"
                  ? (params) => service.getAll(params)
                  : undefined
              }
              header={header}
              renderRow={renderRow}
              sortOptions={[
                { value: "title,asc", label: "ASC" },
                { value: "title,desc", label: "DESC" },
              ]}
              defaultPageSize={5}
              onSelectionChange={setSelected}
            />
          )}
        </QueryClientProvider>
      </Example>
      <Message>{JSON.stringify(selected)}</Message>
    </>
  );
}

export function DataDemo(props: DemoProps) {
  const { id, language } = props;
  const fa = language === "fa";
  const [empty, setEmpty] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sort, setSort] = useState("title,asc");
  const [selected, setSelected] = useState<EntityId[]>([]);
  const [fetching, setFetching] = useState(false);
  const records = useMemo(() => new CatalogService(language).rows, [language]);
  const data = useMemo(
    () =>
      empty
        ? []
        : (sort.endsWith("desc") ? [...records].reverse() : records).slice(
            page * size,
            (page + 1) * size,
          ),
    [records, sort, page, size, empty],
  );
  if (id.startsWith("entity-")) return <EntityExamples {...props} />;
  if (["paginated-table", "base-table", "custom-table"].includes(id))
    return <ServiceTable {...props} />;
  if (id === "ui-table")
    return (
      <>
        {(["comfortable", "compact"] as const).map((density) => (
          <Example
            key={density}
            props={`density="${density}" · caption · header · classNames`}
          >
            <CoreTable
              density={density}
              caption={fa ? "جدول نمونه" : "Sample table"}
              header={
                <>
                  <th>ID</th>
                  <th>{fa ? "عنوان" : "Title"}</th>
                </>
              }
              classNames={{
                viewport: "rounded-lg border",
                caption: "pb-2 text-start",
              }}
            >
              {records.slice(0, 3).map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.title}</td>
                </tr>
              ))}
            </CoreTable>
          </Example>
        ))}
        <Example props="empty · emptyContent · columnCount">
          <CoreTable
            empty
            columnCount={2}
            emptyContent={fa ? "هیچ رکوردی موجود نیست" : "No records available"}
            header={
              <>
                <th>ID</th>
                <th>{fa ? "عنوان" : "Title"}</th>
              </>
            }
          />
        </Example>
      </>
    );
  return (
    <>
      <div className="catalog-row">
        <label>
          <input
            type="checkbox"
            checked={empty}
            onChange={(event) => {
              setEmpty(event.target.checked);
              setPage(0);
            }}
          />{" "}
          {fa ? "جدول خالی" : "Empty table"}
        </label>
        <label>
          <input
            type="checkbox"
            checked={fetching}
            onChange={(event) => setFetching(event.target.checked)}
          />{" "}
          isFetching
        </label>
      </div>
      <Example props="data · renderRow · header · page/pageSize · sort · selection · isRowSelectable · isFetching">
        <Table
          data={data}
          header={
            <>
              <THEAD>ID</THEAD>
              <THEAD>{fa ? "عنوان" : "Title"}</THEAD>
            </>
          }
          renderRow={(record) => (
            <>
              <TBODY>{record.id}</TBODY>
              <TBODY>{record.title}</TBODY>
            </>
          )}
          title={fa ? "جدول کنترل‌شده" : "Controlled table"}
          page={page}
          pageSize={size}
          totalPages={empty ? 0 : Math.ceil(records.length / size)}
          totalItems={empty ? 0 : records.length}
          sortValue={sort}
          sortOptions={[
            { value: "title,asc", label: "ASC" },
            { value: "title,desc", label: "DESC" },
          ]}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setSize(value);
            setPage(0);
          }}
          onSortChange={setSort}
          dataIdKey="id"
          onSelectionChange={setSelected}
          isRowSelectable={(record) => record.id !== 2}
          isFetching={fetching}
          onDeleteSelected={(ids) => setSelected(ids)}
        />
      </Example>
      <Message>{JSON.stringify(selected)}</Message>
    </>
  );
}
