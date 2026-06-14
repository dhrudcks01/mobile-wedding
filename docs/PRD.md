# mobile-wedding PRD

문서 버전: v1.0  
기준일: 2026-06-14  
프로젝트명: `mobile-wedding`

## 1. 제품 정의

`mobile-wedding`은 개인이 직접 사용할 단일 모바일 청첩장입니다. 여러 커플이 가입해서 청첩장을 만드는 플랫폼이 아니며, 관리자 대시보드나 데이터베이스를 전제로 하지 않습니다.

## 2. 최종 결정

```txt
Next.js + React + TypeScript 단일 프로젝트로 시작한다.
Spring Boot는 사용하지 않는다.
MySQL/PostgreSQL 등 DB는 사용하지 않는다.
청첩장 데이터는 TypeScript 설정 파일에서 관리한다.
이미지는 public/images에 저장한다.
```

## 3. 범위

### 포함

- 모바일 청첩장 메인 페이지
- Hero 섹션
- 초대 문구
- 신랑/신부 정보
- 예식 일시
- D-day 표시
- 캘린더 저장
- 장소 안내
- 지도 앱 링크
- 갤러리
- 연락하기
- 계좌번호 보기/복사
- 링크 복사
- Web Share API
- 카카오톡 공유
- OG metadata
- 모바일 반응형 UI

### 제외

- Spring Boot API
- MySQL/PostgreSQL DB
- 관리자 페이지
- 회원가입/로그인
- 여러 커플 관리
- RSVP 저장
- 방명록 저장
- 결제
- 통계
- 템플릿 마켓

## 4. 사용자 흐름

```txt
1. 하객이 카카오톡/문자로 링크를 받는다.
2. 모바일 브라우저에서 청첩장을 연다.
3. 신랑/신부와 예식 정보를 확인한다.
4. 갤러리 사진을 본다.
5. 지도 앱으로 길찾기를 실행한다.
6. 필요하면 연락하기 또는 계좌번호 복사를 사용한다.
7. 다른 사람에게 링크를 공유한다.
```

## 5. 페이지 구성

단일 페이지로 구현합니다.

```txt
/
```

섹션 순서:

```txt
1. Hero
2. Greeting
3. Couple
4. Date
5. Calendar
6. Location
7. Gallery
8. Contact
9. Account
10. Share
11. Footer
```

## 6. 상세 기능

### 6.1 Hero

목적: 청첩장 첫인상 제공

요구사항:

- 대표 이미지 표시
- 신랑/신부 이름 표시
- 예식 날짜 표시
- 예식 장소 표시
- 모바일 첫 화면에서 보기 좋은 세로형 구성
- 대표 이미지는 우선 로딩 대상

### 6.2 Greeting

요구사항:

- 초대 문구 표시
- 줄바꿈 유지
- 가운데 정렬
- 모바일 가독성을 위한 충분한 행간

### 6.3 Couple

요구사항:

- 신랑 이름
- 신부 이름
- 부모님 성함
- 전화/문자 버튼은 설정값에 따라 노출

### 6.4 Date

요구사항:

- 예식 일시 표시
- D-day 자동 계산
- 예식일이 지난 경우 `함께해 주셔서 감사합니다` 또는 `D+N` 표시 가능

### 6.5 Calendar

요구사항:

- `.ics` 파일 다운로드 버튼
- 이벤트 제목, 시작 시간, 종료 시간, 장소, 설명 포함
- 서버 없이 브라우저에서 파일 생성

### 6.6 Location

요구사항:

- 웨딩홀명
- 주소
- 층/홀명
- 주차 안내
- 대중교통 안내
- 카카오맵/네이버지도/티맵/구글맵 링크

MVP에서는 지도 API 임베드를 필수로 하지 않습니다. 지도 앱 링크가 우선입니다.

### 6.7 Gallery

요구사항:

- 대표 이미지와 갤러리 이미지 분리
- 6~12장 권장
- 썸네일 그리드
- 클릭 시 크게 보기
- 원본 이미지 전체를 초기 로딩하지 않기

