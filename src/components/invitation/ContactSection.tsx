import { Section } from "@/components/common/Section";
import type { Wedding } from "@/types/wedding";

type ContactSectionProps = {
  wedding: Wedding;
};

type ContactPerson = {
  label: string;
  name: string;
  phone: string;
};

function formatPhoneLink(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function ContactActions({ label, name, phone }: ContactPerson) {
  const phoneNumber = formatPhoneLink(phone);

  return (
    <div className="flex items-center justify-between gap-4 border-t border-[var(--section-line)] py-5">
      <div className="text-left">
        <p className="font-title-en text-[10px] tracking-[0.12em] text-[var(--section-muted)]">
          {label}
        </p>
        <p className="font-korean-serif mt-1 text-lg font-bold text-[var(--section-text)]">
          {name}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a
          aria-label={`${name}에게 전화하기`}
          className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--color-button)] text-[11px] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
          href={`tel:${phoneNumber}`}
        >
          전화
        </a>
        <a
          aria-label={`${name}에게 문자 보내기`}
          className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--section-line)] bg-white/35 text-[11px] text-[var(--section-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
          href={`sms:${phoneNumber}`}
        >
          문자
        </a>
      </div>
    </div>
  );
}

export function ContactSection({ wedding }: ContactSectionProps) {
  const contacts: ContactPerson[] = [
    {
      label: "GROOM",
      name: wedding.couple.groom.name,
      phone: wedding.couple.groom.phone,
    },
    {
      label: "BRIDE",
      name: wedding.couple.bride.name,
      phone: wedding.couple.bride.phone,
    },
  ].filter((contact) => formatPhoneLink(contact.phone).length > 0);

  if (contacts.length === 0) {
    return null;
  }

  return (
    <Section
      className="movie-paper-muted pb-28 pt-24"
      description="축하와 문의가 필요할 때 연락해 주세요."
      eyebrow="Call Sheet"
      title="Contact"
    >
      <div
        className="mt-10 border-b border-[var(--section-line)]"
        data-reveal="fade-up"
        data-reveal-duration="1200"
      >
        {contacts.map((contact) => (
          <ContactActions key={contact.label} {...contact} />
        ))}
      </div>
    </Section>
  );
}
