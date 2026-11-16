import { useMemo, type ReactNode } from "react";
import { CoreProvider, type UploadAdapter } from "./core/entity/CoreProvider";
import AttachmentService from "./Models/Attachment/AttachmentService";
import { useAuth } from "./stores/AuthContext";
const uploads: UploadAdapter = {
  upload: (file, options) => AttachmentService.upload(file, options),
  preview: async (id, signal) =>
    AttachmentService.downloadAsBlob(
      await AttachmentService.getToken(id, signal),
      signal,
    ),
  download: async (id, signal) =>
    AttachmentService.downloadAsBlob(
      await AttachmentService.getToken(id, signal),
      signal,
    ),
};
export default function CoreSetup({ children }: { children: ReactNode }) {
  const { hasPermission } = useAuth();
  const value = useMemo(
    () => ({
      can: (permission?: string) => !permission || hasPermission(permission),
      uploads,
    }),
    [hasPermission],
  );
  return <CoreProvider value={value}>{children}</CoreProvider>;
}
