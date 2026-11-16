export const BotStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type BotStatusEnum = (typeof BotStatusEnum)[keyof typeof BotStatusEnum];
export const BotStatusEnumLabels = { ACTIVE: "فعال", INACTIVE: "غیرفعال" };
