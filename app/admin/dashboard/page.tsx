import AdminLayout from "@/components/admin/admin-layout";
import DashboardOverview from "@/components/admin/dashboard-overview";

export const metadata = {
  title: "Admin Dashboard | Brew4You",
  description: "Manage your coffee business"
};

export default function DashboardPage() {
  return (
    <AdminLayout currentPage="dashboard">
      <DashboardOverview />
    </AdminLayout>
  );
}
