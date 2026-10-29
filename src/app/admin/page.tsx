"use client";

import { useRouter } from "next/navigation";
import { AdminOverviewTab } from "@/components/admin/tabs/AdminOverviewTab";
import { AdminTab } from "@/components/admin/AdminSidebar";

export default function AdminOverviewPage() {
  const router = useRouter();

  const handleNavigateTab = (tab: AdminTab) => {
    if (tab === "overview") {
      router.push("/admin");
    } else {
      router.push(`/admin/${tab}`);
    }
  };

  return <AdminOverviewTab onNavigateTab={handleNavigateTab} />;
}
