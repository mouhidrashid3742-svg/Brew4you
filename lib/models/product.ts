import mongoose, { Document, Model, models, model, Schema } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  popular: boolean;
  available: boolean;
  views: number;
  intensity: number;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  popular: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  intensity: { type: Number, default: 3 }
});

const Product: Model<ProductDocument> = models.Product || model<ProductDocument>("Product", productSchema);

export default Product;
