export const MAIN_ROUTES = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { name: "Milestones", path: "/milestones", icon: "radius-setting" },
  { name: "Workflow", path: "/workflow", icon: "snippets" },
  { name: "Documents", path: "/documents", icon: "form" }
];

export const SETTINGS_ROUTES = [
  { name: "Main Settings", path: "/main-settings", icon: "" },
  { name: "Company", path: "/company", icon: "" },
  { name: "People", path: "/people", icon: "" }
];

export const ROUTES = [...MAIN_ROUTES, ...SETTINGS_ROUTES];
