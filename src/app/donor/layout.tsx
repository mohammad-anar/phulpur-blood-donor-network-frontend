import type { Metadata } from "next";
import { DonorShell } from "@/components/donor/DonorShell";

export const metadata: Metadata = {
  title: "রক্তদাতা ড্যাশবোর্ড | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  description: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - রক্তদাতা ড্যাশবোর্ড ও প্রোফাইল ব্যবস্থাপনা",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DonorShell>{children}</DonorShell>;
}
