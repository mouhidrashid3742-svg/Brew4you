import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { Order, User } from '@/lib/db-models';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const {
      userId,
      items,
      deliveryAddress,
      paymentMethod,
      scheduledFor,
      notes,
      customerPhone,
      customerName
    } = body;

    if (!userId || !items || !deliveryAddress || !customerPhone || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const taxes = Math.round(subtotal * 0.17); // 17% GST for Pakistan
    const deliveryFee = subtotal > 5000 ? 0 : 200; // Free delivery over 5000 PKR
    const totalAmount = subtotal + taxes + deliveryFee;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const order = new Order({
      orderId,
      userId,
      customerName,
      customerPhone,
      items,
      deliveryAddress,
      subtotal,
      taxes,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      scheduledFor,
      notes,
      trackingUpdates: [
        {
          status: 'pending',
          timestamp: new Date(),
          message: 'Order received. Awaiting confirmation.'
        }
      ]
    });

    await order.save();

    // Update user order count and total spent
    await User.findByIdAndUpdate(userId, {
      $inc: {
        orderCount: 1,
        totalSpent: totalAmount
      }
    });

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        status: order.orderStatus,
        estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000) // 35 mins
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
