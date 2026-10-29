"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileText,
  PlusCircle,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Building2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Printer,
  X,
  Award,
} from "lucide-react";
import { DonorTab } from "../DonorSidebar";
import { defaultDonorDonations, DonationRecord } from "@/lib/data/donorDonations";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/useAuth";
import { useGetMyDonationsQuery } from "@/lib/store/api/bloodDonationApi";
import {
  useDonorCountdown,
  toBengaliNumber,
  formatBengaliDate,
} from "@/lib/utils/donorCountdown";

interface DonorHistoryTabProps {
  onNavigateTab?: (tab: DonorTab) => void;
  donations?: DonationRecord[];
}

export function DonorHistoryTab({
  onNavigateTab,
}: DonorHistoryTabProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: myDonationsData } = useGetMyDonationsQuery();

  const handleNavigate = (tab: DonorTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      router.push(tab === "dashboard" ? "/donor" : `/donor/${tab}`);
    }
  };

  const donorName = user?.name || "রক্তদাতা";
  const donorBloodGroup = user?.bloodGroup || "";

  const allDonations: DonationRecord[] = myDonationsData?.donations || [];

  const countdown = useDonorCountdown(allDonations);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Certificate Modal State
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certificateRecord, setCertificateRecord] = useState<DonationRecord | null>(null);
  const [certificateIssueDate, setCertificateIssueDate] = useState<string>("");

  const approvedCount =
    myDonationsData?.summary?.approvedDonations ??
    allDonations.filter((d) => d.statusType === "approved").length;

  const filteredDonations = allDonations.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.hospital.toLowerCase().includes(q) ||
      item.caseNote.toLowerCase().includes(q) ||
      (item.date && item.date.toLowerCase().includes(q));

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "approved" && item.statusType === "approved") ||
      (selectedStatus === "pending" && item.statusType === "pending");

    return matchesSearch && matchesStatus;
  });

  const handleOpenCertificate = (record?: DonationRecord) => {
    setCertificateRecord(record || null);
    setCertificateIssueDate(formatBengaliDate(new Date()));
    setIsCertificateOpen(true);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            আমার রক্তদানের ইতিহাস ও পরবর্তী সময়
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            আপনার পূর্ববর্তী সকল রক্তদানের ভেরিফায়েড রেকর্ড ও পরবর্তী রক্তদানের আনুমানিক সময়সূচি।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenCertificate()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[var(--color-primary)]" />
            <span>সার্টিফিকেট ডাউনলোড (PDF)</span>
          </button>

          <button
            onClick={() => handleNavigate("new-record")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ নতুন রক্তদানের রেকর্ড যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary: Countdown Card + Lifetime Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Countdown */}
        <div className="lg:col-span-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--color-primary)]">
              পরবর্তী সম্ভাব্য রক্তদানের কাউন্টডাউন
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">
              ১২০ দিনের সুস্থতা সাইকেল
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-4">
            <div className="sm:col-span-7 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)]">
                  {countdown.status === "passed"
                    ? "নির্ধারিত সময় পূর্ণ"
                    : countdown.status === "running"
                    ? `${toBengaliNumber(countdown.days)} দিন বাকি`
                    : "রেকর্ড প্রয়োজন"}
                </span>
                {countdown.daysAgo !== null && (
                  <span className="text-xs text-[var(--foreground-muted)]">
                    ({toBengaliNumber(countdown.daysAgo)} দিন অতিক্রান্ত)
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                {countdown.status === "passed"
                  ? "আপনার পূর্ববর্তী রক্তদানের ১২০ দিনের বিরতি পূর্ণ হয়েছে। আপনি শারীরিক সুস্থতা সাপেক্ষে পুনরায় রক্তদান করতে প্রস্তুত।"
                  : countdown.status === "running"
                  ? "আপনার শরীর স্বাভাবিক লোহিত রক্তকণিকা পুনর্গঠন সম্পন্ন করছে। নির্ধারিত তারিখের পর আপনি সম্পূর্ণ প্রস্তুত থাকবেন।"
                  : "আপনার সাম্প্রতিক অনুমোদিত রক্তদানের তথ্য অনুযায়ী সময় নির্ধারণ করা হবে।"}
              </p>
            </div>

            <div className="sm:col-span-5 flex justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-stone-200 dark:text-stone-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={
                      countdown.status === "passed"
                        ? 0
                        : countdown.daysAgo !== null
                        ? Math.max(0, 251.2 - (251.2 * Math.min(120, countdown.daysAgo)) / 120)
                        : 200
                    }
                    strokeLinecap="round"
                    className="text-[var(--color-primary)] transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg font-bold text-[var(--color-primary)]">
                    {countdown.status === "passed"
                      ? "১০০%"
                      : countdown.daysAgo !== null
                      ? `${toBengaliNumber(Math.min(100, Math.round((countdown.daysAgo / 120) * 100)))}%`
                      : "০%"}
                  </span>
                  <span className="text-[9px] text-[var(--foreground-muted)]">সাইকেল অবস্থা</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <div className="p-3 rounded-xl bg-[var(--background-alt)]">
              <span className="text-[11px] text-[var(--foreground-muted)] block">সর্বশেষ রক্তদানের তারিখ</span>
              <span className="text-xs font-bold text-[var(--foreground)]">
                {countdown.latestApprovedDate ? formatBengaliDate(countdown.latestApprovedDate) : "তথ্য নেই"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--color-primary-light)]">
              <span className="text-[11px] text-[var(--color-primary)] block">পরবর্তী সম্ভাব্য দানের তারিখ</span>
              <span className="text-xs font-bold text-[var(--color-primary)]">
                {countdown.targetDate ? formatBengaliDate(countdown.targetDate) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Lifetime Stats */}
        <div className="lg:col-span-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--foreground)]">আজীবন অবদান সংক্ষিপ্তি</h3>
            <Heart className="w-4 h-4 text-[var(--color-primary)] fill-current" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--background-alt)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)]">মোট রক্তদান</span>
              <p className="text-2xl font-extrabold text-[var(--color-primary)]">
                {toBengaliNumber(String(approvedCount).padStart(2, "0"))} বার
              </p>
              <span className="text-[10px] text-[var(--foreground-subtle)]">
                {toBengaliNumber(approvedCount)} ব্যাগ রক্তদান
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--background-alt)] text-center">
              <span className="text-[11px] text-[var(--foreground-muted)]">সুরক্ষিত জীবন</span>
              <p className="text-2xl font-extrabold text-emerald-600">
                {toBengaliNumber(approvedCount * 3)}+ জন
              </p>
              <span className="text-[10px] text-[var(--foreground-subtle)]">জরুরি ট্রান্সফিউশন</span>
            </div>
          </div>

          {/* Status Guide */}
          <div className="p-3 rounded-xl bg-[var(--background-alt)] text-[11px] space-y-2">
            <span className="font-bold text-[var(--foreground)] block">রেকর্ড যাচাই স্ট্যাটাস নির্দেশিকা:</span>
            <div className="flex items-center justify-between text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>অনুমোদিত (Approved)</span>
              </span>
              <span>অফিসিয়াল সিলযুক্ত</span>
            </div>
            <div className="flex items-center justify-between text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1.5 text-amber-700">
                <Clock className="w-3.5 h-3.5" />
                <span>যাচাই অপেক্ষমাণ</span>
              </span>
              <span>প্রক্রিয়াধীন</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="হাসপাতাল, রোগী বা কেস নোট খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--foreground)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none cursor-pointer"
          >
            <option value="all">সব অবস্থা</option>
            <option value="approved">অনুমোদিত</option>
            <option value="pending">যাচাই অপেক্ষমাণ</option>
          </select>
        </div>
      </div>

      {/* 4. History Data Table */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--foreground)]">
            আমার রক্তদানের ইতিহাস ({toBengaliNumber(filteredDonations.length)}টি এন্ট্রি)
          </h3>
          <span className="text-xs text-[var(--foreground-muted)]">
            অনুমোদিত: {toBengaliNumber(approvedCount)}টি
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--background-alt)] text-[var(--foreground-muted)]">
              <tr>
                <th className="p-4 font-semibold">ক্রম ও তারিখ</th>
                <th className="p-4 font-semibold">হাসপাতাল বা রক্তদান কেন্দ্র</th>
                <th className="p-4 font-semibold">এলাকা</th>
                <th className="p-4 font-semibold">রোগীর ধরন / কেস নোট</th>
                <th className="p-4 font-semibold">পরিমাণ</th>
                <th className="p-4 font-semibold">যাচাইয়ের অবস্থা</th>
                <th className="p-4 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredDonations.length > 0 ? (
                filteredDonations.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[var(--background-alt)]/50 transition-colors">
                    <td className="p-4 font-semibold text-[var(--foreground)]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-bold text-[10px]">
                          {toBengaliNumber(String(idx + 1).padStart(2, "0"))}
                        </span>
                        <div>
                          <span>{item.date}</span>
                          <span className="block text-[10px] text-[var(--foreground-subtle)] font-normal">
                            {item.time || "সকাল ১০:০০ মি."}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[var(--foreground)]">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                        <span>{item.hospital}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--foreground-muted)]">{item.area || "ফুলপুর"}</td>
                    <td className="p-4 text-[var(--foreground-muted)] max-w-xs">{item.caseNote}</td>
                    <td className="p-4 font-bold text-[var(--color-primary)]">{item.quantity || "১ ব্যাগ"}</td>
                    <td className="p-4">
                      {item.statusType === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{item.status}</span>
                        </span>
                      ) : item.statusType === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          <span>{item.status}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3" />
                          <span>{item.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenCertificate(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[var(--color-primary)] border border-[var(--color-primary-border)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>সনদপত্র</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-[var(--foreground-muted)]">
                    কোনো রক্তদানের তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Certificate Modal */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-4 border-rose-200 dark:border-rose-900 shadow-2xl space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setIsCertificateOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-rose-100 dark:border-rose-900 pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-[var(--color-primary)] mb-1">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-800 dark:text-rose-400">
                ফুলপুর ব্লাড ডোনার নেটওয়ার্ক
              </h2>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold block">
                স্বেচ্ছায় রক্তদান সম্মাননা ও স্বীকৃতি সনদপত্র
              </span>
            </div>

            {/* Certificate Content */}
            <div className="text-center space-y-4 py-2">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                কৃতজ্ঞতার সাথে স্বীকৃতি প্রদান করা হচ্ছে যে
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white underline decoration-rose-500 decoration-2 underline-offset-8">
                {donorName}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed pt-2">
                রক্তের গ্রুপ <span className="font-bold text-rose-700 dark:text-rose-400">{donorBloodGroup}</span>। তিনি ফুলপুর উপজেলা ও আশপাশের এলাকার মুমূর্ষু রোগীদের প্রয়োজনে নিয়মিত ও নিঃস্বার্থভাবে রক্তদান করে মানবসেবায় অনন্য অবদান রেখেছেন।
              </p>

              {certificateRecord ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-900 dark:text-rose-200 inline-block font-semibold">
                  নির্দিষ্ট রক্তদান: {certificateRecord.date} • {certificateRecord.hospital}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-900 dark:text-rose-200 inline-block font-semibold">
                  সর্বমোট অনুমোদিত রক্তদান: {toBengaliNumber(approvedCount)} বার • সম্ভাব্য রক্ষিত জীবন: {toBengaliNumber(approvedCount * 3)}+ জন
                </div>
              )}
            </div>

            {/* Signatures & Seal */}
            <div className="flex items-center justify-between pt-6 border-t border-rose-100 dark:border-rose-900 text-xs text-stone-500">
              <div className="text-center">
                <div className="w-24 h-0.5 bg-stone-400 mx-auto mb-1" />
                <span>সমন্বয়ক কমিটি</span>
                <span className="block text-[10px]">ফুলপুর ব্লাড নেটওয়ার্ক</span>
              </div>
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-rose-400 flex items-center justify-center text-[9px] font-bold text-rose-600 text-center uppercase rotate-12">
                ভেরিফায়েড সিল
              </div>
              <div className="text-center">
                <div className="w-24 h-0.5 bg-stone-400 mx-auto mb-1" />
                <span>ইস্যুর তারিখ</span>
                <span className="block text-[10px] font-semibold">{certificateIssueDate || "—"}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCertificateOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-md cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট / PDF সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
