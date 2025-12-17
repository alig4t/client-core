// src/constants/Permission.ts

// Your system's main resources based on API data
export const Permission = {
  // Bot
  Bot_Root: "bot:root",
  Bot_Create: "bot:create",
  Bot_Read: "bot:read",
  Bot_Update: "bot:update",
  Bot_Delete: "bot:delete",
  Bot_Search: "bot:search",

  // Channel
  Channel_Root: "channel:root",
  Channel_Create: "channel:create",
  Channel_Read: "channel:read",
  Channel_Update: "channel:update",
  Channel_Delete: "channel:delete",
  Channel_Search: "channel:search",

  // City
  City_Root: "city:root",
  City_Create: "city:create",
  City_Read: "city:read",
  City_Update: "city:update",
  City_Delete: "city:delete",
  City_Search: "city:search",

  // ComprehensiveEntity
  ComprehensiveEntity_Root: "comprehensiveentity:root",
  ComprehensiveEntity_Create: "comprehensiveentity:create",
  ComprehensiveEntity_Read: "comprehensiveentity:read",
  ComprehensiveEntity_Update: "comprehensiveentity:update",
  ComprehensiveEntity_Delete: "comprehensiveentity:delete",
  ComprehensiveEntity_Search: "comprehensiveentity:search",

  // DashboardData
  DashboardData_Root: "dashboarddata:root",
  DashboardData_Create: "dashboarddata:create",
  DashboardData_Read: "dashboarddata:read",
  DashboardData_Update: "dashboarddata:update",
  DashboardData_Delete: "dashboarddata:delete",
  DashboardData_Search: "dashboarddata:search",

  // Keyword
  Keyword_Root: "keyword:root",
  Keyword_Create: "keyword:create",
  Keyword_Read: "keyword:read",
  Keyword_Update: "keyword:update",
  Keyword_Delete: "keyword:delete",
  Keyword_Search: "keyword:search",

  // KeywordMatch
  KeywordMatch_Root: "keywordmatch:root",
  KeywordMatch_Create: "keywordmatch:create",
  KeywordMatch_Read: "keywordmatch:read",
  KeywordMatch_Update: "keywordmatch:update",
  KeywordMatch_Delete: "keywordmatch:delete",
  KeywordMatch_Search: "keywordmatch:search",

  // Message
  Message_Root: "message:root",
  Message_Create: "message:create",
  Message_Read: "message:read",
  Message_Update: "message:update",
  Message_Delete: "message:delete",
  Message_Search: "message:search",

  // MessagingPlatform
  MessagingPlatform_Root: "messagingplatform:root",
  MessagingPlatform_Create: "messagingplatform:create",
  MessagingPlatform_Read: "messagingplatform:read",
  MessagingPlatform_Update: "messagingplatform:update",
  MessagingPlatform_Delete: "messagingplatform:delete",
  MessagingPlatform_Search: "messagingplatform:search",

  // Person
  Person_Root: "person:root",
  Person_Create: "person:create",
  Person_Read: "person:read",
  Person_Update: "person:update",
  Person_Delete: "person:delete",
  Person_Search: "person:search",

  // Permission (Permission Management)
  Permission_Root: "permission:root",
  Permission_Create: "permission:create",
  Permission_Read: "permission:read",
  Permission_Update: "permission:update",
  Permission_Delete: "permission:delete",
  Permission_Search: "permission:search",

  // PLATFORM
  Platform_Read: "Platform_Read",
  Platform_Create: "Platform_Create",
  Platform_Update: "Platform_Update",
  Platform_Delete: "Platform_Delete",

  // Role
  Role_Root: "role:root",
  Role_Create: "role:create",
  Role_Read: "role:read",
  Role_Update: "role:update",
  Role_Delete: "role:delete",
  Role_Search: "role:search",

  // User
  User_Root: "user:root",
  User_Create: "user:create",
  User_Read: "user:read",
  User_Update: "user:update",
  User_Delete: "user:delete",
  User_Search: "user:search",

  User_AssignRoles: "user:assign_roles",

  // UserChannel
  UserChannel_Root: "userchannel:root",
  UserChannel_Create: "userchannel:create",
  UserChannel_Read: "userchannel:read",
  UserChannel_Update: "userchannel:update",
  UserChannel_Delete: "userchannel:delete",
  UserChannel_Search: "userchannel:search",
} as const;

// TypeScript type to ensure correct usage
export type PermissionType = typeof Permission[keyof typeof Permission];