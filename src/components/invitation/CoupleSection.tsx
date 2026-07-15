import { Section } from "@/components/common/Section";
import type { Wedding, WeddingPerson } from "@/types/wedding";

type CoupleSectionProps = {
  wedding: Wedding;
};

type CastPersonProps = {
  englishName: string;
  label: string;
  person: WeddingPerson;
};

function getFamilyLine(person: WeddingPerson, relation: string) {
  const parents = [person.father, person.mother]
    .map((name) => name.trim())
    .filter(Boolean)
    .join(" · ");

  return parents ? `${parents}의 ${relation}` : "";
}

function CastPerson({ englishName, label, person }: CastPersonProps) {
  const relation = label === "GROOM" ? "아들" : "딸";
  const familyLine = getFamilyLine(person, relation);

  return (
    <article
      className="py-9 text-center"
      data-reveal="fade-up"
      data-reveal-delay={label === "GROOM" ? "0" : "140"}
      data-reveal-duration="1200"
    >
      {familyLine ? (
        <p className="text-[13px] leading-6 text-[var(--section-muted)]">
          {familyLine}
        </p>
      ) : null}
      <h3 className="font-korean-serif mt-4 text-[1.8rem] font-bold leading-none text-[var(--section-text)]">
        {person.name.trim() || "이름 입력 예정"}
      </h3>
      <p className="font-title-en mt-4 text-[0.95rem] font-semibold tracking-[0.05em] text-[#b7aa9c]">
        {englishName.trim() || label}
      </p>
    </article>
  );
}

export function CoupleSection({ wedding }: CoupleSectionProps) {
  return (
    <Section className="movie-paper-muted pb-28 pt-24" eyebrow="Actors" title="Cast">
      <div className="mt-9 divide-y divide-[var(--section-line)]/55">
        <CastPerson
          englishName={wedding.intro.groom.name}
          label="GROOM"
          person={wedding.couple.groom}
        />
        <CastPerson
          englishName={wedding.intro.bride.name}
          label="BRIDE"
          person={wedding.couple.bride}
        />
      </div>

      <div
        className="mt-8 border-t border-[var(--section-line)] pt-8 text-[12px] leading-6 text-[var(--section-muted)]"
        data-reveal="fade-up"
        data-reveal-delay="180"
      >
        <p>{wedding.event.displayDate}</p>
        <p>{[wedding.event.venueName, wedding.event.hallName].filter(Boolean).join(" ")}</p>
      </div>
    </Section>
  );
}