### 6.8 Contact

요구사항:

- 신랑에게 전화/문자
- 신부에게 전화/문자
- 전화번호 미입력 시 버튼 숨김

### 6.9 Account

요구사항:

- 기본 접힘 상태
- 신랑측/신부측 구분
- 계좌번호 복사
- 복사 완료 토스트

주의:

- 실제 계좌번호는 공개 페이지에 노출되는 정보입니다.
- 커밋 전 예시값인지 실제값인지 확인합니다.

### 6.10 Share

요구사항:

- 링크 복사
- Web Share API 지원 브라우저에서는 기본 공유창 사용
- 카카오톡 공유 버튼
- 공유 미지원 환경 fallback 처리

### 6.11 OG metadata

요구사항:

- `title`
- `description`
- `openGraph.title`
- `openGraph.description`
- `openGraph.images`
- `openGraph.url`
- `twitter.card`

## 7. 데이터 설계

DB 대신 TypeScript 파일로 관리합니다.

예상 위치:

```txt
src/data/wedding.ts
```

예시:

```ts
export const wedding = {
  meta: {
    title: '민준 & 소연 결혼합니다',
    description: '2026년 10월 24일 토요일 오후 1시, OO 웨딩홀',
    url: 'https://example.com',
    ogImage: '/images/og-image.jpg',
  },
  couple: {
    groom: {
      name: '민준',
      phone: '',
      father: '홍길동',
      mother: '김영희',
    },
    bride: {
      name: '소연',
      phone: '',
      father: '박길동',
      mother: '이영희',
    },
  },
  event: {
    dateTime: '2026-10-24T13:00:00+09:00',
    displayDate: '2026년 10월 24일 토요일 오후 1시',
    venueName: 'OO 웨딩홀',
    hallName: '3층 그랜드홀',
    address: '서울특별시 ...',
    parking: '건물 지하 주차장 이용 가능',
    transport: '지하철 O호선 OO역 1번 출구 도보 5분',
  },
  greeting: `서로가 마주 보며 다져온 사랑을
이제 함께 한 곳을 바라보며 걸어가고자 합니다.

귀한 걸음으로 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  images: {
    hero: '/images/hero.jpg',
    gallery: [
      '/images/gallery-01.jpg',
      '/images/gallery-02.jpg',
      '/images/gallery-03.jpg',
    ],
  },
  mapLinks: {
    kakao: '',
    naver: '',
    tmap: '',
    google: '',
  },
  accounts: [
    {
      side: 'groom',
      label: '신랑측',
      bank: '국민은행',
      holder: '민준',
      number: '',
    },
  ],
}
```

## 8. 비기능 요구사항

### 성능

- 모바일 첫 로딩이 가벼워야 한다.
- Hero 외 이미지는 lazy loading한다.
- 이미지 용량은 배포 전 압축한다.
- 지도 SDK는 MVP에서 로딩하지 않는다.

### 접근성

- 버튼에는 명확한 label을 둔다.
- 이미지에는 가능한 `alt`를 둔다.
- 텍스트 대비를 확보한다.
- 터치 영역은 모바일에서 누르기 쉽게 한다.

### 보안/개인정보

- DB 저장이 없으므로 서버 측 개인정보 저장은 없다.
- 전화번호/계좌번호는 공개 페이지에 노출된다.
- 실제 개인정보를 커밋하기 전에 공개 여부를 확인한다.

## 9. 배포

1순위: Vercel  
2순위: 정적 export + Cloudflare Pages/GitHub Pages/S3

## 10. 향후 확장 기준

아래 기능이 필요해질 때만 DB를 검토합니다.

- RSVP 저장
- 방명록 저장
- 관리자 화면에서 내용 수정
- 방문 통계
- 여러 청첩장 관리

이때도 먼저 MySQL을 검토합니다. 사용자가 기존에 MySQL에 익숙하고, 이 프로젝트의 확장 데이터는 일반적인 관계형 테이블로 충분하기 때문입니다.
