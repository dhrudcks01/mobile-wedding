import { ContactSection } from "@/components/invitation/ContactSection";
import { CoupleSection } from "@/components/invitation/CoupleSection";
import { DateSection } from "@/components/invitation/DateSection";
import { GreetingSection } from "@/components/invitation/GreetingSection";
import { HeroSection } from "@/components/invitation/HeroSection";
import { LocationSection } from "@/components/invitation/LocationSection";
import { wedding } from "@/data/wedding";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(70,55,42,0.14)] sm:my-8 sm:min-h-[calc(100vh-4rem)] sm:rounded-[32px]">
      <HeroSection wedding={wedding} />
      <GreetingSection wedding={wedding} />
      <CoupleSection wedding={wedding} />
      <DateSection wedding={wedding} />
      <LocationSection wedding={wedding} />
      <ContactSection wedding={wedding} />
    </main>
  );
}
