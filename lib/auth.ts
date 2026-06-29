import { verifyJwtSync } from "@/lib/jwt";

export function parseCookies(cookieHeader?: string) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (!name || rest.length === 0) return;
    cookies[name.trim()] = decodeURIComponent(rest.join("=").trim());
  });
  return cookies;
}

export function getAdminTokenFromRequest(request: Request) {
  const cookieHeader = request.headers?.get("cookie") || "";
  const cookies = parseCookies(cookieHeader);
  return cookies.adminToken || null;
}

export function isAdminRequest(request: Request) {
  const token = getAdminTokenFromRequest(request);
  if (!token) return false;
  const payload = verifyJwtSync(token);
  return !!payload && payload.role === "admin";
}
