import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ClickPulseEffect } from "@/components/ClickPulseEffect";
import { AurumCustomCursor } from "@/components/AurumCustomCursor";
import { getAppUrl } from "@/lib/app-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AURUM EV | Driven by Trust. Powered by Tomorrow.",
    template: "%s | AURUM EV",
  },
  description:
    "Affordable, reliable, and flexible electric two-wheeler rental solutions for delivery partners, individuals, and businesses by Aurum Fleet Solutions Pvt Ltd.",
  keywords: [
    "Electric scooter rental",
    "EV rental for delivery partners",
    "Electric scooter rental for businesses",
    "Monthly EV rental",
    "Electric two-wheeler fleet solutions",
    "EV fleet management",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "AURUM EV",
    title: "AURUM EV | Driven by Trust. Powered by Tomorrow.",
    description:
      "Electric two-wheeler rentals, delivery partner EV plans, corporate fleet solutions, and mobility partnerships by Aurum Fleet Solutions Pvt Ltd.",
    images: [
      {
        url: "/images/aurum-og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "AURUM EV – Powering India's Delivery Future with Electric Mobility",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURUM EV | Driven by Trust. Powered by Tomorrow.",
    description:
      "Smart electric two-wheeler rental and fleet management ecosystem by Aurum Fleet Solutions Pvt Ltd.",
    images: [
      {
        url: "/images/aurum-og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "AURUM EV – Powering India's Delivery Future with Electric Mobility",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawGa4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || "";
  const rawGtm = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
  const ga4Id = /^G-[A-Z0-9]+$/.test(rawGa4) ? rawGa4 : "";
  const gtmId = /^GTM-[A-Z0-9]+$/.test(rawGtm) ? rawGtm : "";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AURUM EV",
    legalName: "Aurum Fleet Solutions Pvt Ltd",
    url: appUrl,
    logo: `${appUrl}/images/aurum-emblem.png`,
    slogan: "Driven by Trust. Powered by Tomorrow.",
  };

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${ga4Id}');`}
            </Script>
          </>
        )}
        {gtmId && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
        {children}
        <AurumCustomCursor />
        <ClickPulseEffect />
      </body>
    </html>
  );
}
