import type { BaseModel } from "@/core/models/BaseModel";

export interface MessagingPlatformModel extends BaseModel<number> {
  platformName: string;
  platformKey: string;
  apiEndpoint: string;
  authMethod: string;
}
export interface MessagingPlatformCreateInput {
  platformName: string;
  platformKey: string;
  apiEndpoint: string;
  authMethod: string;
}
export interface MessagingPlatformUpdateInput {
  platformName?: string;
  platformKey?: string;
  apiEndpoint?: string;
  authMethod?: string;
}
