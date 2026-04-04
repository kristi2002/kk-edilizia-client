import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { WhatsAppButton } from "./WhatsAppButton";
import { SkipLink } from "./SkipLink";
import { ScrollToHash } from "./ScrollToHash";
import { getSite } from "@/lib/data/site-store";

export async function Shell({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const hasWhatsAppFab = Boolean(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim(),
  );
  return (
    <>
      <ScrollToHash />
      <SkipLink />
      <Header />
      <div
        id="main-content"
        tabIndex={-1}
        className={
          hasWhatsAppFab
            ? "flex flex-1 flex-col pt-16 pb-28 outline-none sm:pb-24"
            : "flex flex-1 flex-col pt-16 outline-none"
        }
      >
        {children}
      </div>
      <Footer site={site} />
      <CookieBanner />
      <WhatsAppButton />
    </>
  );
}
