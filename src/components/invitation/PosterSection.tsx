import Image from "next/image";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import type { Wedding } from "@/types/wedding";

type PosterSectionProps = {
  wedding: Wedding;
};

export function PosterSection({ wedding }: PosterSectionProps) {
  const posterImage =
    wedding.images.poster.trim() ||
    wedding.images.hero.trim() ||
    "/images/hero.jpg";
  const groomName = wedding.intro.groom.name.trim() || "Groom";
  const brideName = wedding.intro.bride.name.trim() || "Bride";
  const venue = [wedding.event.venueName, wedding.event.hallName]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");

  return (
    <section className="movie-paper-muted overflow-hidden px-6 py-24">
      <div
        className="mx-auto max-w-sm"
        data-reveal="fade-up"
        data-reveal-duration="1400"
      >
        <div className="relative mx-auto aspect-[375/517] w-full max-w-[375px] drop-shadow-[0_28px_42px_rgba(37,35,33,0.22)]">
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none object-contain"
            fill
            loading="lazy"
            sizes="(max-width: 430px) 100vw, 375px"
            src="/images/bg-showbox.png"
          />

          <div
            aria-hidden="true"
            className="show-light pointer-events-none absolute inset-x-0 top-0 z-20 h-[24.18%]"
          >
            <Image
              alt=""
              className="object-contain object-top"
              fill
              loading="lazy"
              sizes="(max-width: 430px) 100vw, 375px"
              src="/images/img-showing.png"
            />
          </div>

          <div className="absolute left-[11.2%] top-[17.2%] z-10 h-[74.9%] w-[77.5%] overflow-hidden bg-[var(--color-dark-soft)] text-white">
            <ImageWithFallback
              alt={`${groomName}과 ${brideName} 웨딩 포스터`}
              className="object-cover object-center"
              fill
              fallbackClassName="bg-[var(--color-dark-soft)] text-white/65"
              fallbackDescription="wedding.ts의 images.poster 경로를 확인해 주세요."
              fallbackTitle="Wedding Poster"
              loading="lazy"
              sizes="(max-width: 430px) 84vw, 350px"
              src={posterImage}
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,6,0.54)_0%,rgba(4,7,6,0.04)_40%,rgba(4,7,6,0.76)_100%)]" />
            <div className="absolute inset-3 border border-white/32" />

            <div className="absolute inset-x-0 top-8 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.62)]">
              <p className="font-title-en text-[10px] tracking-[0.28em] text-white/72">
                AN INVITATION FILM
              </p>
              <p className="font-title-en mt-5 text-[2.3rem] leading-[0.82] tracking-[-0.05em]">
                WEDDING
              </p>
              <p className="font-script mt-1 text-[3.8rem] leading-[0.82]">
                Day
              </p>
            </div>

            <div className="absolute inset-x-6 bottom-7 text-center drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              {/*<p className="font-title-en text-[0.95rem] tracking-[0.06em]">*/}
              {/*  {groomName} <span className="mx-2 text-white/58">&amp;</span>{" "}*/}
              {/*  {brideName}*/}
              {/*</p>*/}
              <span className="mx-auto my-4 block h-px w-10 bg-white/45" />
              <p className="text-[10px] leading-5 tracking-[0.04em] text-white/82">
                {wedding.event.displayDate || "예식 일시 입력 예정"}
              </p>
              <p className="text-[10px] leading-5 tracking-[0.04em] text-white/72">
                {venue || "예식 장소 입력 예정"}
              </p>
            </div>
          </div>
        </div>

        <p className="font-title-en mt-5 text-center text-[9px] tracking-[0.18em] text-[var(--section-muted)]">
          A FILM ABOUT OUR BEGINNING
        </p>
      </div>
    </section>
  );
}
