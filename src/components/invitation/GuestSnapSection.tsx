import Link from "next/link";

import { Section } from "@/components/common/Section";
import type { Wedding } from "@/types/wedding";

type GuestSnapSectionProps = {
  wedding: Wedding;
};

// 접수 여부는 /photos 페이지가 판단합니다. 여기서 확인하면 메인 페이지가
// 요청마다 새로 렌더링되므로 버튼은 항상 표시합니다.
export function GuestSnapSection({ wedding }: GuestSnapSectionProps) {
  const { title, message, buttonLabel, href } = wedding.guestSnap;

  return (
    <Section
      className="movie-paper pb-28 pt-24"
      description={message}
      eyebrow="Guest Snap"
      title={title}
    >
      <div className="mt-8" data-reveal="fade-up" data-reveal-delay="120">
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-transparent bg-[var(--color-button)] px-7 text-sm font-medium tracking-[-0.01em] text-white shadow-sm transition-colors duration-200 hover:bg-[var(--color-button-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)]"
          href={href}
        >
          {buttonLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Section>
  );
}
