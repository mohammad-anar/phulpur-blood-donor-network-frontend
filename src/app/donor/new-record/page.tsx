"use client";

import { useRouter } from "next/navigation";
import { DonorNewRecordTab } from "@/components/donor/tabs/DonorNewRecordTab";
import { DonorTab } from "@/components/donor/DonorSidebar";

export default function DonorNewRecordPage() {
  const router = useRouter();

  const handleNavigateTab = (tab: DonorTab) => {
    if (tab === "dashboard") {
      router.push("/donor");
    } else {
      router.push(`/donor/${tab}`);
    }
  };

  return <DonorNewRecordTab onNavigateTab={handleNavigateTab} />;
}
