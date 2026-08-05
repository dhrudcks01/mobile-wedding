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
/** globals.css의 ending-frame-settle 재생 시간과 같아야 합니다. */
const FRAME_SETTLE_SECONDS = 1.45;

function toFrames(images: string[]) {
  return images
    .map((image) => image.trim())
    .filter(Boolean)
    .slice(0, MAX_ENDING_FRAMES);
}

/**
 * 마지막 사진이 자리를 잡기까지 걸리는 시간(초)입니다.
 * ShareSection이 이 값을 엔딩 크레딧 시작 시점으로 넘겨서 사진이 끝나면 크레딧이 바로 올라옵니다.
 */
export function getEndingFilmPlaySeconds(images: string[]) {
  const frameCount = toFrames(images).length;

  return frameCount === 0
    ? 0
    : (frameCount - 1) * FRAME_STAGGER_SECONDS + FRAME_SETTLE_SECONDS;
}

export function EndingFilm({ images }: EndingFilmProps) {
  const frames = toFrames(images);

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
      <span aria-hidden="true" className="ending-film-perforations ending-film-perforations-top" />
      <span aria-hidden="true" className="ending-film-perforations ending-film-perforations-bottom" />

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
                className="ending-film-image object-cover"
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
        <div aria-hidden="true" className="ending-film-light-leak" />
        <div aria-hidden="true" className="ending-film-scratches" />
        <div aria-hidden="true" className="ending-film-flicker" />
        <p className="ending-film-copy" lang="en">
          <span>To Be</span>
          <span>Continued</span>
        </p>
      </div>
    </div>
  );
}
