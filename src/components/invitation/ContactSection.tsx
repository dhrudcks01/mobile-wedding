import { Section } from "@/components/common/Section";
import type { Wedding } from "@/data/wedding";

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

  if (!phoneNumber) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-[var(--color-line)] bg-white/60 p-5 shadow-[0_18px_50px_rgba(91,69,55,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div className="text-left">
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-accent)]">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
            {name}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            aria-label={`${name}에게 전화하기`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-transparent bg-[var(--color-accent-strong)] px-4 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
            href={`tel:${phoneNumber}`}
          >
            전화
          </a>
          <a
            aria-label={`${name}에게 문자 보내기`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 hover:bg-[var(--color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
            href={`sms:${phoneNumber}`}
          >
            문자
          </a>
        </div>
      </div>
    </div>
  );
}

export function ContactSection({ wedding }: ContactSectionProps) {
  const contacts: ContactPerson[] = [
    {
      label: "Groom",
      name: wedding.couple.groom.name,
      phone: wedding.couple.groom.phone,
    },
    {
      label: "Bride",
      name: wedding.couple.bride.name,
      phone: wedding.couple.bride.phone,
    },
  ];

  const visibleContacts = contacts.filter(
    (contact) => formatPhoneLink(contact.phone).length > 0,
  );

  return (
    <Section
      className="bg-[var(--color-surface-muted)]"
      eyebrow="Contact"
      title="연락하기"
      description="축하와 문의가 필요할 때 바로 연락하실 수 있습니다."
    >
      {visibleContacts.length > 0 ? (
        <div className="mt-9 grid gap-4">
          {visibleContacts.map((contact) => (
            <ContactActions key={contact.label} {...contact} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-[24px] border border-[var(--color-line)] bg-white/55 px-5 py-6 text-sm leading-7 text-[var(--color-text-muted)]">
          연락처가 입력되면 전화와 문자 버튼이 표시됩니다.
        </p>
      )}
    </Section>
  );
}
