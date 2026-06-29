import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongodb";
import Product from "@/lib/models/product";
import { menuItems } from "@/data/menu";
import { isAdminRequest } from "@/lib/auth";

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 120;
const ipCache = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipCache.get(ip);

  if (!entry || entry.resetAt < now) {
    ipCache.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    await connect();
    let products: any[] = await Product.find({}).lean();

    if (!products.length) {
      const created = await Product.insertMany(
        menuItems.map((item) => ({
          ...item,
          available: true,
          views: Math.floor(Math.random() * 200) + 10
        }))
      );
      products = created.map((item) => item.toObject());
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.log("MongoDB not available, using fallback data");
    // Fallback to hardcoded data if MongoDB is unavailable
    const products = menuItems.map((item) => ({
      ...item,
      available: true,
      views: Math.floor(Math.random() * 200) + 10
    }));
    return NextResponse.json({ products });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, category, description, price, image, popular, available, intensity } = body;

  if (!name || !category || !description || !price || !image) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connect();

  const product = await Product.create({ name, category, description, price, image, popular, available, intensity });
  return NextResponse.json({ product }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  await connect();

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  await connect();

  const deleted = await Product.findByIdAndDelete(body.id);
  if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
