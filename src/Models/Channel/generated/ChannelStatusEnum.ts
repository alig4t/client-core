export const ChannelStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type ChannelStatusEnum =
  (typeof ChannelStatusEnum)[keyof typeof ChannelStatusEnum];
export const ChannelStatusEnumLabels = { ACTIVE: "فعال", INACTIVE: "غیرفعال" };
