import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Blog from "@/lib/models/blog";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const published = searchParams.get("published") === "true";

  try {
    await connect();

    const filter = published ? { published: true } : {};
    const blogs = await Blog.find(filter).sort({ publishedAt: -1 }).lean();

    return NextResponse.json({ blogs });
  } catch (error) {
    console.log("MongoDB not available, returning empty blogs");
    // Return empty array if MongoDB is unavailable
    return NextResponse.json({ blogs: [] });
  }
}

export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");

  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, excerpt, content, category, image, author, published } = await request.json();

  if (!title || !excerpt || !content || !category || !image) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connect();

  const slug = generateSlug(title);

  // Check if slug already exists
  const existing = await Blog.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "Blog title already exists" }, { status: 400 });
  }

  const blog = await Blog.create({
    title,
    slug,
    excerpt,
    content,
    category,
    image,
    author: author || "Brew4You Team",
    published: published || false,
    publishedAt: published ? new Date() : null
  });

  return NextResponse.json({ blog }, { status: 201 });
}

export async function PUT(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");

  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, excerpt, content, category, image, author, published } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
  }

  await connect();

  const slug = title ? generateSlug(title) : undefined;

  // If slug is changing, check for conflicts
  if (slug) {
    const existing = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json({ error: "Blog title already exists" }, { status: 400 });
    }
  }

  const updateData: any = {};
  if (title) updateData.title = title;
  if (slug) updateData.slug = slug;
  if (excerpt) updateData.excerpt = excerpt;
  if (content) updateData.content = content;
  if (category) updateData.category = category;
  if (image) updateData.image = image;
  if (author) updateData.author = author;
  if (published !== undefined) {
    updateData.published = published;
    if (published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ blog });
}

export async function DELETE(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");

  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
  }

  await connect();

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
