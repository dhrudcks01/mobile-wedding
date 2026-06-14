import { Section } from "@/components/common/Section";
import { getAvailableMapLinks } from "@/lib/map";
import type { Wedding } from "@/types/wedding";

type LocationSectionProps = {
  wedding: Wedding;
};

type InfoBlockProps = {
  label: string;
  value: string;
};

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <div className="rounded-[24px] border border-[var(--color-line)] bg-white/55 px-5 py-4 text-left">
      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-accent)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
        {value.trim() || "안내 문구 입력 예정"}
      </p>
    </div>
  );
}

export function LocationSection({ wedding }: LocationSectionProps) {
  const mapLinks = getAvailableMapLinks(wedding.mapLinks);
  const venueName = getDisplayText(wedding.event.venueName, "예식장 입력 예정");
  const hallName = getDisplayText(wedding.event.hallName, "홀 정보 입력 예정");
  const address = getDisplayText(wedding.event.address, "주소 입력 예정");
  const locationLabel = `${venueName} ${hallName}`;

  return (
    <Section
      className="bg-[var(--color-surface-muted)]"
      eyebrow="Location"
      title="오시는 길"
      description="예식 장소와 이동 정보를 안내드립니다."
    >
      <div className="mt-9 overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-white/65 text-left shadow-[0_18px_50px_rgba(91,69,55,0.08)]">
        <div className="border-b border-[var(--color-line)] px-6 py-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)]">
            VENUE
          </p>
          <h3 className="mt-3 text-2xl font-semibold leading-tight text-[var(--color-text)]">
            {venueName}
          </h3>
          <p className="mt-2 text-base font-medium text-[var(--color-text)]">
            {hallName}
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
            {address}
          </p>
        </div>

        <div className="grid gap-3 px-4 py-4">
          <InfoBlock label="PARKING" value={wedding.event.parking} />
          <InfoBlock label="TRANSPORT" value={wedding.event.transport} />
        </div>
      </div>

      {mapLinks.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {mapLinks.map((mapLink) => (
            <a
              aria-label={`${locationLabel} ${mapLink.label}에서 보기`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text)] shadow-sm transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
              href={mapLink.href}
              key={mapLink.key}
              rel="noreferrer"
              target="_blank"
            >
              {mapLink.label}
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-[24px] border border-[var(--color-line)] bg-white/55 px-5 py-5 text-sm leading-7 text-[var(--color-text-muted)]">
          지도 앱 링크가 입력되면 길찾기 버튼이 표시됩니다.
        </p>
      )}
    </Section>
  );
}
