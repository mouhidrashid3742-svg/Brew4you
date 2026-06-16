import { NextResponse } from "next/server";
import validator from "validator";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !validator.isEmail(email) || !subject || !message) {
    return NextResponse.json({ error: "Please complete the form with valid values." }, { status: 400 });
  }

  return NextResponse.json({ message: "Your message has been received. We will reply soon." });
}
