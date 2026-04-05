import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "./sw-register";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#06060e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://debranded.vercel.app"),
  title: "DEBRANDED — Coming Soon",
  description:
    "Elite Tech Marketing & Growth Architecture. We scale tech products into revenue-generating machines. Coming soon.",
  keywords: [
    "DEBRANDED",
    "tech marketing",
    "growth architecture",
    "digital advertising",
    "Meta ads",
    "TikTok ads",
  ],
  authors: [{ name: "Kingsley Maduabuchi (Blessed King)" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    shortcut: "/icon-192.png",
  },
  openGraph: {
    title: "DEBRANDED — Coming Soon",
    description:
      "Elite tech marketing & growth architecture. Launching soon.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "DEBRANDED" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEBRANDED — Coming Soon",
    description:
      "Elite tech marketing & growth architecture. Launching soon.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <meta name="application-name" content="DEBRANDED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="DEBRANDED" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
