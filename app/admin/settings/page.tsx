"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import SettingsManagement from "@/components/admin/settings-management";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Business Settings</h1>
          <p className="text-white/60 mb-8">Configure your Brew4You business details</p>
          <SettingsManagement />
        </div>
      </main>
    </div>
  );
}
