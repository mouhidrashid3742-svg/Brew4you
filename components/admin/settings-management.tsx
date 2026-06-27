"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

interface Settings {
  _id: string;
  businessName: string;
  businessPhone: string;
  businessWhatsApp: string;
  businessEmail: string;
  businessAddress: string;
  deliveryFee: number;
  businessHours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  businessInfo: string;
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SettingsManagement() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success("Settings saved!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-center text-gold">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="mt-2 text-ink-light">Configure your 9 BAR business details</p>
      </div>

      <div className="space-y-6 rounded-xl border border-gold/20 bg-ink/50 p-6">
        {/* Business Info */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gold">Business Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gold">Business Name</label>
              <Input
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold">Business Address</label>
              <Input
                value={settings.businessAddress}
                onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                placeholder="Your business location"
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold">About Business</label>
              <Textarea
                value={settings.businessInfo}
                onChange={(e) => setSettings({ ...settings, businessInfo: e.target.value })}
                placeholder="Tell customers about your business..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gold">Contact Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gold">Phone Number</label>
              <Input
                value={settings.businessPhone}
                onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                placeholder="+923001234567"
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold">WhatsApp Number</label>
              <Input
                value={settings.businessWhatsApp}
                onChange={(e) => setSettings({ ...settings, businessWhatsApp: e.target.value })}
                placeholder="923001234567 (without +)"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gold">Email Address</label>
              <Input
                type="email"
                value={settings.businessEmail}
                onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                placeholder="contact@9bar.coffee"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gold">Delivery Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gold">Delivery Fee (PKR)</label>
            <Input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) })}
              placeholder="0"
              className="mt-1"
            />
          </div>
        </div>

        {/* Business Hours */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gold">Business Hours</h2>
          <div className="space-y-3">
            {DAYS.map((day, idx) => (
              <div key={day} className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">{DAY_LABELS[idx]}</label>
                <Input
                  value={settings.businessHours[day as keyof typeof settings.businessHours]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessHours: {
                        ...settings.businessHours,
                        [day]: e.target.value
                      }
                    })
                  }
                  placeholder="9:00 AM - 10:00 PM"
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-gold/20 pt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-ink hover:bg-gold/90 disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="rounded-xl border border-gold/20 bg-gold/10 p-6">
        <h3 className="mb-4 font-bold text-gold">Format Reference</h3>
        <div className="space-y-2 text-sm text-ink-light">
          <p>📱 <strong>Phone:</strong> +923001234567</p>
          <p>💬 <strong>WhatsApp:</strong> 923001234567 (without +)</p>
          <p>🕐 <strong>Hours:</strong> 9:00 AM - 10:00 PM or Closed</p>
          <p>💰 <strong>Delivery Fee:</strong> 0 for free delivery</p>
        </div>
      </div>
    </div>
  );
}
