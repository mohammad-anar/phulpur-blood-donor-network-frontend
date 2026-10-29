"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Home, ChevronRight, HeartHandshake, Phone, AlertCircle, X, User } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/lib/api/useAuth";
import { getAssetUrl } from "@/lib/api/auth";
import { useGetEmergencyRequestsQuery } from "@/lib/store/api/bloodDonationApi";

interface DonorHeaderProps {
  onToggleMobileMenu: () => void;
  currentTabName?: string;
}

export function DonorHeader({
  onToggleMobileMenu,
  currentTabName,
}: DonorHeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { data: emergencyRequests } = useGetEmergencyRequestsQuery();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const donorName = user?.name || "রক্তদাতা";
  const donorBloodGroup = user?.bloodGroup || "";
  const donorAvatar = getAssetUrl(user?.profileImage);
  const donorZone = user?.presentAddress || user?.currentAddress || user?.location || "";

  const activeCount = emergencyRequests?.length || 0;

  const getPageTitle = (path: string) => {
    if (path === "/donor") return "রক্তদাতা ড্যাশবোর্ড";
    if (path.startsWith("/donor/profile")) return "আমার প্রোফাইল";
    if (path.startsWith("/donor/history")) return "রক্তদানের ইতিহাস";
    if (path.startsWith("/donor/new-record")) return "নতুন রক্তদানের রেকর্ড";
    if (path.startsWith("/donor/settings")) return "সেটিংস ও নিরাপত্তা";
    return "রক্তদাতা ড্যাশবোর্ড";
  };

  const activeTitle = currentTabName || getPageTitle(pathname);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-[var(--card-bg)]/95 backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--background-alt)]"
          aria-label="মেনু খুলুন"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] font-medium">
          <Link href="/" className="hover:text-[var(--color-primary)] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">হোম</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--foreground-subtle)]" />
          <Link
            href="/donor"
            className={`hover:text-[var(--color-primary)] transition-colors ${
              pathname === "/donor" ? "text-[var(--foreground)] font-semibold" : ""
            }`}
          >
            ড্যাশবোর্ড
          </Link>
          {pathname !== "/donor" && (
            <>
              <ChevronRight className="w-3 h-3 text-[var(--foreground-subtle)]" />
              <span className="text-[var(--foreground)] font-semibold">
                {activeTitle}
              </span>
            </>
          )}
          <span className="hidden md:inline ml-2 px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[11px] font-semibold truncate max-w-[140px]">
            {donorZone}
          </span>
        </div>
      </div>

      {/* Right: Volunteer Pill, Theme, Notifications & User Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Volunteer Status Chip */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[var(--color-primary)] border border-rose-200 dark:border-rose-900/50 text-xs font-semibold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>স্বেচ্ছাসেবী রক্তদাতা</span>
        </div>

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="জরুরি রক্তের নোটিফিকেশন"
          >
            <Bell className="w-5 h-5" />
            {activeCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    জরুরি রক্তের অনুরোধ ({activeCount})
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-md text-[var(--foreground-subtle)] hover:bg-[var(--background-alt)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 text-xs divide-y divide-[var(--border-subtle)]">
                {emergencyRequests && emergencyRequests.length > 0 ? (
                  emergencyRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="pt-2 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--foreground)]">{req.rugirNam}</span>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                          {req.bloodGroup} • {req.kotoBag} ব্যাগ
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--foreground-muted)] truncate">{req.thikana}</p>
                      <a
                        href={`tel:${req.phone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)] hover:underline pt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>সরাসরি কল: {req.phone}</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--foreground-muted)] text-center py-4">
                    এই মুহূর্তে কোনো জরুরি রক্তের অনুরোধ নেই।
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Donor Avatar & Blood Group */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-color)]">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-bold text-[var(--foreground)] leading-tight">
              {donorName}
            </span>
            <span className="text-[11px] font-bold text-[var(--color-primary)] leading-tight">
              {donorBloodGroup ? `রক্তের গ্রুপ: ${donorBloodGroup}` : "নিবন্ধিত রক্তদাতা"}
            </span>
          </div>
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--color-primary-border)] shadow-xs bg-[var(--background-alt)] flex items-center justify-center">
            {donorAvatar ? (
              <Image
                src={donorAvatar}
                alt={donorName}
                fill
                sizes="36px"
                unoptimized={donorAvatar.startsWith("http")}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold text-xs">
                {donorBloodGroup || <User className="w-4 h-4" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
