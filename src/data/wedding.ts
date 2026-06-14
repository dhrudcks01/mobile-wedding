import type { Wedding } from "@/types/wedding";

/**
 * 실제 청첩장 정보 입력 파일입니다.
 *
 * 입력 원칙:
 * - 실제 전화번호와 계좌번호는 공개 페이지에 노출됩니다.
 * - 공개해도 되는 정보인지 확인한 뒤 직접 입력하세요.
 * - 빈 문자열("") 또는 빈 배열([])로 두면 관련 UI는 숨겨지거나 fallback 문구로 표시됩니다.
 * - 아래 주석의 예시는 형식 안내용이며 실제 개인정보가 아닙니다.
 */
export const wedding: Wedding = {
  meta: {
    // 예: "민준 & 소연 결혼합니다"
    title: "신랑 & 신부 결혼합니다",
    // 예: "2026년 10월 24일 토요일 오후 1시, OO 웨딩홀"
    description: "예식 날짜와 장소를 입력해 주세요.",
    // 배포 후 실제 URL로 교체하세요. 예: "https://wedding.example.com"
    url: "https://example.com",
    // public 폴더 기준 경로입니다. 예: "/images/og-image.jpg"
    ogImage: "/images/og-image.jpg",
  },
  couple: {
    groom: {
      // 예: "민준"
      name: "",
      // 전화번호가 비어 있으면 전화/문자 버튼이 표시되지 않습니다.
      phone: "",
      father: "",
      mother: "",
    },
    bride: {
      // 예: "소연"
      name: "",
      // 전화번호가 비어 있으면 전화/문자 버튼이 표시되지 않습니다.
      phone: "",
      father: "",
      mother: "",
    },
  },
  event: {
    // ISO 형식으로 입력하세요. 예: "2026-10-24T13:00:00+09:00"
    dateTime: "",
    // 화면에 표시할 날짜 문구입니다. 예: "2026년 10월 24일 토요일 오후 1시"
    displayDate: "",
    venueName: "",
    hallName: "",
    address: "",
    parking: "",
    transport: "",
  },
  greeting: `서로가 마주 보며 다져온 사랑을
이제 함께 한 곳을 바라보며 걸어가고자 합니다.

귀한 걸음으로 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  images: {
    // 대표 이미지 경로입니다. 비워두면 기본 경로("/images/hero.jpg")를 사용합니다.
    hero: "",
    // 갤러리 배열이 비어 있으면 Gallery 섹션이 표시되지 않습니다.
    gallery: [
      // "/images/gallery-01.jpg",
      // "/images/gallery-02.jpg",
      // "/images/gallery-03.jpg",
    ],
  },
  mapLinks: {
    // 지도 링크가 비어 있으면 해당 지도 버튼이 표시되지 않습니다.
    kakao: "",
    naver: "",
    tmap: "",
    google: "",
  },
  accounts: [
    // 계좌 배열이 비어 있으면 Account 섹션이 표시되지 않습니다.
    // {
    //   side: "groom",
    //   label: "신랑측",
    //   bank: "은행명",
    //   holder: "예금주명",
    //   number: "계좌번호",
    // },
    // {
    //   side: "bride",
    //   label: "신부측",
    //   bank: "은행명",
    //   holder: "예금주명",
    //   number: "계좌번호",
    // },
  ],
};

export type { Wedding };
