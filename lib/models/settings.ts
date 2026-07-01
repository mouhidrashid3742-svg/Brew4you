import mongoose, { Document, Model, models, model, Schema } from "mongoose";

export interface SettingsDocument extends Document {
  businessName: string;
  businessPhone: string;
  businessWhatsApp: string;
  businessEmail: string;
  foodpandaUrl: string;
  businessAddress: string;
  deliveryFee: number;
  businessHours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  businessInfo: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<SettingsDocument>(
  {
    businessName: { type: String, default: "9 BAR" },
    businessPhone: { type: String, default: "" },
    businessWhatsApp: { type: String, default: "" },
    businessEmail: { type: String, default: "" },
    foodpandaUrl: { type: String, default: "https://www.foodpanda.pk/" },
    businessAddress: { type: String, default: "" },
    deliveryFee: { type: Number, default: 0 },
    businessHours: {
      mon: { type: String, default: "9:00 AM - 10:00 PM" },
      tue: { type: String, default: "9:00 AM - 10:00 PM" },
      wed: { type: String, default: "9:00 AM - 10:00 PM" },
      thu: { type: String, default: "9:00 AM - 10:00 PM" },
      fri: { type: String, default: "9:00 AM - 10:00 PM" },
      sat: { type: String, default: "9:00 AM - 10:00 PM" },
      sun: { type: String, default: "9:00 AM - 10:00 PM" }
    },
    businessInfo: { type: String, default: "" }
  },
  { timestamps: true }
);

const Settings: Model<SettingsDocument> = models.Settings || model<SettingsDocument>("Settings", settingsSchema);

export default Settings;
