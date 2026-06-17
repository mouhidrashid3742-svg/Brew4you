import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { User } from '@/lib/db-models';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone and OTP required' },
        { status: 400 }
      );
    }

    // In production, verify OTP with SMS provider
    // For now, accept any 6-digit code
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({
        phone,
        name: `User ${phone.slice(-4)}`,
        loyaltyPoints: 0,
        deliveryAddresses: [],
        paymentMethods: []
      });
      await user.save();
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        loyaltyPoints: user.loyaltyPoints
      },
      token
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
