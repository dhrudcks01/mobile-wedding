import { Section } from "@/components/common/Section";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(70,55,42,0.14)] sm:my-8 sm:min-h-[calc(100vh-4rem)] sm:rounded-[32px]">
      <Section
        eyebrow="Mobile Invitation"
        title="아름다운 날을 위한 초대장"
        description="곧 따뜻한 소식으로 채워질 공간입니다."
      >
        <div className="mx-auto mt-10 h-px w-20 bg-[var(--color-line)]" />
      </Section>
    </main>
  );
}
