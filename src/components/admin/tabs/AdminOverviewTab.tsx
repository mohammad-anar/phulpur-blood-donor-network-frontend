"use client";

import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Clock,
  Droplet,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Check,
  Eye,
  FileCheck2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminTab } from "../AdminSidebar";
import {
  useGetAdminOverviewQuery,
  useApproveDonationMutation,
  useApproveDonorMutation,
} from "@/lib/store/api/bloodDonationApi";
import { toBengaliNumber, formatBengaliDate } from "@/lib/utils/donorCountdown";
import { useToast } from "@/components/common/Toast";

interface AdminOverviewTabProps {
  onNavigateTab?: (tab: AdminTab) => void;
}

export function AdminOverviewTab({ onNavigateTab }: AdminOverviewTabProps) {
  const router = useRouter();
  const navigate = (tab: AdminTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      router.push(tab === "overview" ? "/admin" : `/admin/${tab}`);
    }
  };
  const { data: overview, isLoading, isError, refetch } = useGetAdminOverviewQuery();
  const [approveDonation, { isLoading: isApprovingDonation }] = useApproveDonationMutation();
  const [approveDonor, { isLoading: isApprovingDonor }] = useApproveDonorMutation();
  const { success, error } = useToast();

  const stats = overview?.stats || {
    totalDonors: 0,
    approvedDonors: 0,
    pendingDonors: 0,
    blockedDonors: 0,
    thisMonthDonors: 0,
    totalDonations: 0,
    approvedDonations: 0,
    pendingDonations: 0,
    activeEmergencyRequests: 0,
    pendingReports: 0,
  };

  const bloodTypeDistribution = overview?.bloodTypeDistribution || [];
  const pendingApprovals = overview?.pendingApprovals || [];
  const recentRegisteredDonors = overview?.recentDonors || [];

  const handleQuickApproveDonation = async (recordId: string, donorName: string) => {
    try {
      await approveDonation({ id: recordId }).unwrap();
      success(`${donorName}-এর রক্তদানের রেকর্ড সফলভাবে অনুমোদিত হয়েছে!`, "অনুমোদন সম্পন্ন");
    } catch (err: any) {
      error(err?.data?.message || "অনুমোদন করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const handleQuickApproveDonor = async (donorId: string, donorName: string) => {
    try {
      await approveDonor(donorId).unwrap();
      success(`${donorName}-কে রক্তদাতা নেটওয়ার্কে সফলভাবে অনুমোদন করা হয়েছে!`, "ডোনার অনুমোদিত");
    } catch (err: any) {
      error(err?.data?.message || "অনুমোদন করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-80 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]" />
          <div className="lg:col-span-5 h-80 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-rose-200 dark:border-rose-900/50 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold text-[var(--foreground)]">
          অ্যাডমিন ওভারভিউ ডাটা লোড হতে সমস্যা হয়েছে
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
          আপনার অ্যাডমিন সেশন যাচাই করুন অথবা সার্ভারের সংযোগ পুনরায় চেক করুন।
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>পুনরায় চেষ্টা করুন</span>
        </button>
      </div>
    );
  }

  const activeDonorPercent =
    stats.totalDonors > 0
      ? Math.round((stats.approvedDonors / stats.totalDonors) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* 1. Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[var(--color-primary)] text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span>লাইভ নিয়ন্ত্রণ ব্যবস্থা (সার্ভার সংযুক্ত)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            অ্যাডমিন ওভারভিউ ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] max-w-2xl mt-0.5">
            ফুলপুর উপজেলা ও সংলগ্ন এলাকার ডোনার ব্যবস্থাপনা, রক্তদানের রেকর্ড যাচাই এবং জরুরি সমন্বয় কেন্দ্র।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] cursor-pointer transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>
          <button
            onClick={() => navigate("verification")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>নতুন রক্তদাতা যাচাই ({toBengaliNumber(stats.pendingDonations)})</span>
          </button>
        </div>
      </div>

      {/* 2. Top 6 Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Donors */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            মোট নিবন্ধিত ডোনার
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-[var(--foreground)]">
              {toBengaliNumber(stats.totalDonors)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] ml-1">জন</span>
            <div className="flex items-center gap-1 text-[11px] text-[var(--color-primary)] font-semibold mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{toBengaliNumber(stats.thisMonthDonors)} জন এই মাসে</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--background-alt)] overflow-hidden">
            <div className="w-full h-full bg-[var(--color-primary)] rounded-full" />
          </div>
        </div>

        {/* Card 2: Approved Donors */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            অনুমোদিত পাবলিক প্রোফাইল
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-600">
              {toBengaliNumber(stats.approvedDonors)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] ml-1">জন</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{toBengaliNumber(activeDonorPercent)}% সক্রিয় নেটওয়ার্ক</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--background-alt)] overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${activeDonorPercent}%` }}
            />
          </div>
        </div>

        {/* Card 3: Pending Donation Records */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            যাচাই অপেক্ষমাণ রেকর্ড
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-amber-600">
              {toBengaliNumber(stats.pendingDonations)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] ml-1">টি</span>
            <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-0.5">
              <Clock className="w-3 h-3" />
              <span>জরুরি যাচাই বাকি</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--background-alt)] overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  stats.totalDonations > 0
                    ? Math.round((stats.pendingDonations / stats.totalDonations) * 100)
                    : 0
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Card 4: Total Approved Donations */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            অনুমোদিত রক্তদান
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-[var(--color-primary)]">
              {toBengaliNumber(stats.approvedDonations)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] ml-1">ব্যাগ</span>
            <div className="flex items-center gap-1 text-[11px] text-[var(--foreground-subtle)] mt-0.5">
              <span>ফুলপুর উপজেলা রেকর্ড</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--background-alt)] overflow-hidden">
            <div className="w-[85%] h-full bg-[var(--color-primary)] rounded-full" />
          </div>
        </div>

        {/* Card 5: Pending Reports / Complaints */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            রিপোর্ট ও অভিযোগ
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-rose-600">
              {toBengaliNumber(stats.pendingReports)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] ml-1">টি</span>
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold mt-0.5">
              <AlertTriangle className="w-3 h-3" />
              <span>সমাধানযোগ্য অগ্রাধিকার</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--background-alt)] overflow-hidden">
            <div className="w-[40%] h-full bg-rose-500 rounded-full" />
          </div>
        </div>

        {/* Card 6: Pending Donor Registrations */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            অপেক্ষমাণ নতুন ডোনার
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-[var(--foreground)]">
              {toBengaliNumber(stats.pendingDonors)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] ml-1">জন</span>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
              <span>অনুমোদন প্রয়োজন</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--background-alt)] overflow-hidden">
            <div className="w-[60%] h-full bg-amber-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Blood Distribution & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Blood Group Distribution */}
        <div className="lg:col-span-7 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                রক্তদানের গ্রুপভিত্তিক বিন্যাস
              </h3>
              <p className="text-xs text-[var(--foreground-muted)]">
                ফুলপুর আঞ্চলিক ডোনার ডাটাবেজের রক্তের গ্রুপ বণ্টন (লাইভ ডাটাবেজ)
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold">
              মোট ৮টি গ্রুপ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {bloodTypeDistribution.map((item) => (
              <div
                key={item.type}
                className="p-3 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                      item.isRare
                        ? "bg-amber-500 text-white"
                        : "bg-[var(--color-primary)] text-white"
                    }`}
                  >
                    {item.type}
                  </span>
                  <div>
                    <span className="font-bold text-[var(--foreground)] block">
                      {item.type} {item.isRare ? "(বিরল)" : ""}
                    </span>
                    <span className="text-[11px] text-[var(--foreground-muted)]">
                      {toBengaliNumber(item.count)} জন নিবন্ধিত
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-[var(--color-primary)] block">
                    {toBengaliNumber(item.percentage)}
                  </span>
                  <div className="w-16 h-1 rounded-full bg-[var(--card-border)] overflow-hidden mt-1">
                    <div
                      className={`h-full ${item.isRare ? "bg-amber-500" : "bg-[var(--color-primary)]"}`}
                      style={{ width: `${item.percentageNum}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pending Approvals & Complaints */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pending Verifications */}
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-bold text-[var(--foreground)]">
                যাচাই অপেক্ষমাণ রেকর্ড
              </h3>
              <button
                onClick={() => navigate("verification")}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>সবগুলো ({toBengaliNumber(stats.pendingDonations)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--foreground-muted)] bg-[var(--background-alt)] rounded-xl">
                  কোনো রক্তদানের রেকর্ড যাচাইয়ের অপেক্ষায় নেই।
                </div>
              ) : (
                pendingApprovals.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[var(--background-alt)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        {item.bloodGroup}
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-[var(--foreground)] block truncate">
                          {item.donorName}
                        </span>
                        <span className="text-[11px] text-[var(--foreground-muted)] block truncate">
                          {item.hospital}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleQuickApproveDonation(item.id, item.donorName)}
                        disabled={isApprovingDonation}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer transition-colors disabled:opacity-50"
                        title="অনুমোদন করুন"
                      >
                        অনুমোদন
                      </button>
                      <button
                        onClick={() => navigate("verification")}
                        className="px-2 py-1 rounded-lg text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--card-bg)] cursor-pointer"
                        title="স্লিপ দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Dispute / Complaint Alert */}
          {stats.pendingReports > 0 ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-start justify-between gap-3">
              <div className="space-y-1 text-xs">
                <span className="inline-block px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                  জরুরি নোটিশ • {toBengaliNumber(stats.pendingReports)}টি নতুন বার্তা
                </span>
                <h4 className="font-bold text-[var(--foreground)]">
                  ব্যবহারকারী ও হাসপাতালের যোগাযোগ ও রিপোর্ট অপেক্ষমাণ
                </h4>
                <p className="text-[11px] text-[var(--foreground-muted)]">
                  নাগরিকদের মতামত ও অভিযোগ পর্যবেক্ষণ করে দ্রুত পদক্ষেপ নিন।
                </p>
              </div>
              <button
                onClick={() => navigate("reports")}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 whitespace-nowrap cursor-pointer shadow-xs"
              >
                রিপোর্ট দেখুন
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  কোনো অমীমাংসিত অভিযোগ নেই
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  ফুলপুর নেটওয়ার্কে শৃঙ্খলা ও সমন্বয় স্বাভাবিক রয়েছে।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Table: Recent Registered Donors */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">
              সাম্প্রতিক নিবন্ধিত ডোনার তালিকা
            </h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              ফুলপুর নেটওয়ার্কে সাম্প্রতিক প্রোফাইল খোলার সরাসরি ডাটাবেজ তথ্য
            </p>
          </div>
          <button
            onClick={() => navigate("donors")}
            className="text-xs font-bold text-[var(--color-primary)] hover:underline self-start sm:self-auto flex items-center gap-1 cursor-pointer"
          >
            <span>সম্পূর্ণ ডোনার ডাটাবেজ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--background-alt)] text-[var(--foreground-muted)]">
              <tr>
                <th className="p-4 font-semibold">ডোনারের নাম</th>
                <th className="p-4 font-semibold">রক্তের গ্রুপ</th>
                <th className="p-4 font-semibold">ইউনিয়ন / এলাকা</th>
                <th className="p-4 font-semibold">মোবাইল নম্বর</th>
                <th className="p-4 font-semibold">নিবন্ধনের সময়</th>
                <th className="p-4 font-semibold">স্ট্যাটাস</th>
                <th className="p-4 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {recentRegisteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-xs text-[var(--foreground-muted)]">
                    কোনো ডোনার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                recentRegisteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-[var(--background-alt)]/50 transition-colors">
                    <td className="p-4 font-semibold text-[var(--foreground)]">
                      <div>
                        <span>{donor.name}</span>
                        <span className="block text-[10px] text-[var(--foreground-subtle)] font-normal font-mono">
                          ID: {donor.id.slice(-6)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold">
                        {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--foreground-muted)] max-w-xs truncate">
                      {donor.area || "তথ্য নেই"}
                    </td>
                    <td className="p-4 text-[var(--foreground)] font-mono" dir="ltr">
                      {donor.phone}
                    </td>
                    <td className="p-4 text-[var(--foreground-muted)]">
                      {formatBengaliDate(donor.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          donor.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : donor.status === "PENDING"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        ● {donor.status === "APPROVED" ? "অনুমোদিত" : donor.status === "PENDING" ? "অপেক্ষমাণ" : "বাতিল"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {donor.status === "PENDING" ? (
                        <button
                          onClick={() => handleQuickApproveDonor(donor.id, donor.name)}
                          disabled={isApprovingDonor}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          অনুমোদন দিন
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate("donors")}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary-border)] hover:bg-[var(--color-primary-light)] cursor-pointer"
                        >
                          বিবরণ
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
