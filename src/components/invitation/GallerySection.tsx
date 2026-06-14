"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Section } from "@/components/common/Section";
import type { Wedding } from "@/types/wedding";

type GallerySectionProps = {
  wedding: Wedding;
};

export function GallerySection({ wedding }: GallerySectionProps) {
  const gallery = wedding.images.gallery;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage = selectedIndex === null ? null : gallery[selectedIndex];

  const selectedLabel = useMemo(() => {
    if (selectedIndex === null) {
      return "";
    }

    return `갤러리 이미지 ${selectedIndex + 1} / ${gallery.length}`;
  }, [gallery.length, selectedIndex]);

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex - 1 + gallery.length) % gallery.length;
    });
  }, [gallery.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex + 1) % gallery.length;
    });
  }, [gallery.length]);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, selectedIndex, showNext, showPrevious]);

  if (gallery.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="Gallery"
      title="우리의 순간들"
      description="사진을 눌러 크게 볼 수 있어요."
      className="bg-white"
    >
      <div className="grid grid-cols-3 gap-2.5">
        {gallery.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[3/4] overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#f5eee8,#dfcdbd)] shadow-[0_14px_30px_rgba(73,56,44,0.12)] transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            aria-label={`갤러리 이미지 ${index + 1} 크게 보기`}
          >
            <ImageWithFallback
              alt={`갤러리 이미지 ${index + 1}`}
              className="object-cover transition duration-500 group-hover:scale-105"
              fill
              fallbackDescription="이미지를 public/images에 추가하거나 경로를 확인해 주세요."
              fallbackTitle="사진 준비 중"
              loading="lazy"
              sizes="(max-width: 430px) 30vw, 126px"
              src={image}
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(63,44,31,0.18))]" />
          </button>
        ))}
      </div>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={selectedLabel}
          onClick={closeModal}
        >
          <div
            className="relative flex w-full max-w-[430px] flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative min-h-[68vh] overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#f7f0ea,#d8c2af)] shadow-[0_28px_90px_rgba(0,0,0,0.32)]"
              role="img"
              aria-label={selectedLabel}
            >
              <ImageWithFallback
                alt={selectedLabel}
                className="object-contain"
                fill
                fallbackClassName="text-white/80"
                fallbackDescription="이미지를 public/images에 추가하거나 경로를 확인해 주세요."
                fallbackTitle="사진 준비 중"
                sizes="(max-width: 430px) 100vw, 430px"
                src={selectedImage}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-stone-950/55 to-transparent px-5 pb-5 pt-14 text-xs font-medium text-white/90">
                <span>{selectedLabel}</span>
                <span>← → 키로 이동</span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-lg text-stone-700 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="갤러리 닫기"
            >
              ×
            </button>

            {gallery.length > 1 ? (
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="pointer-events-auto grid size-11 place-items-center rounded-full bg-white/90 text-xl text-stone-700 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="이전 사진 보기"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="pointer-events-auto grid size-11 place-items-center rounded-full bg-white/90 text-xl text-stone-700 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="다음 사진 보기"
                >
                  ›
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
