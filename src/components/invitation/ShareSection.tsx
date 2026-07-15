"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { CopyButton } from "@/components/common/CopyButton";
import { Section } from "@/components/common/Section";
import { Toast } from "@/components/common/Toast";
import { EndingFilm } from "@/components/invitation/EndingFilm";
import {
  canUseWebShare,
  copyTextToClipboard,
  getCurrentShareUrl,
  getOptimizedShareImageUrl,
  getUrlWithHash,
  isKakaoShareConfigured,
  shareWithKakao,
  shareWithWebShare,
} from "@/lib/share";
import type { Wedding } from "@/types/wedding";

type ShareSectionProps = {
  kakaoJavaScriptKey?: string;
  wedding: Wedding;
};

type ShareFeedback = {
  message: string;
  tone: "success" | "error";
};

type CreditRowProps = {
  koreanLabel: string;
  koreanName: string;
  role: string;
};

const TOAST_VISIBLE_MS = 2400;

function CreditRow({ koreanLabel, koreanName, role }: CreditRowProps) {
  if (!koreanName.trim()) {
    return null;
  }

  return (
    <div className="grid grid-cols-[1.2fr_1fr] gap-5 text-left">
      <div className="text-right">
        <p className="font-title-en text-[10px] tracking-[0.02em] text-white/48">
          {role}
        </p>
        <p className="mt-1 text-[10px] text-white/38">{koreanLabel}</p>
      </div>
      <p className="font-korean-serif text-[12px] font-bold leading-8 text-white/82">
        {koreanName}
      </p>
    </div>
  );
}

