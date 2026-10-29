"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  History,
  PlusCircle,
  Settings,
  PhoneCall,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/api/useAuth";

export type DonorTab = "dashboard" | "profile" | "history" | "new-record" | "settings";

interface DonorSidebarProps {
  currentTab?: DonorTab;
  onTabChange?: (tab: DonorTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function DonorSidebar({
  currentTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
}: DonorSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { id: "dashboard" as DonorTab, label: "ড্যাশবোর্ড", icon: LayoutDashboard, href: "/donor" },
    { id: "profile" as DonorTab, label: "আমার প্রোফাইল", icon: User, href: "/donor/profile" },
    { id: "history" as DonorTab, label: "রক্তদানের ইতিহাস", icon: History, href: "/donor/history" },
    { id: "new-record" as DonorTab, label: "নতুন রক্তদানের রেকর্ড", icon: PlusCircle, href: "/donor/new-record" },
    { id: "settings" as DonorTab, label: "সেটিংস", icon: Settings, href: "/donor/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isItemActive = (itemHref: string, itemId: DonorTab) => {
    if (currentTab) {
      return currentTab === itemId;
    }
    if (itemHref === "/donor") {
      return pathname === "/donor";
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[var(--card-bg)] border-r border-[var(--border-color)] flex flex-col justify-between transition-transform duration-300 ${
        isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-3 border-b border-[var(--border-subtle)]">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/images/logo_icon.png"
              alt="ফুলপুর রক্ত সেবা লোগো"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-base font-bold text-[var(--color-primary)] leading-tight truncate">
              ফুলপুর রক্ত সেবা
            </span>
            <span className="text-xs text-[var(--foreground-muted)] truncate">
              ফুলপুর, ময়মনসিংহ
            </span>
          </div>
        </div>

        {/* Portal Pill */}
        <div className="px-4 py-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
            রক্তদাতা পোর্টাল
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.href, item.id);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  onTabChange?.(item.id);
                  onCloseMobile?.();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm font-semibold"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Help & Logout */}
      <div className="p-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
        {/* Emergency Helpline Box */}
        <a
          href="tel:01711000001"
          className="p-3 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary-border)] flex flex-col gap-1 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
            <PhoneCall className="w-4 h-4" />
            <span className="text-xs font-bold">জরুরি রক্ত সহায়তা</span>
          </div>
          <span className="text-sm font-bold text-[var(--foreground)]" dir="ltr">
            ০১৭১১-০০০০০১
          </span>
          <span className="text-[11px] text-[var(--foreground-muted)]">
            ফুলপুর উপজেলা হেল্পলাইন
          </span>
        </a>

        {/* Back to Website */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল ওয়েবসাইটে ফিরুন</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট</span>
        </button>
      </div>
    </aside>
  );
}
