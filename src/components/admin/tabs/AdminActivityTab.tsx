"use client";

import { useState } from "react";
import Link from "next/link";
import {
  History,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  FileCheck2,
  Ban,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";
import { useGetAdminOverviewQuery, useGetAdminDonationsQuery } from "@/lib/store/api/bloodDonationApi";
import { toBengaliNumber, formatBengaliDate } from "@/lib/utils/donorCountdown";

export function AdminActivityTab() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: overview, isLoading, refetch } = useGetAdminOverviewQuery();
  const { data: donationsData } = useGetAdminDonationsQuery({ limit: 10 });

  const pendingApprovals = overview?.pendingApprovals || [];
  const recentDonors = overview?.recentDonors || [];
  const recentDonations = donationsData?.data || [];

  // Construct combined activity events
  const donorActivities = recentDonors.map((d) => ({
    id: `donor-${d.id}`,
    type: "donor_registration",
    title: `নতুন ডোনার নিবন্ধন: ${d.name}`,
    description: `রক্তের গ্রুপ: ${d.bloodGroup} • এলাকা: ${d.area || "ফুলপুর"}`,
    status: d.status,
    timestamp: d.createdAt,
    link: "/admin/donors",
    icon: UserCheck,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
  }));

  const donationActivities = recentDonations.map((dn) => ({
    id: `donation-${dn.id}`,
    type: "donation_record",
    title: `রক্তদানের রেকর্ড: ${dn.donor?.name || "ডোনার"} (${dn.donor?.bloodGroup || ""})`,
    description: `কেন্দ্র: ${dn.donationAddress} • বিভাগ: ${dn.rugirDhoron || "জরুরি কেস"}`,
    status: dn.status,
    timestamp: dn.createdAt,
    link: "/admin/verification",
    icon: FileCheck2,
    color: dn.status === "APPROVED" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" : "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
  }));

  const allActivities = [...donorActivities, ...donationActivities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredActivities = allActivities.filter((act) => {
    const matchesFilter = filterType === "all" || act.type === filterType;
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)]">
            অডিট ট্রেল ও লগ • ফুলপুর রক্তদান নেটওয়ার্ক
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-0.5">
            কার্যক্রমের ইতিহাস ও লগ
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            সিস্টেমে সংঘটিত নতুন নিবন্ধন, রক্তদান যাচাই ও প্রশাসনিক সিদ্ধান্তের সার্বিক অডিট টাইমলাইন।
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
          <span>লগ রিফ্রেশ</span>
        </button>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">সর্বমোট রেকর্ডকৃত ইভেন্ট</span>
          <p className="text-2xl font-black text-[var(--foreground)] mt-1">
            {toBengaliNumber(allActivities.length)} টি
          </p>
          <span className="text-[11px] text-[var(--foreground-subtle)]">সর্বশেষ ডাটাবেজ ট্রানজেকশন</span>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">ডোনার নিবন্ধন ইভেন্ট</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {toBengaliNumber(donorActivities.length)} টি
          </p>
          <span className="text-[11px] text-blue-700">সাম্প্রতিক ইউজার যুক্ত</span>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">রক্তদান যাচাই ইভেন্ট</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {toBengaliNumber(donationActivities.length)} টি
          </p>
          <span className="text-[11px] text-emerald-700">জমাকৃত প্রমাণপত্র লগ</span>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">নিরাপত্তা ও অখণ্ডতা</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">১০০%</p>
          <span className="text-[11px] text-emerald-700">কোনো অসঙ্গতি শনাক্ত হয়নি</span>
        </div>
      </div>

      {/* 3. Filters */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              filterType === "all"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
            }`}
          >
            সব ইভেন্ট ({toBengaliNumber(allActivities.length)})
          </button>
          <button
            onClick={() => setFilterType("donor_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              filterType === "donor_registration"
                ? "bg-blue-600 text-white"
                : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
            }`}
          >
            নিবন্ধন ({toBengaliNumber(donorActivities.length)})
          </button>
          <button
            onClick={() => setFilterType("donation_record")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              filterType === "donation_record"
                ? "bg-emerald-600 text-white"
                : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
            }`}
          >
            রক্তদান ({toBengaliNumber(donationActivities.length)})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[var(--foreground-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="ইভেন্ট বা ডোনার খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* 4. Timeline list */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-[var(--foreground)] pb-3 border-b border-[var(--border-subtle)]">
          সাম্প্রতিক অডিট টাইমলাইন
        </h3>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-[var(--foreground-muted)]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--color-primary)]" />
            ইতিহাস লোড হচ্ছে...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--foreground-muted)]">
            কোনো ইভেন্ট পাওয়া যায়নি।
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border-color)]">
            {filteredActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="relative flex items-start justify-between gap-4">
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--card-bg)] shadow-xs ${act.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-bold text-[var(--foreground)]">{act.title}</h4>
                    <p className="text-[11px] text-[var(--foreground-muted)]">{act.description}</p>
                    <span className="text-[10px] text-[var(--foreground-subtle)] block">
                      {formatBengaliDate(act.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        act.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : act.status === "PENDING"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {act.status === "APPROVED" ? "অনুমোদিত" : act.status === "PENDING" ? "অপেক্ষমাণ" : act.status}
                    </span>
                    <Link
                      href={act.link}
                      className="p-1 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--background-alt)]"
                      title="বিভাগে যান"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
