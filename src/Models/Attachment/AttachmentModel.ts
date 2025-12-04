import type { BaseModel } from "@/core/models/BaseModel";

export interface AttachmentModel extends BaseModel {
  path: string;
  size: number;
  type: "IMAGE" | "VIDEO" | "FILE";
  mimeType: string;
  extension: string;
  hash: string;
  scope: "PRIVATE" | "PUBLIC";
}