import type { BaseModel } from "@/core/models/BaseModel";
import type { PlatformModel } from "../Platform/PlatformModel";

export interface ChannelModel extends BaseModel {
    channelName: string;
    channelIdentifier: string;
    status: string; // یا می‌توانی یک enum برای وضعیت تعریف کنی
    platform: PlatformModel;
}