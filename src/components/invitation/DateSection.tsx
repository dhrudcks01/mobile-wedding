"use client";

import { CalendarButton } from "@/components/invitation/CalendarButton";
import { getDdayLabel } from "@/lib/date";
import type { Wedding } from "@/types/wedding";

type DateSectionProps = {
  wedding: Wedding;
};

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

export function DateSection({ wedding }: DateSectionProps) {
  const ddayLabel = getDdayLabel(wedding.event.dateTime);
  const eventPlace = [wedding.event.venueName, wedding.event.hallName]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");

  return (
    <section className="px-6 py-16 text-center">
      <div className="mx-auto max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Wedding Day
        </p>
        <h2 className="mt-4 text-2xl font-semibold leading-tight text-[var(--color-text)]">
          예식 일시
        </h2>

        <div className="mt-8 rounded-[32px] border border-[var(--color-line)] bg-white/60 px-5 py-7 shadow-[0_18px_50px_rgba(91,69,55,0.08)]">
          <p className="text-3xl font-semibold leading-none text-[var(--color-accent-strong)]">
            {ddayLabel}
          </p>
          <p className="mt-5 text-lg font-semibold leading-8 text-[var(--color-text)]">
            {getDisplayText(wedding.event.displayDate, "예식 일시 입력 예정")}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            {eventPlace || "예식 장소 입력 예정"}
          </p>
        </div>

        <CalendarButton wedding={wedding} />
      </div>
    </section>
  );
}
