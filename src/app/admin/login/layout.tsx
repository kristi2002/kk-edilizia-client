export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-8">
      {children}
    </div>
  );
}
