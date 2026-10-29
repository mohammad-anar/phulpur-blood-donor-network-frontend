"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Building2,
  MapPin,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Clock,
  CheckSquare,
  AlertTriangle,
  AlertCircle,
  X,
  Lock,
  History as HistoryIcon,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { DonorTab } from "../DonorSidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/useAuth";
import { useToast } from "@/components/common/Toast";
import {
  useCreateDonationMutation,
  useGetMyDonationsQuery,
} from "@/lib/store/api/bloodDonationApi";
import { formatBengaliDate, toBengaliNumber } from "@/lib/utils/donorCountdown";

interface DonorNewRecordTabProps {
  onNavigateTab?: (tab: DonorTab) => void;
}

export function DonorNewRecordTab({ onNavigateTab }: DonorNewRecordTabProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigate = (tab: DonorTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      router.push(tab === "dashboard" ? "/donor" : `/donor/${tab}`);
    }
  };
  const { success, error } = useToast();
  const [createDonation, { isLoading: isSubmitting }] = useCreateDonationMutation();
  const { data: myDonationsData, isLoading: isLoadingDonations } = useGetMyDonationsQuery();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [todayStr, setTodayStr] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [clientNowMs, setClientNowMs] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTodayStr(today);
    setDate((prev) => prev || today);
    setClientNowMs(Date.now());
  }, []);

  const [hospital, setHospital] = useState("ফুলপুর উপজেলা স্বাস্থ্য কমপ্লেক্স");
  const [district, setDistrict] = useState("ময়মনসিংহ");
  const [upazila, setUpazila] = useState("ফুলপুর");
  const [caseNote, setCaseNote] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmedOath, setConfirmedOath] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const donorBloodGroup = user?.bloodGroup || "O+";
  const donorIdShort = user?.id ? user.id.slice(-4).toUpperCase() : "8842";

  // Calculate 120-day cooldown status based on previous donations
  const submissionCooldown = myDonationsData?.submissionCooldown;
  const activeDonations = (myDonationsData?.donations || []).filter(
    (d) => d.statusType !== "rejected"
  );
  const latestDonation = [...activeDonations].sort(
    (a, b) => new Date(b.isoDate || b.date).getTime() - new Date(a.isoDate || a.date).getTime()
  )[0];

  const lastDonationDateStr =
    submissionCooldown?.lastDonationDate ||
    latestDonation?.isoDate ||
    myDonationsData?.countdown?.lastDonationDate;

  const lastDonationDateObj = lastDonationDateStr ? new Date(lastDonationDateStr) : null;

  let isCoolingDown = false;
  let daysRemaining = 0;
  let daysSinceLast = 0;

  if (clientNowMs && lastDonationDateObj && !isNaN(lastDonationDateObj.getTime())) {
    const msSince = clientNowMs - lastDonationDateObj.getTime();
    daysSinceLast = Math.max(0, Math.floor(msSince / (1000 * 60 * 60 * 24)));
    if (daysSinceLast < 120) {
      isCoolingDown = true;
      daysRemaining = 120 - daysSinceLast;
    }
  } else if (submissionCooldown && !submissionCooldown.canSubmitNewRecord) {
    isCoolingDown = true;
    daysRemaining = submissionCooldown.daysRemaining;
  }

  const nextEligibleDateObj = lastDonationDateObj
    ? new Date(lastDonationDateObj.getTime() + 120 * 24 * 60 * 60 * 1000)
    : null;
  const nextEligibleDateStr = nextEligibleDateObj
    ? nextEligibleDateObj.toISOString().split("T")[0]
    : undefined;

  const latestRecordStatus =
    latestDonation?.status ||
    (submissionCooldown?.lastStatus === "PENDING"
      ? "যাচাই প্রক্রিয়াধীন"
      : submissionCooldown?.lastStatus === "APPROVED"
      ? "অনুমোদিত"
      : "রেকর্ড সংরক্ষিত");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error("ফাইলের সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 120-day interval safeguard
    if (isCoolingDown) {
      const msg = `পূর্ববর্তী রক্তদানের ১২০ দিন পূর্ণ হওয়ার পূর্বে নতুন রেকর্ড জমা দেওয়া সম্ভব নয়। আরও ${toBengaliNumber(daysRemaining)} দিন বাকি আছে।`;
      setErrorMessage(msg);
      error(msg, "অনুরোধ বাতিল");
      return;
    }

    if (!confirmedOath) {
      error("অনুগ্রহ করে শপথ বক্সে টিক চিহ্ন প্রদান করুন");
      return;
    }

    const selectedDate = new Date(date);
    const now = new Date();
    if (selectedDate.getTime() > now.getTime()) {
      const msg = "ভবিষ্যতের রক্তদানের তারিখ গ্রহণযোগ্য নয়";
      setErrorMessage(msg);
      error(msg);
      return;
    }

    // Verify date is at least 120 days after previous donation
    if (lastDonationDateObj && !isNaN(lastDonationDateObj.getTime())) {
      const diffMs = selectedDate.getTime() - lastDonationDateObj.getTime();
      const daysDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (daysDiff < 120) {
        const msg = `নতুন রক্তদানের তারিখটি পূর্ববর্তী রক্তদানের (${formatBengaliDate(lastDonationDateObj)}) কমপক্ষে ১২০ দিন পরের হতে হবে।`;
        setErrorMessage(msg);
        error(msg, "তারিখ সঠিক নয়");
        return;
      }
    }

    const fullAddress = `${hospital}, ${upazila}, ${district}`;

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("donationDate", date);
        formData.append("donationAddress", fullAddress);
        if (caseNote.trim()) formData.append("rugirDhoron", caseNote.trim());
        if (voucherNumber.trim()) formData.append("donationSlipNumber", voucherNumber.trim());
        formData.append("slip", selectedFile);

        await createDonation(formData).unwrap();
      } else {
        await createDonation({
          donationDate: date,
          donationAddress: fullAddress,
          rugirDhoron: caseNote.trim() || undefined,
          donationSlipNumber: voucherNumber.trim() || undefined,
        }).unwrap();
      }

      setSubmitted(true);
      success("রক্তদানের তথ্য সফলভাবে জমা দেওয়া হয়েছে!", "রেকর্ড সংরক্ষিত");
      setTimeout(() => {
        handleNavigate("history");
      }, 1800);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "রেকর্ড জমা দিতে সমস্যা হয়েছে।";
      setErrorMessage(msg);
      error(msg, "ব্যর্থ");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)]">
            ডোনার সার্ভিসেস ও রেকর্ড ম্যানেজমেন্ট
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-0.5">
            নতুন রক্তদানের রেকর্ড অন্তর্ভুক্তি
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            আপনার সাম্প্রতিক রক্তদানের সঠিক তথ্য প্রদান করুন। অ্যাডমিন কর্তৃক যাচাইয়ের পর আপনার প্রোফাইল ও রক্তদানের ইতিহাসে এটি যুক্ত হবে।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isCoolingDown ? (
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>বিরতি বাকি: {toBengaliNumber(daysRemaining)} দিন</span>
            </div>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>নিবন্ধন স্থিতি: সক্রিয় রক্তদাতা #{donorIdShort}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Guidance Alert */}
      {isCoolingDown ? (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-amber-500 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-200">
              ১২০ দিনের কাউন্টডাউন বিরতি কার্যকর:
            </span>
            <p className="text-amber-800/90 dark:text-amber-300/80 mt-0.5 leading-relaxed">
              আপনার পূর্ববর্তী রক্তদানের তারিখের পর ১২০ দিন পূর্ণ হতে আর{" "}
              <strong className="underline">{toBengaliNumber(daysRemaining)} দিন</strong> বাকি আছে।
              চিকিৎসাবিজ্ঞান ও স্বাস্থ্যবিধি অনুযায়ী নির্ধারিত ১২০ দিন অতিক্রান্ত হওয়ার পূর্বে নতুন কোনো রক্তদানের তথ্য জমা নেওয়া সম্ভব নয়।
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border-l-4 border-[var(--color-primary)] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-[var(--color-primary)]">গুরুত্বপূর্ণ নির্দেশনা:</span>
            <p className="text-[var(--foreground-muted)] mt-0.5 leading-relaxed">
              নিয়মিত ও নিরাপদ রক্তদানের সঠিক হিসাব সংরক্ষণে সহায়তা করুন। প্রতিটি রেকর্ড ফুলপুর নেটওয়ার্ক
              অ্যাডমিন ও সংশ্লিষ্ট স্বাস্থ্য কমপ্লেক্স টিমের সমন্বয়ে যাচাই করা হয়।
            </p>
          </div>
        </div>
      )}

      {/* 3. Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form / Locked Screen */}
        <div className="lg:col-span-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-7 shadow-xs">
          {isLoadingDonations ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
              <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                ডোনারের পূর্ববর্তী রেকর্ড ও কাউন্টডাউন তথ্য যাচাই করা হচ্ছে...
              </span>
            </div>
          ) : submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                রেকর্ড সফলভাবে জমা দেওয়া হয়েছে!
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
                আপনার রক্তদানের তথ্যটি অ্যাডমিন প্যানেলে যাচাইয়ের জন্য পাঠানো হয়েছে। যাচাই সম্পন্ন হলে
                আপনার রক্তদানের ইতিহাসে স্বয়ংক্রিয়ভাবে আপডেট হবে।
              </p>
            </div>
          ) : isCoolingDown ? (
            /* Locked 120-day interval card */
            <div className="py-6 space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    রক্তদানের ১২০ দিনের বিরতি চলমান (ফরম সাবমিশন বন্ধ)
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                    রক্তদাতার শারীরিক নিরাপত্তা ও চিকিৎসা নীতিমালার অংশ হিসেবে পূর্ববর্তী রক্তদানের ১২০ দিন অতিবাহিত না হওয়া পর্যন্ত নতুন রক্তদানের তথ্য জমা নেওয়া সাময়িকভাবে স্থগিত রাখা হয়েছে।
                  </p>
                </div>
              </div>

              {/* Countdown Highlight Card */}
              <div className="rounded-2xl border border-[var(--color-primary-border)] bg-gradient-to-br from-rose-50/60 via-[var(--card-bg)] to-amber-50/40 dark:from-rose-950/20 dark:via-[var(--card-bg)] dark:to-amber-950/10 p-6 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold shadow-xs">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>কাউন্টডাউন বিরতি চলছে</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--foreground-muted)] block">
                    পরবর্তী সম্ভাব্য রক্তদান ও নতুন রেকর্ড জমা দেওয়ার জন্য বাকি
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-[var(--color-primary)] tracking-tight">
                    {toBengaliNumber(daysRemaining)}{" "}
                    <span className="text-2xl font-bold text-[var(--foreground)]">দিন</span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg mx-auto text-left">
                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)] block">
                      পূর্ববর্তী রক্তদানের তারিখ
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                      {lastDonationDateObj ? formatBengaliDate(lastDonationDateObj) : "—"}
                    </span>
                    <span className="text-[10px] inline-block px-2 py-0.5 rounded-md bg-[var(--background-alt)] text-[var(--foreground-muted)] font-medium">
                      রেকর্ড স্থিতি: {latestRecordStatus}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)] block">
                      পরবর্তী অনুমোদিত তারিখ
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {nextEligibleDateObj ? formatBengaliDate(nextEligibleDateObj) : "১২০ দিন পর"}
                    </span>
                    <span className="text-[10px] inline-block px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">
                      ১২০ দিন পূর্ণ হলে ফরম আনলক হবে
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Notice */}
              <div className="p-4 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs text-[var(--foreground-muted)] leading-relaxed space-y-1">
                <span className="font-bold text-[var(--foreground)] block">
                  কেন এই ১২০ দিনের বিরতি প্রয়োজন?
                </span>
                <p>
                  চিকিৎসাবিজ্ঞান অনুযায়ী এক ব্যাগ (৪৫০ মিলি) রক্তদানের পর শরীরের লোহিত রক্তকণিকা ও প্রয়োজনীয় আয়রনের ঘাটতি পূরণ হতে পূর্ণ ১২০ দিন বা ৪ মাস সময়ের প্রয়োজন। ডোনারদের স্বাস্থ্য সুরক্ষায় এই সময়ের পূর্বে পুনরায় রক্তদান করা সম্পূর্ণ অনুচিত।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigate("dashboard")}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
                >
                  ড্যাশবোর্ডে ফিরে যান
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("history")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <HistoryIcon className="w-4 h-4" />
                  <span>রক্তদানের ইতিহাস দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h2 className="text-base font-bold text-[var(--foreground)]">
                  রক্তদানের বিবরণ ফরম
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
                  গ্রুপ: {donorBloodGroup}
                </span>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  রক্তদানের তারিখ *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    max={todayStr}
                    min={nextEligibleDateStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-[var(--foreground-subtle)] mt-1 block">
                  {lastDonationDateObj
                    ? `পূর্ববর্তী রক্তদান (${formatBengaliDate(lastDonationDateObj)}) এর কমপক্ষে ১২০ দিন পরের তারিখ নির্বাচন করুন।`
                    : "সর্বশেষ রক্তদানের তারিখ অনুযায়ী পরবর্তী ১২০ দিনের কাউন্টডাউন নির্ধারিত হবে।"}
                </span>
              </div>

              {/* Hospital */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  হাসপাতাল বা রক্তদান কেন্দ্রের নাম *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none cursor-pointer"
                  >
                    <option value="ফুলপুর উপজেলা স্বাস্থ্য কমপ্লেক্স">
                      ফুলপুর উপজেলা স্বাস্থ্য কমপ্লেক্স (Upazila Health Complex)
                    </option>
                    <option value="ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH)">
                      ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH)
                    </option>
                    <option value="ফুলপুর পপুলার ডায়াগনস্টিক ক্লিনিক">
                      ফুলপুর পপুলার ডায়াগনস্টিক ক্লিনিক
                    </option>
                    <option value="তারাকান্দা উপজেলা স্বাস্থ্য কমপ্লেক্স">
                      তারাকান্দা উপজেলা স্বাস্থ্য কমপ্লেক্স
                    </option>
                    <option value="হালুয়াঘাট স্বাস্থ্য কমপ্লেক্স">
                      হালুয়াঘাট স্বাস্থ্য কমপ্লেক্স
                    </option>
                    <option value="অন্যান্য ক্লিনিক বা হাসপাতাল">অন্যান্য ক্লিনিক বা হাসপাতাল</option>
                  </select>
                </div>
              </div>

              {/* District & Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    জেলা *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    উপজেলা / জোন *
                  </label>
                  <input
                    type="text"
                    required
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Case Note */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  রোগীর ধরন / কেস নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: জরুরি সিজারিয়ান অপারেশন রোগী / থ্যালাসেমিয়া"
                  value={caseNote}
                  onChange={(e) => setCaseNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>

              {/* Voucher Details */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  অতিরিক্ত তথ্য বা স্লিপ নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রক্তদান ভাউচার নং FP-2026/094 / ওয়ার্ড নম্বর"
                  value={voucherNumber}
                  onChange={(e) => setVoucherNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  হাসপাতাল স্লিপ বা সনদের ছবি আপলোড (ঐচ্ছিক)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--color-primary)] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[var(--background-alt)]/50"
                >
                  <UploadCloud className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                  <span className="text-xs font-semibold text-[var(--foreground)] block">
                    রক্তদান সনদপত্র বা হাসপাতালের স্লিপ সংযুক্ত করতে ক্লিক করুন
                  </span>
                  <span className="text-[11px] text-[var(--foreground-muted)] block mt-1">
                    JPG, PNG বা WEBP ফরম্যাট (সর্বোচ্চ ৫ মেগাবাইট)
                  </span>

                  {selectedFile ? (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[11px] font-medium text-[var(--foreground)]">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="p-0.5 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Oath Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={confirmedOath}
                  onChange={(e) => setConfirmedOath(e.target.checked)}
                  className="mt-0.5 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  আমি শপথপূর্বক নিশ্চিত করছি যে প্রদত্ত তথ্য সত্য এবং আমি ব্যক্তিগতভাবে এই রক্তদান সম্পন্ন করেছি।
                  কোনো ভুল বা অসত্য তথ্য প্রদান করলে রক্তদাতা নেটওয়ার্কের আইডি সাময়িকভাবে স্থগিত হতে পারে।
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => handleNavigate("dashboard")}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>রেকর্ড জমা দিন ও নিশ্চিতকরণ</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Help Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <HelpCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold">রেকর্ড অন্তর্ভুক্তির নিয়মাবলী</h3>
            </div>
            <ul className="text-xs text-[var(--foreground-muted)] space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>রক্তদানের তারিখ সঠিক দিন। অতীতের তারিখ অনুযায়ী কাউন্টডাউন কাজ করবে।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>হাসপাতালের স্লিপ নম্বর বা চিকিৎসকের প্রত্যয়নপত্র যুক্ত করলে দ্রুত অনুমোদন পাওয়া যায়।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>অ্যাডমিন কর্তৃক যাচাই হওয়ার পর রেকর্ডটি আপনার প্রোফাইলে স্থায়ীভাবে সংরক্ষিত হবে।</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-[var(--color-primary-border)] space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)]">
              সাহায্য প্রয়োজন?
            </span>
            <p className="text-xs text-[var(--foreground-muted)]">
              তথ্য সংযোজন সংক্রান্ত যেকোনো জটিলতায় ফুলপুর ব্লাড ডোনার টিমের সাথে যোগাযোগ করুন।
            </p>
            <a
              href="tel:01711000001"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] pt-1 hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>হেল্পলাইন: ০১৭১১-০০০০০১</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
