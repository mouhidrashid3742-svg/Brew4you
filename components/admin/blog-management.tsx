"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, Upload, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { getAuthHeaders } from "@/lib/auth";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  published: boolean;
  publishedAt: string;
  views: number;
}

const CATEGORIES = ["Coffee Tips", "Health Benefits", "Recipes", "News", "Stories"];

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0],
    image: "",
    author: "9 BAR Team",
    published: false
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploadingImage(true);
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-secret": getAuthHeaders()["x-admin-secret"]
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.url || data.imageUrl) {
        const imageUrl = data.url || data.imageUrl;
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setPreviewImage(imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.image) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const response = await fetch("/api/blogs", {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(editingId ? "Blog updated!" : "Blog published!");
        resetForm();
        loadBlogs();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save blog");
      }
    } catch (error) {
      toast.error("Error saving blog");
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      image: blog.image,
      author: blog.author,
      published: blog.published
    });
    setPreviewImage(blog.image);
    setEditingId(blog._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const adminSecret = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      const response = await fetch("/api/blogs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret || ""
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast.success("Blog deleted!");
        loadBlogs();
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      toast.error("Error deleting blog");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: CATEGORIES[0],
      image: "",
      author: "9 BAR Team",
      published: false
    });
    setPreviewImage("");
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="text-center text-gold">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="mt-2 text-ink-light">Total articles: {blogs.length}</p>
        </div>
        <Button
          onClick={() => (showAddForm ? resetForm() : setShowAddForm(true))}
          className="bg-gold text-ink hover:bg-gold/90"
        >
          <Plus size={20} className="mr-2" />
          {showAddForm ? "Cancel" : "Write Article"}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="space-y-4 rounded-xl border border-gold/20 bg-ink/50 p-6">
          <h2 className="text-xl font-bold">{editingId ? "Edit Article" : "Write New Article"}</h2>

          <div>
            <label className="block text-sm font-medium text-gold">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Article title..."
              className="mt-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gold">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gold/20 bg-ink px-4 py-2 text-ink-light"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gold">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gold">Excerpt</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary (appears in list)..."
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gold">Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content..."
              className="mt-1"
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gold">Featured Image</label>
            <div className="mt-2 flex items-center gap-4">
              <label className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/10 px-4 py-2 cursor-pointer hover:bg-gold/20 transition-colors">
                <Upload size={18} className="text-gold" />
                <span className="text-sm">
                  {uploadingImage ? "Uploading..." : "Choose Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {previewImage && (
                <div className="relative h-20 w-32">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-gold/20"
              />
              <span className="text-sm">Publish Now</span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-gold text-ink hover:bg-gold/90">
              {editingId ? "Update Article" : "Publish Article"}
            </Button>
            <Button onClick={resetForm} variant="outline" className="border-gold/20">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Blogs List */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="flex gap-4 rounded-xl border border-gold/20 bg-ink/50 p-4">
            <div className="relative h-24 w-32 flex-shrink-0">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="rounded-lg object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{blog.title}</h3>
                  <p className="text-sm text-ink-light">{blog.excerpt}</p>
                  <div className="mt-2 flex gap-2 text-xs text-ink-light">
                    <span>{blog.category}</span>
                    <span>•</span>
                    <span>by {blog.author}</span>
                    <span>•</span>
                    <span>{blog.views} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {blog.published ? (
                    <Eye className="text-gold" size={18} />
                  ) : (
                    <EyeOff className="text-ink-light" size={18} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="rounded-lg bg-gold/20 p-2 text-gold hover:bg-gold/30 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="rounded-lg bg-red-400/20 p-2 text-red-400 hover:bg-red-400/30 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
