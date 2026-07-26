import type { CSSProperties } from "react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import type { Wedding } from "@/types/wedding";

type PhotoBoothSectionProps = {
  wedding: Wedding;
};

type PhotoFrameStyle = CSSProperties & {
  "--photo-flash-delay": string;
};

const PHOTO_COUNT = 4;

function getPhotoBoothImages(wedding: Wedding) {
  const candidates = [
    ...wedding.images.film,
    ...wedding.images.gallery,
    wedding.images.poster,
    wedding.images.hero,
  ]
    .map((image) => image.trim())
    .filter(Boolean);
  const uniqueImages = [...new Set(candidates)];

  if (uniqueImages.length === 0) {
    return [];
  }

  return Array.from(
    { length: PHOTO_COUNT },
    (_, index) => uniqueImages[index % uniqueImages.length],
  );
}

export function PhotoBoothSection({ wedding }: PhotoBoothSectionProps) {
  const images = getPhotoBoothImages(wedding);
  const groomName = wedding.intro.groom.name.trim() || "Groom";
  const brideName = wedding.intro.bride.name.trim() || "Bride";

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="movie-paper-muted photo-booth-vintage film-grain relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-sm text-center">
        <div data-reveal="fade-up" data-reveal-duration="1100">
          <span className="font-title-en inline-flex min-h-7 items-center justify-center rounded-[50%] border border-[var(--section-line)] px-3 text-[10px] italic tracking-[0.08em] text-[var(--section-muted)]">
            Photo Booth
          </span>
          <h2 className="font-title-en mt-4 text-[1.65rem] font-semibold uppercase leading-none tracking-[-0.02em] text-[var(--section-text)]">
            Wedding Cuts
          </h2>
          <p className="mt-5 text-[12px] leading-6 text-[var(--section-muted)]">
            촬영한 네 장면이 포토부스에서 약 3초 동안 한 장의 필름으로 출력됩니다.
          </p>
        </div>

        <div
          className="photo-booth-vintage-panel mt-12"
          data-reveal="fade-up"
          data-reveal-duration="900"
          data-reveal-threshold="0.22"
        >
          <div className="photo-booth-printer">
            <div className="photo-booth-printer-shell">
              <div aria-hidden="true" className="photo-booth-printer-slot">
                <span className="photo-booth-slot-roller" />
              </div>
            </div>

            <div
              aria-label={`${groomName}과 ${brideName}의 웨딩 네컷 사진`}
              className="photo-booth-output"
              role="img"
            >
              <div className="photo-booth-strip">
                <div className="space-y-1.5">
                  {images.map((image, index) => {
                    const frameStyle: PhotoFrameStyle = {
                      "--photo-flash-delay": `${3.9 + index * 0.65}s`,
                    };

                    return (
                      <div
                        className="photo-booth-frame relative aspect-[4/3] overflow-hidden bg-[#c8bca9]"
                        key={`${image}-${index}`}
                        style={frameStyle}
                      >
                        <ImageWithFallback
                          alt={`웨딩 네컷 사진 ${index + 1}`}
                          className="object-cover"
                          fallbackClassName="bg-[#c8bca9] text-[#5f5449]"
                          fallbackDescription="wedding.ts의 images.film 또는 gallery 경로를 확인해 주세요."
                          fallbackTitle={`Photo ${index + 1}`}
                          fill
                          loading="lazy"
                          sizes="(max-width: 430px) 36vw, 136px"
                          src={image}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="px-1 pb-1 pt-3 text-center">
                  <p className="font-title-en whitespace-nowrap text-[0.62rem] tracking-[0.01em] text-[#2d2823]">
                    {groomName} <span className="mx-0.5 text-[#8e3f28]">&amp;</span>{" "}
                    {brideName}
                  </p>
                  <p className="mt-1 text-[6px] tracking-[0.1em] text-[#75695e]">
                    {wedding.event.displayDate || "OUR WEDDING DAY"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p
          className="font-title-en mt-5 text-[9px] tracking-[0.18em] text-[var(--section-muted)]"
          data-reveal="fade"
          data-reveal-delay="400"
        >
          PRINTED WITH LOVE · PHOTO BOOTH NO. 2026
        </p>
      </div>
    </section>
  );
}
