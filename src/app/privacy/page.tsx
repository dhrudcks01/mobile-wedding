import type { Metadata } from "next";
import { wedding } from "@/data/wedding";

// Google OAuth 앱을 프로덕션으로 게시할 때 필요한 개인정보처리방침 주소입니다.
export const metadata: Metadata = {
  title: "개인정보처리방침",
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: "수집하는 정보",
    body: "하객 사진·동영상 업로드 페이지(/photos)에서 하객이 직접 선택한 사진·동영상 파일과, 선택적으로 입력한 이름만 받습니다. 회원가입, 로그인, 쿠키, 방문 분석 도구는 사용하지 않습니다.",
  },
  {
    title: "이용 목적",
    body: "받은 사진·동영상을 신랑·신부에게 전달하는 데에만 사용합니다. 입력한 이름은 같은 분이 보낸 파일을 한 폴더에 모으는 데 사용합니다. 파일은 이 사이트에 공개되지 않습니다.",
  },
  {
    title: "보관 위치와 기간",
    body: "파일은 신랑·신부의 Google Drive에 저장되며, 이 사이트의 서버에는 보관하지 않습니다. 신랑·신부가 추억으로 보관하며, 삭제를 원하시면 신랑·신부에게 연락해 주세요. 요청 시 지체 없이 삭제합니다.",
  },
  {
    title: "Google 사용자 데이터",
    body: "이 사이트는 신랑·신부 본인의 Google 계정에 대해서만 Google Drive 권한(drive.file)을 사용하며, 이 앱이 만든 폴더와 파일에만 접근합니다. 하객의 Google 계정 정보는 요청하거나 수집하지 않으며, Google 사용자 데이터를 제3자에게 판매하거나 광고에 사용하지 않습니다.",
  },
  {
    title: "처리 위탁",
    body: "사이트 호스팅은 Vercel, 파일 저장은 Google Drive를 이용합니다. 업로드 과정에서 파일이 이 서비스들을 거쳐 전달됩니다.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="movie-paper mx-auto min-h-screen w-full max-w-[430px] px-6 py-20 text-[var(--color-text)]">
      <p className="font-title-en text-[10px] tracking-[0.14em] text-[var(--color-text-muted)]">
        PRIVACY POLICY
      </p>
      <h1 className="mt-3 text-[1.25rem] font-bold">개인정보처리방침</h1>
      <p className="mt-4 text-[13px] leading-7 text-[var(--color-text-muted)]">
        {wedding.couple.groom.name} &amp; {wedding.couple.bride.name}의 모바일 청첩장({wedding.meta.url})은
        하객의 개인정보를 아래와 같이 최소한으로 처리합니다.
      </p>

      {sections.map((section) => (
        <section className="mt-10 border-t border-[var(--color-line)] pt-6" key={section.title}>
          <h2 className="text-sm font-semibold">{section.title}</h2>
          <p className="mt-2 text-[13px] leading-7 text-[var(--color-text-muted)]">{section.body}</p>
        </section>
      ))}

      <p className="mt-12 text-[11px] text-[var(--color-text-muted)]">시행일: 2026년 10월 6일</p>
    </main>
  );
}
