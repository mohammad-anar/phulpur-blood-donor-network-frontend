"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  FileCheck2,
  Building2,
  ShieldCheck,
  Send,
  RefreshCw,
  Ban,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import {
  useGetAdminDonationsQuery,
  useApproveDonationMutation,
  useRejectDonationMutation,
  AdminDonationItem,
} from "@/lib/store/api/bloodDonationApi";
import { toBengaliNumber, formatBengaliDate } from "@/lib/utils/donorCountdown";
import { useToast } from "@/components/common/Toast";
import { getAssetUrl } from "@/lib/api/auth";

export function AdminVerificationTab() {
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "all">("PENDING");
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [previewSlipImage, setPreviewSlipImage] = useState<string | null>(null);

  const { success, error } = useToast();

  const {
    data: donationsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminDonationsQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    limit: 50,
  });

  const [approveDonation, { isLoading: isApproving }] = useApproveDonationMutation();
  const [rejectDonation, { isLoading: isRejecting }] = useRejectDonationMutation();

  const donations = donationsData?.data || [];
  const selectedItem: AdminDonationItem | undefined =
    donations.find((item) => item.id === selectedDonationId) || donations[0];

  const pendingCount = donations.filter((d) => d.status === "PENDING").length;
  const approvedCount = donations.filter((d) => d.status === "APPROVED").length;

  const handleApprove = async () => {
    if (!selectedItem) return;
    try {
      await approveDonation({
        id: selectedItem.id,
        adminNote: adminNote.trim() || undefined,
      }).unwrap();
      success(
        `${selectedItem.donor.name}-এর রক্তদানের রেকর্ড সফলভাবে অনুমোদিত হয়েছে! ডোনারের কাউন্টডাউন শুরু হয়েছে।`,
        "রেকর্ড অনুমোদিত"
      );
      setAdminNote("");
    } catch (err: any) {
      error(err?.data?.message || "অনুমোদন করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedItem) return;
    try {
      await rejectDonation({
        id: selectedItem.id,
        rejectionReason: rejectionReason.trim() || undefined,
      }).unwrap();
      success(
        `${selectedItem.donor.name}-এর রক্তদানের রেকর্ড প্রত্যাখ্যান করা হয়েছে।`,
        "রেকর্ড প্রত্যাখ্যাত"
      );
      setShowRejectModal(false);
      setRejectionReason("");
    } catch (err: any) {
      error(err?.data?.message || "প্রত্যাখ্যান করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)]">
            ভেরিফিকেশন মডিউল • নিরাপদ স্বাস্থ্য ব্যবস্থা
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-0.5">
            রক্তদানের রেকর্ড যাচাই
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            ডোনারদের জমাকৃত সাম্প্রতিক রক্তদানের আবেদন ও মেডিকেল রেকর্ড যাচাই করে অনুমোদন বা পর্যালোচনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--foreground-muted)] ${isFetching ? "animate-spin" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">যাচাই অপেক্ষমাণ</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {toBengaliNumber(pendingCount)} টি
          </p>
          <span className="text-[11px] text-amber-700 font-semibold block">
            জরুরি অনুমোদন সাপেক্ষ
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">অনুমোদিত রেকর্ড</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {toBengaliNumber(approvedCount)} টি
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            সক্রিয় ও বৈধকৃত রক্তদান
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">কাউন্টডাউন চক্র</span>
          <p className="text-2xl font-black text-[var(--foreground)] mt-1">১২০ দিন</p>
          <span className="text-[11px] text-[var(--foreground-subtle)] block">
            নিরাপদ রক্তদানের বিরতি
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">মেডিকেল যাচাই</span>
          <p className="text-2xl font-black text-[var(--color-primary)] mt-1">১০০%</p>
          <span className="text-[11px] text-[var(--foreground-subtle)] block">
            হাসপাতাল রসিদ সাপেক্ষে
          </span>
        </div>
      </div>

      {/* 3. Main Split View: Queue & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Submissions Queue Table */}
        <div className="lg:col-span-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === "PENDING"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
                }`}
              >
                অপেক্ষমাণ ({toBengaliNumber(pendingCount)})
              </button>
              <button
                onClick={() => setStatusFilter("APPROVED")}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === "APPROVED"
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
                }`}
              >
                অনুমোদিত ({toBengaliNumber(approvedCount)})
              </button>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === "all"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
                }`}
              >
                সব রেকর্ড ({toBengaliNumber(donations.length)})
              </button>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] text-xs max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-[var(--foreground-muted)]">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--color-primary)]" />
                রেকর্ড লোড হচ্ছে...
              </div>
            ) : donations.length === 0 ? (
              <div className="p-8 text-center text-[var(--foreground-muted)]">
                এই বিভাগে কোনো রক্তদানের রেকর্ড পাওয়া যায়নি।
              </div>
            ) : (
              donations.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDonationId(item.id)}
                    className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[var(--color-primary-light)]/60 border-l-4 border-[var(--color-primary)]"
                        : "hover:bg-[var(--background-alt)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {item.donor.bloodGroup}
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-[var(--foreground)] block truncate">
                          {item.donor.name}
                        </span>
                        <span className="text-[10px] text-[var(--foreground-subtle)] block truncate">
                          {item.donationAddress}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-semibold text-[var(--foreground)] block">
                        {formatBengaliDate(item.donationDate)}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-0.5 font-bold ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : item.status === "PENDING"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        {item.status === "APPROVED"
                          ? "অনুমোদিত"
                          : item.status === "PENDING"
                          ? "অপেক্ষমাণ"
                          : "প্রত্যাখ্যাত"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Inspection & Decision Panel */}
        <div className="lg:col-span-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <h3 className="text-base font-bold text-[var(--foreground)]">
              পরীক্ষা ও যাচাই প্যানেল
            </h3>
            {selectedItem && (
              <span className="text-xs font-mono text-[var(--foreground-muted)]">
                রেকর্ড আইডি: #{selectedItem.id.slice(-6)}
              </span>
            )}
          </div>

          {!selectedItem ? (
            <div className="p-8 text-center text-xs text-[var(--foreground-muted)]">
              যাচাই করতে বাঁয়ের তালিকা থেকে একটি আবেদন নির্বাচন করুন।
            </div>
          ) : (
            <>
              {/* Selected Donor Card */}
              <div className="p-4 rounded-xl bg-[var(--background-alt)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--color-primary-border)] bg-[var(--card-bg)] flex items-center justify-center font-bold text-[var(--color-primary)]">
                    <Image
                      src={
                        selectedItem.donor.profileImage
                          ? getAssetUrl(selectedItem.donor.profileImage)
                          : "/images/donors/default.jpg"
                      }
                      alt={selectedItem.donor.name}
                      fill
                      sizes="48px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">
                      {selectedItem.donor.name}
                    </h4>
                    <span className="text-xs text-[var(--foreground-muted)] block font-mono" dir="ltr">
                      {selectedItem.donor.phone} • {selectedItem.donor.currentAddress || "ফুলপুর"}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
                  {selectedItem.donor.bloodGroup}
                </span>
              </div>

              {/* Submission Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                  <span className="text-[var(--foreground-muted)]">রক্তদান কেন্দ্র ও হাসপাতাল</span>
                  <span className="font-semibold text-[var(--foreground)] text-right">
                    {selectedItem.donationAddress}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                  <span className="text-[var(--foreground-muted)]">রোগীর বিবরণ / বিভাগ</span>
                  <span className="font-semibold text-[var(--foreground)] text-right">
                    {selectedItem.rugirDhoron || "সাধারণ কেস"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                  <span className="text-[var(--foreground-muted)]">রক্তদানের তারিখ</span>
                  <span className="font-bold text-[var(--color-primary)]">
                    {formatBengaliDate(selectedItem.donationDate)}
                  </span>
                </div>
                {selectedItem.donationSlipNumber && (
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--foreground-muted)]">স্লিপ / রসিদ নম্বর</span>
                    <span className="font-mono text-[var(--foreground)]">
                      {selectedItem.donationSlipNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Uploaded Slip Inspection */}
              <div className="p-3.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] space-y-2">
                <span className="text-xs font-bold text-[var(--foreground)] block">
                  প্রমাণপত্র / হাসপাতালের রসিদ কপি:
                </span>
                {selectedItem.slipUrl ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-44 rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)]">
                      <Image
                        src={selectedItem.slipUrl}
                        alt="রক্তদান স্লিপ"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setPreviewSlipImage(selectedItem.slipUrl || null)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>বড় করে দেখুন</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[var(--card-bg)] text-xs text-[var(--foreground-muted)] text-center">
                    সরাসরি ছবি আপলোড করা হয়নি। স্লিপ নম্বর: {selectedItem.donationSlipNumber || "নেই"}
                  </div>
                )}
              </div>

              {/* Status Banner */}
              {selectedItem.status === "APPROVED" && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    এই রক্তদানের রেকর্ড ইতিমধ্যে অনুমোদিত হয়েছে।
                  </span>
                </div>
              )}

              {selectedItem.status === "REJECTED" && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-2">
                  <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold text-rose-800 dark:text-rose-300">
                    এই রক্তদানের রেকর্ড বাতিল করা হয়েছে।
                  </span>
                </div>
              )}

              {/* Action Section for PENDING */}
              {selectedItem.status === "PENDING" && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)]">
                      প্রশাসনিক সিদ্ধান্ত ও মন্তব্য (ঐচ্ছিক)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="যাচাই সংক্রান্ত কোনো নির্দেশনা বা নোট থাকলে লিখুন..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full p-2.5 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="col-span-2 py-2.5 px-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isApproving ? "অনুমোদন হচ্ছে..." : "রেকর্ড অনুমোদন করুন"}</span>
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="py-2.5 px-3 rounded-xl font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 dark:text-rose-300 transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>প্রত্যাখ্যান</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-rose-600">রক্তদানের রেকর্ড প্রত্যাখ্যান</h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              অনুগ্রহ করে রেকর্ডটি প্রত্যাখ্যান করার সুনির্দিষ্ট কারণ উল্লেখ করুন (যেমন: অস্পষ্ট স্লিপ বা ভুল তারিখ)।
            </p>
            <textarea
              rows={3}
              placeholder="প্রত্যাখ্যানের কারণ লিখুন..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-xs text-[var(--foreground)]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={isRejecting}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-50"
              >
                {isRejecting ? "বাতিল হচ্ছে..." : "প্রত্যাখ্যান নিশ্চিত করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewSlipImage && (
        <div
          onClick={() => setPreviewSlipImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl w-full h-[80vh] rounded-2xl overflow-hidden bg-black">
            <Image
              src={previewSlipImage}
              alt="স্লিপ প্রিভিউ"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
