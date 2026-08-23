import type { Metadata } from "next";

export const siteConfig = {
    name: "QR Pay Manager",
    title: "QR Pay Manager — UPI QR Code Generator & Payment History",
    description:
        "Generate UPI payment QR codes instantly. Manage multiple UPI IDs, track payment history, share QR codes, and use offline as a PWA. Free, secure, and built for Indian merchants.",
    url: "https://dynamic-qr-pwa.netlify.app",
    locale: "en_IN",
    company: "Taginus Innovations",
    contactEmail: "taginusinnovation@gmail.com",
    contactPhone: "+919850818859",
    ogImage: "/QR_Pay.png",
    keywords: [
        "UPI QR code generator",
        "payment QR code",
        "UPI payment",
        "QR code for payments",
        "dynamic QR code",
        "merchant QR code India",
        "UPI ID manager",
        "payment history",
        "PWA QR generator",
        "Taginus Innovations",
    ],
} as const;

type PageMetadataOptions = {
    title?: string;
    description?: string;
    path?: string;
    noIndex?: boolean;
    keywords?: string[];
};

export function createMetadata({
    title,
    description = siteConfig.description,
    path = "",
    noIndex = false,
    keywords = [...siteConfig.keywords],
}: PageMetadataOptions = {}): Metadata {
    const url = `${siteConfig.url}${path}`;
    const pageTitle = title ?? siteConfig.title;

    return {
        title: title ? title : siteConfig.title,
        description,
        keywords,
        authors: [{ name: siteConfig.company, url: siteConfig.url }],
        creator: siteConfig.company,
        publisher: siteConfig.company,
        metadataBase: new URL(siteConfig.url),
        alternates: { canonical: url },
        openGraph: {
            type: "website",
            locale: siteConfig.locale,
            url,
            siteName: siteConfig.name,
            title: pageTitle,
            description,
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 512,
                    height: 512,
                    alt: `${siteConfig.name} — UPI QR Code Generator`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: pageTitle,
            description,
            images: [siteConfig.ogImage],
        },
        robots: noIndex
            ? { index: false, follow: false }
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      "max-image-preview": "large",
                      "max-snippet": -1,
                  },
              },
        category: "finance",
    };
}
