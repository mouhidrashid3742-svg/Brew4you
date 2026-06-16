import mongoose, { Document, Model, models, model, Schema } from "mongoose";

export interface OrderDocument extends Document {
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  deliveryType: "pickup" | "delivery";
  deliveryAddress?: string;
  notes?: string;
  orderedAt: Date;
  completedAt?: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
    deliveryType: { type: String, enum: ["pickup", "delivery"], default: "pickup" },
    deliveryAddress: String,
    notes: String,
    orderedAt: { type: Date, default: Date.now },
    completedAt: Date
  },
  { timestamps: true }
);

const Order: Model<OrderDocument> = models.Order || model<OrderDocument>("Order", orderSchema);

export default Order;
