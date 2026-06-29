import { NextResponse } from "next/server";
import { serialize } from "cookie";
import validator from "validator";
import { signJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password || "");

  if (!validator.isLength(password, { min: 6 })) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }

  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // create a short-lived JWT for admin session
  const token = signJwt({ role: "admin" }, { expiresIn: 60 * 60 * 24 });

  // set httpOnly cookie with the JWT
  const cookie = serialize("adminToken", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24
  });

  return NextResponse.json({ message: "Welcome, admin.", token }, { headers: { "Set-Cookie": cookie } });
}
