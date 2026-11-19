import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useFormContext } from "react-hook-form";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  UNSAFE_DataRouterContext,
} from "react-router-dom";
import { toast } from "sonner";
import FilePreview from "../components/form/FilePreview";
import { FormWrapper, useFormActivity } from "../components/form/FormWrapper";
import { PageWrapper } from "../components/general/container/PageWrapper";
import ConfirmationModal from "../components/general/modal/ConfirmationModal";
import TableErrorState from "../components/general/TableErrorState";
import Table, { TBODY, THEAD } from "../components/Table/DataTable";
import Button from "../components/general/button/Button";
import { DynamicFields } from "../forms/DynamicField";
import type { FormFieldMetadata } from "../forms/FieldFormTypes";
import { BaseService } from "../service/BaseService";
import { BulkOperationError, type EntityId } from "../service/contracts";
import { useCore } from "./CoreProvider";
import {
  buildEntitySchema,
  dataTypeOf,
  defaultEntityValues,
  editableField,
  formatFieldValue,
  entityToApi,
  entityFromApi,
} from "./fields";
import { useEntityDetail, useEntityList, useEntityMutations } from "./queries";
import type {
  EntityDefinition,
  EntityInput,
  EntityRecord,
  EntityTransforms,
} from "./types";
export interface EntityAction<T> {
  name: string;
  label: string;
  permission?: string;
  visible?: (record: T) => boolean;
  execute: (record: T) => void | Promise<void>;
}
export interface EntityPageProps<
  T extends object,
  TCreate = EntityInput,
  TUpdate = EntityInput,
