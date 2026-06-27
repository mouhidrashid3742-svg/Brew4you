import mongoose, { Document, Model, models, model, Schema } from "mongoose";

export interface BlogDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

const blogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, default: "9 BAR Team" },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Blog: Model<BlogDocument> = models.Blog || model<BlogDocument>("Blog", blogSchema);

export default Blog;
