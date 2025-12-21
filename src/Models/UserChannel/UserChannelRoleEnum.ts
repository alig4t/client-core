export const UserChannelRoleEnum = {
  OWNER: "OWNER",
  MEMBER: "MEMBER",
} as const;

export type UserChannelRoleEnum =
  (typeof UserChannelRoleEnum)[keyof typeof UserChannelRoleEnum];

export const UserChannelRoleEnumLabels = {
  [UserChannelRoleEnum.OWNER]: "مالک",
  [UserChannelRoleEnum.MEMBER]: "عضو",
};
