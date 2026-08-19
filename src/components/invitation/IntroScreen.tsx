import Image from "next/image";

import type { Wedding } from "@/types/wedding";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

// 폰트는 전부 layout.tsx에서 싣고 CSS 변수로 씁니다. 여기서 next/font를 다시
// 부르면 같은 폰트가 두 벌 받아집니다(예전에 Great Vibes가 그랬습니다).
// 이 화면이 쓰는 서체는 .font-sans-en(Montserrat) 하나뿐입니다.

/** 레퍼런스 .img-tit의 표시 크기입니다(원본 466×414의 절반). */
const TITLE_WIDTH = 233;
const TITLE_HEIGHT = 207;

/*
 * 인트로 높이를 첫 페인트 전에 픽셀로 못 박습니다.
 *
 * 카카오톡 같은 인앱 브라우저는 스크롤로 상단 URL 바를 접었다 펴는데, 그때마다
 * 뷰포트 높이가 바뀝니다. 원래 이걸 막으라고 있는 단위가 svh("URL 바가 펴진
 * 상태의 높이"로 고정)인데, 일부 WebView는 svh를 dvh처럼 매번 다시 계산합니다.
 * 그러면 이 섹션 높이가 스크롤 중에 흔들리고, 안의 사진은 object-cover에
 * object-position이 %(center 44%)라 높이가 바뀔 때마다 잘리는 위치가 달라져서
 * 위아래로 튀어 보입니다.
 *
 * 그래서 로드 시점의 innerHeight를 한 번 재서 --intro-vh에 넣고, 그 뒤로는
 * URL 바 여닫힘에 반응하지 않게 합니다. 다시 재는 경우는 두 가지뿐입니다.
 *   - 가로 폭이 바뀔 때(화면 회전, 데스크톱 창 크기 조절)
 *   - 높이가 25% 넘게 달라질 때(URL 바는 보통 10% 안팎이라 걸리지 않습니다)
 *
 * innerHeight가 0일 때는 잠그지 않고 넘어갑니다. 창이 아직 그려지기 전이거나
 * 백그라운드 탭에서 0이 잡히면 인트로 높이와 타이틀 크기가 통째로 0이 됩니다.
 * 그 경우는 100svh 폴백에 맡기고, 다음 resize에서 제대로 된 값으로 잠급니다.
 *
 * <script>로 넣는 이유: 클라이언트 컴포넌트의 effect는 하이드레이션 뒤에
 * 돌아서, svh가 깨진 브라우저에서는 첫 화면이 한 번 튄 뒤에 고쳐집니다.
 * 동기 인라인 스크립트는 아래 마크업이 그려지기 전에 실행됩니다.
 */
const LOCK_INTRO_HEIGHT = `(function(){
var el=document.documentElement,w=0,h=0;
function lock(){if(window.innerHeight<1)return;w=window.innerWidth;h=window.innerHeight;el.style.setProperty('--intro-vh',h+'px');}
lock();
addEventListener('resize',function(){
if(window.innerWidth===w&&Math.abs(window.innerHeight-h)<=h*0.25)return;
lock();
},{passive:true});
})();`;

type IntroScreenProps = {
  wedding: Wedding;
};

function getDisplayText(value: string, fallback: string) {
  return value.trim() || fallback;
}

export function IntroScreen({ wedding }: IntroScreenProps) {
  const groomName = getDisplayText(wedding.intro.groom.name, "Groom");
  const brideName = getDisplayText(wedding.intro.bride.name, "Bride");
  const coupleNames = `${groomName} & ${brideName}`;
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
      className="relative h-[var(--intro-vh,100svh)] w-full overflow-hidden bg-[var(--color-dark)] p-3 text-center"
      aria-label="청첩장 인트로"
    >
      {/* 스크립트가 막히거나 실패해도 위 100svh 폴백으로 지금과 같게 동작합니다. */}
      <script dangerouslySetInnerHTML={{ __html: LOCK_INTRO_HEIGHT }} />
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
        <div className="intro-copy-stack relative z-10 flex h-full flex-col items-center px-6 pb-[max(2.25rem,env(safe-area-inset-bottom))] text-white">
          <div
            className="intro-copy-top flex flex-col items-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.48)]"
            aria-hidden="true"
          >
            {/* 레퍼런스는 이 로고를 글자가 아니라 흰색 투명 PNG 한 장으로
                넣습니다(.img-tit, width 233px). 웹폰트로는 그 필기체를 똑같이
                낼 수 없어 같은 방식으로 바꿨습니다. 원본이 466×414라 표시
                크기의 정확히 2배여서 고해상도 화면에서도 선명합니다.
                표시 폭은 .intro-title-img에서 프레임 높이에 맞춰 줄입니다(짧은
                인앱 브라우저에서 로고가 얼굴을 덮지 않게 하는 장치입니다).
                max-w-full은 좁은 화면에서 좌우 패딩을 넘지 않게 하는 안전장치라
                height:auto와 함께 두어야 비율이 유지됩니다. */}
            <Image
              alt=""
              className="intro-title-img max-w-full"
              height={TITLE_HEIGHT}
              priority
              src="/images/tit-cover.png"
              width={TITLE_WIDTH}
            />
          </div>

          {/* 그림자를 줄인 이유: 이름이 38px에서 13px로 작아졌는데 번짐 8px에
              투명도 0.75를 그대로 두면 글자 획보다 후광이 굵어서 실제보다
              두껍고 뭉개져 보입니다. 작은 글자에 맞춰 낮췄습니다. */}
          <div className="intro-copy-bottom mt-auto flex flex-col items-center text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            {/* 레퍼런스 .content-head 구조입니다 — 한 줄에 "A & B"로 붙이지
                않고, 신부·신랑을 좌우로 벌린 뒤 각 이름 위에 필기체 라벨을
                얹습니다. 좌우 순서는 레퍼런스와 반대로 신랑을 왼쪽에 둡니다.
                레퍼런스는 이 라벨을 투명 PNG(txt_bride.png 49×19)로 넣지만,
                같은 계열 필기체인 Pinyon Script가 이미 실려 있어 텍스트로
                냅니다. 이미지보다 선명하고 받을 파일도 늘지 않습니다.
                이름 자체는 레퍼런스 .tit-name 그대로 Montserrat 13px 대문자.
                굵기만 400 대신 300인데, 어두운 사진 위 흰 글자가 실제보다
                두껍게 보여서 한 단계 낮춘 것입니다. */}
            <h1 className="flex w-full max-w-[280px] items-end justify-between">
              <span className="flex flex-col items-center">
                <span className="font-heading text-[15px] leading-none">
                  Groom
                </span>
                <span className="font-sans-en mt-[3px] whitespace-nowrap text-[13px] font-light uppercase leading-none tracking-[0.08em]">
                  {groomName}
                </span>
              </span>
              <span className="flex flex-col items-center">
                <span className="font-heading text-[15px] leading-none">
                  Bride
                </span>
                <span className="font-sans-en mt-[3px] whitespace-nowrap text-[13px] font-light uppercase leading-none tracking-[0.08em]">
                  {brideName}
                </span>
              </span>
            </h1>
            <span className="my-4 h-px w-10 bg-white/65" />
            <p className="font-korean max-w-[285px] whitespace-pre-line text-[0.8rem] leading-6 tracking-[0.08em] text-white/90">
              {introMessage}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
