// components/FormUploader.tsx
import React, { useRef, useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { UploadCloud, X, Loader2 } from "lucide-react";
import type { FieldError } from "react-hook-form";
import DocumentService from "@/Models/Document/DocumentService";

// --- Helper Component Types ---
interface LabelProps {
  children: React.ReactNode;
}

interface ErrorFormTextProps {
  msg?: string;
}

// --- Main Component Props Type ---
interface FormUploaderProps {
  name: string;
  label: string;
  className?: string;
}

// --- Helper Components ---
const Label: React.FC<LabelProps> = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
    {children}
  </label>
);

const ErrorFormText: React.FC<ErrorFormTextProps> = ({ msg }) => {
  if (!msg) return null;
  return <p className="text-sm text-red-600 mt-1">{msg}</p>;
};

// --- ✨ Main Component: FormUploader (آپلود واقعی با id) ✨ ---
export const FormUploader: React.FC<FormUploaderProps> = ({
  name,
  label,
  className = "",
}) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // مقدار فعلی فیلد (باید عدد باشه: id فایل)
  const fileId = useWatch({ name, control });

  // --- وقتی fileId تغییر کرد، previewUrl را به‌روز کن ---
  useEffect(() => {
    if (typeof fileId === "number") {
      const fetchPreview = async () => {
        try {
          const token = await DocumentService.getToken(fileId);
          const url = DocumentService.getDownloadUrl(token);
          setPreviewUrl(url);
        } catch (err) {
          console.error("Failed to fetch preview token", err);
          setPreviewUrl(null);
        }
      };
      fetchPreview();
    } else {
      setPreviewUrl(null);
    }
  }, [fileId]);

  // --- آپلود فایل ---
  // در FormUploader.tsx
  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setValue(name, null, { shouldValidate: true });
      return;
    }

    setIsUploading(true);
    try {
      const doc = await DocumentService.upload(file);
      // فقط id رو در فرم ذخیره کن
      setValue(name, doc.id, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      console.error("Upload failed", error);
      setValue(name, null, { shouldValidate: true });
    } finally {
      setIsUploading(false);
    }
  };
  // --- پردازش فایل انتخاب‌شده ---
  const processFile = (file: File | null | undefined) => {
    if (!file) return;
    uploadFile(file);
  };

  // --- Event Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
  };

  const handleRemoveImage = () => {
    setValue(name, null, { shouldValidate: true, shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl(null);
  };

  // Drag and Drop Handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  };

  const hasError = !!errors[name];
  const errorMessage = (errors[name] as FieldError)?.message;

  // --- Dropzone Classes ---
  const dropzoneBaseClasses =
    "w-full h-48 flex flex-col justify-center items-center border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300";
  const dropzoneErrorClasses = "border-red-500 bg-red-50 dark:bg-red-900/10";
  const dropzoneDefaultClasses =
    "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/20 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10";
  const dropzoneDraggingClasses =
    "border-purple-600 bg-purple-100 dark:bg-purple-900/20";

  const dropzoneClassName = `${dropzoneBaseClasses} ${
    isDragging
      ? dropzoneDraggingClasses
      : hasError
        ? dropzoneErrorClasses
        : dropzoneDefaultClasses
  }`;

  return (
    <div className={`w-full ${className}`}>
      <Label>{label}</Label>
      <div className="mt-1">
        {previewUrl ? (
          // --- Image Preview with Remove Button ---
          <div className="relative group w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)} // اگر لود نشد، پیش‌نمایش رو پاک کن
            />
            <div className="absolute inset-0 bg-[#8080808f] bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
                aria-label="Remove image"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : isUploading ? (
          // --- Uploading State ---
          <div className="w-full h-48 flex flex-col justify-center items-center border-2 border-dashed border-purple-500 rounded-lg bg-purple-50 dark:bg-purple-900/10">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
              در حال آپلود...
            </p>
          </div>
        ) : (
          // --- Dropzone ---
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={dropzoneClassName}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="text-center pointer-events-none">
              <UploadCloud
                className={`mx-auto h-12 w-12 ${hasError ? "text-red-500" : "text-gray-400"}`}
              />
              <p
                className={`mt-2 text-sm ${hasError ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}
              >
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  برای آپلود کلیک کنید
                </span>{" "}
                یا بکشید و رها کنید
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF تا حداکثر 10MB
              </p>
            </div>
          </div>
        )}
      </div>
      {hasError && <ErrorFormText msg={errorMessage} />}
    </div>
  );
};
