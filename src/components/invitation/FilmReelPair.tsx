"use client";

import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

/*
 * 원본 묶음을 세 벌 이어 붙이고 늘 가운데 벌에 머무르게 합니다.
 * 두 벌이면 왼쪽 끝이 scrollLeft 0이라 손으로 되돌릴 자리가 없어 거기서
 * 막힙니다. 세 벌이면 양쪽으로 한 벌씩 여유가 생겨 어느 방향으로 넘겨도
 * 이어집니다. 화면 밖 프레임은 lazy 이미지라 실제로 받아오지 않습니다.
 */
const REEL_COPIES = 3;

/** 한 벌을 지나는 데 걸리는 시간. 전에 쓰던 CSS 애니메이션과 같은 26초입니다. */
const CYCLE_DURATION = 26000;

/*
 * 손을 뗀 뒤 언제 자동 재생을 되살릴지. 고정 시간으로 기다리면 살짝 밀고
 * 놓았을 때는 답답하고, 세게 튕겼을 때는 관성이 아직 남았는데 자동 재생이
 * 겹쳐 들어옵니다. 그래서 시계가 아니라 실제로 미끄러짐이 멎었는지를 봅니다.
 * 프레임 사이 이동이 이 값보다 작은 상태가 아래 프레임 수만큼 이어지면
 * 멎은 것으로 봅니다(3프레임이면 50ms 남짓).
 */
const SETTLE_EPSILON = 0.5;
const SETTLE_FRAMES = 3;

/** 탭이 잠들었다 돌아왔을 때 밀린 시간만큼 확 튀지 않게 막습니다. */
const MAX_FRAME_DELTA = 50;

/** 이만큼 어긋났을 때만 위치를 고쳐 씁니다. 매 프레임 대입하면 관성이 끊깁니다. */
const SYNC_THRESHOLD = 0.5;

type FilmReelProps = {
  images: string[];
  viewportRef: RefObject<HTMLDivElement | null>;
};

