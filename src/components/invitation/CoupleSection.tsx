import { Section } from "@/components/common/Section";
import type { Wedding } from "@/data/wedding";

type CoupleSectionProps = {
  wedding: Wedding;
};

type Person = {
  father: string;
  mother: string;
  name: string;
};

type CoupleCardProps = {
  label: string;
  person: Person;
};

function CoupleCard({ label, person }: CoupleCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--color-line)] bg-white/55 px-5 py-6 text-center shadow-[0_18px_50px_rgba(91,69,55,0.08)]">
      <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)]">
        {label}
      </p>
      <h3 className="mt-4 text-3xl font-semibold leading-none text-[var(--color-text)]">
        {person.name}
      </h3>
      <dl className="mt-6 space-y-3 text-sm leading-6 text-[var(--color-text-muted)]">
        <div className="flex items-center justify-center gap-3">
          <dt className="text-xs font-medium text-[var(--color-accent)]">아버지</dt>
          <dd>{person.father}</dd>
        </div>
        <div className="flex items-center justify-center gap-3">
          <dt className="text-xs font-medium text-[var(--color-accent)]">어머니</dt>
          <dd>{person.mother}</dd>
        </div>
      </dl>
    </article>
  );
}

export function CoupleSection({ wedding }: CoupleSectionProps) {
  return (
    <Section
      eyebrow="Bride & Groom"
      title="두 사람을 소개합니다"
      description="서로의 가족과 함께 감사한 마음으로 인사드립니다."
    >
      <div className="mt-9 grid gap-4">
        <CoupleCard label="Groom" person={wedding.couple.groom} />
        <CoupleCard label="Bride" person={wedding.couple.bride} />
      </div>
    </Section>
  );
}
