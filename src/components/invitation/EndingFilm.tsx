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
/**
 * 마지막 사진이 들어오기 시작한 시점을 기준으로 크레딧을 얼마나 더 당길지(초).
 * 0이면 마지막 사진이 화면에 들어오는 순간 크레딧이 같이 출발합니다.
 * 키우면 더 일찍, 음수면 더 늦게 시작합니다.
 */
const CREDITS_LEAD_SECONDS = 0.5;

function toFrames(images: string[]) {
  return images
    .map((image) => image.trim())
    .filter(Boolean)
    .slice(0, MAX_ENDING_FRAMES);
}

/**
 * 엔딩 크레딧이 올라오기 시작할 시점(초)입니다. ShareSection이 이 값을 넘깁니다.
 *
 * 예전에는 마지막 사진의 정착 애니메이션(globals.css의 ending-frame-settle,
 * 1.45s)까지 끝나기를 기다렸는데, 그러면 사진이 완전히 멈춘 뒤에야 글자가
 * 움직여서 흐름이 한 번 끊깁니다. 지금은 마지막 사진이 들어오기 시작하는
 * 시점보다 CREDITS_LEAD_SECONDS만큼 앞서 출발해서, 사진이 끝날 무렵에는
 * 크레딧이 이미 올라오고 있습니다.
 */
export function getEndingCreditsStartSeconds(images: string[]) {
  const frameCount = toFrames(images).length;

  if (frameCount === 0) {
    return 0;
  }

  const lastFrameEnters = (frameCount - 1) * FRAME_STAGGER_SECONDS;

  return Math.max(0, lastFrameEnters - CREDITS_LEAD_SECONDS);
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
