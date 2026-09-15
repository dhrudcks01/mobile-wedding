import type { Metadata } from "next";
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

export default function PhotosPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>OUR DAY, THROUGH YOUR EYES</p>
        <h1 className={styles.title}>
          A little piece<br /><em>of our day.</em>
        </h1>
        <p className={styles.couple}>
          {wedding.couple.groom.name} &amp; {wedding.couple.bride.name}
        </p>
        <p className={styles.intro}>
          여러분의 시선에 담긴 우리의 하루.<br />
          사진과 영상으로 소중한 순간을 나눠 주세요.
        </p>
        <span className={styles.date}>{wedding.event.displayDate}</span>
      </header>
      <UploadForm isOpen={isUploadOpen()} />
      <footer className={styles.footer}>WITH LOVE &amp; GRATITUDE</footer>
    </main>
  );
}
