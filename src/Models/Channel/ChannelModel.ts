import type { BaseModel } from "@/core/models/BaseModel";
import type { PlatformModel } from "../Platform/PlatformModel";
import type { ChannelStatusOption } from "./ChannelEnumField";

export interface ChannelModel extends BaseModel {
    channelName: string;
    channelIdentifier: string;
    status: ChannelStatusOption; // or you can define an enum for status
    platform: PlatformModel;
}