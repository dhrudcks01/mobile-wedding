"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { CopyButton } from "@/components/common/CopyButton";
import { Section } from "@/components/common/Section";
import { Toast } from "@/components/common/Toast";
import {
  canUseWebShare,
  copyTextToClipboard,
  getAbsoluteUrl,
  getCurrentShareUrl,
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

const TOAST_VISIBLE_MS = 2400;

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

  const sharePayload = useMemo(
    () => ({
      imageUrl: getAbsoluteUrl(wedding.meta.ogImage, wedding.meta.url),
      text: wedding.meta.description,
      title: wedding.meta.title,
      url: shareUrl,
    }),
    [
      shareUrl,
      wedding.meta.description,
      wedding.meta.ogImage,
      wedding.meta.title,
      wedding.meta.url,
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

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
    }, TOAST_VISIBLE_MS);

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
        setFeedback({
          message: "카카오 공유를 열지 못했습니다.",
          tone: "error",
        });
      }
    } finally {
      setIsKakaoSharing(false);
    }
  };

  return (
    <Section
      className="bg-white"
      eyebrow="Share"
      title="청첩장 공유하기"
      description="소중한 분들께 이 마음을 그대로 전해 주세요."
    >
      <div className="mt-9 rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-left shadow-[0_18px_50px_rgba(91,69,55,0.08)]">
        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-accent)]">
          INVITATION LINK
        </p>
        <p className="mt-3 break-all rounded-[20px] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)]">
          {shareUrl}
        </p>

        <div className="mt-5 grid gap-3">
          <CopyButton
            className="w-full"
            onFeedback={setFeedback}
            size="md"
            successMessage="청첩장 링크를 복사했습니다."
            text={shareUrl}
            variant="primary"
          >
            링크 복사
          </CopyButton>

          <Button
            className="w-full"
            disabled={isNativeSharing}
            onClick={handleNativeShare}
            type="button"
            variant="secondary"
          >
            {isNativeSharing ? "공유 준비 중" : "기본 공유창 열기"}
          </Button>

          <Button
            className="w-full"
            disabled={!kakaoConfigured || isKakaoSharing}
            onClick={handleKakaoShare}
            type="button"
            variant="secondary"
          >
            {isKakaoSharing ? "카카오 준비 중" : "카카오톡 공유"}
          </Button>
        </div>

        <div className="mt-5 grid gap-2 text-xs leading-6 text-[var(--color-text-muted)]">
          <p>
            {isWebShareSupported
              ? "이 브라우저에서는 기본 공유창을 사용할 수 있습니다."
              : "기본 공유창 미지원 환경에서는 링크 복사로 대체됩니다."}
          </p>
          {!kakaoConfigured ? (
            <p>
              카카오톡 공유는 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` 설정 후
              활성화됩니다.
            </p>
          ) : null}
        </div>
      </div>

      <Toast message={feedback?.message ?? ""} tone={feedback?.tone} />
    </Section>
  );
}
