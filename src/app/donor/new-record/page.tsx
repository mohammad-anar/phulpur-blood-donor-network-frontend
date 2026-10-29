"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { DonorNewRecordTab } from "@/components/donor/tabs/DonorNewRecordTab";
import { DonorTab } from "@/components/donor/DonorSidebar";
import { Loader2 } from "lucide-react";

function DonorNewRecordContent() {
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

export default function DonorNewRecordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        </div>
      }
    >
      <DonorNewRecordContent />
    </Suspense>
  );
}

