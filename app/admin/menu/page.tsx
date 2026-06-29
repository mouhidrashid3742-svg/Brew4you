"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import type { MenuItem } from "@/components/admin/menu-item-form";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";



export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES = ["All", "Hot Coffee", "Cold Coffee", "Frappes", "Non Coffee"];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data.products || []);
    } catch (error) {
      console.error("Failed to load items:", error);
      alert("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData: MenuItem) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to add item");

      const data = await res.json();
      setItems([...items, data.product]);
      setShowForm(false);
      alert("Item added successfully!");
    } catch (error) {
      console.error("Add failed:", error);
      alert("Failed to add item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData: MenuItem) => {
    if (!editingId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData
        })
      });

      if (!res.ok) throw new Error("Failed to update item");

      const data = await res.json();
      setItems(items.map(item => item._id === editingId ? data.product : item));
      setEditingId(null);
      setShowForm(false);
      alert("Item updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error("Failed to delete item");

      setItems(items.filter(item => item._id !== id));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete item");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (showForm) {
    return (
      <div className="min-h-screen bg-black">
        <AdminSidebar />
        <main className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {editingId ? "Edit Menu Item" : "Add New Menu Item"}
              </h1>
              <p className="text-white/60">
                {editingId ? "Update the item details below" : "Fill in the details to add a new product"}
              </p>
            </div>
            <MenuItemForm
              item={editingId ? items.find(i => i._id === editingId) : undefined}
              onSubmit={editingId ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              loading={submitting}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      
      <main className="ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
              <p className="text-white/60">Manage your menu items, prices, and availability</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gold hover:bg-gold/90 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-gold"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-black">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/60">Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-6">No items found</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gold hover:bg-gold/90 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div key={item._id} className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-gold/50 transition group">
                  {/* Image */}
                  <div className="relative w-full h-40 bg-black overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.popular ? 'bg-gold/20 text-gold' : 'bg-white/10 text-white/70'}`}>
                        {item.popular ? '⭐ Popular' : 'Regular'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.available ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                        {item.available ? 'Available' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-xs text-white/60">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gold font-bold text-lg">PKR {item.price}</p>
                        <p className="text-xs text-white/60">Level {item.intensity}/5</p>
                      </div>
                    </div>

                    <p className="text-sm text-white/70 mb-4 line-clamp-2">{item.description}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(item._id ?? null);
                          setShowForm(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg py-2 transition text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => item._id && handleDelete(item._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg py-2 transition text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
