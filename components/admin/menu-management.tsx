"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, Upload, X } from "lucide-react";
import Image from "next/image";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular: boolean;
  intensity: number;
}

const CATEGORIES = ["Hot Coffee", "Cold Coffee", "Frappes", "Non Coffee"];

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    price: 0,
    description: "",
    image: "",
    popular: false,
    intensity: 3
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setItems(data.products || []);
    } catch (error) {
      toast.error("Failed to load items");
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
        body: formDataToSend
      });

      const data = await response.json();

      if (data.imageUrl) {
        setFormData((prev) => ({ ...prev, image: data.imageUrl }));
        setPreviewImage(data.imageUrl);
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
    if (!formData.name || !formData.category || !formData.price || !formData.description || !formData.image) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const response = await fetch("/api/products", {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(editingId ? "Item updated!" : "Item added!");
        resetForm();
        loadItems();
      } else {
        toast.error("Failed to save item");
      }
    } catch (error) {
      toast.error("Error saving item");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      popular: item.popular,
      intensity: item.intensity
    });
    setPreviewImage(item.image);
    setEditingId(item._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast.success("Item deleted!");
        loadItems();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: CATEGORIES[0],
      price: 0,
      description: "",
      image: "",
      popular: false,
      intensity: 3
    });
    setPreviewImage("");
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="text-center text-gold">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="mt-2 text-ink-light">Total items: {items.length}</p>
        </div>
        <Button
          onClick={() => (showAddForm ? resetForm() : setShowAddForm(true))}
          className="bg-gold text-ink hover:bg-gold/90"
        >
          <Plus size={20} className="mr-2" />
          {showAddForm ? "Cancel" : "Add Item"}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="space-y-4 rounded-xl border border-gold/20 bg-ink/50 p-6">
          <h2 className="text-xl font-bold">{editingId ? "Edit Item" : "Add New Item"}</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gold">Item Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Espresso"
                className="mt-1"
              />
            </div>

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
              <label className="block text-sm font-medium text-gold">Price (PKR)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="250"
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold">Caffeine Level (1-5)</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gold">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this coffee item..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gold">Image</label>
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
                <div className="relative h-20 w-20">
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
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="rounded border-gold/20"
              />
              <span className="text-sm">Mark as Popular</span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-gold text-ink hover:bg-gold/90">
              {editingId ? "Update Item" : "Add Item"}
            </Button>
            <Button onClick={resetForm} variant="outline" className="border-gold/20">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-ink/50 to-ink/30">
            <div className="relative h-40 w-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              {item.popular && (
                <div className="absolute right-2 top-2 bg-gold text-ink px-3 py-1 rounded-full text-xs font-bold">
                  Popular
                </div>
              )}
            </div>

            <div className="space-y-3 p-4">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-ink-light">{item.description}</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gold">PKR {item.price}</p>
                  <p className="text-xs text-ink-light">{item.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < item.intensity ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gold/20 py-2 text-gold hover:bg-gold/30 transition-colors"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-400/20 py-2 text-red-400 hover:bg-red-400/30 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
