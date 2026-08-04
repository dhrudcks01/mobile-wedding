import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { getWeddingDate } from "@/lib/date";
import type { Wedding } from "@/types/wedding";

type PhotoBoothSectionProps = {
  wedding: Wedding;
};

const ENGLISH_WEEKDAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

/** 날짜와 무관한 고정 문구입니다. 필요하면 이 값만 수정하세요. */
const COPY = {
  title: "Our First Page",
  subtitle: "We're getting married",
  center: "WITH LOVE",
};

function formatDotDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "WEDDING DAY";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function formatWeekdayTime(dateTime: string, date: Date) {
  const timeMatch = dateTime.match(/T(\d{2}):(\d{2})/);

  if (!timeMatch || Number.isNaN(date.getTime())) {
    return "TIME TO BE ANNOUNCED";
  }

  const hour = Number(timeMatch[1]);
  const meridiem = hour >= 12 ? "PM" : "AM";

  return `${ENGLISH_WEEKDAYS[date.getDay()]} ${hour % 12 || 12}:${timeMatch[2]}${meridiem}`;
}

export function PhotoBoothSection({ wedding }: PhotoBoothSectionProps) {
  const backgroundImage = wedding.images.hero.trim() || "/images/hero.jpg";
  const groomName = wedding.intro.groom.name.trim() || "Groom";
  const brideName = wedding.intro.bride.name.trim() || "Bride";
  const weddingDate = getWeddingDate(wedding.event.dateTime);
  const displayDate = formatDotDate(weddingDate);
  const displayTime = formatWeekdayTime(wedding.event.dateTime, weddingDate);

  // 프레임 비율은 aspect-[9/16] 하나로만 정합니다. max-height를 같이 걸면 폭은 그대로인 채
  // 높이만 잘려서 실제 비율이 뷰포트 높이에 따라 달라집니다.
  // container-type은 내부 글자 크기를 뷰포트가 아닌 이 섹션 폭(cqw) 기준으로 잡기 위한 것입니다.
  return (
    <section className="film-grain relative aspect-[9/16] w-full overflow-hidden bg-[var(--color-dark)] text-white [container-type:inline-size]">
      <ImageWithFallback
        alt={`${groomName}과 ${brideName} 웨딩 사진`}
        className="object-cover object-center"
        fallbackClassName="bg-[var(--color-dark)] text-white/70"
        fallbackDescription="wedding.ts의 images.hero 경로를 확인해 주세요."
        fallbackTitle="사진 준비 중"
        fill
        loading="lazy"
        sizes="(max-width: 430px) 100vw, 430px"
        src={backgroundImage}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,6,0.62)_0%,rgba(4,7,6,0.12)_32%,rgba(4,7,6,0.18)_56%,rgba(4,7,6,0.86)_100%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_92px_18px_rgba(0,0,0,0.42)]" />

      <div
        className="absolute inset-0 z-10 flex flex-col px-7 pb-10 pt-10 drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]"
        data-reveal="fade-up"
        data-reveal-duration="1200"
        data-reveal-threshold="0.2"
      >
        <div className="font-title-en flex items-start justify-between text-[11px] uppercase tracking-[0.16em] text-white/85">
          <span>{groomName}</span>
          <span>{brideName}</span>
        </div>

        <div className="my-auto text-center">
          <h2
            className="font-display"
            // 폰트 실측 폭이 5.879em이라 60px 고정이면 섹션 폭 409px 미만에서 줄바꿈됩니다.
            // 좌우 패딩 56px을 뺀 가용 폭의 94%에 맞춰 따라 줄어들게 합니다.
            // 기준은 vw가 아니라 cqw(섹션 폭)입니다. vw는 스크롤바 폭을 포함하고
            // max-w-[430px]로 잘린 실제 섹션 폭과도 어긋나서 경계 부근에서 줄바꿈이 났습니다.
            style={{
              fontSize: "min(60px, calc(16cqw - 9px))",
              lineHeight: 1.25,
            }}
          >
            {COPY.title}
          </h2>
          <p className="mt-1.5 text-[12px] tracking-[0.08em] text-white/82">
            {COPY.subtitle}
          </p>
        </div>

        <div className="font-title-en flex items-end justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-white/85">
          <span>{displayDate}</span>
          <span className="text-white/70">{COPY.center}</span>
          <span>{displayTime}</span>
        </div>
      </div>
    </section>
  );
}
