import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import type { Wedding } from "@/types/wedding";

type HeroSectionProps = {
  wedding: Wedding;
};

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

function getCoupleNames(wedding: Wedding) {
  const groomName = getDisplayText(wedding.couple.groom.name, "신랑");
  const brideName = getDisplayText(wedding.couple.bride.name, "신부");

  return `${groomName} · ${brideName}`;
}

export function HeroSection({ wedding }: HeroSectionProps) {
  const coupleNames = getCoupleNames(wedding);
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
    <section className="relative flex min-h-[60svh] flex-col justify-between overflow-hidden px-6 pb-10 pt-12 text-center">
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Wedding Invitation
        </p>
        <h1 className="mt-5 text-[2.7rem] font-semibold leading-none text-[var(--color-text)]">
          {coupleNames}
        </h1>
      </div>

      <div
        className="relative my-10 min-h-[700px] overflow-hidden rounded-t-[180px] border border-white/70 bg-[linear-gradient(135deg,#f5eee8,#dfcdbd)] shadow-[0_28px_70px_rgba(68,49,39,0.18)]"
      >
        <ImageWithFallback
          alt={`${coupleNames} 웨딩 대표 이미지`}
          className="object-cover"
          fill
          fallbackDescription="대표 사진을 public/images/hero.jpg로 넣으면 자동으로 표시됩니다."
          fallbackTitle="대표 사진 준비 중"
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          src={heroImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,242,0.08),rgba(73,52,42,0.3))]" />
        <div className="absolute inset-x-8 bottom-8 rounded-full border border-white/70 bg-white/75 px-5 py-4 text-sm leading-6 text-[var(--color-text-muted)] shadow-sm backdrop-blur">
          <p>{displayDate}</p>
          <p>{eventPlace || "예식 장소 입력 예정"}</p>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">
          소중한 분들을 모시고 새로운 시작을 함께 나누려 합니다.
        </p>
      </div>
    </section>
  );
}
