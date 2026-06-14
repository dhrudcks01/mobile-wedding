# mobile-wedding 티켓 백로그

이 문서는 Codex에게 작업을 시킬 때 기준이 되는 티켓 목록입니다.

## 티켓 운영 원칙

- 티켓 하나당 Codex 작업 하나를 원칙으로 한다.
- 한 티켓에서 다른 티켓 범위까지 구현하지 않는다.
- 각 티켓 완료 후 `pnpm lint`, `pnpm build`를 실행한다.
- 완료된 티켓은 체크박스를 체크한다.
- 큰 변경은 커밋을 분리한다.

## 공통 완료 보고 형식

```txt
완료 티켓: MW-XX
변경 파일:
- ...
검증:
- pnpm lint: pass/fail/not run
- pnpm build: pass/fail/not run
남은 이슈:
- ...
```

---

## MW-00. 프로젝트 세팅

상태: [x] done

### 목표

Next.js + TypeScript + Tailwind CSS 기반 프로젝트를 생성하고 기본 실행이 가능하게 한다.

### 범위

- Next.js App Router 프로젝트 생성
- TypeScript 설정
- Tailwind CSS 설정
- ESLint 설정
- 기본 `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` 확인
- 문서 폴더 유지
- `pnpm dev`, `pnpm lint`, `pnpm build` 실행 가능 상태 만들기

### 제외

- 청첩장 UI 구현
- 이미지 추가
- 카카오 공유 구현
- DB/API 구현

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-00 티켓만 구현해줘.
Next.js + TypeScript + Tailwind CSS 기반으로 mobile-wedding 프로젝트를 세팅하고, Spring Boot/DB/API는 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [x] `pnpm dev` 실행 가능
- [x] `pnpm lint` 통과
- [x] `pnpm build` 통과
- [x] 불필요한 backend/db 폴더 없음

---

## MW-01. 정적 데이터 모델 작성

상태: [x] done

### 목표

청첩장 데이터를 한 곳에서 관리할 수 있게 `src/data/wedding.ts`와 타입을 만든다.

### 범위

- `src/types/wedding.ts`
- `src/data/wedding.ts`
- meta, couple, event, greeting, images, mapLinks, accounts 구조 정의
- 예시 데이터는 placeholder로 작성

### 제외

- UI 구현
- 실제 개인정보 입력
- DB/환경변수 사용

### Codex 프롬프트

```txt
AGENTS.md와 docs/PRD.md를 읽고 MW-01 티켓만 구현해줘.
src/types/wedding.ts와 src/data/wedding.ts를 만들고, 개인용 단일 청첩장 정적 데이터 구조를 정의해줘.
실제 전화번호/계좌번호는 placeholder 또는 빈 문자열로 둬.
DB, API, 환경변수는 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [x] `src/types/wedding.ts` 존재
- [x] `src/data/wedding.ts` 존재
- [x] 타입 오류 없음
- [x] 개인정보 placeholder 처리

---

## MW-02. 전역 레이아웃과 디자인 시스템 기초

상태: [x] done

### 목표

모바일 청첩장 전체 레이아웃과 공통 UI 기초를 만든다.

### 범위

- `src/app/layout.tsx` 기본 metadata
- `src/app/page.tsx` 모바일 컨테이너
- `src/app/globals.css` 기본 색상/타이포그래피
- `src/components/common/Section.tsx`
- `src/components/common/Button.tsx`

### 디자인 방향

- 따뜻한 ivory/beige/warm gray 톤
- 모바일 폭 우선
- 데스크톱에서는 중앙 모바일 카드 형태
- 과한 애니메이션 금지

### Codex 프롬프트

```txt
AGENTS.md, docs/PRD.md, docs/PROJECT_STRUCTURE.md를 읽고 MW-02 티켓만 구현해줘.
모바일 청첩장용 전역 레이아웃, globals.css, Section/Button 공통 컴포넌트를 만들어줘.
아직 각 청첩장 섹션 구현은 하지 말고 page.tsx에는 기본 컨테이너와 자리표시 정도만 둬.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [x] 모바일 컨테이너 적용
- [x] 공통 Section/Button 컴포넌트 존재
- [x] 디자인 톤이 PRD와 맞음

