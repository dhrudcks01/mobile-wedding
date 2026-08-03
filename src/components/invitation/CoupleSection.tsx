import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Section } from "@/components/common/Section";
import type { Wedding, WeddingPerson } from "@/types/wedding";

type CoupleSectionProps = {
  wedding: Wedding;
};

type CastPersonProps = {
  englishName: string;
  image: string;
  label: string;
  person: WeddingPerson;
  reverse?: boolean;
};

function getFamilyLine(person: WeddingPerson, relation: string) {
  const parents = [person.father, person.mother]
    .map((name) => name.trim())
    .filter(Boolean)
    .join(" · ");

  return parents ? `${parents}의 ${relation}` : "";
}

function CastPerson({
  englishName,
  image,
  label,
  person,
  reverse = false,
}: CastPersonProps) {
  const relation = label === "GROOM" ? "아들" : "딸";
  const familyLine = getFamilyLine(person, relation);
  const name = person.name.trim() || "이름 입력 예정";
  const photo = image.trim();

  return (
    <article
      className={`flex items-center gap-5 ${reverse ? "flex-row-reverse" : ""}`}
      data-reveal="fade-up"
      data-reveal-delay={reverse ? "140" : "0"}
      data-reveal-duration="1200"
    >
      {photo ? (
        <div className="relative aspect-[3/4] w-[38%] shrink-0 overflow-hidden bg-[var(--color-dark-raised)]">
          <ImageWithFallback
            alt={`${label === "GROOM" ? "신랑" : "신부"} ${name}`}
            className="object-cover"
            fallbackClassName="bg-[var(--color-dark-raised)] text-white/70"
            fallbackDescription="wedding.ts의 images.groom / images.bride 경로를 확인해 주세요."
            fallbackTitle={label}
            fill
            loading="lazy"
            sizes="(max-width: 430px) 38vw, 145px"
            src={photo}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 border border-[var(--color-line)]/25"
          />
        </div>
      ) : null}

      <div className={`min-w-0 flex-1 ${reverse ? "text-right" : "text-left"}`}>
        <p className="font-title-en text-[10px] font-semibold tracking-[0.22em] text-[var(--color-accent)]">
          {label}
        </p>
        <h3 className="font-korean-serif mt-2 text-[1.7rem] font-bold leading-none text-[var(--section-text)]">
          {name}
        </h3>
        <p className="font-title-en mt-2 text-[0.95rem] font-semibold tracking-[0.05em] text-[var(--color-accent)]">
          {englishName.trim() || label}
        </p>
        {familyLine ? (
          <p className="mt-3 text-[12px] leading-6 text-[var(--section-muted)]">
            {familyLine}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function CoupleSection({ wedding }: CoupleSectionProps) {
  return (
    <Section className="movie-paper pb-28 pt-24" eyebrow="Actors" title="Cast">
      <div className="mt-10 space-y-9">
        <CastPerson
          englishName={wedding.intro.groom.name}
          image={wedding.images.groom}
          label="GROOM"
          person={wedding.couple.groom}
        />

        <div
          aria-hidden="true"
          className="flex items-center gap-3 text-[var(--color-accent)]"
        >
          <span className="h-px flex-1 bg-[var(--section-line)]" />
          <span className="font-heading text-[1.5rem] leading-none">&amp;</span>
          <span className="h-px flex-1 bg-[var(--section-line)]" />
        </div>

        <CastPerson
          englishName={wedding.intro.bride.name}
          image={wedding.images.bride}
          label="BRIDE"
          person={wedding.couple.bride}
          reverse
        />
      </div>
    </Section>
  );
}
