"use client";

import { Great_Vibes } from "next/font/google";
import { useEffect, useState } from "react";

import type { Wedding } from "@/types/wedding";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

const introCoupleScriptFont = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const INTRO_DISPLAY_MS = 3000;
const INTRO_FADE_OUT_MS = 500;

type IntroScreenProps = {
  wedding: Wedding;
};

type IntroPhase = "visible" | "leaving" | "hidden";

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

function formatIntroName(name: string) {
  return name.trim();
}

function getCoupleNames(wedding: Wedding) {
  const groomName = formatIntroName(
    getDisplayText(wedding.intro.groom.name, "Groom"),
  );
  const brideName = formatIntroName(
    getDisplayText(wedding.intro.bride.name, "Bride"),
  );

  return `${groomName} & ${brideName}`;
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
  const introImage =
    wedding.meta.ogImage.trim() ||
    "/images/000021560007.jpg";

  return (
    <div
      className={[
        "intro-motion fixed inset-0 z-[100] flex items-center justify-center opacity-100",
        phase === "leaving"
          ? "animate-[intro-fade-out_500ms_ease-in_forwards]"
          : "",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-label="청첩장 인트로"
    >
      {/* 대표 사진이 가로(1.5:1)라 본문과 같은 430px로 묶으면 좌우가 크게 잘립니다.
          데스크톱에서만 600px까지 넓혀 잘림을 줄이되, 화면 전체로는 퍼지지 않게 합니다.
          모바일은 뷰포트가 이보다 좁아 w-full로 동작하므로 영향이 없습니다. */}
      <div className="film-grain relative h-[100svh] w-full max-w-[600px] overflow-hidden bg-[var(--color-dark)] text-center shadow-[0_0_90px_rgba(0,0,0,0.55)]">
        <ImageWithFallback
          src={introImage}
          alt={`${coupleNames} 웨딩 대표 이미지`}
          fill
          priority
          sizes="(max-width: 600px) 100vw, 600px"
          className="intro-image-motion object-cover object-[center_44%] sm:object-[center_18%]"
          fallbackClassName="bg-[var(--color-dark)] text-white/70"
          fallbackTitle="대표 사진 준비 중"
          fallbackDescription="대표 사진을 public/images/hero.jpg로 넣으면 자동으로 표시됩니다."
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.1)_58%,rgba(0,0,0,0.86)_100%)]" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_28px_rgba(0,0,0,0.58)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />

        <div className="relative z-10 flex h-[100svh] flex-col items-center px-6 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top))] text-white">
          <div
            className="flex flex-col items-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.48)]"
            aria-hidden="true"
          >
            <p className="font-title-en text-[2rem] font-normal leading-[0.88] tracking-[0.04em]">
              THE
            </p>
            <p
              className={`${introCoupleScriptFont.className} -mb-1 mt-1 text-[4.15rem] font-normal leading-[0.9]`}
              style={introCoupleScriptFont.style}
            >
              Grandest
            </p>
            <p className="font-title-en text-[2.55rem] font-normal leading-[0.92] tracking-[0.02em]">
              SHOW
            </p>
            <p className="font-title-en mt-1 text-[2.45rem] font-normal leading-[0.92] tracking-[0.02em]">
              OF OUR
            </p>
            <div className="mt-1 flex items-center leading-none">
              <span className="font-title-en text-[3.5rem] font-normal">&#123;</span>
              <span
                className={`${introCoupleScriptFont.className} -mx-1 translate-y-1 text-[4.6rem] font-normal`}
                style={introCoupleScriptFont.style}
              >
                love
              </span>
              <span className="font-title-en text-[3.5rem] font-normal">&#125;</span>
            </div>
          </div>

          <div className="mt-auto flex flex-col items-center text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]">
            <h1
              className={`${introCoupleScriptFont.className} text-[2.4rem] font-normal leading-none`}
              style={introCoupleScriptFont.style}
            >
              {coupleNames}
            </h1>
            <span className="my-4 h-px w-10 bg-white/65" />
            <p className="font-korean-serif max-w-[285px] whitespace-pre-line text-[0.8rem] leading-6 tracking-[0.08em] text-white/90">
              {introMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
