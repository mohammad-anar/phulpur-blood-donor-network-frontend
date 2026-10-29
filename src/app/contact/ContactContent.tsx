"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/components/common/Toast";
import {
  useGetPlatformContactQuery,
  useSendContactMessageMutation,
} from "@/lib/store/api/bloodDonationApi";

export function ContactContent() {
  const { data: contactInfo } = useGetPlatformContactQuery();
  const [sendContactMessage, { isLoading: isSubmitting }] =
    useSendContactMessageMutation();
  const { success, error } = useToast();

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Client Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Contact Details from API (or official project values)
  const officialPhone = contactInfo?.phone || "০১৯৭২-৬০৬২৫৫";
  const officialEmail = contactInfo?.email || "bonnochobi@gmail.com";
  const officialFacebook =
    contactInfo?.facebook || "https://www.facebook.com/PhulpurBloodDonorNetwork";

  // Format tel link (removes non-digits/bangla formatting for href)
  const phoneTelHref = "01972606255";

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "আপনার নাম লিখুন";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "ইমেইল ঠিকানা লিখুন";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "একটি সঠিক ইমেইল ঠিকানা প্রদান করুন (যেমন: example@email.com)";
    }

    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.trim().replace(/[-\s]/g, "");
      const bdPhoneRegex = /^(\+?880|0)1[3-9]\d{8}$/;
      if (!bdPhoneRegex.test(cleanPhone)) {
        newErrors.phone = "সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 01712345678)";
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "বার্তার বিষয় লিখুন";
    } else if (formData.subject.trim().length < 2) {
      newErrors.subject = "বিষয় কমপক্ষে ২ অক্ষরের হতে হবে";
    }

    if (!formData.message.trim()) {
      newErrors.message = "আপনার বার্তা লিখুন";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "বার্তা বিস্তারিত লিখুন (কমপক্ষে ৫ অক্ষর)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      await sendContactMessage(payload).unwrap();

      setSubmittedSuccess(true);
      success("আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। যোগাযোগ করার জন্য ধন্যবাদ।", "বার্তা প্রাপ্তি নিশ্চিত");

      // Reset form fields on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "দুঃখিত, আপনার বার্তাটি পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।";
      setServerError(msg);
      error("দুঃখিত, আপনার বার্তাটি পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।", "ব্যর্থ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-[var(--foreground-muted)]">
            <Link
              href="/"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)]" />
            <span className="text-[var(--color-primary)] font-semibold">
              যোগাযোগ
            </span>
          </nav>

          {/* =====================================================
              SECTION 3: COMPACT PAGE HEADER
          ====================================================== */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>যোগাযোগ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
              আমাদের সাথে যোগাযোগ করুন
            </h1>

            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
              আপনার কোনো প্রশ্ন, পরামর্শ বা সহযোগিতার প্রয়োজন হলে আমাদের সাথে যোগাযোগ করুন। আমরা আপনার মতামতকে গুরুত্ব দিই।
            </p>
          </div>

          {/* =====================================================
              SECTION 4 & 5: TWO-COLUMN MAIN CONTACT SECTION
          ====================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          >
            {/* =====================================================
                LEFT COLUMN: CONTACT INFORMATION (approx 40%)
            ====================================================== */}
            <div className="lg:col-span-5 bg-gradient-to-br from-red-700 via-rose-700 to-red-800 text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle background blood droplet motif */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-10 right-8 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    যোগাযোগের তথ্য
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                    আমাদের সাথে যোগাযোগ করতে নিচের মাধ্যমগুলো ব্যবহার করুন। আপনার সুবিধামতো যেকোনো একটি মাধ্যম বেছে নিন।
                  </p>
                </div>

                {/* 3 Clear Contact Method Cards */}
                <div className="space-y-3.5 pt-2">
                  {/* 1. Phone Card */}
                  <a
                    href={`tel:${phoneTelHref}`}
                    className="group block p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 hover:scale-[1.02] shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-white text-red-700 flex items-center justify-center flex-shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">
                          ফোন
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-white tracking-wide block truncate">
                          {officialPhone}
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* 2. Email Card */}
                  <a
                    href={`mailto:${officialEmail}`}
                    className="group block p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 hover:scale-[1.02] shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-white text-red-700 flex items-center justify-center flex-shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">
                          ইমেইল
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide block truncate">
                          {officialEmail}
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* 3. Facebook Card */}
                  <a
                    href={officialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 hover:scale-[1.02] shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-white text-red-700 flex items-center justify-center flex-shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">
                            ফেসবুক
                          </span>
                          <span className="text-sm font-extrabold text-white block">
                            আমাদের ফেসবুক পেজ
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-rose-200 opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Bottom Emergency Banner in Left Column */}
              <div className="mt-8 pt-6 border-t border-white/15 relative z-10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-100">
                  <ShieldCheck className="w-4 h-4 text-rose-200" />
                  <span>জরুরি সহায়তার প্রতিশ্রুতি</span>
                </div>
                <p className="text-[11px] text-rose-100/80 leading-relaxed">
                  ফুলপুরের যেকোনো এলাকায় জরুরি রক্তের প্রয়োজনে আমাদের স্বেচ্ছাসেবী দল সার্বক্ষণিক সহযোগিতায় প্রস্তুত।
                </p>
              </div>
            </div>

            {/* =====================================================
                RIGHT COLUMN: CONTACT FORM (approx 60%)
            ====================================================== */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-[var(--card-bg)] flex flex-col justify-between">
              <div>
                <div className="space-y-1.5 pb-6 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
                      আমাদের একটি বার্তা পাঠান
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                    নিচের ফর্মটি পূরণ করে আপনার প্রশ্ন বা মতামত আমাদের জানান।
                  </p>
                </div>

                {/* Success Alert Banner */}
                {submittedSuccess && (
                  <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm space-y-1">
                      <p className="font-bold">
                        আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। যোগাযোগ করার জন্য ধন্যবাদ।
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        আমাদের টিম শীঘ্রই আপনার ইমেইল বা ফোন নম্বরে যোগাযোগ করবে।
                      </p>
                    </div>
                  </div>
                )}

                {/* Server Error Alert Banner */}
                {serverError && (
                  <div className="mt-5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm space-y-1">
                      <p className="font-bold">
                        দুঃখিত, আপনার বার্তাটি পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।
                      </p>
                      <p className="text-xs text-rose-700 dark:text-rose-300">{serverError}</p>
                    </div>
                  </div>
                )}

                {/* Main Contact Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Full Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-bold text-[var(--foreground)] mb-1"
                      >
                        আপনার নাম <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        disabled={isSubmitting}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border text-xs sm:text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none ${
                          errors.name
                            ? "border-red-500 focus:ring-red-400"
                            : "border-[var(--border-color)]"
                        }`}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && (
                        <p
                          id="name-error"
                          className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* 2. Email Address */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-bold text-[var(--foreground)] mb-1"
                      >
                        ইমেইল ঠিকানা <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        disabled={isSubmitting}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border text-xs sm:text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none ${
                          errors.email
                            ? "border-red-500 focus:ring-red-400"
                            : "border-[var(--border-color)]"
                        }`}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 3. Phone Number (Optional) */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-bold text-[var(--foreground)] mb-1"
                      >
                        ফোন নম্বর{" "}
                        <span className="text-xs text-[var(--foreground-muted)] font-normal">
                          (ঐচ্ছিক)
                        </span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="আপনার ফোন নম্বর লিখুন"
                        disabled={isSubmitting}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border text-xs sm:text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none ${
                          errors.phone
                            ? "border-red-500 focus:ring-red-400"
                            : "border-[var(--border-color)]"
                        }`}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && (
                        <p
                          id="phone-error"
                          className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* 4. Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-bold text-[var(--foreground)] mb-1"
                      >
                        বিষয় <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="বার্তার বিষয় লিখুন"
                        disabled={isSubmitting}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border text-xs sm:text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none ${
                          errors.subject
                            ? "border-red-500 focus:ring-red-400"
                            : "border-[var(--border-color)]"
                        }`}
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={errors.subject ? "subject-error" : undefined}
                      />
                      {errors.subject && (
                        <p
                          id="subject-error"
                          className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.subject}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 5. Message Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="message"
                        className="block text-xs font-bold text-[var(--foreground)]"
                      >
                        আপনার বার্তা <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <span className="text-[11px] text-[var(--foreground-muted)]">
                        {formData.message.length}/1000 অক্ষর
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      maxLength={1000}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="আপনার প্রশ্ন, পরামর্শ বা বার্তা বিস্তারিত লিখুন..."
                      disabled={isSubmitting}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border text-xs sm:text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none resize-y ${
                        errors.message
                          ? "border-red-500 focus:ring-red-400"
                          : "border-[var(--border-color)]"
                      }`}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* 6. Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>বার্তা পাঠানো হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>বার্তা পাঠান</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Bottom Note */}
              <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] text-[11px] text-[var(--foreground-muted)] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>সাধারণত ২৪ ঘণ্টার মধ্যে বার্তা পর্যালোচনা করা হয়।</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
