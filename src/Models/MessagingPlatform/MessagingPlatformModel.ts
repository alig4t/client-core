import type { BaseModel } from "@/core/models/BaseModel";

export interface MessagingPlatformModel extends BaseModel {
  platformName: string;
  platformKey: string;
  apiEndpoint: string;
  authMethod: string;
}
