export const BotStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type BotStatusEnum = (typeof BotStatusEnum)[keyof typeof BotStatusEnum];

export const BotStatusEnumLabels = {
  [BotStatusEnum.ACTIVE]: "فعال",
  [BotStatusEnum.INACTIVE]: "غیرفعال",
};
