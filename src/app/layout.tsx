import type { Metadata, Viewport } from "next";
import {
  Gowun_Batang,
  Gowun_Dodum,
  Great_Vibes,
  Montserrat,
  Pinyon_Script,
  Playfair_Display,
} from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { wedding } from "@/data/wedding";
import "./globals.css";

const fallbackUrl = "https://example.com";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  variable: "--font-gowun-dodum",
  display: "swap",
  preload: false,
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
});

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  variable: "--font-gowun-batang",
  display: "swap",
  preload: false,
  fallback: ["Nanum Myeongjo", "Batang", "serif"],
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});

// 레퍼런스(repocu 무비 템플릿)가 영문에 쓰는 유일한 폰트입니다.
// weight를 지정하지 않는 이유: Montserrat은 가변 폰트라 축을 통째로 담은
// 파일 하나만 받습니다. 굵기를 나열하면 정적 인스턴스가 그 수만큼 받아집니다.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
  fallback: ["cursive"],
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon-script",
  display: "swap",
  fallback: ["cursive"],
});

const californication = localFont({
  src: "../fonts/The Californication.ttf",
  weight: "400",
  variable: "--font-californication",
  display: "swap",
  fallback: ["Great Vibes", "cursive"],
});

function getMetadataBase(url: string) {
  try {
    return new URL(url);
  } catch {
    return new URL(fallbackUrl);
  }
}

const metadataBase = getMetadataBase(wedding.meta.url);
const canonicalUrl = wedding.meta.url.trim() || fallbackUrl;

export const metadata: Metadata = {
  title: wedding.meta.title,
  description: wedding.meta.description,
  metadataBase,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: wedding.meta.title,
    description: wedding.meta.description,
    url: canonicalUrl,
    siteName: wedding.meta.title,
    images: [
      {
        url: wedding.meta.ogImage,
        width: 1200,
        height: 630,
        alt: wedding.meta.title,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [wedding.meta.ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080c0b",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="ko"
      className={[
        gowunDodum.variable,
        gowunBatang.variable,
        playfairDisplay.variable,
        montserrat.variable,
        greatVibes.variable,
        pinyonScript.variable,
        californication.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}
