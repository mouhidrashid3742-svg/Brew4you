import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { Subscription, User } from '@/lib/db-models';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { userId, subscriptionType, items, deliveryAddress, paymentMethod, frequency } = await req.json();

    if (!userId || !subscriptionType || !items || !deliveryAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    // Calculate next delivery date
    const nextDeliveryDate = new Date();
    nextDeliveryDate.setDate(nextDeliveryDate.getDate() + (frequency || 1));

    const subscription = new Subscription({
      userId,
      subscriptionType,
      items,
      deliveryAddress,
      paymentMethod,
      frequency: frequency || 1,
      isActive: true,
      nextDeliveryDate,
      totalAmount
    });

    await subscription.save();

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription._id,
        type: subscriptionType,
        nextDelivery: nextDeliveryDate,
        amount: totalAmount
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
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

    const subscriptions = await Subscription.find({ userId, isActive: true });

    return NextResponse.json({
      success: true,
      subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const { subscriptionId, isActive, items } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      {
        isActive: isActive !== undefined ? isActive : undefined,
        items: items || undefined
      },
      { new: true }
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { isActive: false },
      { new: true }
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
