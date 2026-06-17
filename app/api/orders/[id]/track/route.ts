import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { Order } from '@/lib/db-models';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  try {
    await connect();

    const order = await Order.findOne({ orderId }).lean() as any;

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      status: order.orderStatus,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      trackingUpdates: order.trackingUpdates,
      items: order.items,
      totalAmount: order.totalAmount
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    const authHeader = req.headers.get('x-admin-secret');

    if (authHeader !== adminSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connect();
    const { status, message } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status required' },
        { status: 400 }
      );
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        orderStatus: status,
        $push: {
          trackingUpdates: {
            status,
            timestamp: new Date(),
            message: message || `Order status updated to ${status}`
          }
        }
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
