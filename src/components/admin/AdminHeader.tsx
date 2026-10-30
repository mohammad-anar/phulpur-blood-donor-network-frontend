"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  AuthUser,
  getAssetUrl,
  getStoredToken,
  getStoredUser,
  authApi,
} from "@/lib/api/auth";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  currentTabName?: string;
}

export function AdminHeader({
  onToggleMobileMenu,
  currentTabName,
}: AdminHeaderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(getStoredUser());

    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("phulpur-auth-change", handleAuthChange);

    // Refresh profile in background to ensure latest image/role
    if (getStoredToken()) {
      authApi.getMe().catch(() => {});
    }

    return () => {
      window.removeEventListener("phulpur-auth-change", handleAuthChange);
    };
  }, []);

  const getPageTitle = (path: string) => {
    if (path === "/admin") return "অ্যাডমিন ওভারভিউ";
    if (path.startsWith("/admin/donors")) return "ডোনার ব্যবস্থাপনা";
    if (path.startsWith("/admin/verification")) return "রক্তদানের রেকর্ড তালিকা";
    if (path.startsWith("/admin/reports")) return "রিপোর্ট ও অভিযোগ";
    if (path.startsWith("/admin/activity")) return "কার্যক্রমের ইতিহাস";
    return "অ্যাডমিন ড্যাশবোর্ড";
  };

  const activeTabName = currentTabName || getPageTitle(pathname);
  const adminName = user?.name || "Md. Hridoy Hassan";
  const adminRole =
    user?.role === "SUPERADMIN"
      ? "সুপার অ্যাডমিন • ফুলপুর"
      : user?.role === "ADMIN"
      ? "উপজেলা সমন্বয়ক • অ্যাডমিন"
      : "অ্যাডমিন পোর্টাল";
  const initial = adminName.trim().charAt(0) || "অ";

  const adminAvatar =
    user?.profileImage
      ? getAssetUrl(user.profileImage)
      : user?.phone === "01972606255" || user?.role === "SUPERADMIN"
      ? "/images/team-profile1.jpeg"
      : "/images/donors/default.jpg";

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-[var(--card-bg)]/95 backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle, Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
          aria-label="মেনু খুলুন"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] font-medium">
          <Link href="/" className="hover:text-[var(--color-primary)] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ফুলপুর সদর</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--foreground-subtle)]" />
          <span className="text-[var(--foreground)] font-semibold">
            {activeTabName}
          </span>
        </div>
      </div>

      {/* Right: Theme, Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-color)]">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-bold text-[var(--foreground)] leading-tight">
              {adminName}
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-primary)] leading-tight">
              {adminRole}
            </span>
          </div>

          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[var(--color-primary)] shrink-0 bg-[var(--background-alt)] flex items-center justify-center shadow-xs">
            <Image
              src={adminAvatar}
              alt={adminName}
              fill
              sizes="36px"
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
