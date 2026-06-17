import mongoose from 'mongoose';

// User Model
export interface IUser extends mongoose.Document {
  email?: string;
  phone: string;
  name: string;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
  profileImage?: string;
  deliveryAddresses: {
    id: string;
    label: string;
    address: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
    coordinates?: { lat: number; lng: number };
  }[];
  paymentMethods: {
    id: string;
    type: string; // 'card', 'wallet', 'upi'
    last4?: string;
    isDefault: boolean;
  }[];
  loyaltyPoints: number;
  totalSpent: number;
  orderCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, sparse: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    googleId: { type: String, sparse: true },
    otp: String,
    otpExpires: Date,
    profileImage: String,
    deliveryAddresses: [
      {
        id: String,
        label: String,
        address: String,
        city: String,
        zipCode: String,
        isDefault: Boolean,
        coordinates: { lat: Number, lng: Number }
      }
    ],
    paymentMethods: [
      {
        id: String,
        type: String,
        last4: String,
        isDefault: Boolean
      }
    ],
    loyaltyPoints: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Order Model
export interface IOrder extends mongoose.Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  items: {
    itemId: string;
    name: string;
    basePrice: number;
    customizations: Record<string, any>;
    quantity: number;
    subtotal: number;
  }[];
  deliveryAddress: {
    address: string;
    city: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'brewing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  scheduledFor?: Date;
  notes?: string;
  trackingUpdates: {
    status: string;
    timestamp: Date;
    message: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        itemId: String,
        name: String,
        basePrice: Number,
        customizations: mongoose.Schema.Types.Mixed,
        quantity: Number,
        subtotal: Number
      }
    ],
    deliveryAddress: {
      address: String,
      city: String,
      zipCode: String,
      coordinates: { lat: Number, lng: Number }
    },
    subtotal: Number,
    taxes: Number,
    deliveryFee: Number,
    discountAmount: { type: Number, default: 0 },
    totalAmount: Number,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'brewing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    scheduledFor: Date,
    notes: String,
    trackingUpdates: [
      {
        status: String,
        timestamp: Date,
        message: String
      }
    ]
  },
  { timestamps: true }
);

// Cart Model
export interface ICart extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  items: {
    itemId: string;
    name: string;
    basePrice: number;
    customizations: Record<string, any>;
    quantity: number;
    subtotal: number;
  }[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  totalAmount: number;
  expiresAt: Date;
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        itemId: String,
        name: String,
        basePrice: Number,
        customizations: mongoose.Schema.Types.Mixed,
        quantity: Number,
        subtotal: Number
      }
    ],
    subtotal: Number,
    taxes: Number,
    deliveryFee: Number,
    totalAmount: Number,
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }
  },
  { timestamps: true }
);

// Loyalty/Rewards Model
export interface ILoyaltyTransaction extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  orderId?: string;
  pointsEarned: number;
  pointsUsed: number;
  balanceAfter: number;
  transactionType: 'earn' | 'redeem' | 'bonus' | 'refund';
  description: string;
  createdAt: Date;
}

const loyaltyTransactionSchema = new mongoose.Schema<ILoyaltyTransaction>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: String,
    pointsEarned: { type: Number, default: 0 },
    pointsUsed: { type: Number, default: 0 },
    balanceAfter: Number,
    transactionType: {
      type: String,
      enum: ['earn', 'redeem', 'bonus', 'refund'],
      default: 'earn'
    },
    description: String
  },
  { timestamps: true }
);

// Subscription Model
export interface ISubscription extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  subscriptionType: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  items: {
    itemId: string;
    name: string;
    quantity: number;
    customizations: Record<string, any>;
  }[];
  deliveryAddress: {
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
  weekDays?: number[]; // For weekly subscriptions
  frequency: number; // Days between deliveries
  isActive: boolean;
  nextDeliveryDate: Date;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionType: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
      required: true
    },
    items: [
      {
        itemId: String,
        name: String,
        quantity: Number,
        customizations: mongoose.Schema.Types.Mixed
      }
    ],
    deliveryAddress: {
      address: String,
      city: String,
      zipCode: String
    },
    paymentMethod: String,
    weekDays: [Number],
    frequency: Number,
    isActive: { type: Boolean, default: true },
    nextDeliveryDate: Date,
    totalAmount: Number
  },
  { timestamps: true }
);

// Gift Card Model
export interface IGiftCard extends mongoose.Document {
  giftCardCode: string;
  amount: number;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  message: string;
  isRedeemed: boolean;
  redeemedBy?: mongoose.Types.ObjectId;
  redeemedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

const giftCardSchema = new mongoose.Schema<IGiftCard>(
  {
    giftCardCode: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    senderName: String,
    senderPhone: String,
    recipientName: String,
    recipientPhone: String,
    recipientEmail: String,
    message: String,
    isRedeemed: { type: Boolean, default: false },
    redeemedBy: mongoose.Schema.Types.ObjectId,
    redeemedAt: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

// Export models
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
export const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);
export const LoyaltyTransaction =
  mongoose.models.LoyaltyTransaction ||
  mongoose.model<ILoyaltyTransaction>('LoyaltyTransaction', loyaltyTransactionSchema);
export const Subscription =
  mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema);
export const GiftCard =
  mongoose.models.GiftCard || mongoose.model<IGiftCard>('GiftCard', giftCardSchema);
