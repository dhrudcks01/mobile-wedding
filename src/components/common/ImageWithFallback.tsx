"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = Omit<ImageProps, "onError" | "src"> & {
  src: string;
  fallbackClassName?: string;
  fallbackDescription?: string;
  fallbackTitle?: string;
};

export function ImageWithFallback({
  alt,
  className,
  fallbackClassName = "",
  fallbackDescription = "이미지 파일을 public/images에 추가하면 이 영역에 표시됩니다.",
  fallbackTitle = "사진 준비 중",
  src,
  ...imageProps
}: ImageWithFallbackProps) {
  const imageSrc = src.trim();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const shouldShowFallback = imageSrc.length === 0 || failedSrc === imageSrc;
  const fallbackClasses = [
    "absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-[var(--color-text-muted)]",
    fallbackClassName,
  ]
    .filter(Boolean)
    .join(" ");

  if (shouldShowFallback) {
    return (
      <div className={fallbackClasses} role="img" aria-label={alt}>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Image
        </span>
        <span className="text-base font-semibold text-[var(--color-text)]">
          {fallbackTitle}
        </span>
        <span className="max-w-[220px] text-xs leading-5">
          {fallbackDescription}
        </span>
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(imageSrc)}
      src={imageSrc}
    />
  );
}