export function ShareSection({
  kakaoJavaScriptKey,
  wedding,
}: ShareSectionProps) {
  const [feedback, setFeedback] = useState<ShareFeedback | null>(null);
  const [isKakaoSharing, setIsKakaoSharing] = useState(false);
  const [isNativeSharing, setIsNativeSharing] = useState(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  const [shareUrl, setShareUrl] = useState(wedding.meta.url);
  const kakaoConfigured = isKakaoShareConfigured(kakaoJavaScriptKey);
  const endingImages = wedding.images.ending.length
    ? wedding.images.ending
    : wedding.images.gallery;

  const sharePayload = useMemo(
    () => ({
      imageUrl: getOptimizedShareImageUrl(wedding.meta.ogImage, shareUrl),
      locationUrl:
        wedding.mapLinks.kakao.trim() || getUrlWithHash(shareUrl, "location"),
      text: wedding.meta.description,
      title: wedding.meta.title,
      url: shareUrl,
    }),
    [
      shareUrl,
      wedding.meta.description,
      wedding.meta.ogImage,
      wedding.meta.title,
      wedding.mapLinks.kakao,
    ],
  );

  useEffect(() => {
    setShareUrl(getCurrentShareUrl(wedding.meta.url));
  }, [wedding.meta.url]);

  useEffect(() => {
    setIsWebShareSupported(canUseWebShare(sharePayload));
  }, [sharePayload]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => setFeedback(null), TOAST_VISIBLE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const copyShareUrl = async (message: string) => {
    await copyTextToClipboard(shareUrl);
    setFeedback({ message, tone: "success" });
  };

  const handleNativeShare = async () => {
    setIsNativeSharing(true);

    try {
      if (!isWebShareSupported) {
        await copyShareUrl("공유창을 지원하지 않아 링크를 복사했습니다.");
        return;
      }

      await shareWithWebShare(sharePayload);
      setFeedback({ message: "공유창을 열었습니다.", tone: "success" });
    } catch {
      setFeedback({
        message: "공유하지 못했습니다. 링크 복사를 이용해 주세요.",
        tone: "error",
      });
    } finally {
      setIsNativeSharing(false);
    }
  };

  const handleKakaoShare = async () => {
    if (!kakaoConfigured) {
      return;
    }

    setIsKakaoSharing(true);

    try {
      const result = await shareWithKakao(sharePayload, kakaoJavaScriptKey);

      if (result === "shared") {
        setFeedback({ message: "카카오톡 공유창을 열었습니다.", tone: "success" });
        return;
      }

      await copyShareUrl("카카오 공유 대신 링크를 복사했습니다.");
    } catch {
      try {
        await copyShareUrl("카카오 공유 대신 링크를 복사했습니다.");
      } catch {
        setFeedback({ message: "카카오 공유를 열지 못했습니다.", tone: "error" });
      }
    } finally {
      setIsKakaoSharing(false);
    }
  };

  return (
    <Section className="movie-dark min-h-[100svh] !px-0 !pb-16 !pt-0">
      <EndingFilm images={endingImages} />

      <div
        className="mt-12 px-6"
        data-reveal="fade-up"
        data-reveal-duration="1100"
      >
        <h2 className="font-title-en text-[13px] font-semibold uppercase leading-none tracking-[0.02em] text-white">
          Cast
        </h2>
      </div>

      <div
        className="mt-10 space-y-4 px-6"
        data-reveal="fade-up"
        data-reveal-duration="1400"
      >
        <CreditRow koreanLabel="신랑" koreanName={wedding.couple.groom.name} role="GROOM" />
        <CreditRow koreanLabel="신부" koreanName={wedding.couple.bride.name} role="BRIDE" />
        <CreditRow
          koreanLabel="신랑 아버지"
          koreanName={wedding.couple.groom.father}
          role="GROOM'S FATHER"
        />
        <CreditRow
          koreanLabel="신랑 어머니"
          koreanName={wedding.couple.groom.mother}
          role="GROOM'S MOTHER"
        />
        <CreditRow
          koreanLabel="신부 아버지"
          koreanName={wedding.couple.bride.father}
          role="BRIDE'S FATHER"
        />
        <CreditRow
          koreanLabel="신부 어머니"
          koreanName={wedding.couple.bride.mother}
          role="BRIDE'S MOTHER"
        />
      </div>

      <div
        className="mx-6 mt-28 border-t border-white/12 pt-14"
        data-reveal="fade-up"
        data-reveal-duration="1300"
      >
        <p className="font-title-en text-[10px] tracking-[0.2em] text-white/45">
          SHARE THE INVITATION
        </p>
        <div className="mt-7 grid gap-3">
          <CopyButton
            className="w-full !border-white !bg-white !text-[#111514] hover:!bg-white/90"
            onFeedback={setFeedback}
            size="md"
            successMessage="청첩장 링크를 복사했습니다."
            text={shareUrl}
          >
            링크 복사
          </CopyButton>
          <Button
            aria-label="기본 공유창으로 청첩장 공유하기"
            className="w-full !border-white/25 !bg-transparent !text-white hover:!bg-white/10"
            disabled={isNativeSharing}
            onClick={handleNativeShare}
            variant="secondary"
          >
            {isNativeSharing ? "공유 준비 중" : "공유창 열기"}
          </Button>
          {kakaoConfigured ? (
            <Button
              aria-label="카카오톡으로 청첩장 공유하기"
              className="w-full !border-[#f5df49] !bg-[#f5df49] !text-[#2d241f] hover:!bg-[#f7e567]"
              disabled={isKakaoSharing}
              onClick={handleKakaoShare}
              variant="secondary"
            >
              {isKakaoSharing ? "카카오 준비 중" : "카카오톡 공유"}
            </Button>
          ) : null}
        </div>
      </div>

      <div
        className="mt-24 text-center text-[9px] uppercase leading-5 tracking-[0.12em] text-white/32"
        data-reveal="fade"
        data-reveal-duration="1400"
      >
        <p>
          {wedding.intro.groom.name} &amp; {wedding.intro.bride.name}
        </p>
        <p>Wedding Film · 2026</p>
      </div>

      <Toast message={feedback?.message ?? ""} tone={feedback?.tone} />
    </Section>
  );
}
