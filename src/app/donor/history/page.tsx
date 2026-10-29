"use client";

import { useRouter } from "next/navigation";
import { DonorHistoryTab } from "@/components/donor/tabs/DonorHistoryTab";
import { DonorTab } from "@/components/donor/DonorSidebar";

export default function DonorHistoryPage() {
  const router = useRouter();

  const handleNavigateTab = (tab: DonorTab) => {
    if (tab === "dashboard") {
      router.push("/donor");
    } else {
      router.push(`/donor/${tab}`);
    }
  };

  return <DonorHistoryTab onNavigateTab={handleNavigateTab} />;
}
