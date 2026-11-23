export type AppRole = "customer" | "technician" | "admin";

export function normalizeAppRole(role: unknown): AppRole {
  const value = String(role ?? "").trim().toLowerCase();

  if (value === "admin") return "admin";
  if (value === "technician") return "technician";

  return "customer";
}

export function dashboardPathForRole(role: unknown) {
  const normalized = normalizeAppRole(role);

  return `/dashboard/${normalized}`;
}
