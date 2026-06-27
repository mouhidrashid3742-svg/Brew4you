import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In production, use Twilio or Firebase for real SMS
export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In production:
    // await sendSMS(phone, `Your 9 BAR OTP is: ${otp}. Valid for 5 minutes.`);
    
    // Store OTP in cache with 5-minute expiry
    // For demo, we'll just return it
    console.log(`[DEMO] OTP for ${phone}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Remove this in production - only for testing
      otpForDemo: otp
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
