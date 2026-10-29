"use client";

import { useState } from "react";
import { DonorSidebar } from "@/components/donor/DonorSidebar";
import { DonorHeader } from "@/components/donor/DonorHeader";

interface DonorShellProps {
  children: React.ReactNode;
}

export function DonorShell({ children }: DonorShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex text-[var(--foreground)] transition-colors duration-200">
      {/* Sidebar */}
      <DonorSidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <DonorHeader
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
