import { Section } from "@/components/common/Section";
import { KakaoMap } from "@/components/invitation/KakaoMap";
import { getAvailableMapLinks } from "@/lib/map";
import type { Wedding } from "@/types/wedding";

type LocationSectionProps = {
  kakaoJavaScriptKey?: string;
  wedding: Wedding;
};

type InfoBlockProps = {
  label: string;
  title: string;
  value: string;
};

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

function InfoBlock({ label, title, value }: InfoBlockProps) {
  if (!value.trim()) {
    return null;
  }

  return (
    <div className="border-t border-[var(--section-line)] py-6 text-left">
      <p className="font-title-en text-[10px] font-semibold tracking-[0.14em] text-[var(--section-muted)]">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold text-[var(--section-text)]">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-line text-[13px] leading-7 text-[var(--section-muted)]">
        {value}
      </p>
    </div>
  );
}

export function LocationSection({
  kakaoJavaScriptKey,
  wedding,
}: LocationSectionProps) {
  const mapLinks = getAvailableMapLinks(wedding.mapLinks);
  const venueName = getDisplayText(wedding.event.venueName, "예식장 입력 예정");
  const hallName = wedding.event.hallName.trim();
  const address = getDisplayText(wedding.event.address, "주소 입력 예정");
  const locationLabel = `${venueName} ${hallName}`.trim();

  return (
    <Section
      className="movie-paper pb-28 pt-24"
      eyebrow="Place"
      id="location"
      title="Location"
    >
      <div
        className="mt-12 text-center"
        data-reveal="fade-up"
        data-reveal-duration="1200"
      >
        <h3 className="font-korean text-[1.15rem] font-bold leading-7 text-[var(--section-text)]">
          {venueName}
          {hallName ? <span className="block">{hallName}</span> : null}
        </h3>
        <p className="mt-4 text-[12px] leading-6 text-[var(--section-muted)]">
          {address}
        </p>
      </div>

      <div
        className="mt-12"
        data-reveal="fade"
        data-reveal-duration="1400"
      >
        <KakaoMap
          address={wedding.event.address}
          javaScriptKey={kakaoJavaScriptKey}
          mapUrl={wedding.mapLinks.kakao}
          venueName={locationLabel}
        />
      </div>

      {mapLinks.length > 0 ? (
        <div
          className="mt-4 grid grid-cols-2 gap-2"
          data-reveal="fade-up"
          data-reveal-delay="120"
        >
          {mapLinks.map((mapLink) => (
            <a
              aria-label={`${locationLabel} ${mapLink.label}에서 보기`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--section-line)] bg-white/30 px-3 text-[12px] font-medium text-[var(--section-text)] transition hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
              href={mapLink.href}
              key={mapLink.key}
              rel="noreferrer"
              target="_blank"
            >
              {mapLink.label}
            </a>
          ))}
        </div>
      ) : null}

      <div className="mt-14" data-reveal="fade-up" data-reveal-duration="1200">
        <InfoBlock
          label="PUBLIC TRANSPORT"
          title="대중교통 이용 시"
          value={wedding.event.transport}
        />
        <InfoBlock
          label="PARKING"
          title="자가용 이용 시"
          value={wedding.event.parking}
        />
      </div>
    </Section>
  );
}
