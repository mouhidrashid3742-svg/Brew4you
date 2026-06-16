import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Settings from "@/lib/models/settings";

export async function GET() {
  await connect();

  let settings = await Settings.findOne({});

  if (!settings) {
    settings = await Settings.create({});
  }

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");

  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await connect();

  let settings = await Settings.findOne({});

  if (!settings) {
    settings = await Settings.create(body);
  } else {
    Object.assign(settings, body);
    await settings.save();
  }

  return NextResponse.json({ settings });
}
