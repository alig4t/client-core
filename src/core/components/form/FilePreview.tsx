import { useEffect, useState } from "react";
import { useCore } from "../../entity/CoreProvider";
import type { EntityId } from "../../service/contracts";
interface FilePreviewProps {
  fileId?: EntityId | null;
  previewSize?: "sm" | "md" | "lg";
  className?: string;
}
export default function FilePreview({
  fileId,
  previewSize = "md",
  className,
}: FilePreviewProps) {
  const { uploads } = useCore();
  const [preview, setPreview] = useState<{
    url: string;
    image: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setPreview(null);
    setError("");
    if (fileId == null || !uploads?.preview) return;
    const controller = new AbortController();
    let url: string | undefined;
    uploads
      .preview(fileId, controller.signal)
      .then((blob) => {
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setPreview({ url, image: blob.type.startsWith("image/") });
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : "خطا در پیش‌نمایش");
      });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileId, uploads]);
  if (fileId == null) return null;
  return (
    <div className={className}>
      {preview ? (
        <a
          href={preview.url}
          target="_blank"
          rel="noreferrer"
          download={!preview.image}
        >
          {preview.image ? (
            <img
              src={preview.url}
              alt="پیوست"
              className={
                { sm: "h-12 w-12", md: "h-20 w-20", lg: "h-32 w-32" }[
                  previewSize
                ] + " object-contain rounded"
              }
            />
          ) : (
            "دریافت فایل"
          )}
        </a>
      ) : error ? (
        <span role="alert">{error}</span>
      ) : (
        <span>پیوست {fileId}</span>
      )}
    </div>
  );
}
