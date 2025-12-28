export const OwnedChannelStatusEnum = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type OwnedChannelStatusEnum =
  (typeof OwnedChannelStatusEnum)[keyof typeof OwnedChannelStatusEnum];

export const OwnedChannelStatusEnumLabels = {
  [OwnedChannelStatusEnum.DRAFT]: "پیش‌نویس",
  [OwnedChannelStatusEnum.PENDING]: "در انتظار تایید",
  [OwnedChannelStatusEnum.APPROVED]: "تایید شده",
  [OwnedChannelStatusEnum.REJECTED]: "رد شده",
};