> {
  definition: EntityDefinition;
  service: BaseService<T, TCreate, TUpdate>;
  transforms?: EntityTransforms<T, TCreate, TUpdate>;
  actions?: EntityAction<T>[];
  renderField?: (name: string, value: unknown, record: T) => ReactNode;
}
function Failure({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <PageWrapper>
      <TableErrorState message={error.message} onRetry={retry} />
    </PageWrapper>
  );
}
function FormActions({ cancel, busy }: { cancel: () => void; busy: boolean }) {
  const dataRouter = useContext(UNSAFE_DataRouterContext);
  const {
    formState: { isDirty, isSubmitting },
  } = useFormContext();
  const { pendingUploads } = useFormActivity();
  return (
    <div className="flex gap-3 mt-6">
      <Button
        type="submit"
        disabled={busy || isSubmitting || pendingUploads > 0}
      >
        ذخیره
      </Button>
      <Button
        variant="cancel"
        type="button"
        onClick={() => {
          if (
            dataRouter ||
            !isDirty ||
            window.confirm("تغییرات ذخیره نشده‌اند. خارج می‌شوید؟")
          )
            cancel();
        }}
      >
        انصراف
      </Button>
    </div>
  );
}
export function EntityForm<T extends object, TCreate, TUpdate>({
  definition,
  service,
  transforms,
}: EntityPageProps<T, TCreate, TUpdate>) {
  const { id } = useParams(),
    navigate = useNavigate(),
    { can } = useCore();
  const mode = id === undefined ? "create" : "edit";
  const permission =
    definition.permissions?.[mode === "create" ? "create" : "update"];
  const detail = useEntityDetail(
    definition.name,
    service,
    can(permission) ? id : undefined,
  );
  const mutations = useEntityMutations(definition.name, service);
  const fields = useMemo(() => {
    const select = (
      fields: Record<string, FormFieldMetadata>,
    ): Record<string, FormFieldMetadata> =>
      Object.fromEntries(
        Object.entries(fields)
          .filter(
            ([, field]) =>
              editableField(field, mode) &&
              can(
                field.writePermission,
                detail.data as EntityRecord | undefined,
              ) &&
              can(
                field.readPermission,
                detail.data as EntityRecord | undefined,
              ),
          )
          .map(([name, field]) => [
            name,
            {
              ...field,
              ...(field.fields ? { fields: select(field.fields) } : {}),
            },
          ]),
      );
    return select(definition.fields);
  }, [definition, mode, can, detail.data]);
  const schemaDefinition = { ...definition, fields };
  const schema = buildEntitySchema(schemaDefinition, mode);
  if (!can(permission, detail.data as EntityRecord | undefined))
    return <p role="alert">اجازه دسترسی به این عملیات وجود ندارد</p>;
  if (id !== undefined && detail.isPending)
    return <p role="status">در حال دریافت…</p>;
  if (id !== undefined && detail.isError)
    return <Failure error={detail.error} retry={() => detail.refetch()} />;
  const initial = detail.data
    ? (transforms?.fromApi?.(detail.data) ??
      entityFromApi(definition, detail.data as EntityInput))
    : defaultEntityValues(definition);
  return (
    <PageWrapper>
      <h1 className="text-2xl mb-5">
        {mode === "create" ? "ایجاد " : "ویرایش "}
        {definition.displayName}
      </h1>
      <FormWrapper<EntityInput>
        key={id ?? "create"}
        recordKey={id ?? "create"}
        defaultValues={initial}
        schema={schema}
        guardUnsaved
        onSubmit={async (values) => {
          if (!can(permission, detail.data as EntityRecord | undefined))
            throw new Error("اجازه ذخیره وجود ندارد");
          values = entityToApi(schemaDefinition, values, mode);
          if (id !== undefined)
            await mutations.update.mutateAsync({
              id,
              values: transforms?.toUpdate?.(values) ?? (values as TUpdate),
            });
          else
            await mutations.create.mutateAsync(
              transforms?.toCreate?.(values) ?? (values as TCreate),
            );
          toast.success("اطلاعات ذخیره شد");
          navigate(definition.routing?.basePath ?? "..");
        }}
      >
        <DynamicFields fields={fields} />
        <FormActions
          cancel={() => navigate(definition.routing?.basePath ?? "..")}
          busy={mutations.create.isPending || mutations.update.isPending}
        />
      </FormWrapper>
    </PageWrapper>
  );
}
export function EntityDetail<T extends object, TCreate, TUpdate>({
  definition,
  service,
  renderField,
}: EntityPageProps<T, TCreate, TUpdate>) {
  const { id } = useParams(),
    { can, locale, calendar } = useCore();
  const query = useEntityDetail(
    definition.name,
    service,
    can(definition.permissions?.read) ? id : undefined,
  );
  if (
    !can(definition.permissions?.read, query.data as EntityRecord | undefined)
  )
    return <p role="alert">اجازه مشاهده وجود ندارد</p>;
  if (query.isPending) return <p role="status">در حال دریافت…</p>;
  if (query.isError)
    return <Failure error={query.error} retry={() => query.refetch()} />;
  if (!query.data) return <p role="alert">رکورد یافت نشد</p>;
  const record = query.data as EntityInput;
  return (
    <PageWrapper>
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl">
          {definition.displayName} {id}
        </h1>
        {can(definition.permissions?.update, record as EntityRecord) && (
          <Link
            to={
              definition.routing?.basePath +
              "/" +
              encodeURIComponent(id ?? "") +
              "/edit"
            }
          >
            ویرایش
          </Link>
        )}
      </div>
      <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(definition.fields)
          .filter(
            ([, field]) =>
              field.detail !== false &&
              !field.hidden &&
              !field.writeOnly &&
              can(field.readPermission, record as EntityRecord),
          )
          .map(([name, field]) => (
            <div key={name} className="border rounded p-3">
              <dt>{field.label}</dt>
              <dd>
                {renderField?.(name, record[name], query.data) ??
                  (dataTypeOf(field) === "file"
                    ? (Array.isArray(record[name])
                        ? record[name]
                        : [record[name]]
                      ).map((value: unknown, index: number) => (
                        <FilePreview
                          key={index}
                          fileId={
                            (value && typeof value === "object"
                              ? (value as { id: EntityId }).id
                              : value) as EntityId
                          }
                        />
                      ))
                    : formatFieldValue(record[name], field, locale, calendar))}
              </dd>
            </div>
          ))}
      </dl>
    </PageWrapper>
  );
}
export function buildFilterFields(
  definition: EntityDefinition,
): Record<string, FormFieldMetadata> {
  const fields: Record<string, FormFieldMetadata> = {};
  for (const [name, field] of Object.entries(definition.fields)) {
    if (!field.searchable || field.hidden || field.writeOnly) continue;
    const kind = dataTypeOf(field);
    const base = {
      ...field,
      required: false,
      requiredWhen: undefined,
      visibleWhen: undefined,
      disabledWhen: undefined,
      readOnly: false,
      create: true,
      edit: true,
    };
    if (kind === "string")
      fields[name + "_like"] = {
        ...base,
        dataType: "string",
        type: "text",
        minLength: undefined,
        pattern: undefined,
      };
    else if (kind === "boolean")
      fields[name + "_eq"] = {
        ...base,
        dataType: "enum",
        type: "select",
        options: [
          { value: "true", label: "بله" },
          { value: "false", label: "خیر" },
        ],
      };
    else if (kind === "enum" || kind === "reference")
      fields[name + "_eq"] =
        kind === "reference"
          ? {
              ...base,
              multiple: false,
              relation: { ...base.relation!, multiple: false, valueMode: "id" },
            }
          : base;
    else if (
      [
        "integer",
        "long",
        "double",
        "decimal",
        "date",
        "datetime",
        "instant",
      ].includes(kind)
    )
      for (const operator of ["ge", "le"])
        fields[name + "_" + operator] = {
          ...base,
          min: undefined,
          max: undefined,
          label: field.label + (operator === "ge" ? " از" : " تا"),
        };
  }
  return fields;
}
export function EntitySearch({
  definition,
  onApply,
  values = {},
}: {
  definition: EntityDefinition;
  onApply: (values: EntityInput) => void;
  values?: EntityInput;
}) {
  const fields = useMemo(() => buildFilterFields(definition), [definition]);
  const searchDefinition = useMemo(
    () => ({ ...definition, fields }),
    [definition, fields],
  );
  return (
    <FormWrapper<EntityInput>
      defaultValues={values}
      schema={buildEntitySchema(searchDefinition)}
      onSubmit={onApply}
    >
      <DynamicFields fields={fields} />
      <div className="flex gap-3 my-4">
        <button type="submit">اعمال فیلتر</button>
        <button type="button" onClick={() => onApply({})}>
          حذف فیلترها
        </button>
      </div>
    </FormWrapper>
  );
}
export function EntityList<T extends object, TCreate, TUpdate>({
  definition,
  service,
  actions = [],
  renderField,
}: EntityPageProps<T, TCreate, TUpdate>) {
  const [search, setSearch] = useSearchParams(),
    { can, locale, calendar } = useCore();
  const page = Math.max(0, Number(search.get("page")) || 0),
    size = Math.min(100, Math.max(1, Number(search.get("size")) || 10)),
    sort = search.get("sort") ?? "createdAt,desc";
  const filterKey = Array.from(search)
    .filter(([key]) => key.startsWith("filter."))
    .map(([key, value]) => [key.slice(7), value]);
  const allowedFilters = buildFilterFields(definition);
  const filters = Object.fromEntries(
    filterKey.filter(
      ([key]) => allowedFilters[key] && can(allowedFilters[key].readPermission),
    ),
  );
  const query = useEntityList(
    definition.name,
    service,
    { page, size, sort, filters },
    can(definition.permissions?.read),
  );
  const mutations = useEntityMutations(definition.name, service);
  const [selected, setSelected] = useState<EntityId[]>([]),
    [deleting, setDeleting] = useState<EntityId[]>([]);
  const update = (changes: Record<string, string | undefined>) =>
    setSearch((previous) => {
      const next = new URLSearchParams(previous);
      for (const [key, value] of Object.entries(changes)) {
        if (value === undefined) next.delete(key);
        else next.set(key, value);
      }
      return next;
    });
  useEffect(() => {
    if (query.data && page > 0 && page >= query.data.meta.totalPages)
      setSearch((previous) => {
        const next = new URLSearchParams(previous);
        next.set("page", String(Math.max(0, query.data.meta.totalPages - 1)));
        return next;
      });
  }, [query.data, page, setSearch]);
  const columns = Object.entries(definition.fields)
    .filter(
      ([, field]) =>
        field.list !== false &&
        !field.hidden &&
        !field.writeOnly &&
        can(field.readPermission),
    )
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0));
  if (!can(definition.permissions?.read))
    return <p role="alert">اجازه مشاهده وجود ندارد</p>;
  return (
    <PageWrapper>
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl">{definition.pluralDisplayName}</h1>
        {can(definition.permissions?.create) && (
          <Link to={definition.routing?.basePath + "/create"}>
            ایجاد {definition.displayName}
          </Link>
        )}
      </div>
      <details className="mb-5">
        <summary>جستجو و فیلتر</summary>
        <EntitySearch
          key={JSON.stringify(filterKey)}
          definition={definition}
          values={filters}
          onApply={(values) =>
            setSearch((previous) => {
              const next = new URLSearchParams(previous);
              Array.from(next.keys())
                .filter((key) => key.startsWith("filter."))
                .forEach((key) => next.delete(key));
              for (const [key, value] of Object.entries(values))
                if (value !== undefined && value !== null && value !== "")
                  next.set(
                    "filter." + key,
                    String(
                      value && typeof value === "object"
                        ? (value as { id: EntityId }).id
                        : value,
                    ),
                  );
              next.set("page", "0");
              return next;
            })
          }
        />
      </details>
      {query.isPending ? (
        <p role="status">در حال دریافت…</p>
      ) : query.isError ? (
        <TableErrorState
          message={query.error.message}
          onRetry={() => query.refetch()}
        />
      ) : (
        <Table<T>
          data={query.data.data}
          dataIdKey={"id" as keyof T}
          title={definition.pluralDisplayName}
          header={
            <>
              <THEAD>شناسه</THEAD>
              {columns.map(([name, field]) => (
                <THEAD key={name}>{field.label}</THEAD>
              ))}
              <THEAD>عملیات</THEAD>
            </>
          }
          renderRow={(item) => {
            const record = item as EntityInput;
            const id = record.id as EntityId;
            return (
              <>
                <TBODY>{String(id)}</TBODY>
                {columns.map(([name, field]) => (
                  <TBODY key={name}>
                    {renderField?.(name, record[name], item) ??
                      formatFieldValue(record[name], field, locale, calendar)}
                  </TBODY>
                ))}
                <TBODY>
                  <div className="flex gap-3">
                    <Link
                      to={
                        definition.routing?.basePath +
                        "/" +
                        encodeURIComponent(String(id))
                      }
                    >
                      مشاهده
                    </Link>
                    {can(
                      definition.permissions?.update,
                      record as EntityRecord,
                    ) && (
                      <Link
                        to={
                          definition.routing?.basePath +
                          "/" +
                          encodeURIComponent(String(id)) +
                          "/edit"
                        }
                      >
                        ویرایش
                      </Link>
                    )}
                    {can(
                      definition.permissions?.delete,
                      record as EntityRecord,
                    ) && (
                      <button type="button" onClick={() => setDeleting([id])}>
                        حذف
                      </button>
                    )}
                    {actions
                      .filter(
                        (action) =>
                          can(action.permission, record as EntityRecord) &&
                          (action.visible?.(item) ?? true),
                      )
                      .map((action) => (
                        <button
                          type="button"
                          key={action.name}
                          onClick={() => action.execute(item)}
                        >
                          {action.label}
                        </button>
                      ))}
                  </div>
                </TBODY>
              </>
            );
          }}
          page={page}
          pageSize={size}
          totalPages={query.data.meta.totalPages}
          totalItems={query.data.meta.totalItems}
          sortValue={sort}
          sortOptions={columns
            .filter(([, field]) => field.sortable)
            .flatMap(([name, field]) => [
              { value: name + ",asc", label: field.label + " صعودی" },
              { value: name + ",desc", label: field.label + " نزولی" },
            ])}
          onPageChange={(value) => update({ page: String(value) })}
          onPageSizeChange={(value) =>
            update({ size: String(value), page: "0" })
          }
          onSortChange={(value) => update({ sort: value, page: "0" })}
          isRowSelectable={(item) =>
            can(definition.permissions?.delete, item as EntityRecord)
          }
          onSelectionChange={
            can(definition.permissions?.delete) ? setSelected : undefined
          }
          onDeleteSelected={
            can(definition.permissions?.delete) ? setDeleting : undefined
          }
          isFetching={query.isFetching}
        />
      )}
      {selected.length > 0 && (
        <span className="sr-only">{selected.length} انتخاب شده</span>
      )}
      <ConfirmationModal
        isOpen={deleting.length > 0}
        onClose={() => {
          if (!mutations.remove.isPending) setDeleting([]);
        }}
        onConfirm={async () => {
          if (
            !can(definition.permissions?.delete) ||
            deleting.some(
              (id) =>
                !can(
                  definition.permissions?.delete,
                  query.data?.data.find(
                    (item) => (item as EntityRecord).id === id,
                  ) as EntityRecord | undefined,
                ),
            )
          )
            return;
          try {
            await mutations.remove.mutateAsync(deleting);
            setDeleting([]);
            setSelected([]);
            if (
              query.data &&
              page > 0 &&
              deleting.length >= query.data.data.length
            )
              update({ page: String(page - 1) });
            toast.success("حذف انجام شد");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "حذف ناموفق بود",
            );
            if (error instanceof BulkOperationError) {
              setDeleting(error.result.failed.map((value) => value.id));
              if (
                page > 0 &&
                error.result.succeeded.length >=
                  (query.data?.data.length ?? Infinity)
              )
                update({ page: String(page - 1) });
            }
          }
        }}
        title="تأیید حذف"
        message={"حذف " + deleting.length + " مورد انجام شود؟"}
        isDeleting={mutations.remove.isPending}
      />
    </PageWrapper>
  );
}
export function createEntityService<
  T extends object = EntityRecord,
  TCreate = EntityInput,
  TUpdate = EntityInput,
>(definition: EntityDefinition) {
  return new BaseService<T, TCreate, TUpdate>(definition.endpoint, undefined, {
    operations: definition.operations,
  });
}
