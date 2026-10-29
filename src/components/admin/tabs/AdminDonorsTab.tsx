"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  FileSpreadsheet,
  FileText,
  Plus,
  Eye,
  Edit,
  PhoneCall,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  X,
  RefreshCw,
  UserCheck,
  UserX,
  AlertTriangle,
  Check,
  Trash2,
} from "lucide-react";
import {
  useGetAdminDonorsQuery,
  useGetAdminOverviewQuery,
  useApproveDonorMutation,
  useRejectDonorMutation,
  useBlockDonorMutation,
  useUnblockDonorMutation,
  useDeleteDonorMutation,
  AdminDonorItem,
} from "@/lib/store/api/bloodDonationApi";
import { toBengaliNumber, formatBengaliDate } from "@/lib/utils/donorCountdown";
import { useToast } from "@/components/common/Toast";
import { getAssetUrl } from "@/lib/api/auth";

export function AdminDonorsTab() {
  const searchParams = useSearchParams();
  const urlStatus = searchParams?.get("status")?.toUpperCase();

  const [searchQuery, setSearchQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>(
    urlStatus === "PENDING" || urlStatus === "APPROVED" || urlStatus === "BLOCKED"
      ? urlStatus
      : "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDonor, setSelectedDonor] = useState<AdminDonorItem | null>(null);
  const [donorToDelete, setDonorToDelete] = useState<AdminDonorItem | null>(null);

  const { success, error } = useToast();

  // Sync if URL query param changes
  useEffect(() => {
    if (urlStatus === "PENDING" || urlStatus === "APPROVED" || urlStatus === "BLOCKED") {
      setStatusFilter(urlStatus);
      setCurrentPage(1);
    }
  }, [urlStatus]);

  // Overall system overview stats
  const { data: overview, refetch: refetchOverview } = useGetAdminOverviewQuery();

  const statusParam =
    statusFilter === "PENDING" || statusFilter === "APPROVED"
      ? statusFilter
      : undefined;
  const isBlockedParam =
    statusFilter === "BLOCKED" ? true : undefined;

  const {
    data: donorsData,
    isLoading,
    isFetching,
    refetch: refetchDonors,
  } = useGetAdminDonorsQuery({
    searchQuery: searchQuery.trim() || undefined,
    bloodGroup: bloodGroupFilter !== "all" ? bloodGroupFilter : undefined,
    status: statusParam,
    isBlocked: isBlockedParam,
    page: currentPage,
    limit: 10,
  });

  const [approveDonor, { isLoading: isApproving }] = useApproveDonorMutation();
  const [rejectDonor, { isLoading: isRejecting }] = useRejectDonorMutation();
  const [blockDonor, { isLoading: isBlocking }] = useBlockDonorMutation();
  const [unblockDonor, { isLoading: isUnblocking }] = useUnblockDonorMutation();
  const [deleteDonor, { isLoading: isDeleting }] = useDeleteDonorMutation();

  const donors = donorsData?.data || [];
  const pagination = donorsData?.pagination || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const totalDonorsCount = overview?.stats?.totalDonors ?? pagination.total;
  const approvedDonorsCount = overview?.stats?.approvedDonors ?? 0;
  const pendingDonorsCount = overview?.stats?.pendingDonors ?? 0;
  const blockedDonorsCount = overview?.stats?.blockedDonors ?? 0;

  const refetchAll = () => {
    refetchDonors();
    refetchOverview();
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      await approveDonor(id).unwrap();
      success(`${name}-কে রক্তদাতা নেটওয়ার্কে সফলভাবে অনুমোদন দেওয়া হয়েছে!`, "অনুমোদন সম্পন্ন");
      if (selectedDonor?.id === id) {
        setSelectedDonor((prev) => (prev ? { ...prev, status: "APPROVED" } : null));
      }
    } catch (err: any) {
      error(err?.data?.message || "অনুমোদন ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে ${name}-এর নিবন্ধন বাতিল করতে চান?`)) return;
    try {
      await rejectDonor(id).unwrap();
      success(`${name}-এর নিবন্ধন বাতিল করা হয়েছে।`, "নিবন্ধন বাতিল");
      if (selectedDonor?.id === id) {
        setSelectedDonor((prev) => (prev ? { ...prev, status: "REJECTED" } : null));
      }
    } catch (err: any) {
      error(err?.data?.message || "বাতিল করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const handleBlock = async (id: string, name: string) => {
    if (!confirm(`আপনি কি ${name}-এর অ্যাকাউন্ট সাময়িকভাবে স্থগিত (Block) করতে চান?`)) return;
    try {
      await blockDonor(id).unwrap();
      success(`${name}-এর অ্যাকাউন্ট ব্লক করা হয়েছে।`, "অ্যাকাউন্ট ব্লক");
      if (selectedDonor?.id === id) {
        setSelectedDonor((prev) => (prev ? { ...prev, isBlocked: true } : null));
      }
    } catch (err: any) {
      error(err?.data?.message || "ব্লক করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const handleUnblock = async (id: string, name: string) => {
    try {
      await unblockDonor(id).unwrap();
      success(`${name}-এর অ্যাকাউন্ট পুনরায় সক্রিয় করা হয়েছে।`, "আনব্লক সম্পন্ন");
      if (selectedDonor?.id === id) {
        setSelectedDonor((prev) => (prev ? { ...prev, isBlocked: false } : null));
      }
    } catch (err: any) {
      error(err?.data?.message || "আনব্লক করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const handleConfirmDelete = async () => {
    if (!donorToDelete) return;
    try {
      await deleteDonor(donorToDelete.id).unwrap();
      success(`${donorToDelete.name}-এর অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলা হয়েছে।`, "মুছে ফেলা সম্পন্ন");
      if (selectedDonor?.id === donorToDelete.id) {
        setSelectedDonor(null);
      }
      setDonorToDelete(null);
      refetchAll();
    } catch (err: any) {
      error(err?.data?.message || "অ্যাকাউন্ট মুছে ফেলা সম্ভব হয়নি।", "ত্রুটি");
    }
  };

  const exportToCSV = () => {
    if (donors.length === 0) {
      error("এক্সপোর্ট করার মতো কোনো ডোনার পাওয়া যায়নি।", "এক্সপোর্ট ব্যর্থ");
      return;
    }
    const headers = ["ID", "Name", "BloodGroup", "Phone", "Status", "IsBlocked", "Address", "CreatedDate"];
    const rows = donors.map((d) => [
      d.id,
      `"${d.name.replace(/"/g, '""')}"`,
      d.bloodGroup,
      `"${d.phone}"`,
      d.status,
      d.isBlocked ? "BLOCKED" : "ACTIVE",
      `"${(d.currentAddress || "").replace(/"/g, '""')}"`,
      d.createdAt,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fulpur_donors_${statusFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)]">
            প্রশাসনিক নিয়ন্ত্রণ • ফুলপুর উপজেলা কেন্দ্রীয় ডাটাবেজ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-0.5">
            ডোনার ব্যবস্থাপনা
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            ফুলপুর উপজেলার নিবন্ধিত রক্তদাতাদের তালিকা, প্রোফাইল যাচাই, প্রাপ্যতা নিরীক্ষণ ও প্রশাসনিক নিয়ন্ত্রণ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={refetchAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] shadow-xs cursor-pointer transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--foreground-muted)] ${isFetching ? "animate-spin" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] shadow-xs cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>এক্সপোর্ট (Excel/CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Interactive Metric Cards - Click to Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Donors Card */}
        <div
          onClick={() => {
            setStatusFilter("all");
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl bg-[var(--card-bg)] border cursor-pointer transition-all shadow-xs flex items-center justify-between ${
            statusFilter === "all"
              ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-sm"
              : "border-[var(--card-border)] hover:border-[var(--color-primary-border)] hover:shadow-xs"
          }`}
        >
          <div>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">মোট ডোনার (ডাটাবেজ)</span>
            <p className="text-2xl font-black text-[var(--foreground)] mt-1">
              {toBengaliNumber(totalDonorsCount)} জন
            </p>
            <span className="text-[11px] text-[var(--foreground-subtle)]">ক্লিক করে সব ডোনার দেখুন</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Donors Card */}
        <div
          onClick={() => {
            setStatusFilter("APPROVED");
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl bg-[var(--card-bg)] border cursor-pointer transition-all shadow-xs flex items-center justify-between ${
            statusFilter === "APPROVED"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm"
              : "border-[var(--card-border)] hover:border-emerald-400 hover:shadow-xs"
          }`}
        >
          <div>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">অনুমোদিত ও সক্রিয়</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {toBengaliNumber(approvedDonorsCount)} জন
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">ক্লিক করে সক্রিয় ডোনার দেখুন</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Donors Card (KEY FOCUS) */}
        <div
          onClick={() => {
            setStatusFilter("PENDING");
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl bg-[var(--card-bg)] border cursor-pointer transition-all shadow-xs flex items-center justify-between relative overflow-hidden ${
            statusFilter === "PENDING"
              ? "border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/40 dark:bg-amber-950/30 shadow-md"
              : "border-[var(--card-border)] hover:border-amber-400 hover:shadow-xs"
          }`}
        >
          {pendingDonorsCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--foreground-muted)] font-bold">যাচাই অপেক্ষমাণ</span>
              {pendingDonorsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold animate-pulse">
                  নতুন
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {toBengaliNumber(pendingDonorsCount)} জন
            </p>
            <span className="text-[11px] text-amber-700 font-bold block">
              ক্লিক করে অপেক্ষমাণদের ফিল্টার করুন
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Blocked Donors Card */}
        <div
          onClick={() => {
            setStatusFilter("BLOCKED");
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl bg-[var(--card-bg)] border cursor-pointer transition-all shadow-xs flex items-center justify-between ${
            statusFilter === "BLOCKED"
              ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 dark:bg-rose-950/20 shadow-sm"
              : "border-[var(--card-border)] hover:border-rose-400 hover:shadow-xs"
          }`}
        >
          <div>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">স্থগিত / ব্লককৃত</span>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {toBengaliNumber(blockedDonorsCount)} জন
            </p>
            <span className="text-[11px] text-rose-700 font-semibold">ক্লিক করে ব্লক তালিকা দেখুন</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 flex items-center justify-center">
            <Ban className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Search and Filter Panel */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-bold text-[var(--foreground)]">ফিল্টার ও অনুসন্ধান প্যানেল</h3>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setBloodGroupFilter("all");
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>সব রিসেট</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--foreground-muted)] mb-1">
              নাম, মোবাইল বা ঠিকানা
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--foreground-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="যেমন: তানভীর আহমেদ বা 017..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--foreground-muted)] mb-1">
              রক্তের গ্রুপ
            </label>
            <select
              value={bloodGroupFilter}
              onChange={(e) => {
                setBloodGroupFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-[var(--foreground)] cursor-pointer"
            >
              <option value="all">সব রক্তের গ্রুপ</option>
              <option value="O_POSITIVE">O+ (পজিটিভ)</option>
              <option value="A_POSITIVE">A+ (পজিটিভ)</option>
              <option value="B_POSITIVE">B+ (পজিটিভ)</option>
              <option value="AB_POSITIVE">AB+ (পজিটিভ)</option>
              <option value="O_NEGATIVE">O- (নেগেটিভ)</option>
              <option value="A_NEGATIVE">A- (নেগেটিভ)</option>
              <option value="B_NEGATIVE">B- (নেগেটিভ)</option>
              <option value="AB_NEGATIVE">AB- (নেগেটিভ)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--foreground-muted)] mb-1">
              স্ট্যাটাস ফিল্টার (Pending / Approved)
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-[var(--foreground)] font-semibold cursor-pointer"
            >
              <option value="all">সকল ডোনার স্ট্যাটাস (ALL)</option>
              <option value="PENDING">যাচাই অপেক্ষমাণ ডোনার (PENDING)</option>
              <option value="APPROVED">অনুমোদিত ডোনার (APPROVED)</option>
              <option value="BLOCKED">স্থগিত / ব্লককৃত ডোনার (BLOCKED)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => refetchDonors()}
              className="w-full py-2 px-4 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-colors cursor-pointer"
            >
              ফিল্টার প্রয়োগ করুন
            </button>
          </div>
        </div>
      </div>

      {/* 4. Active Pending Filter Banner (Displayed when PENDING status filter is active) */}
      {statusFilter === "PENDING" && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                যাচাই অপেক্ষমাণ ডোনার তালিকা সক্রিয় ({toBengaliNumber(donors.length)} জন প্রদর্শিত)
              </h4>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                এই রক্তদাতারা সম্প্রতি নিবন্ধন সম্পন্ন করেছেন। রক্তদাতা তালিকায় সক্রিয় হওয়ার পূর্বে অ্যাডমিন অনুমোদন প্রয়োজন।
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-white border border-amber-300 hover:bg-amber-100 dark:bg-stone-900 dark:text-amber-200 cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            সব ডোনার দেখুন
          </button>
        </div>
      )}

      {/* 5. Donors Central Database Table */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs overflow-hidden">
        {/* Table Top Bar with Quick Filter Pills */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[var(--foreground)] mr-1">ফিল্টার:</span>

            {/* All Pill */}
            <button
              onClick={() => {
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                statusFilter === "all"
                  ? "bg-[var(--foreground)] text-[var(--background)] shadow-xs"
                  : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--card-border)]"
              }`}
            >
              সকল ({toBengaliNumber(totalDonorsCount)})
            </button>

            {/* Pending Pill (Highlighted) */}
            <button
              onClick={() => {
                setStatusFilter("PENDING");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                statusFilter === "PENDING"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>অপেক্ষমাণ ({toBengaliNumber(pendingDonorsCount)})</span>
            </button>

            {/* Approved Pill */}
            <button
              onClick={() => {
                setStatusFilter("APPROVED");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                statusFilter === "APPROVED"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>অনুমোদিত ({toBengaliNumber(approvedDonorsCount)})</span>
            </button>

            {/* Blocked Pill */}
            <button
              onClick={() => {
                setStatusFilter("BLOCKED");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                statusFilter === "BLOCKED"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-100"
              }`}
            >
              <Ban className="w-3 h-3" />
              <span>ব্লককৃত ({toBengaliNumber(blockedDonorsCount)})</span>
            </button>
          </div>

          <span className="text-xs text-[var(--foreground-muted)] shrink-0">
            পৃষ্ঠা {toBengaliNumber(pagination.page)} এর {toBengaliNumber(pagination.totalPage || 1)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--background-alt)] text-[var(--foreground-muted)]">
              <tr>
                <th className="p-4 font-semibold">ডোনারের নাম ও যোগাযোগ</th>
                <th className="p-4 font-semibold">গ্রুপ</th>
                <th className="p-4 font-semibold">ঠিকানা</th>
                <th className="p-4 font-semibold">সর্বশেষ রক্তদান</th>
                <th className="p-4 font-semibold">স্ট্যাটাস</th>
                <th className="p-4 font-semibold">ব্লক অবস্থা</th>
                <th className="p-4 font-semibold text-right">প্রশাসনিক অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[var(--foreground-muted)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[var(--color-primary)] mb-2" />
                    ডোনার ডাটাবেজ লোড হচ্ছে...
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[var(--foreground-muted)]">
                    {statusFilter === "PENDING"
                      ? "বর্তমানে কোনো রক্তদাতা অনুমোদনের অপেক্ষায় নেই।"
                      : "কোনো রক্তদাতা পাওয়া যায়নি।"}
                  </td>
                </tr>
              ) : (
                donors.map((donor) => {
                  const isRare = donor.bloodGroupDetails?.isRare || false;
                  return (
                    <tr
                      key={donor.id}
                      className={`transition-colors ${
                        donor.status === "PENDING"
                          ? "bg-amber-50/20 dark:bg-amber-950/10 hover:bg-amber-50/40"
                          : "hover:bg-[var(--background-alt)]/50"
                      }`}
                    >
                      {/* Name & Phone */}
                      <td className="p-4 font-semibold text-[var(--foreground)]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--border-color)] flex-shrink-0 bg-[var(--background-alt)] flex items-center justify-center font-bold text-[var(--color-primary)]">
                            <Image
                              src={
                                donor.profileImage || (donor as any).avatarUrl
                                  ? getAssetUrl(donor.profileImage || (donor as any).avatarUrl)
                                  : "/images/donors/default.jpg"
                              }
                              alt={donor.name}
                              fill
                              sizes="36px"
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span>{donor.name}</span>
                              {isRare && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                  বিরল গ্রুপ
                                </span>
                              )}
                              {donor.status === "PENDING" && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-bold">
                                  অপেক্ষমাণ
                                </span>
                              )}
                            </div>
                            <span className="block text-[10px] text-[var(--foreground-subtle)] font-mono" dir="ltr">
                              ID: {donor.id.slice(-6)} • {donor.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold">
                          {donor.bloodGroupDetails?.symbol || donor.bloodGroup}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="p-4 text-[var(--foreground-muted)] max-w-xs truncate">
                        {donor.currentAddress || "তথ্য নেই"}
                      </td>

                      {/* Last Donation */}
                      <td className="p-4 text-[var(--foreground-muted)]">
                        {donor.lastDonationDate
                          ? formatBengaliDate(donor.lastDonationDate)
                          : "রেকর্ড নেই"}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            donor.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : donor.status === "PENDING"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          }`}
                        >
                          ● {donor.status === "APPROVED" ? "অনুমোদিত" : donor.status === "PENDING" ? "অপেক্ষমাণ" : "বাতিল"}
                        </span>
                      </td>

                      {/* Blocked state */}
                      <td className="p-4">
                        {donor.isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                            <Ban className="w-3 h-3" />
                            <span>ব্লককৃত</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>সক্রিয়</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button if PENDING (Highlighted) */}
                          {donor.status === "PENDING" && (
                            <button
                              onClick={() => handleApprove(donor.id, donor.name)}
                              disabled={isApproving}
                              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1"
                              title="অনুমোদন করুন"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>অনুমোদন</span>
                            </button>
                          )}

                          {/* Reject Button if PENDING */}
                          {donor.status === "PENDING" && (
                            <button
                              onClick={() => handleReject(donor.id, donor.name)}
                              disabled={isRejecting}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="নিবন্ধন বাতিল করুন"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {/* Details Modal Trigger */}
                          <button
                            onClick={() => setSelectedDonor(donor)}
                            className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] cursor-pointer"
                            title="পূর্ণ বিবরণ দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Direct Call */}
                          <a
                            href={`tel:${donor.phone}`}
                            className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 cursor-pointer"
                            title="কল করুন"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>

                          {/* Block / Unblock Toggle for APPROVED donors */}
                          {donor.status === "APPROVED" && (
                            donor.isBlocked ? (
                              <button
                                onClick={() => handleUnblock(donor.id, donor.name)}
                                disabled={isUnblocking}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 cursor-pointer disabled:opacity-50"
                                title="আনব্লক করুন"
                              >
                                আনব্লক
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlock(donor.id, donor.name)}
                                disabled={isBlocking}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                                title="ব্লক করুন"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )
                          )}

                          {/* Delete Donor Action */}
                          <button
                            onClick={() => setDonorToDelete(donor)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer transition-colors"
                            title="অ্যাকাউন্ট মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPage > 1 && (
          <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-xs text-[var(--foreground-muted)]">
              মোট {toBengaliNumber(pagination.total)} জন ডোনার
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[var(--border-color)] text-xs text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-2">
                {toBengaliNumber(currentPage)} / {toBengaliNumber(pagination.totalPage)}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPage, p + 1))}
                disabled={currentPage >= pagination.totalPage}
                className="p-1.5 rounded-lg border border-[var(--border-color)] text-xs text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Donor Full Details Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedDonor(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-subtle)]">
              <div className="relative">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--color-primary)] bg-[var(--background-alt)]">
                  <Image
                    src={
                      selectedDonor.profileImage || (selectedDonor as any).avatarUrl
                        ? getAssetUrl(selectedDonor.profileImage || (selectedDonor as any).avatarUrl)
                        : "/images/donors/default.jpg"
                    }
                    alt={selectedDonor.name}
                    fill
                    sizes="56px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 min-w-[24px] h-[24px] px-1 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-black flex items-center justify-center border-2 border-[var(--card-bg)] shadow-xs">
                  {selectedDonor.bloodGroupDetails?.symbol || selectedDonor.bloodGroup}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">{selectedDonor.name}</h3>
                <span className="text-xs text-[var(--foreground-muted)] font-mono" dir="ltr">
                  আইডি: {selectedDonor.id} • ফোন: {selectedDonor.phone}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--background-alt)]">
                <span className="text-[var(--foreground-muted)] block">বর্তমান ঠিকানা</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {selectedDonor.currentAddress || "তথ্য নেই"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--background-alt)]">
                <span className="text-[var(--foreground-muted)] block">স্থায়ী ঠিকানা</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {selectedDonor.permanentAddress || "তথ্য নেই"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--background-alt)]">
                <span className="text-[var(--foreground-muted)] block">ইমেইল</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {selectedDonor.email || "সংযুক্ত নেই"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--background-alt)]">
                <span className="text-[var(--foreground-muted)] block">নিবন্ধনের তারিখ</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {formatBengaliDate(selectedDonor.createdAt)}
                </span>
              </div>
            </div>

            {/* Quick Actions inside modal */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              {selectedDonor.status === "PENDING" && (
                <button
                  onClick={() => handleApprove(selectedDonor.id, selectedDonor.name)}
                  disabled={isApproving}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                >
                  অনুমোদন দিন
                </button>
              )}
              {selectedDonor.isBlocked ? (
                <button
                  onClick={() => handleUnblock(selectedDonor.id, selectedDonor.name)}
                  disabled={isUnblocking}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 cursor-pointer"
                >
                  আনব্লক করুন
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(selectedDonor.id, selectedDonor.name)}
                  disabled={isBlocking}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 cursor-pointer"
                >
                  অ্যাকাউন্ট স্থগিত (Block)
                </button>
              )}
              <button
                onClick={() => setDonorToDelete(selectedDonor)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>অ্যাকাউন্ট মুছুন</span>
              </button>
              <a
                href={`tel:${selectedDonor.phone}`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>সরাসরি কল দিন</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {donorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-[var(--foreground)]">
                রক্তদাতার অ্যাকাউন্ট মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                আপনি কি নিশ্চিত যে <strong className="text-[var(--foreground)] font-semibold">{donorToDelete.name}</strong> ({donorToDelete.bloodGroup}) এর ডোনার অ্যাকাউন্টটি মুছে ফেলতে চান? এটি মুছে ফেললে ডাটাবেজ থেকে এই ডোনারের সকল রক্তদানের হিস্ট্রি ও প্রোফাইল স্থায়ীভাবে মুছে যাবে।
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDonorToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>হ্যাঁ, মুছে ফেলুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
