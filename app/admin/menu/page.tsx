"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import type { MenuItem } from "@/components/admin/menu-item-form";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Search, Sparkles } from "lucide-react";
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.14),transparent_34%),linear-gradient(135deg,#f8efe4_0%,#f1e3ce_100%)]">
        <AdminSidebar />
        <main className="ml-64">
          <div className="p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 rounded-[30px] border border-[#e6d3bd] bg-[#fffdf9]/90 p-8 shadow-[0_20px_70px_rgba(98,66,38,0.08)]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d6ab79]/30 bg-[#f7e4c7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b0743d]">
                <Sparkles className="h-3.5 w-3.5" />
                Menu Studio
              </div>
              <h1 className="text-3xl font-semibold text-[#24150d] mb-2">
                {editingId ? "Edit Menu Item" : "Add New Menu Item"}
              </h1>
              <p className="text-[#6f5846]">
                {editingId ? "Update the item details below" : "Fill in the details to add a new product"}
              </p>
            </motion.div>
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.14),transparent_34%),linear-gradient(135deg,#f8efe4_0%,#f1e3ce_100%)]">
      <AdminSidebar />

      <main className="ml-64">
        <div className="p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 rounded-[30px] border border-[#e6d3bd] bg-[#fffdf9]/90 p-8 shadow-[0_20px_70px_rgba(98,66,38,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d6ab79]/30 bg-[#f7e4c7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b0743d]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Menu Studio
                </div>
                <h1 className="text-3xl font-semibold text-[#24150d] mb-2">Menu Management</h1>
                <p className="text-[#6f5846]">Manage your menu items, prices, and availability from a refined control panel.</p>
              </div>
              <Button onClick={() => setShowForm(true)} className="rounded-full bg-[linear-gradient(135deg,#b68349_0%,#e0b77b_100%)] text-[#fff8eb] hover:brightness-105">
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </div>
          </motion.div>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-[#e6d3bd] bg-[#fffdf9]/80 text-[#24150d] placeholder:text-[#8b6b4f]"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-2xl border border-[#e6d3bd] bg-[#fffdf9]/80 px-4 py-2 text-[#24150d] focus:border-[#b0743d] focus:outline-none"
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
            <div className="rounded-[24px] border border-[#e6d3bd] bg-[#fffdf9]/90 py-12 text-center text-[#6f5846]">
              <p>Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-[24px] border border-[#e6d3bd] bg-[#fffdf9]/90 py-12 text-center text-[#6f5846]">
              <p className="mb-6">No items found</p>
              <Button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-[linear-gradient(135deg,#b68349_0%,#e0b77b_100%)] text-[#fff8eb]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <motion.div key={item._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="overflow-hidden rounded-[24px] border border-[#ebdcc8] bg-[#fffdf9]/90 shadow-[0_20px_60px_rgba(98,66,38,0.08)] transition group hover:-translate-y-1 hover:border-[#b0743d]/40">
                  {/* Image */}
                  <div className="relative w-full h-40 bg-black overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.popular ? 'bg-[#f7e4c7] text-[#85522c]' : 'bg-[#f5efe7] text-[#6f5846]'}`}>
                        {item.popular ? '⭐ Popular' : 'Regular'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.available ? 'Available' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#24150d]">{item.name}</h3>
                        <p className="text-xs text-[#8b6b4f]">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#b0743d]">PKR {item.price}</p>
                        <p className="text-xs text-[#8b6b4f]">Level {item.intensity}/5</p>
                      </div>
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm text-[#6f5846]">{item.description}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(item._id ?? null);
                          setShowForm(true);
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#d6ab79]/30 bg-[#f7e4c7] py-2 text-sm font-medium text-[#85522c] transition hover:bg-[#e9c997]"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => item._id && handleDelete(item._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500/90 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
