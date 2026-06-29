import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongodb";
import Settings from "@/lib/models/settings";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  await connect();

  let settings = await Settings.findOne({});

  if (!settings) {
    settings = await Settings.create({});
  }

  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
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
