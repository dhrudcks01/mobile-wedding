import { Section } from "@/components/common/Section";
import type { Wedding } from "@/data/wedding";

type GreetingSectionProps = {
  wedding: Wedding;
};

export function GreetingSection({ wedding }: GreetingSectionProps) {
  return (
    <Section
      className="bg-[var(--color-surface-muted)]"
      eyebrow="Greeting"
      title="초대합니다"
    >
      <p className="mt-8 whitespace-pre-line text-center text-[0.95rem] leading-9 text-[var(--color-text-muted)]">
        {wedding.greeting}
      </p>
    </Section>
  );
}
