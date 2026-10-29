"use client";

import { Suspense } from "react";
import { AdminDonorsTab } from "@/components/admin/tabs/AdminDonorsTab";

export default function AdminDonorsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[var(--foreground-muted)]">
          ডোনার ডাটাবেজ লোড হচ্ছে...
        </div>
      }
    >
      <AdminDonorsTab />
    </Suspense>
  );
}
