// Centralized Route Paths - DRY principle
// Define all route paths here to avoid repetition

export const ROUTE_PATHS = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Dashboard base
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",

  // Parent groupings
  PORTAL: "/dashboard/portal",
  MESSAGING: "/dashboard/messaging",

  // Portal children
  PERMISSIONS: "/dashboard/portal/permissions",
  PERMISSIONS_CREATE: "/dashboard/portal/permissions/create",
  PERMISSIONS_EDIT: "/dashboard/portal/permissions/:id",

  CHANNELS: "/dashboard/portal/channels",
  CHANNELS_CREATE: "/dashboard/portal/channels/create",
  CHANNELS_DISPLAY: "/dashboard/portal/channels/:id",
  CHANNELS_EDIT: "/dashboard/portal/channels/:id/edit",
  CHANNELS_APPROVE: "/dashboard/portal/channels/approve",

  PLATFORMS: "/dashboard/portal/platforms",
  PLATFORMS_CREATE: "/dashboard/portal/platforms/create",
  PLATFORMS_DISPLAY: "/dashboard/portal/platforms/:id",
  PLATFORMS_EDIT: "/dashboard/portal/platforms/:id/edit",

  // Comprehensive (example - commented out)
  // COMPREHENSIVE: "/dashboard/portal/comprehensive",
  // COMPREHENSIVE_CREATE: "/dashboard/portal/comprehensive/create",
  // COMPREHENSIVE_DISPLAY: "/dashboard/portal/comprehensive/:id",
  // COMPREHENSIVE_EDIT: "/dashboard/portal/comprehensive/:id/edit",
} as const;

// Helper for creating parameterized routes
export const withId = (base: string) => `${base}/:id`;
export const withEdit = (base: string) => `${base}/:id/edit`;
