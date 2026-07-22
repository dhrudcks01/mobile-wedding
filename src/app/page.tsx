import { AccountSection } from "@/components/invitation/AccountSection";
import { ScrollRevealController } from "@/components/common/ScrollRevealController";
import { ContactSection } from "@/components/invitation/ContactSection";
import { CoupleSection } from "@/components/invitation/CoupleSection";
import { DateSection } from "@/components/invitation/DateSection";
import { GallerySection } from "@/components/invitation/GallerySection";
import { GreetingSection } from "@/components/invitation/GreetingSection";
import { IntroScreen } from "@/components/invitation/IntroScreen";
import { LocationSection } from "@/components/invitation/LocationSection";
import { PosterSection } from "@/components/invitation/PosterSection";
import { ShareSection } from "@/components/invitation/ShareSection";
import { wedding } from "@/data/wedding";

export default function Home() {
  const kakaoJavaScriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? "";
  const kakaoMapScriptKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY ?? "";

  return (
    <main className="invitation-page mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[var(--color-dark)] shadow-[0_0_90px_rgba(0,0,0,0.55)]">
      <ScrollRevealController />
      <IntroScreen wedding={wedding} />
      <PosterSection wedding={wedding} />
      <GreetingSection wedding={wedding} />
      <DateSection wedding={wedding} />
      <CoupleSection wedding={wedding} />
      <GallerySection wedding={wedding} />
      <LocationSection
        kakaoJavaScriptKey={kakaoMapScriptKey}
        wedding={wedding}
      />
      <ContactSection wedding={wedding} />
      <AccountSection wedding={wedding} />
      <ShareSection
        kakaoJavaScriptKey={kakaoJavaScriptKey}
        wedding={wedding}
      />
    </main>
  );
}
