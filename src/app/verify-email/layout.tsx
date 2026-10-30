import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ইমেইল ভেরিফিকেশন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

