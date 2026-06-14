export const wedding = {
  couple: {
    groom: {
      name: "민준",
    },
    bride: {
      name: "소연",
    },
  },
  event: {
    displayDate: "2026년 10월 24일 토요일 오후 1시",
    venueName: "OO 웨딩홀",
    hallName: "3층 그랜드홀",
  },
  greeting: `서로가 마주 보며 다져온 사랑을
이제 함께 한 곳을 바라보며 걸어가고자 합니다.

귀한 걸음으로 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  images: {
    hero: "/images/hero.jpg",
  },
} as const;

export type Wedding = typeof wedding;
