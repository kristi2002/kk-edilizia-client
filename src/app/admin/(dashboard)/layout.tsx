import { AdminSidebar } from "../AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1 overflow-x-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          <div className="text-base leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
