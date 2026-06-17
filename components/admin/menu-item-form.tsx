"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { getAuthHeaders } from "@/lib/auth";

export interface MenuItem {
  _id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular: boolean;
  available: boolean;
  intensity: number;
}

interface MenuFormProps {
  item?: MenuItem;
  onSubmit: (data: MenuItem) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CATEGORIES = ["Hot Coffee", "Cold Coffee", "Frappes", "Non Coffee"];

export function MenuItemForm({ item, onSubmit, onCancel, loading }: MenuFormProps) {
  const [formData, setFormData] = useState<MenuItem>(
    item || {
      name: "",
      category: "Hot Coffee",
      price: 280,
      description: "",
      image: "",
      popular: false,
      available: true,
      intensity: 3
    }
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(item?.image || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = formData.image;
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "x-admin-secret": getAuthHeaders()["x-admin-secret"]
          },
          body: uploadFormData
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url || uploadData.imageUrl;
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image");
        return;
      }
    }

    await onSubmit({
      ...formData,
      image: imageUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Product Image</label>
        <div className="relative">
          {imagePreview && (
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 p-2 rounded-lg"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gold/50 rounded-lg cursor-pointer hover:border-gold transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-8 h-8 text-gold/60 mb-2" />
              <p className="text-sm text-white/70">Click to upload image or drag and drop</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Product Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Espresso"
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
      </div>

      {/* Category & Price Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-black">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Price (PKR)</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            placeholder="280"
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Intensity & Popular Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Caffeine Level (1-5)</label>
          <Input
            type="number"
            min="1"
            max="5"
            value={formData.intensity}
            onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Status</label>
          <select
            value={formData.available ? "available" : "hidden"}
            onChange={(e) => setFormData({ ...formData, available: e.target.value === "available" })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          >
            <option value="available" className="bg-black">Available</option>
            <option value="hidden" className="bg-black">Hidden</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this product..."
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-24"
        />
      </div>

      {/* Popular Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.popular}
          onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
          className="w-4 h-4 rounded accent-gold"
        />
        <span className="text-white">Mark as popular (featured on home page)</span>
      </label>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gold hover:bg-gold/90 text-black font-semibold"
        >
          {loading ? "Saving..." : item ? "Update Item" : "Add Item"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
