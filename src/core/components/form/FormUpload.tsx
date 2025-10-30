// components/FormUploader.tsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { UploadCloud, X, Loader2, FileText } from "lucide-react";
import type { FieldError } from "react-hook-form";
import DocumentService from "@/Models/Document/DocumentService";
import { ACCEPT_FILE_STRING, ALLOWED_FILE_EXTENSIONS, ALLOWED_FILE_TYPES } from "./fileUtils";


// تشخیص تصویر از روی mimeType
const isImageMimeType = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

interface LabelProps {
  children: React.ReactNode;
}

interface ErrorFormTextProps {
  msg?: string;
}

interface FormUploaderProps {
  name: string;
  label: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
    {children}
  </label>
);

const ErrorFormText: React.FC<ErrorFormTextProps> = ({ msg }) => {
  if (!msg) return null;
  return <p className="text-sm text-red-600 mt-1">{msg}</p>;
};

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
  const [isDocument, setIsDocument] = useState<boolean>(false);
  const [isImageFile, setIsImageFile] = useState<boolean>(false); // ✅ اضافه شد

  const fileId = useWatch({ name, control });

  // --- برای فایل‌های جدید: mimeType را از آپلود بگیر
  const handleUploadSuccess = useCallback((doc: any) => {
    const mimeType = doc.mimeType || '';
    const isImage = isImageMimeType(mimeType);
    setIsImageFile(isImage);
    setIsDocument(!isImage);
  }, []);

  // --- Fetch preview for existing fileId (فقط سعی کن، اگر لود شد خوبه)
  useEffect(() => {
    if (typeof fileId !== "number") {
      setPreviewUrl(null);
      setIsDocument(false);
      setIsImageFile(false);
      return;
    }

    const abortController = new AbortController();
    let objectUrl: string | null = null;

    const fetchPreview = async () => {
      try {
        const token = await DocumentService.getToken(fileId);
        if (abortController.signal.aborted) return;

        const blob = await DocumentService.downloadAsBlob(token);
        if (abortController.signal.aborted) return;

        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
        setIsImageFile(true); // ✅ فرض می‌کنیم تصویر است تا ثابت شود خلاف آن
        setIsDocument(false);
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Preview failed for fileId", fileId, err);
          setPreviewUrl(null);
          setIsImageFile(false);
          setIsDocument(true);
        }
      }
    };

    fetchPreview();

    return () => {
      abortController.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId]);

  const uploadFile = useCallback(async (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setValue(name, null, { shouldValidate: true });
      return;
    }

    setIsUploading(true);
    try {
      const doc = await DocumentService.upload(file);
      handleUploadSuccess(doc); // ✅ mimeType را پردازش کن
      setValue(name, doc.id, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      console.error("Upload failed", error);
      setValue(name, null, { shouldValidate: true });
      setIsImageFile(false);
      setIsDocument(false);
    } finally {
      setIsUploading(false);
    }
  }, [name, setValue, handleUploadSuccess]);

  const processFile = (file: File | null | undefined) => {
    if (!file) return;
    uploadFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
  };

  const handleRemoveImage = () => {
    setValue(name, null, { shouldValidate: true, shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewUrl(null);
    setIsDocument(false);
    setIsImageFile(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  };

  const hasError = !!errors[name];
  const errorMessage = (errors[name] as FieldError)?.message;

  // --- Render Preview ---
  const renderPreview = () => {
    if (isUploading) {
      return (
        <div className="w-full h-48 flex flex-col justify-center items-center border-2 border-dashed border-purple-500 rounded-lg bg-purple-50 dark:bg-purple-900/10">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">در حال آپلود...</p>
        </div>
      );
    }

    if (previewUrl && isImageFile) {
      return (
        <div className="relative group w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => {
              // اگر لود نشد، فایل غیرتصویر است
              setPreviewUrl(null);
              setIsImageFile(false);
              setIsDocument(true);
            }}
          />
          <div className="absolute inset-0 bg-[#8080808f] bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      );
    }

    if (isDocument) {
      return (
        <div className="relative group w-full h-48 flex flex-col items-center justify-center 
                  border border-gray-200 dark:border-gray-700 
                  rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 
                  bg-white dark:bg-gray-800">

          {/* Document Icon and Text - Ensure these are visually above the overlay if possible */}
          <div className="z-10 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-blue-500 dark:text-blue-400 mb-3" />
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
              فایل آپلود شده
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              document-name.pdf
            </p>
          </div>

          {/* Overlay and Remove Button - z-20 puts the button on top of the text, but the overlay is still there. */}
          {/* The key change: using 'bg-gray-900/10' instead of 'bg-black' for light mode, 
         and a softer transition for dark mode. */}
          <div className="absolute inset-0 rounded-xl z-20
                      bg-gray-900/0 group-hover:bg-gray-900/10   {/* Subtle, lighter dark overlay on hover (Light Mode) */}
                      dark:group-hover:bg-black/30              {/* Less harsh overlay on hover (Dark Mode) */}
                      transition-all duration-300 
                      flex items-center justify-center cursor-pointer">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-3 bg-red-600 hover:bg-red-700 text-white 
                     rounded-full opacity-0 group-hover:opacity-100 
                     transform scale-90 group-hover:scale-100 transition-all duration-300 
                     shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Remove file"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`${dropzoneBaseClasses} ${isDragging
            ? dropzoneDraggingClasses
            : hasError
              ? dropzoneErrorClasses
              : dropzoneDefaultClasses
          }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={ACCEPT_FILE_STRING}
        />
        <div className="text-center pointer-events-none">
          <UploadCloud
            className={`mx-auto h-12 w-12 ${hasError ? "text-red-500" : "text-gray-400"}`}
          />
          <p className={`mt-2 text-sm ${hasError ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}>
            <span className="font-semibold text-purple-600 dark:text-purple-400">برای آپلود کلیک کنید</span> یا بکشید و رها کنید
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {ALLOWED_FILE_EXTENSIONS.map(ext => `.${ext}`).join(', ')} تا حداکثر 10MB
          </p>
        </div>
      </div>
    );
  };

  const dropzoneBaseClasses =
    "w-full h-48 flex flex-col justify-center items-center border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300";
  const dropzoneErrorClasses = "border-red-500 bg-red-50 dark:bg-red-900/10";
  const dropzoneDefaultClasses =
    "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/20 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10";
  const dropzoneDraggingClasses = "border-purple-600 bg-purple-100 dark:bg-purple-900/20";

  return (
    <div className={`w-full ${className}`}>
      <Label>{label}</Label>
      <div className="mt-1">{renderPreview()}</div>
      {hasError && <ErrorFormText msg={errorMessage} />}
    </div>
  );
};