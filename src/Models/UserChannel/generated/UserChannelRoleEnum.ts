export const UserChannelRoleEnum = {
  OWNER: "OWNER",
  MEMBER: "MEMBER",
} as const;
export type UserChannelRoleEnum =
  (typeof UserChannelRoleEnum)[keyof typeof UserChannelRoleEnum];
export const UserChannelRoleEnumLabels = { OWNER: "مالک", MEMBER: "عضو" };
