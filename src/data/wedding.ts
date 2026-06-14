import type { Wedding } from "@/types/wedding";

export const wedding: Wedding = {
  meta: {
    title: "민준 & 소연 결혼합니다",
    description: "2026년 10월 24일 토요일 오후 1시, OO 웨딩홀",
    url: "https://example.com",
    ogImage: "/images/og-image.jpg",
  },
  couple: {
    groom: {
      name: "민준",
      phone: "",
      father: "홍길동",
      mother: "김영희",
    },
    bride: {
      name: "소연",
      phone: "",
      father: "박길동",
      mother: "이영희",
    },
  },
  event: {
    dateTime: "2026-10-24T13:00:00+09:00",
    displayDate: "2026년 10월 24일 토요일 오후 1시",
    venueName: "OO 웨딩홀",
    hallName: "3층 그랜드홀",
    address: "서울특별시 OO구 OO로 00",
    parking: "건물 지하 주차장 이용 가능",
    transport: "지하철 O호선 OO역 1번 출구 도보 5분",
  },
  greeting: `서로가 마주 보며 다져온 사랑을
이제 함께 한 곳을 바라보며 걸어가고자 합니다.

귀한 걸음으로 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  images: {
    hero: "/images/hero.jpg",
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
    kakao: "",
    naver: "",
    tmap: "",
    google: "",
  },
  accounts: [
    {
      side: "groom",
      label: "신랑측",
      bank: "은행명",
      holder: "예금주명",
      number: "",
    },
    {
      side: "bride",
      label: "신부측",
      bank: "은행명",
      holder: "예금주명",
      number: "",
    },
  ],
};

export type { Wedding };
