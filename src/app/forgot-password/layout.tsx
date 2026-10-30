import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড ভুলে গেছেন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

