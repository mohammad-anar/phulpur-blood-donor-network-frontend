import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "অ্যাডমিন ড্যাশবোর্ড | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  description: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - কেন্দ্রীয় প্রশাসনিক নিয়ন্ত্রণ প্যানেল",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
