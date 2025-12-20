// Main ViewName Constants - Safe Modular Architecture

// Generated view names (safe - auto-updated by generator)
import { GENERATED_VIEWNAMES } from "./generated.viewnames";

// Core ViewNames (manual - safe)
const CORE_VIEWNAMES = {
  // Public
  LANDING: "LANDING",
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",

  // Dashboard
  DASHBOARD: "DASHBOARD",
  PROFILE: "PROFILE",
  SETTINGS: "SETTINGS",

  // Permission Module (manual)
  PERMISSION_LIST: "PERMISSION_LIST",
  PERMISSION_CREATE: "PERMISSION_CREATE",
  PERMISSION_EDIT: "PERMISSION_EDIT",

  // Comprehensive Module (manual/example)
  COMPREHENSIVE_LIST: "COMPREHENSIVE_LIST",
  COMPREHENSIVE_CREATE: "COMPREHENSIVE_CREATE",
  COMPREHENSIVE_DISPLAY: "COMPREHENSIVE_DISPLAY",
  COMPREHENSIVE_EDIT: "COMPREHENSIVE_EDIT",

  // Users Module (manual)
  USERS_LIST: "USERS_LIST",
  USERS_CREATE: "USERS_CREATE",
  USERS_DISPLAY: "USERS_DISPLAY",
  USERS_EDIT: "USERS_EDIT",

  // Other manual
  MESSAGES: "MESSAGES",
  USERS: "USERS",
} as const;

// ✅ SAFE MERGE: Core + Generated
export const VIEWNAME = {
  ...CORE_VIEWNAMES,
  ...GENERATED_VIEWNAMES,  // ✨ All auto-generated view names
} as const;

// TypeScript type
export type ViewName = typeof VIEWNAME[keyof typeof VIEWNAME];
