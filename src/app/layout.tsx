import type { Metadata, Viewport } from "next";
import {
  Gowun_Batang,
  Gowun_Dodum,
  Great_Vibes,
  Playfair_Display,
} from "next/font/google";
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

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
  fallback: ["cursive"],
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
        greatVibes.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}
