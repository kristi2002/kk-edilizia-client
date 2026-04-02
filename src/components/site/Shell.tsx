import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { WhatsAppButton } from "./WhatsAppButton";
import { SkipLink } from "./SkipLink";
import { ScrollToHash } from "./ScrollToHash";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToHash />
      <SkipLink />
      <Header />
      <div
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col pt-16 outline-none"
      >
        {children}
      </div>
      <Footer />
      <CookieBanner />
      <WhatsAppButton />
    </>
  );
}
