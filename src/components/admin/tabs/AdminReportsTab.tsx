"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  FileText,
  FileCheck2,
  Download,
  Ban,
  UserX,
  MessageSquare,
  RefreshCw,
  Trash2,
  Mail,
  Check,
  Eye,
  ArrowRight,
} from "lucide-react";
import {
  useGetAdminReportsQuery,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
  AdminReportItem,
} from "@/lib/store/api/bloodDonationApi";
import { toBengaliNumber, formatBengaliDate } from "@/lib/utils/donorCountdown";
import { useToast } from "@/components/common/Toast";

export function AdminReportsTab() {
  const [statusFilter, setStatusFilter] = useState<"NEW" | "READ" | "RESOLVED" | "all">("all");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { success, error } = useToast();

  const {
    data: reportsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminReportsQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    limit: 50,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateReportStatusMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  const reports = reportsData?.data || [];
  const counts = reportsData?.pagination?.counts || { total: 0, new: 0, read: 0, resolved: 0 };

  const selectedReport: AdminReportItem | undefined =
    reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleStatusChange = async (id: string, newStatus: "NEW" | "READ" | "RESOLVED") => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      const statusLabel =
        newStatus === "RESOLVED" ? "নিষ্পত্তি করা হয়েছে" : newStatus === "READ" ? "পঠিত হিসেবে চিহ্নিত" : "নতুন হিসেবে চিহ্নিত";
      success(`বার্তার স্থিতি সফলভাবে ${statusLabel}!`, "আপডেট সম্পন্ন");
    } catch (err: any) {
      error(err?.data?.message || "স্থিতি পরিবর্তন করতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${name}"-এর এই রিপোর্ট বা বার্তাটি মুছে ফেলতে চান?`)) return;
    try {
      await deleteReport(id).unwrap();
      success("রিপোর্টটি স্থায়ীভাবে মুছে ফেলা হয়েছে।", "মুছে ফেলা হয়েছে");
      if (selectedReportId === id) {
        setSelectedReportId(null);
      }
    } catch (err: any) {
      error(err?.data?.message || "মুছে ফেলতে ব্যর্থ হয়েছে।", "ত্রুটি");
    }
  };

  const exportReportsCSV = () => {
    if (reports.length === 0) {
      error("কোনো রিপোর্ট পাওয়া যায়নি।", "এক্সপোর্ট ব্যর্থ");
      return;
    }
    const headers = ["ID", "Name", "Phone", "Email", "Subject", "Status", "Date"];
    const rows = reports.map((r) => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.phone || ""}"`,
      `"${r.email}"`,
      `"${r.subject.replace(/"/g, '""')}"`,
      r.status,
      r.createdAt,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fulpur_reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-rose-600">
            শৃঙ্খলা ও নিরাপত্তা উইং • ফুলপুর রক্তদান নেটওয়ার্ক
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-0.5">
            রিপোর্ট ও অভিযোগ ব্যবস্থাপনা
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            কমিউনিটি রিপোর্ট, যোগাযোগের অপব্যবহার, সেবা সংক্রান্ত অভিযোগ ও বার্তা পর্যবেক্ষণ ও দ্রুত নিষ্পত্তি।
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--foreground-muted)] ${isFetching ? "animate-spin" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
          <button
            onClick={exportReportsCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>রিপোর্ট ডাউনলোড (CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">মোট বার্তা ও অভিযোগ</span>
          <p className="text-2xl font-black text-[var(--foreground)] mt-1">
            {toBengaliNumber(counts.total)} টি
          </p>
          <span className="text-[11px] text-[var(--foreground-subtle)] block">
            সর্বমোট প্রাপ্ত অভিযোগ
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">নতুন ও অপ্রক্রিয়াকৃত</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {toBengaliNumber(counts.new)} টি
          </p>
          <span className="text-[11px] text-rose-700 font-semibold block">
            জরুরি পদক্ষেপ প্রয়োজন
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">পর্যালোচনাধীন (পঠিত)</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {toBengaliNumber(counts.read)} টি
          </p>
          <span className="text-[11px] text-amber-700 font-semibold block">
            তদন্তাধীন অবস্থা
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)]">সমাধানকৃত (নিষ্পত্তি)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {toBengaliNumber(counts.resolved)} টি
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            সফলভাবে মীমাংসিত
          </span>
        </div>
      </div>

      {/* 3. Main Split View: Queue & Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Complaints Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[var(--border-subtle)]">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === "all"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
                }`}
              >
                সকল ({toBengaliNumber(counts.total)})
              </button>
              <button
                onClick={() => setStatusFilter("NEW")}
                className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === "NEW"
                    ? "bg-rose-600 text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
                }`}
              >
                নতুন ({toBengaliNumber(counts.new)})
              </button>
              <button
                onClick={() => setStatusFilter("READ")}
                className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === "READ"
                    ? "bg-amber-600 text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
                }`}
              >
                পঠিত ({toBengaliNumber(counts.read)})
              </button>
              <button
                onClick={() => setStatusFilter("RESOLVED")}
                className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === "RESOLVED"
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
                }`}
              >
                সমাধানকৃত ({toBengaliNumber(counts.resolved)})
              </button>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center text-xs text-[var(--foreground-muted)]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--color-primary)]" />
                  রিপোর্ট লোড হচ্ছে...
                </div>
              ) : reports.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--foreground-muted)]">
                  কোনো বার্তা বা রিপোর্ট পাওয়া যায়নি।
                </div>
              ) : (
                reports.map((report) => {
                  const isSelected = selectedReport?.id === report.id;
                  return (
                    <div
                      key={report.id}
                      onClick={() => {
                        setSelectedReportId(report.id);
                        if (report.status === "NEW") {
                          handleStatusChange(report.id, "READ");
                        }
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-500 shadow-xs"
                          : "bg-[var(--background-alt)] border-[var(--border-color)] hover:border-rose-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[var(--foreground)] truncate max-w-[180px]">
                          {report.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            report.status === "NEW"
                              ? "bg-rose-600 text-white"
                              : report.status === "READ"
                              ? "bg-amber-600 text-white"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {report.status === "NEW"
                            ? "নতুন"
                            : report.status === "READ"
                            ? "পর্যালোচনাধীন"
                            : "নিষ্পত্তিকৃত"}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-[var(--foreground)] line-clamp-1">
                        {report.subject}
                      </h4>
                      <p className="text-[11px] text-[var(--foreground-muted)] line-clamp-2 mt-1">
                        "{report.message}"
                      </p>
                      <span className="text-[10px] text-[var(--foreground-subtle)] block mt-1.5">
                        {formatBengaliDate(report.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Detailed Investigation & Actions */}
        <div className="lg:col-span-7 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-5">
          {!selectedReport ? (
            <div className="p-8 text-center text-xs text-[var(--foreground-muted)]">
              বিস্তারিত দেখতে বাঁয়ের তালিকা থেকে একটি বার্তা নির্বাচন করুন।
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="text-xs text-rose-600 font-bold block">
                    বার্তা ও অভিযোগ নথি
                  </span>
                  <h3 className="text-lg font-extrabold text-[var(--foreground)]">
                    {selectedReport.subject}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedReport.status === "NEW"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      : selectedReport.status === "READ"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}
                >
                  {selectedReport.status === "NEW"
                    ? "নতুন আগমন"
                    : selectedReport.status === "READ"
                    ? "পর্যালোচনাধীন"
                    : "নিষ্পত্তি সম্পন্ন"}
                </span>
              </div>

              {/* Sender Details */}
              <div className="p-4 rounded-xl bg-[var(--background-alt)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[var(--foreground-muted)] block text-[11px]">
                    প্রেরকের নাম ও পরিচয়
                  </span>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    {selectedReport.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[var(--foreground-muted)]">
                    {selectedReport.phone && (
                      <a
                        href={`tel:${selectedReport.phone}`}
                        className="hover:text-[var(--color-primary)] flex items-center gap-1 font-mono"
                        dir="ltr"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{selectedReport.phone}</span>
                      </a>
                    )}
                    <a
                      href={`mailto:${selectedReport.email}`}
                      className="hover:text-[var(--color-primary)] flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[var(--color-primary)]" />
                      <span>{selectedReport.email}</span>
                    </a>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[var(--foreground-muted)] block text-[11px]">
                    আগমনের তারিখ
                  </span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {formatBengaliDate(selectedReport.createdAt)}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs space-y-2">
                <span className="font-bold text-[var(--foreground)] block">
                  মূল বার্তা / অভিযোগের বিবরণ:
                </span>
                <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                  {selectedReport.message}
                </p>
              </div>

              {/* Administrative Actions */}
              <div className="p-4 rounded-xl bg-[var(--background-alt)] space-y-3">
                <span className="text-xs font-bold text-[var(--foreground)] block">
                  প্রশাসনিক স্থিতি নির্ধারণ:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedReport.id, "RESOLVED")}
                    disabled={isUpdatingStatus || selectedReport.status === "RESOLVED"}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>সমাধান সম্পন্ন হিসেবে চিহ্নিত করুন</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedReport.id, "READ")}
                    disabled={isUpdatingStatus || selectedReport.status === "READ"}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300 disabled:opacity-50 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>পর্যালোচনাধীন রাখুন</span>
                  </button>

                  <button
                    onClick={() => handleDelete(selectedReport.id, selectedReport.name)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 ml-auto cursor-pointer"
                    title="বার্তা মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
