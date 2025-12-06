import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { StructuredData } from "./components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vorex - The First Human-Like AI English Tutor",
    template: "%s | Vorex",
  },
  description: "Master English with the first AI tutor that explains like a human. Get instant grammar corrections, personalized feedback, and learn from context-aware explanations that actually make sense.",
  keywords: [
    "English learning",
    "AI English tutor",
    "human-like AI tutor",
    "grammar checker",
    "writing feedback",
    "English fluency",
    "language learning app",
    "ESL",
    "English writing practice",
    "grammar corrections",
    "spaced repetition",
    "personalized learning",
  ],
  authors: [{ name: "Vorex" }],
  creator: "Vorex",
  publisher: "Vorex",
  metadataBase: new URL("https://vorex.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vorex.app",
    title: "Vorex - The First Human-Like AI English Tutor",
    description: "Master English with the first AI tutor that explains like a human. Instant corrections, personalized feedback, and context-aware explanations.",
    siteName: "Vorex",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vorex - The First Human-Like AI English Tutor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorex - The First Human-Like AI English Tutor",
    description: "Master English with instant corrections and context-aware explanations that actually make sense.",
    images: ["/og-image.png"],
    creator: "@vorex",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0C10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <StructuredData />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
