import type { Wedding } from "@/types/wedding";

export const wedding: Wedding = {
  meta: {
    title: "경찬 & 지연 결혼합니다",
    description: "2026년 10월 9일 금요일 오후 3시, 라비두스",
    url: "https://example.com",
    ogImage: "/images/og-image.jpg",
  },
  couple: {
    groom: {
      name: "오경찬",
      phone: "",
      father: "오종오",
      mother: "박관순",
    },
    bride: {
      name: "유지연",
      phone: "",
      father: "유상희",
      mother: "이채원",
    },
  },
  event: {
    dateTime: "2026-10-09T15:00:00+09:00",
    displayDate: "2026년 10월 9일 금요일 오후 3시",
    venueName: "라비두스",
    hallName: " ",
    address: "서울특별시 중구 필동로5길 7(필동 3가 62-11번지)",
    parking: "라비두스 별관 주차장",
    transport: "3,4호선 충무로역 1번 출구뒤 BHC 치킨집 앞 셔틀버스 이용(3분 간격 운행) 셔틀버스는 예식 1시간 전부터 예식 시작 시간까지 운행됩니다.",
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
    kakao: "https://map.kakao.com/link/search/OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
    naver: "https://map.naver.com/p/search/OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
    tmap: "tmap://search?name=OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
    google:
      "https://www.google.com/maps/search/?api=1&query=OO%20%EC%9B%A8%EB%94%A9%ED%99%80",
  },
  accounts: [
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
