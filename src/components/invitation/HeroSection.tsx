import type { Wedding } from "@/data/wedding";

type HeroSectionProps = {
  wedding: Wedding;
};

function getCoupleNames(wedding: Wedding) {
  return `${wedding.couple.groom.name} · ${wedding.couple.bride.name}`;
}

export function HeroSection({ wedding }: HeroSectionProps) {
  const coupleNames = getCoupleNames(wedding);
  const eventPlace = [wedding.event.venueName, wedding.event.hallName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-10 pt-12 text-center">
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Wedding Invitation
        </p>
        <h1 className="mt-5 text-[2.7rem] font-semibold leading-none text-[var(--color-text)]">
          {coupleNames}
        </h1>
      </div>

      <div
        aria-label={`${coupleNames} 웨딩 대표 이미지`}
        className="relative my-10 min-h-[430px] overflow-hidden rounded-t-[180px] border border-white/70 bg-[var(--color-surface-muted)] shadow-[0_28px_70px_rgba(68,49,39,0.18)]"
        role="img"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,250,242,0.08), rgba(73,52,42,0.3)), url("${wedding.images.hero}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-x-8 bottom-8 rounded-full border border-white/70 bg-white/75 px-5 py-4 text-sm leading-6 text-[var(--color-text-muted)] shadow-sm backdrop-blur">
          <p>{wedding.event.displayDate}</p>
          <p>{eventPlace}</p>
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
