export const ChannelStatusOption = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type ChannelStatusOption = (typeof ChannelStatusOption)[keyof typeof ChannelStatusOption];

export const ChannelStatusOptionLabels: Record<ChannelStatusOption, string> = {
  [ChannelStatusOption.ACTIVE]: "فعال",
  [ChannelStatusOption.INACTIVE]: "غیرفعال",
};