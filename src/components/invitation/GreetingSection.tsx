import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Section } from "@/components/common/Section";
import { TornEdge } from "@/components/common/TornEdge";
import type { Wedding } from "@/types/wedding";

type GreetingSectionProps = {
  wedding: Wedding;
};

type FilmReelProps = {
  images: string[];
  reverse?: boolean;
};

function FilmReel({ images, reverse = false }: FilmReelProps) {
  const reelImages = [...images, ...images];

  return (
    <div className="film-reel -mx-6 w-[calc(100%+3rem)]" aria-hidden="true">
      <div
        className={`film-reel-track ${reverse ? "film-reel-track-reverse" : ""}`}
      >
        {reelImages.map((image, index) => (
          <div className="film-reel-frame" key={`${image}-${index}`}>
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-dark-raised)]">
              <ImageWithFallback
                alt=""
                className="object-cover grayscale-[8%]"
                fill
                fallbackClassName="bg-[var(--color-dark-raised)] text-white/60"
                fallbackDescription=""
                fallbackTitle="Wedding Film"
                loading="lazy"
                sizes="220px"
                src={image}
              />
              <span className="absolute inset-0 bg-black/5" />
            </div>
            <div className="flex items-center justify-between px-1 pt-1 font-title-en text-[6px] tracking-[0.08em] text-white/48">
              <span>WEDDING FILM</span>
              <span>{String((index % images.length) + 1).padStart(2, "0")}A</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GreetingSection({ wedding }: GreetingSectionProps) {
  const greeting = wedding.greeting.trim();
  const filmImages = wedding.images.film.filter((image) => image.trim());
  const galleryImages = wedding.images.gallery.filter((image) => image.trim());
  const availableImages = filmImages.length
    ? filmImages
    : galleryImages.length
      ? galleryImages
      : [wedding.images.hero].filter(Boolean);
  const splitIndex = Math.max(1, Math.ceil(availableImages.length / 2));
  const topImages = availableImages.slice(0, splitIndex);
  const bottomImages = availableImages.slice(splitIndex);

  if (!greeting || availableImages.length === 0) {
    return null;
  }

  return (
    <Section
      className="movie-dark overflow-hidden px-6 pb-28 pt-24"
      description="우리의 가장 빛나는 장면에 소중한 분들을 초대합니다."
      eyebrow="Opening"
      title="Invitation"
    >
      <div
        className="mt-10"
        data-reveal="fade-up"
        data-reveal-duration="1300"
      >
        <div className="origin-center -rotate-[3deg] scale-[1.08]">
          <FilmReel images={topImages} />
        </div>
      </div>

      <div
        className="mx-auto my-14 max-w-[315px]"
        data-reveal="fade-up"
        data-reveal-delay="150"
        data-reveal-duration="1500"
      >
        <p className="font-korean-serif whitespace-pre-line text-[0.95rem] leading-9 text-[var(--section-text)]">
          {greeting}
        </p>
        <span className="mx-auto mt-10 block h-px w-9 bg-[var(--section-line)]" />
      </div>

      <div
        data-reveal="fade-up"
        data-reveal-duration="1300"
      >
        <div className="origin-center rotate-[3deg] scale-[1.08]">
          <FilmReel
            images={bottomImages.length > 0 ? bottomImages : topImages}
            reverse
          />
        </div>
      </div>

      {/* 어두운 이 섹션이 아래 밝은 섹션과 직선으로 만나지 않게 합니다. */}
      <TornEdge id="greeting" />
    </Section>
  );
}