function FilmReel({ images, viewportRef }: FilmReelProps) {
  const reelImages = Array.from({ length: REEL_COPIES }, () => images).flat();

  return (
    <div className="film-reel -mx-6 w-[calc(100%+3rem)]" aria-hidden="true">
      {/* 읽어 줄 내용이 없는 장식이라 aria-hidden입니다. 스크롤 컨테이너가
          되면서 포커스가 잡히지 않도록 tabIndex로 명시해 둡니다. */}
      <div className="film-reel-viewport" ref={viewportRef} tabIndex={-1}>
        <div className="film-reel-track">
          {reelImages.map((image, index) => (
            <div className="film-reel-frame" key={`${image}-${index}`}>
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-dark-raised)]">
                <ImageWithFallback
                  alt=""
                  className="film-reel-image object-cover"
                  fill
                  fallbackClassName="bg-[var(--color-dark-raised)] text-white/60"
                  fallbackDescription=""
                  fallbackTitle="Wedding Film"
                  loading="lazy"
                  sizes="220px"
                  src={image}
                />
                <span className="film-reel-veil" />
              </div>
              <div className="flex items-center justify-between px-1 pt-1 font-title-en text-[6px] tracking-[0.08em] text-white/48">
                <span>WEDDING FILM</span>
                <span>
                  {String((index % images.length) + 1).padStart(2, "0")}A
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type FilmReelPairProps = {
  bottomImages: string[];
  children: ReactNode;
  topImages: string[];
};

/**
 * 위·아래 필름 두 줄을 한 몸으로 움직입니다. 사이에 낀 인사말은 children으로
 * 받습니다. 두 줄을 각각 따로 두면 서로를 몰라서, 한 줄을 손으로 넘길 때
 * 다른 줄은 제 갈 길만 갑니다.
 *
 * 위치를 픽셀이 아니라 진행도(0~1, 한 바퀴)로 들고 있는 이유가 두 가지입니다.
 *   - 두 줄의 사진 수가 달라 한 바퀴 길이가 달라도 비율은 그대로 공유됩니다.
 *   - scrollLeft에 소수를 더해 쌓으려 하면, 브라우저가 값을 정수로 스냅할 때
 *     프레임당 1px이 안 되는 이동분이 매번 깎여 나가 아예 움직이지 않습니다.
 *     진행도를 따로 쌓아 두면 스냅과 무관하게 전진합니다.
 */
export function FilmReelPair({
  bottomImages,
  children,
  topImages,
}: FilmReelPairProps) {
  const topViewportRef = useRef<HTMLDivElement>(null);
  const bottomViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topViewport = topViewportRef.current;
    const bottomViewport = bottomViewportRef.current;

    if (!topViewport || !bottomViewport) {
      return;
    }

    const reels = [
      { cycle: 0, isReverse: false, viewport: topViewport },
      { cycle: 0, isReverse: true, viewport: bottomViewport },
    ];

    type Reel = (typeof reels)[number];

    // 모션을 줄이기로 한 사용자에게는 자동 재생을 하지 않습니다.
    // 손으로 넘기는 것은 본인이 시작한 동작이라 그대로 둡니다.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let progress = 0;
    let heldReel: Reel | null = null;
    let isSettling = false;
    let stillFrames = 0;
    let lastHeldScrollLeft = 0;
    let frameId = 0;
    let previousTime = 0;

    // 복제본 첫 프레임까지의 거리가 한 벌입니다. 프레임 폭이 clamp()라
    // 화면마다 달라지므로 값을 박지 않고 실제 레이아웃에서 잽니다.
    const measure = () => {
      reels.forEach((reel) => {
        const track = reel.viewport.firstElementChild;

        if (!(track instanceof HTMLElement)) {
          return;
        }

        const frames = track.children;
        const first = frames[0];
        const copyStart = frames[Math.floor(frames.length / REEL_COPIES)];

        reel.cycle =
          first instanceof HTMLElement && copyStart instanceof HTMLElement
            ? copyStart.offsetLeft - first.offsetLeft
            : 0;
      });
    };

    // 아래 줄은 반대로 흐릅니다. 진행도가 같아도 방향만 뒤집어 읽습니다.
    const getRatio = (reel: Reel) =>
      reel.isReverse ? (1 - progress) % 1 : progress;

    const getOffset = (reel: Reel) => reel.cycle + getRatio(reel) * reel.cycle;

    // 손으로 넘긴 줄의 실제 위치에서 진행도를 되읽어 두 줄에 함께 반영합니다.
    const readProgress = (reel: Reel) => {
      const raw = (reel.viewport.scrollLeft - reel.cycle) / reel.cycle;
      const normalized = ((raw % 1) + 1) % 1;

      return reel.isReverse ? (1 - normalized) % 1 : normalized;
    };

    const sync = () => {
      reels.forEach((reel) => {
        const offset = getOffset(reel);

        if (Math.abs(reel.viewport.scrollLeft - offset) > SYNC_THRESHOLD) {
          reel.viewport.scrollLeft = offset;
        }
      });
    };

    // 백그라운드 탭에서는 rAF가 돌지 않으므로 여기서 바로 자리를 잡습니다.
    // 루프에 맡기면 그동안 왼쪽 끝에 있다가 탭을 볼 때 한 벌만큼 튑니다.
    measure();

    if (reels.every((reel) => reel.cycle > 0)) {
      sync();
    }

    const step = (time: number) => {
      frameId = window.requestAnimationFrame(step);

      if (reels.some((reel) => reel.cycle <= 0)) {
        measure();

        return;
      }

      const delta = Math.min(time - previousTime, MAX_FRAME_DELTA);
      previousTime = time;

      if (heldReel) {
        // 잡고 있는 동안에는 자동 재생을 멈추고, 손이 민 만큼만 따라갑니다.
        progress = readProgress(heldReel);
      } else if (!prefersReducedMotion && delta > 0) {
        progress = (progress + delta / CYCLE_DURATION) % 1;
      }

      // 잡고 있는 줄도 함께 봅니다. 범위 안이면 손대지 않으니 관성은 살아
      // 있고, 한 벌을 넘어가면 그때만 이음매로 감아 줍니다.
      sync();

      if (!heldReel || !isSettling) {
        return;
      }

      // 감기가 일어난 프레임은 이동량이 크게 잡히므로 sync 뒤에 잽니다.
      const { scrollLeft } = heldReel.viewport;

      stillFrames =
        Math.abs(scrollLeft - lastHeldScrollLeft) < SETTLE_EPSILON
          ? stillFrames + 1
          : 0;
      lastHeldScrollLeft = scrollLeft;

      if (stillFrames >= SETTLE_FRAMES) {
        heldReel = null;
        isSettling = false;
        stillFrames = 0;
      }
    };

    const hold = (reel: Reel) => () => {
      heldReel = reel;
      isSettling = false;
      stillFrames = 0;
      lastHeldScrollLeft = reel.viewport.scrollLeft;
    };

    // 손을 떼도 바로 놓아주지 않습니다. 관성이 멎을 때까지는 그 줄을 계속
    // 따라가야 다른 줄도 같이 미끄러집니다.
    const release = () => {
      if (!heldReel) {
        return;
      }

      isSettling = true;
      stillFrames = 0;
      lastHeldScrollLeft = heldReel.viewport.scrollLeft;
    };

    const handleResize = () => {
      measure();
    };

    // pointer 이벤트만으로 대부분 덮이지만, 구형 인앱 웹뷰를 위해 touch도
    // 함께 답니다. 둘 다 들어와도 같은 일을 두 번 할 뿐이라 무해합니다.
    const detachers = reels.map((reel) => {
      const onHold = hold(reel);
      const onWheel = () => {
        onHold();
        release();
      };
      const { viewport } = reel;

      viewport.addEventListener("pointerdown", onHold, { passive: true });
      viewport.addEventListener("pointerup", release, { passive: true });
      viewport.addEventListener("pointercancel", release, { passive: true });
      viewport.addEventListener("touchstart", onHold, { passive: true });
      viewport.addEventListener("touchend", release, { passive: true });
      viewport.addEventListener("touchcancel", release, { passive: true });
      viewport.addEventListener("wheel", onWheel, { passive: true });

      return () => {
        viewport.removeEventListener("pointerdown", onHold);
        viewport.removeEventListener("pointerup", release);
        viewport.removeEventListener("pointercancel", release);
        viewport.removeEventListener("touchstart", onHold);
        viewport.removeEventListener("touchend", release);
        viewport.removeEventListener("touchcancel", release);
        viewport.removeEventListener("wheel", onWheel);
      };
    });

    window.addEventListener("resize", handleResize, { passive: true });
    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      detachers.forEach((detach) => detach());
    };
  }, [bottomImages.length, topImages.length]);

  return (
    <>
      <div className="mt-10" data-reveal="fade-up" data-reveal-duration="1300">
        <div className="origin-center -rotate-[3deg] scale-[1.08]">
          <FilmReel images={topImages} viewportRef={topViewportRef} />
        </div>
      </div>

      {children}

      <div data-reveal="fade-up" data-reveal-duration="1300">
        <div className="origin-center rotate-[3deg] scale-[1.08]">
          <FilmReel images={bottomImages} viewportRef={bottomViewportRef} />
        </div>
      </div>
    </>
  );
}
