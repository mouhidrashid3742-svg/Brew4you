import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { Cart } from '@/lib/db-models';

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

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        subtotal: 0,
        taxes: 0,
        deliveryFee: 200,
        totalAmount: 0
      });
      await cart.save();
    }

    return NextResponse.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { userId, item } = await req.json();

    if (!userId || !item) {
      return NextResponse.json(
        { error: 'User ID and item required' },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        subtotal: 0,
        taxes: 0,
        deliveryFee: 200,
        totalAmount: 0
      });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (i: any) => i.itemId === item.itemId && JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity || 1;
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].basePrice * cart.items[existingItemIndex].quantity;
    } else {
      cart.items.push({
        ...item,
        quantity: item.quantity || 1,
        subtotal: item.basePrice * (item.quantity || 1)
      });
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    cart.taxes = Math.round(cart.subtotal * 0.17);
    cart.deliveryFee = cart.subtotal > 5000 ? 0 : 200;
    cart.totalAmount = cart.subtotal + cart.taxes + cart.deliveryFee;

    await cart.save();

    return NextResponse.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const { userId, itemIndex, quantity } = await req.json();

    if (!userId || itemIndex === undefined) {
      return NextResponse.json(
        { error: 'User ID and item index required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items[itemIndex]) {
      return NextResponse.json(
        { error: 'Cart or item not found' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = 
        cart.items[itemIndex].basePrice * quantity;
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    cart.taxes = Math.round(cart.subtotal * 0.17);
    cart.deliveryFee = cart.subtotal > 5000 ? 0 : 200;
    cart.totalAmount = cart.subtotal + cart.taxes + cart.deliveryFee;

    await cart.save();

    return NextResponse.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    await Cart.findOneAndDelete({ userId });

    return NextResponse.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