---

## MW-03. Hero와 Greeting 섹션

상태: [x] done

### 목표

청첩장 첫 화면과 초대 문구를 구현한다.

### 범위

- `HeroSection.tsx`
- `GreetingSection.tsx`
- `page.tsx`에 섹션 연결
- `wedding.ts` 데이터 사용
- Hero 이미지 placeholder 처리

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-03 티켓만 구현해줘.
HeroSection과 GreetingSection을 만들고 src/data/wedding.ts 데이터를 사용해서 page.tsx에 연결해줘.
모바일 첫 화면에서 예쁘게 보이도록 구현하되, 새 라이브러리는 추가하지 마.
이미지는 public/images/hero.jpg 경로를 사용하되 파일이 없어도 레이아웃이 깨지지 않게 처리해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [x] Hero 섹션 표시
- [x] 신랑/신부 이름 표시
- [x] 날짜/장소 표시
- [x] 초대 문구 줄바꿈 유지

---

## MW-04. Couple과 Contact 섹션

상태: [x] done

### 목표

신랑/신부 및 가족 정보, 연락하기 버튼을 구현한다.

### 범위

- `CoupleSection.tsx`
- `ContactSection.tsx`
- 전화번호가 없으면 버튼 숨김
- `tel:`, `sms:` 링크

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-04 티켓만 구현해줘.
CoupleSection과 ContactSection을 만들어 신랑/신부 정보와 연락하기 버튼을 표시해줘.
전화번호가 빈 문자열이면 전화/문자 버튼은 렌더링하지 마.
개인정보가 공개 페이지에 노출된다는 점을 고려해서 데이터는 src/data/wedding.ts의 값만 사용해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [x] 신랑/신부 정보 표시
- [x] 부모님 정보 표시
- [x] 전화번호 없을 때 버튼 숨김
- [x] 전화/문자 링크 정상 생성

---

## MW-05. Date와 Calendar 기능

상태: [x] done

### 목표

예식 일시, D-day, 캘린더 저장 기능을 구현한다.

### 범위

- `DateSection.tsx`
- `CalendarButton.tsx`
- `src/lib/date.ts`
- `src/lib/calendar.ts`
- 브라우저에서 `.ics` 파일 생성 후 다운로드

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-05 티켓만 구현해줘.
DateSection, CalendarButton, src/lib/date.ts, src/lib/calendar.ts를 구현해줘.
D-day를 계산하고, 버튼 클릭 시 예식 일정 .ics 파일을 브라우저에서 생성해 다운로드되게 해줘.
서버 API는 만들지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [x] 예식 일시 표시
- [x] D-day 계산
- [x] `.ics` 다운로드
- [x] 서버/API 없음

---

## MW-06. Location과 지도 앱 링크

상태: [x] done

### 목표

장소 안내와 지도 앱 링크 버튼을 구현한다.

### 범위

- `LocationSection.tsx`
- `src/lib/map.ts`
- 카카오맵/네이버지도/티맵/구글맵 링크
- 주소 복사 기능은 선택

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-06 티켓만 구현해줘.
LocationSection과 src/lib/map.ts를 만들어 웨딩홀명, 주소, 층/홀, 주차/교통 안내, 지도 앱 링크 버튼을 표시해줘.
지도 API SDK를 로딩하지 말고, wedding.ts의 mapLinks 값으로 외부 지도 앱 링크만 연결해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [x] 장소명/주소/홀 정보 표시
- [x] 주차/교통 안내 표시
- [x] 지도 앱 링크 표시
- [x] 지도 SDK 추가 없음

---

## MW-07. Gallery 섹션

상태: [ ] todo

### 목표

갤러리 이미지 그리드와 크게 보기 기능을 구현한다.

### 범위

