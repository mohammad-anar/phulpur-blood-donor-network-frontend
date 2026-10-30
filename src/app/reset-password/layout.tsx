import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড রিসেট করুন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

