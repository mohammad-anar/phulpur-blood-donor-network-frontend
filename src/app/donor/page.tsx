"use client";

import { useRouter } from "next/navigation";
import { DonorDashboardTab } from "@/components/donor/tabs/DonorDashboardTab";
import { DonorTab } from "@/components/donor/DonorSidebar";

export default function DonorDashboardPage() {
  const router = useRouter();

  const handleNavigateTab = (tab: DonorTab) => {
    if (tab === "dashboard") {
      router.push("/donor");
    } else {
      router.push(`/donor/${tab}`);
    }
  };

  return <DonorDashboardTab onNavigateTab={handleNavigateTab} />;
}
