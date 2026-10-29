"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { authApi, ApiError } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [currentAddress, setCurrentAddress] = useState("ফুলপুর পৌরসভা, ময়মনসিংহ");
  const [permanentAddress, setPermanentAddress] = useState("ফুলপুর, ময়মনসিংহ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Profile image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      error("শুধুমাত্র ছবি ফাইল (JPEG, PNG, WEBP) আপলোড করা যাবে");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error("ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (name.trim().length < 2) {
      setErrorMessage("অনুগ্রহ করে আপনার সঠিক পূর্ণ নাম লিখুন");
      return;
    }

    if (phone.trim().length < 10) {
      setErrorMessage("সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন");
      return;
    }

    if (!bloodGroup) {
      setErrorMessage("রক্তের গ্রুপ নির্বাচন করুন");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("পাসওয়ার্ড দুটি মিলছে না। পুনরায় যাচাই করুন");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("bloodGroup", bloodGroup);
      formData.append("gender", gender);
      formData.append("currentAddress", currentAddress.trim());
      formData.append("permanentAddress", permanentAddress.trim());
      formData.append("password", password);

      if (email.trim()) {
        formData.append("email", email.trim().toLowerCase());
      }

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      // Also append JSON data string for body parsing flexibility
      formData.append(
        "data",
        JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          bloodGroup,
          gender,
          currentAddress: currentAddress.trim(),
          permanentAddress: permanentAddress.trim(),
          password,
          email: email.trim().toLowerCase() || undefined,
        })
      );

      await authApi.register(formData);

      setIsSuccess(true);
      success("রেজিস্ট্রেশন সফল হয়েছে! অ্যাডমিনের অনুমোদনের পর অ্যাকাউন্ট সক্রিয় হবে।", "অভিনন্দন");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        error(err.message, "রেজিস্ট্রেশন ব্যর্থ");
      } else {
        const msg = err?.message || "রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি।";
        setErrorMessage(msg);
        error(msg, "রেজিস্ট্রেশন ব্যর্থ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl w-full mx-auto relative z-10">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm">
              <Heart className="w-7 h-7 fill-current animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              নতুন রক্তদাতা নিবন্ধন
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] max-w-lg mx-auto">
              ফুলপুর উপজেলার মুমূর্ষু রোগীদের জীবন রক্ষায় স্বেচ্ছায় রক্তদানে অংশ নিন। আপনার একটি সিদ্ধান্ত বাঁচাতে পারে একটি পরিবার।
            </p>
          </div>

          {isSuccess ? (
            <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-8 sm:p-12 text-center shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!
                </h2>
                <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
                  ফুলপুর ব্লাড ডোনার নেটওয়ার্কে যুক্ত হওয়ার জন্য আপনাকে আন্তরিক ধন্যবাদ। নিরাপত্তার স্বার্থে রক্তদাতার তথ্য অনুমোদনের পর সক্রিয় হবে।
                </p>
              </div>

              {email && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs sm:text-sm text-blue-800 dark:text-blue-300 max-w-md mx-auto text-left flex items-start gap-3">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-bold block">ইমেইল ভেরিফিকেশন:</span>
                    আপনার ইমেইল <strong className="font-semibold underline">{email}</strong>-এ যাচাইকরণ লিংক পাঠানো হয়েছে। লিংকটিতে ক্লিক করে ইমেইল নিশ্চিত করতে পারেন।
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-md inline-flex items-center justify-center gap-2"
                >
                  <span>লগইন পেজে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] transition-colors border border-[var(--border-color)] inline-flex items-center justify-center"
                >
                  হোম পেজে ফিরে যান
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-10 shadow-xl">
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-sm animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Blood Group Selection (Hero Grid) */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[var(--foreground)]">
                    রক্তের গ্রুপ নির্বাচন করুন <span className="text-[var(--color-primary)]">*</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {BLOOD_GROUPS.map((group) => {
                      const isSelected = bloodGroup === group;
                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setBloodGroup(group)}
                          className={`py-3 rounded-xl text-sm font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-[var(--color-primary)] text-white shadow-md scale-105 ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--card-bg)]"
                              : "bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50"
                          }`}
                        >
                          <span>{group}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      পূর্ণ নাম <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন: মোঃ আরিফুল ইসলাম"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      মোবাইল নম্বর <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="০১৭১২-৩৪৫৬৭৮"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Gender and Optional Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gender Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      লিঙ্গ <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "পুরুষ", val: "male" },
                        { label: "মহিলা", val: "female" },
                        { label: "অন্যান্য", val: "other" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setGender(item.val as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            gender === item.val
                              ? "bg-[var(--color-primary)] text-white shadow-xs"
                              : "bg-[var(--background-alt)] border border-[var(--border-color)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Email */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                        ইমেইল ঠিকানা
                      </label>
                      <span className="text-[11px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-md">
                        ঐচ্ছিক (রিকভারির জন্য)
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com (পাসওয়ার্ড রিকভারি)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Address Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      বর্তমান ঠিকানা / এলাকা <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={currentAddress}
                        onChange={(e) => setCurrentAddress(e.target.value)}
                        placeholder="যেমন: ফুলপুর পৌরসভা, ওয়ার্ড নং ০৩"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      স্থায়ী ঠিকানা <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={permanentAddress}
                        onChange={(e) => setPermanentAddress(e.target.value)}
                        placeholder="যেমন: গ্রাম: বালিয়া, ডাকঘর: ফুলপুর"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Profile Image Upload (Optional) */}
                <div className="space-y-2 p-4 rounded-2xl bg-[var(--background-alt)] border border-[var(--border-color)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[var(--color-primary)]" />
                      <label className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
                        প্রোফাইল ছবি
                      </label>
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)]">
                      ঐচ্ছিক (সর্বোচ্চ ৫MB)
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image-input"
                  />

                  {imagePreview ? (
                    <div className="flex items-center gap-4 pt-1">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[var(--color-primary)] shadow-sm">
                        <Image
                          src={imagePreview}
                          alt="প্রোফাইল ছবি প্রিভিউ"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                          {imageFile?.name}
                        </p>
                        <p className="text-[11px] text-[var(--foreground-muted)]">
                          {(imageFile?.size ? imageFile.size / (1024 * 1024) : 0).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        title="ছবি মুছে ফেলুন"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="profile-image-input"
                      className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--color-primary)] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center"
                    >
                      <Upload className="w-6 h-6 text-[var(--foreground-subtle)]" />
                      <span className="text-xs font-bold text-[var(--foreground)]">
                        ছবি আপলোড করতে ক্লিক করুন
                      </span>
                      <span className="text-[11px] text-[var(--foreground-muted)]">
                        JPG, PNG অথবা WEBP ফরম্যাট (৫০×৫০ পিক্সেল বা তার বেশি)
                      </span>
                    </label>
                  )}
                </div>

                {/* 6. Security & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      পাসওয়ার্ড <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষর"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      পাসওয়ার্ড নিশ্চিত করুন <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms / Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    নিবন্ধনের মাধ্যমে আপনি নিশ্চিত করছেন যে প্রদত্ত সকল তথ্য সঠিক এবং আপনি স্বেচ্ছায় ফুলপুর উপজেলার জরুরি প্রয়োজনে রক্তদানে আগ্রহী।
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-current" />
                      <span>রক্তদাতা হিসেবে নিবন্ধন সম্পন্ন করুন</span>
                    </>
                  )}
                </button>
              </form>

              {/* Already have account */}
              <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center text-sm text-[var(--foreground-muted)]">
                ইতিমধ্যে রক্তদাতা হিসেবে অ্যাকাউন্ট আছে?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
                >
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
