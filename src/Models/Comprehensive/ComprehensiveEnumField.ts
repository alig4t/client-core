export const ComprehensiveEnumFieldOption = {
    OPTION_A: "OPTION_A",
    OPTION_B: "OPTION_B",
} as const;

export type ComprehensiveEnumFieldOption = (typeof ComprehensiveEnumFieldOption)[keyof typeof ComprehensiveEnumFieldOption];

export const ComprehensiveEnumFieldOptionLabels: Record<ComprehensiveEnumFieldOption, string> = {
    [ComprehensiveEnumFieldOption.OPTION_A]: "گزینه A",
    [ComprehensiveEnumFieldOption.OPTION_B]: "گزینه B",
};
