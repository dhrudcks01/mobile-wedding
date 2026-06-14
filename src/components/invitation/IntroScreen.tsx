"use client";

import { useEffect, useState } from "react";

import type { Wedding } from "@/types/wedding";
import {ImageWithFallback} from "@/components/common/ImageWithFallback";

const INTRO_DISPLAY_MS = 2500;
const INTRO_FADE_OUT_MS = 500;

type IntroScreenProps = {
  wedding: Wedding;
};

type IntroPhase = "visible" | "leaving" | "hidden";

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

function getCoupleNames(wedding: Wedding) {
  const groomName = getDisplayText(wedding.couple.groom.name, "신랑");
  const brideName = getDisplayText(wedding.couple.bride.name, "신부");

  return `${groomName} · ${brideName}`;
}

export function IntroScreen({ wedding }: IntroScreenProps) {
  const [phase, setPhase] = useState<IntroPhase>("visible");
  const coupleNames = getCoupleNames(wedding);
  const introMessage = getDisplayText(
    wedding.intro.message,
    "저희의 시작에 초대합니다.",
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fadeOutMs = reduceMotion ? 0 : INTRO_FADE_OUT_MS;
    const previousOverflow = document.body.style.overflow;
    const leaveTimer = window.setTimeout(() => {
      setPhase("leaving");
    }, INTRO_DISPLAY_MS);
    const hideTimer = window.setTimeout(() => {
      setPhase("hidden");
    }, INTRO_DISPLAY_MS + fadeOutMs);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === "hidden") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  if (phase === "hidden") {
    return null;
  }
  const introImage = wedding.meta.ogImage.trim() || "/images/og-image.jpg";
  return (
    <div
      className={[
        "intro-motion fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-page)] px-6",
        phase === "leaving"
          ? "animate-[intro-fade-out_500ms_ease-in_forwards]"
          : "animate-[intro-fade-in_700ms_ease-out_both]",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-label="청첩장 인트로"
    >
      <div className="relative flex min-h-[100svh] w-full max-w-[430px] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#fffaf2_0%,#f3e8db_46%,#e7d8c7_100%)] px-8 text-center shadow-[0_24px_80px_rgba(70,55,42,0.14)] sm:my-8 sm:min-h-[calc(100vh-4rem)] sm:rounded-[32px]">
        <div className="absolute -top-24 h-52 w-52 rounded-full bg-white/45 blur-3xl" />
        <div className="absolute -bottom-20 h-44 w-44 rounded-full bg-[#c9a894]/25 blur-3xl" />
        <ImageWithFallback
            alt={`${coupleNames} 웨딩 대표 이미지`}
            className="object-cover"
            fill
            fallbackDescription="대표 사진을 public/images/og-image.jpg로 넣으면 자동으로 표시됩니다."
            fallbackTitle="대표 사진 준비 중"
            priority
            sizes="(max-width: 430px) 100vw, 430px"
            src={introImage}
        />

        <div className="absolute inset-0 bg-white/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/20 to-[#f3e8db]/65" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="mb-7 h-px w-14 bg-[var(--color-accent)]/45" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Wedding Invitation
          </p>
          <h1 className="mt-6 text-[2.65rem] font-semibold leading-none text-[var(--color-text)]">
            {coupleNames}
          </h1>
          <p className="mt-7 max-w-[250px] text-sm leading-7 text-[var(--color-text-muted)]">
            {introMessage}
          </p>
          <span className="mt-8 h-px w-14 bg-[var(--color-accent)]/45" />
        </div>
      </div>
    </div>
  );
}
