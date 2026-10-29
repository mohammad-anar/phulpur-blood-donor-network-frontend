import type { Metadata } from "next";
import { DonorShell } from "@/components/donor/DonorShell";

export const metadata: Metadata = {
  title: "রক্তদাতা ড্যাশবোর্ড | ফুলপুর রক্ত সেবা",
  description: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - রক্তদাতা ড্যাশবোর্ড ও প্রোফাইল ব্যবস্থাপনা",
};

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DonorShell>{children}</DonorShell>;
}
