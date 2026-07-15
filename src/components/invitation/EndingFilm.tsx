import type { CSSProperties } from "react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

type EndingFilmProps = {
  images: string[];
};

type EndingFilmStyle = CSSProperties & {
  "--ending-copy-delay": string;
};

type EndingFrameStyle = CSSProperties & {
  "--ending-frame-delay": string;
};

const MAX_ENDING_FRAMES = 4;
const FRAME_STAGGER_SECONDS = 1.2;

export function EndingFilm({ images }: EndingFilmProps) {
  const frames = images
    .map((image) => image.trim())
    .filter(Boolean)
    .slice(0, MAX_ENDING_FRAMES);

  if (frames.length === 0) {
    return null;
  }

  const lastFrameIndex = frames.length - 1;
  const endingFilmStyle: EndingFilmStyle = {
    "--ending-copy-delay": `${lastFrameIndex * FRAME_STAGGER_SECONDS + 1.05}s`,
  };

  return (
    <div
      aria-label="웨딩 사진 엔딩 필름"
      className="ending-film film-grain"
      data-reveal="fade"
      data-reveal-duration="1400"
      data-reveal-threshold="0.35"
      role="img"
      style={endingFilmStyle}
    >
      <div className="ending-film-window">
        {frames.map((image, index) => {
          const frameStyle: EndingFrameStyle = {
            "--ending-frame-delay": `${index * FRAME_STAGGER_SECONDS}s`,
          };
          const isLastFrame = index === lastFrameIndex;

          return (
            <div
              className={
                isLastFrame
                  ? "ending-film-frame ending-film-frame-final"
                  : "ending-film-frame"
              }
              key={`${image}-${index}`}
              style={frameStyle}
            >
              <ImageWithFallback
                alt={`웨딩 엔딩 사진 ${index + 1}`}
                className="object-cover"
                fallbackDescription="wedding.ts의 images.ending 경로를 확인해 주세요."
                fallbackTitle="엔딩 사진 준비 중"
                fill
                loading="lazy"
                sizes="(max-width: 430px) 78vw, 330px"
                src={image}
              />
            </div>
          );
        })}

        <div aria-hidden="true" className="ending-film-vignette" />
        <p className="ending-film-copy" lang="en">
          <span>To Be</span>
          <span>Continued</span>
        </p>
      </div>

    </div>
  );
}
