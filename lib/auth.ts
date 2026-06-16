// Centralized authentication utilities

export function getAdminSecret(): string {
  return process.env.NEXT_PUBLIC_ADMIN_SECRET || "";
}

export function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "x-admin-secret": getAdminSecret()
  };
}

export function isAdmin(): boolean {
  if (typeof document === "undefined") return false;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("brew4you_admin="));
  return !!cookie;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}
