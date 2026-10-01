import type { Metadata } from "next";
import { TornEdge } from "@/components/common/TornEdge";
import { wedding } from "@/data/wedding";
import { isUploadOpen } from "@/lib/photos/upload-security";
import { UploadForm } from "./UploadForm";
import styles from "./photos.module.css";

export const dynamic = "force-dynamic";

const title = "우리의 순간을 모아 주세요";
const description = "함께한 날의 사진과 동영상을 신랑·신부에게 전해 주세요.";
const pageUrl = new URL("/photos", wedding.meta.url).toString();

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, images: [] },
  twitter: { card: "summary", title, description, images: [] },
  referrer: "no-referrer",
};

// 청첩장 본문과 같은 구성입니다. 어두운 필름 헤더 → 찢긴 종이 경계 →
// 아이보리 종이 위의 폼 → 다시 어두운 엔딩으로 닫습니다.
export default function PhotosPage() {
  return (
    <main className={styles.page}>
      <header className={`movie-dark film-grain ${styles.header}`}>
        <span className={styles.eyebrow}>Guest Snap</span>
        <h1 className={styles.title}>Our Day, Your Eyes</h1>
        <p className={styles.couple}>
          {wedding.couple.groom.name}
          <span aria-hidden="true">·</span>
          {wedding.couple.bride.name}
        </p>
        <p className={styles.date}>{wedding.event.displayDate}</p>
        <p className={styles.intro}>
          여러분의 시선에 담긴 우리의 하루.<br />
          사진과 영상으로 소중한 순간을 나눠 주세요.
        </p>
        <TornEdge id="photos-header" />
      </header>

      <section className={`movie-paper ${styles.body}`} aria-labelledby="photos-upload-title">
        <span className={styles.sectionEyebrow}>Upload</span>
        <h2 id="photos-upload-title" className={`section-title ${styles.sectionTitle}`}>
          Share the Moments
        </h2>
        <p className={styles.sectionDescription}>
          보내 주신 사진은 원본 그대로<br />
          신랑·신부에게만 전달됩니다.
        </p>
        <UploadForm isOpen={isUploadOpen()} />
      </section>

      <footer className={`movie-dark ${styles.footer}`}>
        <TornEdge flip id="photos-footer" />
        <p className={styles.footerScript}>Thank you</p>
        <p className={styles.footerCaption}>WITH LOVE &amp; GRATITUDE</p>
      </footer>
    </main>
  );
}
