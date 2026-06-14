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
    title: "경찬 & 지연 결혼합니다",
    // 예: "2026년 10월 24일 토요일 오후 1시, OO 웨딩홀"
    description: "2026년 10월 9일 금요일 오후 3시, 라비두스",
    // 배포 후 실제 URL로 교체하세요. 예: "https://wedding.example.com"
    url: "https://example.com",
    // 공유 미리보기 이미지입니다. public/images/og-image.jpg 파일을 교체하면 됩니다.
    ogImage: "/images/og-image.jpg",
  },
  intro: {
    // 첫 접속 인트로에 표시할 짧은 문구입니다.
    message: "소중한 분들을 저희의 시작에 초대합니다.",
  },
  couple: {
    groom: {
      // 예: "민준"
      name: "오경찬",
      // 전화번호가 비어 있으면 전화/문자 버튼이 표시되지 않습니다.
      phone: "",
      father: "오종오",
      mother: "박관순",
    },
    bride: {
      // 예: "소연"
      name: "유지연",
      // 전화번호가 비어 있으면 전화/문자 버튼이 표시되지 않습니다.
      phone: "",
      father: "유상희",
      mother: "이채원",
    },
  },
  event: {
    // ISO 형식으로 입력하세요. 예: "2026-10-24T13:00:00+09:00"
    dateTime: "2026-10-09T15:00:00+09:00",
    // 화면에 표시할 날짜 문구입니다. 예: "2026년 10월 24일 토요일 오후 1시"
    displayDate: "2026년 10월 9일 금요일 오후 3시",
    venueName: "라비두스",
    hallName: " ",
    address: "서울특별시 중구 필동로5길 7(필동 3가 62-11번지)",
    parking: "라비두스 별관 주차장",
    transport:
      "3,4호선 충무로역 1번 출구뒤 BHC 치킨집 앞 셔틀버스 이용(3분 간격 운행) 셔틀버스는 예식 1시간 전부터 예식 시작 시간까지 운행됩니다.",
  },
  greeting: `서로가 마주 보며 다져온 사랑을
이제 함께 한 곳을 바라보며 걸어가고자 합니다.

귀한 걸음으로 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  images: {
    // 대표 이미지 경로입니다. public/images/hero.jpg 파일을 교체하면 메인 이미지가 바뀝니다.
    hero: "/images/hero.jpg",
    // public/images에 사진을 넣고 아래 배열에 경로를 추가하면 갤러리에 표시됩니다.
    // 배열이 비어 있으면 Gallery 섹션이 표시되지 않습니다.
    gallery: [
      "/images/gallery-01.jpg",
      "/images/gallery-02.jpg",
      "/images/gallery-03.jpg",
      "/images/gallery-04.jpg",
      "/images/gallery-05.jpg",
      "/images/gallery-06.jpg",
    ],
  },
  mapLinks: {
    // 지도 링크가 비어 있으면 해당 지도 버튼이 표시되지 않습니다.
    kakao: "https://map.kakao.com/link/search/OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
    naver: "https://map.naver.com/p/search/OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
    tmap: "tmap://search?name=OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
    google:
      "https://www.google.com/maps/search/?api=1&query=OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
  },
  accounts: [
    // 계좌 배열이 비어 있으면 Account 섹션이 표시되지 않습니다.
    // number가 비어 있으면 해당 계좌 항목은 표시되지 않습니다.
    {
      side: "groom",
      label: "신랑측",
      bank: "농협",
      holder: "오경찬",
      number: "3020003144831",
    },
    {
      side: "bride",
      label: "신부측",
      bank: "은행명",
      holder: "예금주명",
      number: "",
    },
    {
      side: "groom",
      label: "신랑측",
      bank: "",
      holder: "오종오",
      number: "",
    },
    {
      side: "groom",
      label: "신랑측",
      bank: "",
      holder: "박관순",
      number: "",
    },
    {
      side: "bride",
      label: "신부측",
      bank: "은행명",
      holder: "유상희",
      number: "",
    },
    {
      side: "bride",
      label: "신부측",
      bank: "은행명",
      holder: "이채원",
      number: "",
    },
  ],
};

export type { Wedding };
