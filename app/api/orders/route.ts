import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Order from "@/lib/models/order";

export async function GET(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");

  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const filter = status ? { status } : {};
  const orders = await Order.find(filter).sort({ orderedAt: -1 }).lean();

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, customerPhone, items, totalPrice, deliveryType, deliveryAddress, notes } = body;

  if (!customerName || !customerPhone || !items || !totalPrice) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connect();

  const order = await Order.create({
    customerName,
    customerPhone,
    items,
    totalPrice,
    deliveryType: deliveryType || "pickup",
    deliveryAddress,
    notes,
    status: "pending",
    orderedAt: new Date()
  });

  return NextResponse.json({ order }, { status: 201 });
}

export async function PUT(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");

  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connect();

  const updateData: any = { status };
  if (status === "completed") {
    updateData.completedAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function DELETE(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");

  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  await connect();

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
