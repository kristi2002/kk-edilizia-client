import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