- `GallerySection.tsx`
- 썸네일 그리드
- 클릭 시 모달 크게 보기
- 좌우 이동은 가능하면 구현
- 새 라이브러리 추가 금지

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-07 티켓만 구현해줘.
GallerySection을 만들어 wedding.ts의 images.gallery 배열을 표시해줘.
썸네일 클릭 시 모달로 크게 볼 수 있게 하고, 새 이미지/슬라이더 라이브러리는 추가하지 마.
이미지 파일이 없어도 빌드가 깨지지 않게 경로 기반으로만 구현해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 갤러리 그리드 표시
- [ ] 이미지 클릭 시 모달 표시
- [ ] 모달 닫기 가능
- [ ] 새 라이브러리 없음

---

## MW-08. Account 섹션과 복사 기능

상태: [ ] todo

### 목표

계좌번호 접힘 UI와 복사 기능을 구현한다.

### 범위

- `AccountSection.tsx`
- `CopyButton.tsx`
- `Toast.tsx` 또는 간단한 복사 완료 피드백
- 기본 접힘 상태

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-08 티켓만 구현해줘.
AccountSection, CopyButton, 필요한 경우 Toast를 구현해줘.
계좌번호는 기본 접힘 상태로 두고, 사용자가 펼쳤을 때 신랑측/신부측 계좌와 복사 버튼을 표시해줘.
복사 성공/실패 피드백을 보여줘.
DB나 서버 저장은 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 기본 접힘 상태
- [ ] 계좌 목록 표시
- [ ] 복사 기능
- [ ] 복사 피드백

---

## MW-09. Share와 OG/Kakao 공유

상태: [ ] todo

### 목표

공유 기능과 OG metadata를 구현한다.

### 범위

- `ShareSection.tsx`
- `src/lib/share.ts`
- 링크 복사
- Web Share API
- 카카오톡 공유 SDK 로딩 구조
- Next.js metadata 설정

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-09 티켓만 구현해줘.
ShareSection과 src/lib/share.ts를 만들어 링크 복사, Web Share API, 카카오톡 공유 버튼 구조를 구현해줘.
Next.js metadata/openGraph/twitter 설정도 wedding.ts의 meta 데이터를 사용해서 적용해줘.
카카오 JavaScript 키는 실제 값 없이 환경변수 placeholder 또는 안전한 fallback으로 처리하고, 키가 없으면 카카오 공유 버튼은 비활성/안내 처리해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 링크 복사 가능
- [ ] Web Share API 지원
- [ ] 카카오톡 공유 fallback 있음
- [ ] OG metadata 설정

---

## MW-10. 모바일 QA, 성능, 마무리

상태: [ ] todo

### 목표

모바일 사용성을 점검하고 배포 전 품질을 높인다.

### 범위

- 360px/390px/430px 모바일 레이아웃 점검
- 빈 데이터 fallback
- 이미지 alt 확인
- 버튼 aria-label 확인
- 빌드 경고 정리
- README 업데이트
- QA_CHECKLIST 체크

### Codex 프롬프트

```txt
AGENTS.md, docs/QA_CHECKLIST.md, docs/TICKETS.md를 읽고 MW-10 티켓만 구현해줘.
모바일 레이아웃, 접근성, 빈 데이터 fallback, 빌드 경고를 점검하고 필요한 수정만 해줘.
새 기능은 추가하지 말고 품질 개선에 집중해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 모바일 레이아웃 깨짐 없음
- [ ] 주요 버튼 label 존재
- [ ] 빈 데이터 fallback 존재
- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 통과
- [ ] README 업데이트

---

## MW-11. 배포 문서 정리

상태: [ ] todo

### 목표

Vercel 또는 정적 배포 방법을 README에 정리한다.

### 범위

- Vercel 배포 절차
- 환경변수 placeholder 설명
- 이미지 교체 방법
- 실제 결혼식 정보 입력 위치
- 공유 미리보기 확인 방법

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-11 티켓만 구현해줘.
README에 배포 방법, 실제 데이터 입력 위치, 이미지 교체 방법, 공유 미리보기 확인 방법을 정리해줘.
코드 변경은 필요한 경우에만 최소화해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] README에 배포 절차 있음
- [ ] 데이터 입력 위치 명시
- [ ] 이미지 교체 방법 명시
- [ ] 공유 미리보기 확인 방법 명시
