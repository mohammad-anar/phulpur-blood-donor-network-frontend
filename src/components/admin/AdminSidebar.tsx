"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  AlertTriangle,
  History,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  User,
} from "lucide-react";
import { useGetAdminOverviewQuery } from "@/lib/store/api/bloodDonationApi";
import { toBengaliNumber } from "@/lib/utils/donorCountdown";
import { clearStoredAuth } from "@/lib/api/auth";

export type AdminTab = "overview" | "donors" | "verification" | "reports" | "activity";

interface AdminSidebarProps {
  currentTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  currentTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: overview } = useGetAdminOverviewQuery();

  const pendingDonations = overview?.stats?.pendingDonations || 0;
  const pendingReports = overview?.stats?.pendingReports || 0;

  const navItems = [
    { id: "overview" as AdminTab, label: "ওভারভিউ", icon: LayoutDashboard, href: "/admin" },
    { id: "donors" as AdminTab, label: "ডোনার ব্যবস্থাপনা", icon: Users, href: "/admin/donors" },
    {
      id: "verification" as AdminTab,
      label: "যাচাই অপেক্ষমাণ",
      icon: CheckSquare,
      href: "/admin/verification",
      badge: pendingDonations > 0 ? toBengaliNumber(pendingDonations) : undefined,
      badgeColor: "bg-amber-500",
    },
    {
      id: "reports" as AdminTab,
      label: "রিপোর্ট ও অভিযোগ",
      icon: ShieldAlert,
      href: "/admin/reports",
      badge: pendingReports > 0 ? toBengaliNumber(pendingReports) : undefined,
      badgeColor: "bg-rose-600",
    },
    { id: "activity" as AdminTab, label: "কার্যক্রমের ইতিহাস", icon: History, href: "/admin/activity" },
  ];

  const handleLogout = () => {
    if (confirm("আপনি কি অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?")) {
      clearStoredAuth();
      router.push("/login");
    }
  };

  const isItemActive = (itemHref: string, itemId: AdminTab) => {
    if (currentTab) {
      return currentTab === itemId;
    }
    if (itemHref === "/admin") {
      return pathname === "/admin";
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
              alt="ফুলপুর ব্লাড ডোনার নেটওয়ার্ক লোগো"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-base font-bold text-[var(--color-primary)] leading-tight truncate">
              ফুলপুর ব্লাড
            </span>
            <span className="text-xs text-[var(--foreground-muted)] truncate">
              ডোনার নেটওয়ার্ক
            </span>
          </div>
        </div>

        {/* Admin Portal Badge */}
        <div className="px-4 py-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-[var(--color-primary)] text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            <span>অ্যাডমিন পোর্টাল</span>
          </span>
        </div>

        {/* Navigation */}
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm font-semibold"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-white text-[var(--color-primary)]"
                        : `${item.badgeColor || "bg-red-500"} text-white`
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-[var(--border-subtle)] flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল ওয়েবসাইটে ফিরুন</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট</span>
        </button>
      </div>
    </aside>
  );
}
