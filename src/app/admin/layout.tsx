import type { Metadata } from "next";
import { getPortfolioDataSource } from "@/lib/data/projects-store";
import { getSiteUrl } from "@/lib/data/site-store";
import { isUpstashRedisConfigured } from "@/lib/upstash-redis";
import { AdminEnvironmentBar } from "./AdminEnvironmentBar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteUrl, portfolioSource] = await Promise.all([
    getSiteUrl(),
    getPortfolioDataSource(),
  ]);
  const redisOk = isUpstashRedisConfigured();
  const blobOk = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <AdminEnvironmentBar
          siteUrl={siteUrl}
          redisOk={redisOk}
          blobOk={blobOk}
          portfolioSource={portfolioSource}
        />
        {children}
      </div>
    </div>
  );
}
