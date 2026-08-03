import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import type { Wedding } from "@/types/wedding";

type HeroSectionProps = {
  wedding: Wedding;
};

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

export function HeroSection({ wedding }: HeroSectionProps) {
  const groomName = getDisplayText(wedding.intro.groom.name, "Groom");
  const brideName = getDisplayText(wedding.intro.bride.name, "Bride");
  const eventPlace = [wedding.event.venueName, wedding.event.hallName]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");
  const displayDate = getDisplayText(
    wedding.event.displayDate,
    "예식 일시 입력 예정",
  );
  const heroImage = wedding.images.hero.trim() || "/images/hero.jpg";

  return (
    <section className="film-grain relative min-h-[100svh] overflow-hidden bg-[var(--color-dark)] text-white">
      <ImageWithFallback
        alt={`${groomName}과 ${brideName} 웨딩 대표 이미지`}
        className="movie-hero-image object-cover object-[center_44%]"
        fill
        fallbackClassName="bg-[var(--color-dark)] text-white/70"
        fallbackDescription="대표 사진을 public/images/hero.jpg로 넣으면 자동으로 표시됩니다."
        fallbackTitle="대표 사진 준비 중"
        priority
        sizes="(max-width: 430px) 100vw, 430px"
        src={heroImage}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,8,0.48)_0%,rgba(5,8,8,0.04)_34%,rgba(5,8,8,0.08)_54%,rgba(5,8,8,0.92)_100%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_92px_18px_rgba(0,0,0,0.48)]" />

      <div className="cinema-rise relative z-10 flex min-h-[100svh] flex-col px-7 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(4rem,env(safe-area-inset-top))]">
        <div className="flex flex-col items-center text-center drop-shadow-[0_2px_14px_rgba(0,0,0,0.72)]">
          <p className="font-title-en text-[2.1rem] leading-[0.86] tracking-[0.02em]">
            THE
          </p>
          <p className="font-script -mb-1 mt-1 text-[4.3rem] leading-[0.78]">
            Grandest
          </p>
          <p className="font-title-en text-[2.85rem] leading-[0.9]">SHOW</p>
          <p className="font-title-en mt-1 text-[2.55rem] leading-[0.92]">
            OF OUR
          </p>
          <p className="mt-1 flex items-center font-title-en text-[3.25rem] leading-none">
            <span aria-hidden="true">&#123;</span>
            <span className="font-script -mx-1 translate-y-1 text-[4.7rem]">
              love
            </span>
            <span aria-hidden="true">&#125;</span>
          </p>
        </div>

        <div className="mt-auto">
          <div className="mb-14 flex items-end justify-between px-1 font-title-en text-[10px] uppercase tracking-[0.08em] text-white/85">
            <span>{brideName}</span>
            <span>{groomName}</span>
          </div>

          <div className="space-y-2 border-t border-white/20 pt-5 text-[12px] leading-5 text-white/92">
            <p className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-[1px] text-[10px]">
                □
              </span>
              <span>{displayDate}</span>
            </p>
            <p className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-[1px] text-[10px]">
                ◆
              </span>
              <span>{eventPlace || "예식 장소 입력 예정"}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
