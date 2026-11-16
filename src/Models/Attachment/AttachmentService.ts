import { api } from "@/core/service/Axios";
import { BaseService } from "@/core/service/BaseService";
import type { EntityId } from "@/core/service/contracts";
import type { AttachmentModel } from "./AttachmentModel";
class AttachmentService extends BaseService<AttachmentModel> {
  constructor() { super("/attachment"); }
  async upload(file: File, options?: { signal?: AbortSignal; onProgress?: (percentage: number) => void }): Promise<AttachmentModel> {
    const formData = new FormData(); formData.append("file", file);
    return (await api.post<AttachmentModel>("/document/upload", formData, { signal: options?.signal, onUploadProgress: event => options?.onProgress?.(event.total ? Math.round(event.loaded * 100 / event.total) : 0) })).data;
  }
  async getToken(id: EntityId, signal?: AbortSignal): Promise<string> { return (await api.get<string>("/document/token/" + encodeURIComponent(String(id)), { signal })).data; }
  async downloadAsBlob(token: string, signal?: AbortSignal): Promise<Blob> { return (await api.get<Blob>("/document/stream/" + encodeURIComponent(token), { responseType: "blob", signal })).data; }
}
export default new AttachmentService();
