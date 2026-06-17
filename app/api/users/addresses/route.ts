import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { User } from '@/lib/db-models';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { userId, address } = await req.json();

    if (!userId || !address) {
      return NextResponse.json(
        { error: 'User ID and address required' },
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

    const newAddress = {
      id: crypto.randomBytes(8).toString('hex'),
      ...address
    };

    user.deliveryAddresses.push(newAddress);
    await user.save();

    return NextResponse.json({
      success: true,
      address: newAddress
    });
  } catch (error) {
    console.error('Add address error:', error);
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const { userId, addressId, updates } = await req.json();

    if (!userId || !addressId) {
      return NextResponse.json(
        { error: 'User ID and address ID required' },
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

    const addressIndex = user.deliveryAddresses.findIndex(
      (addr: any) => addr.id === addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    user.deliveryAddresses[addressIndex] = {
      ...user.deliveryAddresses[addressIndex],
      ...updates
    };

    await user.save();

    return NextResponse.json({
      success: true,
      address: user.deliveryAddresses[addressIndex]
    });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const { userId, addressId } = await req.json();

    if (!userId || !addressId) {
      return NextResponse.json(
        { error: 'User ID and address ID required' },
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

    user.deliveryAddresses = user.deliveryAddresses.filter(
      (addr: any) => addr.id !== addressId
    );

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Address deleted'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
