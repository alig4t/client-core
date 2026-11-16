import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useCore, type UploadFile } from "../../entity/CoreProvider";
import { isRecord, type EntityId } from "../../service/contracts";
import FilePreview from "./FilePreview";
import { useFormActivity } from "./FormWrapper";
interface FormUploaderProps {
  name: string;
  label: string;
  className?: string;
  multiple?: boolean;
  valueMode?: "id" | "object";
  maxFileSize?: number;
  accept?: string[];
  disabled?: boolean;
}
export const FormUploader = ({
  name,
  label,
  className,
  multiple = false,
  valueMode = "id",
  maxFileSize = 10 * 1024 * 1024,
  accept = ["image/*", "application/pdf", "application/zip"],
  disabled,
}: FormUploaderProps) => {
  const { control } = useFormContext();
  const { uploads } = useCore();
  const activity = useFormActivity();
  const [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [error, setError] = useState("");
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const values: unknown[] = multiple
          ? Array.isArray(field.value)
            ? field.value
            : []
          : field.value != null
            ? [field.value]
            : [];
        return (
          <div className={className}>
            <label htmlFor={name} className="block mb-1.5">
              {label}
            </label>
            <input
              id={name}
              type="file"
              multiple={multiple}
              accept={accept.join(",")}
              disabled={disabled || busy || !uploads}
              onChange={async (event) => {
                const files = Array.from(event.target.files ?? []);
                event.target.value = "";
                if (!files.length || !uploads) return;
                const invalid = files.find(
                  (file) =>
                    file.size > maxFileSize ||
                    !accept.some((type) =>
                      type.startsWith(".")
                        ? file.name.toLowerCase().endsWith(type.toLowerCase())
                        : type.endsWith("/*")
                          ? file.type.startsWith(type.slice(0, -1))
                          : file.type === type,
                    ),
                );
                if (invalid) {
                  setError("نوع یا حجم فایل مجاز نیست: " + invalid.name);
                  return;
                }
                abort.current?.abort();
                const controller = new AbortController();
                abort.current = controller;
                setBusy(true);
                setProgress(0);
                setError("");
                activity.startUpload();
                const uploaded: UploadFile[] = [];
                try {
                  for (const file of files)
                    uploaded.push(
                      await uploads.upload(file, {
                        signal: controller.signal,
                        onProgress: setProgress,
                      }),
                    );
                  if (!controller.signal.aborted) {
                    const next = uploaded.map((file) =>
                      valueMode === "object" ? file : file.id,
                    );
                    field.onChange(multiple ? [...values, ...next] : next[0]);
                  }
                } catch (cause) {
                  if (!controller.signal.aborted) {
                    if (uploaded.length) {
                      const next = uploaded.map((file) =>
                        valueMode === "object" ? file : file.id,
                      );
                      field.onChange(multiple ? [...values, ...next] : next[0]);
                    }
                    setError(
                      cause instanceof Error
                        ? cause.message
                        : "خطا در بارگذاری",
                    );
                  }
                } finally {
                  activity.finishUpload();
                  if (!controller.signal.aborted) setBusy(false);
                }
              }}
            />
            {!uploads && <p role="alert">سرویس بارگذاری پیکربندی نشده است</p>}
            {busy && (
              <progress
                aria-label="پیشرفت بارگذاری"
                value={progress}
                max={100}
              />
            )}
            {values.map((value, index) => {
              const id = isRecord(value) ? value.id : value;
              return (
                <div key={String(id)} className="flex gap-2 items-center">
                  <FilePreview fileId={id as EntityId} previewSize="sm" />
                  <button
                    type="button"
                    disabled={disabled || busy}
                    aria-label="حذف فایل"
                    onClick={() =>
                      field.onChange(
                        multiple
                          ? values.filter((_, position) => position !== index)
                          : null,
                      )
                    }
                  >
                    حذف
                  </button>
                </div>
              );
            })}
            {(error || fieldState.error?.message) && (
              <p role="alert" className="text-red-600">
                {error || fieldState.error?.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
