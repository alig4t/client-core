import type { BaseModel } from "@/core/models/BaseModel";

export interface PlatformModel extends BaseModel {
    platformName: string;
    apiEndpoint: string;
    authMethod: string;
}