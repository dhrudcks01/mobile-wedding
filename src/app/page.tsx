import { AccountSection } from "@/components/invitation/AccountSection";
import { ContactSection } from "@/components/invitation/ContactSection";
import { CoupleSection } from "@/components/invitation/CoupleSection";
import { DateSection } from "@/components/invitation/DateSection";
import { GallerySection } from "@/components/invitation/GallerySection";
import { GreetingSection } from "@/components/invitation/GreetingSection";
import { HeroSection } from "@/components/invitation/HeroSection";
import { IntroScreen } from "@/components/invitation/IntroScreen";
import { LocationSection } from "@/components/invitation/LocationSection";
import { ShareSection } from "@/components/invitation/ShareSection";
import { wedding } from "@/data/wedding";

export default function Home() {
  const kakaoJavaScriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? "";

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(70,55,42,0.14)] sm:my-8 sm:min-h-[calc(100vh-4rem)] sm:rounded-[32px]">
      <IntroScreen wedding={wedding} />
      <HeroSection wedding={wedding} />
      <GreetingSection wedding={wedding} />
      <CoupleSection wedding={wedding} />
      <DateSection wedding={wedding} />
      <LocationSection wedding={wedding} />
      <GallerySection wedding={wedding} />
      <ContactSection wedding={wedding} />
      <AccountSection wedding={wedding} />
      <ShareSection
        kakaoJavaScriptKey={kakaoJavaScriptKey}
        wedding={wedding}
      />
    </main>
  );
}
