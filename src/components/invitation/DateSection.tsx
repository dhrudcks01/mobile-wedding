"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Section } from "@/components/common/Section";
import { CalendarButton } from "@/components/invitation/CalendarButton";
import {
  buildWeddingMonthCalendar,
  WEEKDAY_LABELS,
} from "@/lib/calendar";
import { getWeddingCountdownText, getWeddingDate } from "@/lib/date";
import type { Wedding } from "@/types/wedding";

type DateSectionProps = {
  wedding: Wedding;
};

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EMPTY_COUNTDOWN: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const ENGLISH_WEEKDAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

function getPosterDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "WEDDING DAY";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}. ${ENGLISH_WEEKDAYS[date.getDay()]}`;
}

function getPosterTime(dateTime: string) {
  const timeMatch = dateTime.match(/T(\d{2}):(\d{2})/);

  if (!timeMatch) {
    return "TIME TO BE ANNOUNCED";
  }

  const hour = Number(timeMatch[1]);
  const minute = timeMatch[2];
  const meridiem = hour >= 12 ? "PM" : "AM";
  const hour12 = String(hour % 12 || 12).padStart(2, "0");

  return `${hour12}:${minute} ${meridiem}`;
}

function getCountdownParts(dateTime: string): CountdownParts {
  const targetTime = new Date(dateTime).getTime();

  if (Number.isNaN(targetTime)) {
    return EMPTY_COUNTDOWN;
  }

  const difference = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function CountdownClock({ dateTime }: { dateTime: string }) {
  const [countdown, setCountdown] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdownParts(dateTime));

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [dateTime]);

  const values = [
    { label: "Days", value: countdown?.days },
    { label: "Hours", value: countdown?.hours },
    { label: "Min", value: countdown?.minutes },
    { label: "Sec", value: countdown?.seconds },
  ];

  return (
    <div
      className="mt-10 grid grid-cols-4 gap-2"
      data-reveal="fade-up"
      data-reveal-duration="1200"
      role="timer"
      aria-live="off"
    >
      {values.map((item) => (
        <div
          className="bg-[var(--color-accent-strong)] px-1 py-4 text-center"
          key={item.label}
        >
          <strong className="font-title-en block text-[1.55rem] font-normal leading-none text-[var(--color-on-dark)]">
            {item.value === undefined ? "--" : String(item.value).padStart(2, "0")}
          </strong>
          <span className="font-title-en mt-2 block text-[9px] uppercase tracking-[0.14em] text-[var(--color-on-dark-muted)]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CountdownSentence({ wedding }: { wedding: Wedding }) {
  const countdown = getWeddingCountdownText(wedding.event.dateTime);
  const coupleNames = `${wedding.couple.groom.name} & ${wedding.couple.bride.name}`;

  if (countdown.message === "until" && countdown.daysUntil !== null) {
    return (
      <p
        className="mt-6 text-[12px] leading-6 text-[var(--section-muted)]"
        data-reveal="fade-up"
        data-reveal-delay="150"
      >
        {coupleNames}의 결혼식이 <strong>{countdown.daysUntil}일</strong> 남았습니다.
      </p>
    );
  }

  return (
    <p
      className="mt-6 text-[12px] leading-6 text-[var(--section-muted)]"
      data-reveal="fade-up"
      data-reveal-delay="150"
    >
      {countdown.message}
    </p>
  );
}

export function DateSection({ wedding }: DateSectionProps) {
  const weddingDate = getWeddingDate(wedding.event.dateTime);
  const calendarCells = buildWeddingMonthCalendar(wedding.event.dateTime);
  const posterDate = getPosterDate(weddingDate);
  const posterTime = getPosterTime(wedding.event.dateTime);

  return (
    <Section
      className="movie-paper pb-28 pt-24"
      eyebrow="When"
      title="Our Day"
    >
      <CountdownClock dateTime={wedding.event.dateTime} />
      <CountdownSentence wedding={wedding} />

      <article
        // 카드 배경(#e0d9c6)과 섹션 배경(#f1eee7)의 대비는 1.2:1뿐이라
        // 색만으로는 경계가 잡히지 않습니다. 종이 질감은 그대로 두고
        // 테두리와 그림자로 '얹힌 카드'라는 걸 만듭니다.
        className="relative mt-14 overflow-hidden border border-[var(--color-line)] bg-[var(--color-calendar)] px-7 pb-14 pt-11 text-center shadow-[0_14px_36px_rgba(65,55,50,0.12)]"
        data-reveal="fade-up"
        data-reveal-duration="1300"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none object-cover mix-blend-multiply"
          fill
          loading="lazy"
          sizes="(max-width: 430px) 88vw, 360px"
          src="/images/calendar-hands-lineart.png"
        />

        <div className="relative z-10">
          <p className="font-title-en text-[1.02rem] font-semibold leading-none tracking-[-0.01em] text-[var(--color-text)]">
            {posterDate}
          </p>
          <p className="font-title-en mt-2 text-[0.82rem] font-semibold leading-none text-[var(--color-text)]">
            {posterTime}
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-10 max-w-[270px]">
          <div className="grid grid-cols-7 gap-y-3.5 text-center">
            {WEEKDAY_LABELS.map((label, index) => (
              <span
                className="font-title-en text-[8px] font-semibold tracking-[0.08em] text-[var(--color-text-muted)]"
                key={`weekday-${index}`}
              >
                {label}
              </span>
            ))}
            {calendarCells.map((cell, index) => (
              <span
                className={[
                  "mx-auto flex size-7 items-center justify-center text-[10px]",
                  cell.isWeddingDay
                    ? "rounded-full bg-[var(--color-button)] font-semibold text-white"
                    : cell.isSunday
                      ? "text-[var(--color-sunday)]"
                      : "text-[var(--color-text)]",
                ].join(" ")}
                key={`day-${index}`}
              >
                {cell.day ?? ""}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/*<div data-reveal="fade-up" data-reveal-delay="120">*/}
      {/*  <CalendarButton wedding={wedding} />*/}
      {/*</div>*/}
    </Section>
  );
}
