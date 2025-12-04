import type { BaseModel } from "@/core/models/BaseModel";
import type { PlatformModel } from "../Platform/PlatformModel";

export interface ChannelModel extends BaseModel {
    channelName: string;
    channelIdentifier: string;
    status: string; // or you can define an enum for status
    platform: PlatformModel;
}