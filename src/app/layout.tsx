import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ClickPulseEffect } from "@/components/ClickPulseEffect";
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
  openGraph: {
    type: "website",
    siteName: "AURUM EV",
    title: "AURUM EV | Driven by Trust. Powered by Tomorrow.",
    description:
      "Electric two-wheeler rentals, delivery partner EV plans, corporate fleet solutions, and mobility partnerships by Aurum Fleet Solutions Pvt Ltd.",
    images: ["/images/hero-ev-scooter.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURUM EV | Driven by Trust. Powered by Tomorrow.",
    description:
      "Smart electric two-wheeler rental and fleet management ecosystem by Aurum Fleet Solutions Pvt Ltd.",
    images: ["/images/hero-ev-scooter.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

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
        <ClickPulseEffect />
      </body>
    </html>
  );
}
