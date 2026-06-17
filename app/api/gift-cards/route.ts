import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { GiftCard, User } from '@/lib/db-models';
import crypto from 'crypto';

// Generate unique gift card code
function generateGiftCardCode(): string {
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part3 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BREW-${part1}-${part2}-${part3}`;
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { amount, senderName, senderPhone, recipientName, recipientPhone, recipientEmail, message } = await req.json();

    if (!amount || !senderName || !senderPhone || !recipientName || !recipientPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { error: 'Minimum gift card amount is 100 PKR' },
        { status: 400 }
      );
    }

    const giftCardCode = generateGiftCardCode();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const giftCard = new GiftCard({
      giftCardCode,
      amount,
      senderName,
      senderPhone,
      recipientName,
      recipientPhone,
      recipientEmail,
      message,
      expiresAt
    });

    await giftCard.save();

    return NextResponse.json({
      success: true,
      giftCard: {
        code: giftCardCode,
        amount,
        expiresAt,
        message: `Gift card created. Share code with recipient: ${giftCardCode}`
      }
    });
  } catch (error) {
    console.error('Create gift card error:', error);
    return NextResponse.json(
      { error: 'Failed to create gift card' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Gift card code required' },
        { status: 400 }
      );
    }

    const giftCard = await GiftCard.findOne({ giftCardCode: code });

    if (!giftCard) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    if (giftCard.isRedeemed) {
      return NextResponse.json(
        { error: 'Gift card already redeemed' },
        { status: 400 }
      );
    }

    if (new Date() > giftCard.expiresAt) {
      return NextResponse.json(
        { error: 'Gift card expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      giftCard: {
        code: giftCard.giftCardCode,
        amount: giftCard.amount,
        recipientName: giftCard.recipientName,
        message: giftCard.message
      }
    });
  } catch (error) {
    console.error('Get gift card error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift card' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const { code, userId } = await req.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Code and user ID required' },
        { status: 400 }
      );
    }

    const giftCard = await GiftCard.findOne({ giftCardCode: code });

    if (!giftCard) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    if (giftCard.isRedeemed) {
      return NextResponse.json(
        { error: 'Gift card already redeemed' },
        { status: 400 }
      );
    }

    if (new Date() > giftCard.expiresAt) {
      return NextResponse.json(
        { error: 'Gift card expired' },
        { status: 400 }
      );
    }

    // Mark as redeemed
    giftCard.isRedeemed = true;
    giftCard.redeemedBy = userId;
    giftCard.redeemedAt = new Date();
    await giftCard.save();

    // Add amount to user account (stored as loyalty credit)
    await User.findByIdAndUpdate(userId, {
      $inc: { loyaltyPoints: giftCard.amount }
    });

    return NextResponse.json({
      success: true,
      message: `Gift card redeemed! ${giftCard.amount} PKR added to your account`,
      amount: giftCard.amount
    });
  } catch (error) {
    console.error('Redeem gift card error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem gift card' },
      { status: 500 }
    );
  }
}
