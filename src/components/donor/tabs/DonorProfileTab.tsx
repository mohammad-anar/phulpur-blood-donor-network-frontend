"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Eye,
  Edit,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Lock,
  Globe,
  Award,
  Zap,
  Camera,
  Trash2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  EyeOff,
  Save,
  X,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/api/useAuth";
import { authApi, ApiError, getAssetUrl } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";
import {
  useGetMyDonationsQuery,
  useUpdateDonorProfileMutation,
} from "@/lib/store/api/bloodDonationApi";
import { toBengaliNumber, formatBloodGroup } from "@/lib/utils/donorCountdown";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function DonorProfileTab() {
  const { user, refreshUser } = useAuth();
  const { success, error, warning } = useToast();

  const { data: myDonationsData } = useGetMyDonationsQuery();
  const [updateDonorProfile, { isLoading: isUpdatingProfile }] = useUpdateDonorProfileMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Live user profile data from auth session
  const donorName = user?.name || "";
  const donorPhone = user?.phone || "";
  const donorBloodGroup = formatBloodGroup(user?.bloodGroup);
  const donorPresentAddress =
    user?.presentAddress || user?.currentAddress || user?.location || "";
  const donorPermanentAddress = user?.permanentAddress || "";
  const donorProfileImage = getAssetUrl(user?.profileImage);

  // Personal Info Edit State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(donorName);
  const [bloodGroup, setBloodGroup] = useState(donorBloodGroup);
  const [currentAddress, setCurrentAddress] = useState(donorPresentAddress);
  const [permanentAddress, setPermanentAddress] = useState(donorPermanentAddress);
  const [gender, setGender] = useState(user?.gender || "male");

  // Email state
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isSendingVerify, setIsSendingVerify] = useState(false);
  const [emailHighlight, setEmailHighlight] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Profile image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.bloodGroup) setBloodGroup(user.bloodGroup);
      if (user.presentAddress || user.currentAddress || user.location) {
        setCurrentAddress(user.presentAddress || user.currentAddress || user.location || "");
      }
      if (user.permanentAddress) setPermanentAddress(user.permanentAddress);
      if (user.gender) setGender(user.gender);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Handle Save Personal Profile Information
  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDonorProfile({
        name: name.trim(),
        bloodGroup,
        currentAddress: currentAddress.trim(),
        permanentAddress: permanentAddress.trim(),
        gender,
      }).unwrap();

      await refreshUser();
      setIsEditingInfo(false);
      success("ব্যক্তিগত প্রোফাইল সফলভাবে আপডেট করা হয়েছে!", "সফল");
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।";
      error(msg, "ব্যর্থ");
    }
  };

  // Handle Profile Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      await authApi.updateProfileImage(formData);
      await refreshUser();
      success("প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!", "সফল");
    } catch (err: any) {
      const msg = err?.message || "ছবি আপলোড করতে সমস্যা হয়েছে।";
      error(msg, "ব্যর্থ");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle Profile Image Removal
  const handleRemoveImage = async () => {
    if (!confirm("আপনি কি নিশ্চিতভাবে প্রোফাইল ছবি মুছে ফেলতে চান?")) return;

    setIsUploadingImage(true);
    try {
      await authApi.updateProfileImage({ remove: true });
      await refreshUser();
      success("প্রোফাইল ছবি মুছে ফেলা হয়েছে", "সফল");
    } catch (err: any) {
      const msg = err?.message || "ছবি মুছে ফেলতে সমস্যা হয়েছে।";
      error(msg, "ব্যর্থ");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Email Update
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      error("একটি সঠিক ইমেইল ঠিকানা প্রদান করুন");
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await authApi.updateEmail(trimmed);
      await refreshUser();
      setEmailHighlight(false);
      success("ইমেইল সফলভাবে আপডেট করা হয়েছে!", "সফল");
    } catch (err: any) {
      const msg = err?.message || "ইমেইল আপডেট করা সম্ভব হয়নি।";
      error(msg, "ব্যর্থ");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // Handle Send Email Verification
  const handleSendVerification = async () => {
    setIsSendingVerify(true);
    try {
      await authApi.sendEmailVerification();
      success("আপনার ইমেইলে যাচাইকরণ লিংক পাঠানো হয়েছে!", "ভেরিফিকেশন ইমেইল");
    } catch (err: any) {
      const msg = err?.message || "ভেরিফিকেশন ইমেইল পাঠানো সম্ভব হয়নি।";
      error(msg, "ব্যর্থ");
    } finally {
      setIsSendingVerify(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("বর্তমান পাসওয়ার্ড লিখুন");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("নতুন পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      success("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!", "নিরাপত্তা আপডেট");
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errorCode === "EMAIL_REQUIRED") {
          error("You must update your email", "Email Required");
          setEmailHighlight(true);
          setPasswordError("পাসওয়ার্ড পরিবর্তনের পূর্বে আপনার প্রোফাইলে একটি সচল ইমেইল যুক্ত করা আবশ্যক।");
          emailInputRef.current?.focus();
          emailInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (err.errorCode === "EMAIL_NOT_VERIFIED") {
          warning("পাসওয়ার্ড পরিবর্তনের জন্য প্রথমে আপনার ইমেইল যাচাই (Verify) করুন।", "ইমেইল অযাচাইকৃত");
          setPasswordError("আপনার ইমেইলটি এখনো ভেরিফাই করা হয়নি। নিচে 'যাচাই লিংক পাঠান' বাটনে ক্লিক করে ইমেইল ভেরিফাই করুন।");
        } else {
          setPasswordError(err.message);
          error(err.message, "পাসওয়ার্ড পরিবর্তন ব্যর্থ");
        }
      } else {
        const msg = err?.message || "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি।";
        setPasswordError(msg);
        error(msg, "পাসওয়ার্ড পরিবর্তন ব্যর্থ");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const isEmailVerified = Boolean(user?.email && user?.emailVerifiedAt);

  const approvedDonationsCount =
    myDonationsData?.summary?.approvedDonations ?? 0;

  return (
    <div className="space-y-6">
      {/* 1. Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            ডোনার প্রোফাইল
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            আপনার ব্যক্তিগত তথ্য, ইমেইল, প্রোফাইল ছবি ও অ্যাকাউন্টের নিরাপত্তা পরিচালনা করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/donor/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>সেটিংস ও নিরাপত্তা</span>
          </Link>

          <Link
            href="/donors"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>পাবলিক ডিরেক্টরি</span>
          </Link>

          <button
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs cursor-pointer"
          >
            {isEditingInfo ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>সম্পাদনা বাতিল</span>
              </>
            ) : (
              <>
                <Edit className="w-3.5 h-3.5" />
                <span>ব্যক্তিগত তথ্য সম্পাদনা</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Profile Summary Card with Avatar Upload */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with Upload trigger */}
          <div className="relative group">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-primary-light)] shadow-sm bg-[var(--background-alt)] flex items-center justify-center">
              {donorProfileImage ? (
                <Image
                  src={donorProfileImage}
                  alt={donorName || "রক্তদাতা"}
                  fill
                  sizes="96px"
                  unoptimized={Boolean(donorProfileImage.startsWith("http"))}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary)] font-extrabold text-2xl">
                  {donorBloodGroup || <User className="w-10 h-10" />}
                </div>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Blood Group Badge */}
            {donorBloodGroup && (
              <span className="absolute -top-1 -right-1 min-w-[32px] h-[32px] px-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-black flex items-center justify-center border-2 border-[var(--card-bg)] shadow-xs">
                {donorBloodGroup}
              </span>
            )}

            {/* Upload Button overlay */}
            <label
              htmlFor="avatar-file-input"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] hover:text-[var(--color-primary)] shadow-sm cursor-pointer transition-colors"
              title="ছবি পরিবর্তন করুন"
            >
              <Camera className="w-3.5 h-3.5" />
            </label>

            <input
              ref={fileInputRef}
              id="avatar-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleImageFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-[var(--foreground)]">{donorName || "রক্তদাতা"}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>{user?.status === "APPROVED" ? "যাচাইকৃত রক্তদাতা" : "সক্রিয় সদস্য"}</span>
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>স্বেচ্ছাসেবী রক্তদাতা {donorPresentAddress ? `• ${donorPresentAddress}` : ""}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              {user?.profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage}
                  className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>ছবি মুছুন</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[var(--border-subtle)] pt-4 md:pt-0 md:pl-8">
          <div className="text-center">
            <span className="text-xs text-[var(--foreground-muted)]">মোট রক্তদান</span>
            <p className="text-2xl font-black text-[var(--color-primary)]">
              {toBengaliNumber(String(approvedDonationsCount).padStart(2, "0"))}
            </p>
            <span className="text-[10px] text-[var(--foreground-subtle)]">বার সম্পন্ন</span>
          </div>
          <div className="text-center">
            <span className="text-xs text-[var(--foreground-muted)]">রক্তের গ্রুপ</span>
            <p className="text-2xl font-black text-[var(--color-primary)]">{donorBloodGroup}</p>
            <span className="text-[10px] text-[var(--foreground-subtle)]">গ্রুপ</span>
          </div>
          <div className="text-center">
            <span className="text-xs text-[var(--foreground-muted)]">স্ট্যাটাস</span>
            <p className="text-base font-bold text-emerald-600 mt-1">সক্রিয়</p>
            <span className="text-[10px] text-[var(--foreground-subtle)]">অনুমোদিত</span>
          </div>
        </div>
      </div>

      {/* Inline Personal Info Edit Form */}
      {isEditingInfo && (
        <form
          onSubmit={handleSavePersonalInfo}
          className="rounded-2xl bg-[var(--card-bg)] border-2 border-[var(--color-primary-border)] p-6 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <h3 className="text-base font-bold text-[var(--foreground)]">
              ব্যক্তিগত তথ্য হালনাগাদ ফরম
            </h3>
            <span className="text-xs text-[var(--color-primary)] font-semibold">
              সরাসরি সংরক্ষিত হবে
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                রক্তের গ্রুপ *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none cursor-pointer"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                লিঙ্গ
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none cursor-pointer"
              >
                <option value="male">পুরুষ</option>
                <option value="female">নারী</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                বর্তমান ঠিকানা / এলাকা *
              </label>
              <input
                type="text"
                required
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                স্থায়ী ঠিকানা
              </label>
              <input
                type="text"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingInfo(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isUpdatingProfile ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 3. Email & Verification Section */}
      <div
        className={`rounded-2xl bg-[var(--card-bg)] border p-6 shadow-xs space-y-4 transition-all ${
          emailHighlight
            ? "border-amber-500 ring-2 ring-amber-400/50"
            : "border-[var(--card-border)]"
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">
              ইমেইল ও ভেরিফিকেশন ব্যবস্থাপনা
            </h3>
          </div>
          {isEmailVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>যাচাইকৃত (Verified)</span>
            </span>
          ) : user?.email ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>অযাচাইকৃত (Unverified)</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold">
              যুক্ত করা হয়নি
            </span>
          )}
        </div>

        {emailHighlight && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>You must update your email — পাসওয়ার্ড পরিবর্তনের জন্য অ্যাকাউন্টে ইমেইল যোগ করুন।</span>
          </div>
        )}

        <form onSubmit={handleUpdateEmail} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার সচল ইমেইল ঠিকানা লিখুন"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingEmail}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              {isUpdatingEmail ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>ইমেইল সংরক্ষণ করুন</span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <p className="text-[var(--foreground-muted)]">
              পাসওয়ার্ড উদ্ধার, সিকিউরিটি নোটিফিকেশন ও অ্যাকাউন্ট সুরক্ষার জন্য ইমেইল ব্যবহৃত হয়।
            </p>

            {user?.email && !isEmailVerified && (
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isSendingVerify}
                className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline font-bold cursor-pointer disabled:opacity-60"
              >
                {isSendingVerify ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>ভেরিফিকেশন লিংক পাঠান</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 4. Password Change & Security Section */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-[var(--foreground)]">
              পাসওয়ার্ড পরিবর্তন
            </h3>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                autoComplete="current-password"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                autoComplete="new-password"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পুনরায় লিখুন"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-1.5 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}</span>
            </button>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isChangingPassword ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>পাসওয়ার্ড আপডেট করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 5. 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Public Information */}
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="text-base font-bold text-[var(--foreground)]">সার্বজনীন তথ্য</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
              পাবলিক
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">রক্তের গ্রুপ</span>
              <span className="font-bold text-[var(--color-primary)]">{donorBloodGroup}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">জেলা ও উপজেলা</span>
              <span className="font-semibold text-[var(--foreground)]">ময়মনসিংহ, ফুলপুর</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">বর্তমান এলাকা</span>
              <span className="font-semibold text-[var(--foreground)]">{donorPresentAddress}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">বর্তমান প্রাপ্যতা</span>
              <span className="font-semibold text-emerald-700">● রক্তদানে প্রস্তুত (Ready to Donate)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--foreground-muted)] font-medium">মোবাইল নম্বর দৃশ্যমানতা</span>
              <span className="font-semibold text-[var(--foreground)]" dir="ltr">{donorPhone}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
            <span className="text-xs font-bold text-[var(--foreground)]">অর্জিত ব্যাজসমূহ:</span>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900">
                <Award className="w-3.5 h-3.5" />
                <span>গোল্ড ডোনার (৫+ রক্তদান)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-900">
                <Zap className="w-3.5 h-3.5" />
                <span>জরুরি রেসপন্ডার</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ফুলপুর লাইফসেভার</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Personal & Protected Information */}
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-[var(--foreground)]">ব্যক্তিগত ও গোপনীয় তথ্য</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
              সুরক্ষিত
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">পূর্ণ নাম</span>
              <span className="font-semibold text-[var(--foreground)]">{donorName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">মোবাইল নম্বর</span>
              <span className="font-bold text-[var(--color-primary)]" dir="ltr">{donorPhone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">ইমেইল ঠিকানা</span>
              <span className="font-semibold text-[var(--foreground)]">
                {user?.email || "যুক্ত করা হয়নি"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--foreground-muted)] font-medium">স্থায়ী ঠিকানা</span>
              <span className="font-semibold text-[var(--foreground)]">{donorPermanentAddress}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--foreground-muted)] font-medium">অ্যাকাউন্ট স্ট্যাটাস</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{user?.status === "APPROVED" ? "অনুমোদিত রক্তদাতা" : "সক্রিয় সদস্য"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
