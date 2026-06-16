import { NextResponse } from "next/server";
import { serialize } from "cookie";
import validator from "validator";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password || "");

  if (!validator.isLength(password, { min: 6 })) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }

  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const cookie = serialize("brew4you_admin", "true", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24
  });

  return NextResponse.json({ message: "Welcome, admin." }, { headers: { "Set-Cookie": cookie } });
}
