import { siteConfig } from "@/lib/seo/metadata";

type JsonLdProps = {
    data: Record<string, unknown> | Record<string, unknown>[];
};

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function HomePageJsonLd() {
    const website = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: {
            "@type": "Organization",
            name: siteConfig.company,
            url: siteConfig.url,
        },
    };

    const webApp = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web, Android, iOS",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
        },
        featureList: [
            "UPI payment QR code generation",
            "Multiple UPI ID management",
            "Payment history tracking",
            "Offline PWA support",
            "Share and download QR codes",
        ],
    };

    const organization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.company,
        url: siteConfig.url,
        email: siteConfig.contactEmail,
        telephone: siteConfig.contactPhone,
    };

    return (
        <>
            <JsonLd data={website} />
            <JsonLd data={webApp} />
            <JsonLd data={organization} />
        </>
    );
}

export function FAQPageJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map(({ question, answer }) => ({
                    "@type": "Question",
                    name: question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: answer,
                    },
                })),
            }}
        />
    );
}
