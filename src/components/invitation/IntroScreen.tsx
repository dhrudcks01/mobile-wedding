import { Great_Vibes } from "next/font/google";

import type { Wedding } from "@/types/wedding";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

const introCoupleScriptFont = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type IntroScreenProps = {
  wedding: Wedding;
};

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

function formatIntroName(name: string) {
  return name.trim();
}

function getCoupleNames(wedding: Wedding) {
  const groomName = formatIntroName(
    getDisplayText(wedding.intro.groom.name, "Groom"),
  );
  const brideName = formatIntroName(
    getDisplayText(wedding.intro.bride.name, "Bride"),
  );

  return `${groomName} & ${brideName}`;
}

export function IntroScreen({ wedding }: IntroScreenProps) {
  const coupleNames = getCoupleNames(wedding);
  const introMessage = getDisplayText(
    wedding.intro.message,
    "저희의 시작에 초대합니다.",
  );
  const introImage =
    wedding.meta.ogImage.trim() ||
    "/images/000021560007.jpg";

  // 바깥 section은 어두운 여백만 담당하고, 사진·문구는 안쪽 둥근 프레임에 넣습니다.
  // 프레임에만 clip-path를 걸어야 여백은 그대로 둔 채 사진만 원에서 열립니다.
  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden bg-[var(--color-dark)] p-3 text-center"
      aria-label="청첩장 인트로"
    >
      {/* film-grain은 일부러 빼 두었습니다. 5·7·9px 타일 반복이라 넓고 매끈한
          이 사진 위에서는 입자가 아니라 점 격자로 보입니다. */}
      {/* container-type은 아래 이름 글자 크기를 뷰포트가 아닌 이 프레임 폭(cqw)
          기준으로 잡기 위한 것입니다. vw는 스크롤바를 포함하고 max-w-[430px]로
          잘린 실제 폭과도 어긋납니다. PhotoBoothSection과 같은 이유입니다. */}
      <div className="intro-frame relative h-full w-full overflow-hidden rounded-[28px] bg-[var(--color-dark)] [container-type:inline-size]">
        <ImageWithFallback
          src={introImage}
          alt={`${coupleNames} 웨딩 대표 이미지`}
          fill
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover object-[center_44%] sm:object-[center_18%]"
          fallbackClassName="bg-[var(--color-dark)] text-white/70"
          fallbackTitle="대표 사진 준비 중"
          fallbackDescription="대표 사진을 public/images/hero.jpg로 넣으면 자동으로 표시됩니다."
        />

        {/* 위아래만 눌러 주는 판. 테두리 어둠은 아래 비네트가 맡으므로
            글자 가독성에 필요한 만큼만 남기고 약하게 잡았습니다. */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(0,0,0,0.30)_0%,rgba(0,0,0,0.04)_40%,rgba(0,0,0,0.06)_58%,rgba(0,0,0,0.56)_100%)]" />
        {/* 레퍼런스의 bg_cover3.png와 같은 역할입니다. 가운데는 완전히 비고
            가장자리로 갈수록 섹션 바닥색까지 어두워져서, 사진이 사각형으로
            끝나지 않고 어두운 면에 둥글게 깎여 들어간 것처럼 멈춥니다.
            모서리는 정규화 거리가 1을 넘어 완전히 var(--color-dark)가 됩니다. */}
        <div className="intro-vignette pointer-events-none absolute inset-0 rounded-[inherit]" />

        {/* 여기서는 data-reveal을 쓰지 않습니다. 리빌 컨트롤러가 하이드레이션 뒤에
            숨김 클래스를 붙이는 구조라, 첫 화면에서 지연을 주면 문구가 보였다
            사라졌다 다시 나타납니다. 순수 CSS 애니메이션이라야 첫 프레임부터
            숨은 상태로 시작합니다.
            위·아래 블록을 따로 올리는 이유: 한 덩어리로 올리면 원이 열리다 멈춘
            뒤 판 하나가 통째로 튀어나와 흐름이 끊깁니다. */}
        <div className="relative z-10 flex h-full flex-col items-center px-6 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-[max(4rem,env(safe-area-inset-top))] text-white">
          <div
            className="intro-copy-top flex flex-col items-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.48)]"
            aria-hidden="true"
          >
            <p className="font-title-en text-[2rem] font-normal leading-[0.88] tracking-[0.04em]">
              THE
            </p>
            <p
              className={`${introCoupleScriptFont.className} -mb-1 mt-1 text-[4.15rem] font-normal leading-[0.9]`}
              style={introCoupleScriptFont.style}
            >
              Grandest
            </p>
            <p className="font-title-en text-[2.55rem] font-normal leading-[0.92] tracking-[0.02em]">
              SHOW
            </p>
            <p className="font-title-en mt-1 text-[2.45rem] font-normal leading-[0.92] tracking-[0.02em]">
              OF OUR
            </p>
            <div className="mt-1 flex items-center leading-none">
              <span className="font-title-en text-[3.5rem] font-normal">&#123;</span>
              <span
                className={`${introCoupleScriptFont.className} -mx-1 translate-y-1 text-[4.6rem] font-normal`}
                style={introCoupleScriptFont.style}
              >
                love
              </span>
              <span className="font-title-en text-[3.5rem] font-normal">&#125;</span>
            </div>
          </div>

          <div className="intro-copy-bottom mt-auto flex flex-col items-center text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]">
            {/* "Gyeong Chan & Ji Yeon"의 실측 폭은 Great Vibes에서 8.494em입니다.
                2.4rem이면 326px이 필요한데, 좌우 패딩 48px을 뺀 가용 폭은 뷰포트
                390px에서 318px뿐이라 두 줄로 접혔습니다. 흔한 폰(360~400px)이
                전부 여기 걸립니다.
                그래서 프레임 폭에 비례해 줄어들게 하고 nowrap으로 못 박습니다.
                9.5cqw인 이유: 한 줄에 들어가는 한계 계수가 가장 좁은 320px에서
                9.86이라, 커닝 차이를 감안해 4%쯤 여유를 둔 값입니다.
                이름을 바꿔 더 길어지면 이 계수를 다시 잡아야 합니다. */}
            <h1
              // text-[2.4rem]은 cqw를 모르는 브라우저용 대비값입니다. 지원하면
              // 아래 인라인 fontSize가 이깁니다.
              className={`${introCoupleScriptFont.className} whitespace-nowrap text-[2.4rem] font-normal leading-none`}
              style={{
                ...introCoupleScriptFont.style,
                fontSize: "min(2.4rem, 9.5cqw)",
              }}
            >
              {coupleNames}
            </h1>
            <span className="my-4 h-px w-10 bg-white/65" />
            <p className="font-korean-serif max-w-[285px] whitespace-pre-line text-[0.8rem] leading-6 tracking-[0.08em] text-white/90">
              {introMessage}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
