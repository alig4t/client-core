export const ChannelStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type ChannelStatusEnum =
  (typeof ChannelStatusEnum)[keyof typeof ChannelStatusEnum];

export const ChannelStatusEnumLabels = {
  [ChannelStatusEnum.ACTIVE]: "فعال",
  [ChannelStatusEnum.INACTIVE]: "غیرفعال",
};
