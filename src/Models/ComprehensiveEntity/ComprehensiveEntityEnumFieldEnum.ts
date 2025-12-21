export const ComprehensiveEntityEnumFieldEnum = {
  OPTION_A: "OPTION_A",
  OPTION_B: "OPTION_B",
} as const;

export type ComprehensiveEntityEnumFieldEnum =
  (typeof ComprehensiveEntityEnumFieldEnum)[keyof typeof ComprehensiveEntityEnumFieldEnum];

export const ComprehensiveEntityEnumFieldEnumLabels = {
  [ComprehensiveEntityEnumFieldEnum.OPTION_A]: "گزینه A",
  [ComprehensiveEntityEnumFieldEnum.OPTION_B]: "گزینه B",
};
