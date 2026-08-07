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
              <span>{String((index % images.length) + 1).padStart(2, "0")}A</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
 * 레퍼런스 .box-film:before의 영사기 표시입니다(ic_cam_44.png, 44×30을
 * 인사말 위 margin 30px auto에 얹습니다).
 * 그 PNG를 그대로 가져오는 대신 같은 형태를 SVG로 그렸습니다. 남의 상용
 * 템플릿 이미지를 복사해 오는 것을 피하려는 것이고, 확대해도 안 깨지며
 * 색을 currentColor로 상속받아 섹션 톤에 맞습니다.
 * 릴 두 개 · 본체 · 렌즈 · 오른쪽으로 퍼지는 빛줄기까지 원본 구성 그대로입니다.
 */
function ProjectorMark() {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto block h-[30px] w-[44px] text-[var(--section-text)]"
      fill="none"
      viewBox="0 0 44 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="greeting-projector-beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.42" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 렌즈에서 오른쪽으로 퍼지는 빛. 가장 뒤에 깔아야 본체에 가려집니다. */}
      <path d="M28 16.6 44 9.5V28l-16-6.4z" fill="url(#greeting-projector-beam)" />

      {/* 위쪽 릴 두 개 — 오른쪽이 조금 크고 살이 보입니다 */}
      <circle cx="9.5" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9.5" cy="8" r="1.6" fill="currentColor" />
      <circle cx="22" cy="7.5" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="22" cy="7.5" r="2" fill="currentColor" />
      <g opacity="0.75" stroke="currentColor" strokeWidth="1.2">
        <path d="M22 1.7v3.4M22 9.9v3.4M16.1 7.5h3.4M24.5 7.5h3.4" />
      </g>

      {/* 본체와 렌즈 */}
      <rect
        height="9.4"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.4"
        width="21"
        x="3.5"
        y="15.2"
      />
      <path
        d="M24.5 17.4h3.6v4.9h-3.6z"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* 받침과 다리 */}
      <path
        d="M7 24.6v2.6M20 24.6v2.6M4.5 27.6h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
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
      // 바로 위 포토부스 섹션이 같은 var(--color-dark)로 끝나므로,
      // 상단 글로우만 서서히 올라오게 해서 경계가 보이지 않게 합니다.
      className="movie-dark movie-dark-blend-top overflow-hidden px-6 pb-28 pt-24"
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
        {/* 레퍼런스는 이 표시와 글 사이를 30px 띄웁니다 */}
        <span className="mb-[30px] block">
          <ProjectorMark />
        </span>

        {/* 레퍼런스(repocu)의 .txt-film과 동일: Pretendard Regular / 13px / 28px */}
        <p className="font-korean whitespace-pre-line text-[13px] leading-[28px] text-[var(--section-text)]">
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
