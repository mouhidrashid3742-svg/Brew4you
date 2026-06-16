"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import BlogManagement from "@/components/admin/blog-management";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <BlogManagement />
      </main>
    </div>
  );
}
