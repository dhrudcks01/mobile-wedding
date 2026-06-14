import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { wedding } from "@/data/wedding";
import "./globals.css";

const metadataBase = new URL(wedding.meta.url);

export const metadata: Metadata = {
  title: wedding.meta.title,
  description: wedding.meta.description,
  metadataBase,
  alternates: {
    canonical: wedding.meta.url,
  },
  openGraph: {
    title: wedding.meta.title,
    description: wedding.meta.description,
    url: wedding.meta.url,
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
  themeColor: "#eee7dc",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
