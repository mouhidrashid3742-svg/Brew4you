import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { User, LoyaltyTransaction } from '@/lib/db-models';

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

    const user = await User.findById(userId).select('loyaltyPoints totalSpent orderCount');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const transactions = await LoyaltyTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    // Calculate tier based on points
    const tier = user.loyaltyPoints >= 5000 ? 'Gold' : user.loyaltyPoints >= 2500 ? 'Silver' : 'Bronze';

    return NextResponse.json({
      success: true,
      loyalty: {
        points: user.loyaltyPoints,
        tier,
        nextRewardAt: tier === 'Gold' ? 'Max Tier' : Math.ceil((user.loyaltyPoints / 2500 + 1) * 2500),
        totalSpent: user.totalSpent,
        orderCount: user.orderCount,
        transactions
      }
    });
  } catch (error) {
    console.error('Loyalty error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty info' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const { userId, orderId, pointsEarned, transactionType, description } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user points
    user.loyaltyPoints += pointsEarned || 0;
    await user.save();

    // Create transaction record
    const transaction = new LoyaltyTransaction({
      userId,
      orderId,
      pointsEarned: pointsEarned || 0,
      pointsUsed: 0,
      balanceAfter: user.loyaltyPoints,
      transactionType: transactionType || 'earn',
      description
    });

    await transaction.save();

    return NextResponse.json({
      success: true,
      loyaltyPoints: user.loyaltyPoints,
      transaction
    });
  } catch (error) {
    console.error('Add loyalty error:', error);
    return NextResponse.json(
      { error: 'Failed to update loyalty points' },
      { status: 500 }
    );
  }
}
