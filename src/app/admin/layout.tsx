import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pannello di controllo",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060606] text-zinc-200 antialiased">{children}</div>
  );
}
