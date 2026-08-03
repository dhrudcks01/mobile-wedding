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

  const closeModal = useCallback(() => setSelectedIndex(null), []);

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
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
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
      className="movie-paper-muted overflow-hidden px-6 pb-28 pt-24"
      description="좌우로 넘기거나 사진을 눌러 크게 감상해 주세요."
      eyebrow="Scenes"
      title="Gallery"
    >
      <div
        className="film-strip -mx-6 mt-14 flex snap-x snap-mandatory gap-2 overflow-x-auto bg-[var(--color-dark)] px-4 py-4"
        data-reveal="fade-up"
        data-reveal-duration="1400"
      >
        {gallery.map((image, index) => (
          <button
            aria-label={`갤러리 이미지 ${index + 1} 크게 보기`}
            className="group relative aspect-[3/4] w-[76%] shrink-0 snap-center overflow-hidden border border-white/20 bg-[var(--color-dark-raised)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            key={`${image}-${index}`}
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            <div className="absolute inset-x-0 top-0 z-10 flex h-5 items-center justify-between border-b border-white/20 bg-[var(--color-dark)] px-2 font-title-en text-[7px] tracking-[0.08em] text-white/58">
              <span>WEDDING FILM</span>
              <span>{String(index + 1).padStart(2, "0")}A</span>
            </div>
            <ImageWithFallback
              alt={`갤러리 이미지 ${index + 1}`}
              className="object-cover pt-5 transition duration-700 group-hover:scale-[1.03]"
              fill
              fallbackClassName="bg-[var(--color-dark-raised)] text-white/70"
              fallbackDescription="이미지 경로를 확인해 주세요."
              fallbackTitle="Wedding Film"
              loading="lazy"
              sizes="(max-width: 430px) 76vw, 320px"
              src={image}
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgba(0,0,0,0.22))]" />
            <span className="absolute inset-x-0 bottom-0 z-10 h-4 border-t border-white/20 bg-[var(--color-dark)]" />
          </button>
        ))}
      </div>

      <p
        className="mt-8 text-[11px] tracking-[0.02em] text-[var(--section-muted)]"
        data-reveal="fade-up"
        data-reveal-delay="180"
      >
        Film {String(gallery.length).padStart(2, "0")} frames · tap to enlarge
      </p>

      {selectedImage ? (
        <div
          aria-label={selectedLabel}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] px-4 py-6 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
        >
          <div
            className="relative flex w-full max-w-[430px] flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[72svh] overflow-hidden border border-white/18 bg-[#111] shadow-[0_28px_90px_rgba(0,0,0,0.48)]">
              <ImageWithFallback
                alt={selectedLabel}
                className="object-contain"
                fill
                fallbackClassName="bg-[#111] text-white/80"
                fallbackDescription="이미지 경로를 확인해 주세요."
                fallbackTitle="Wedding Film"
                sizes="(max-width: 430px) 100vw, 430px"
                src={selectedImage}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-14 text-[10px] tracking-[0.06em] text-white/80">
                <span>{selectedLabel}</span>
                <span>WEDDING FILM</span>
              </div>
            </div>

            <button
              aria-label="갤러리 닫기"
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-white/20 bg-black/55 text-xl text-white backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              onClick={closeModal}
              type="button"
            >
              ×
            </button>

            {gallery.length > 1 ? (
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                <button
                  aria-label="이전 사진 보기"
                  className="pointer-events-auto grid size-11 place-items-center rounded-full border border-white/20 bg-black/55 text-xl text-white backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  onClick={showPrevious}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="다음 사진 보기"
                  className="pointer-events-auto grid size-11 place-items-center rounded-full border border-white/20 bg-black/55 text-xl text-white backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  onClick={showNext}
                  type="button"
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
