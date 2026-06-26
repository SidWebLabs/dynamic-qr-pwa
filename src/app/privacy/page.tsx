import Link from "next/link";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import AdsenseAd from "@/components/AdseneseAd/AdsenseAd";

export const metadata = {
    title: "Privacy Policy — QR Pay Manager",
    description: "Privacy policy for QR Pay Manager UPI payment QR code generator.",
};

export default function PrivacyPage() {
    const lastUpdated = "21 June 2026";
    const contactEmail = "taginusinnovation@gmail.com";
    const contactPhone = "+91 9850818859";
    const companyName = "Taginus Innovations";
    const appName = "QR Pay Manager";
    const appUrl = "https://dynamic-qr-pwa.netlify.app";

    return (
        <div className="min-h-screen bg-[#f0f4ff]">
            {/* Header */}
            <div
                className="px-4 py-10 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(160deg,#0a0f2e 0%,#0e2060 50%,#1a3a8f 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(37,99,235,0.3) 0%,transparent 70%)" }}
                />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm no-underline mb-6 transition-colors"
                    >
                        <FiArrowLeft size={14} /> Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <FiShield size={20} color="white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-sora)" }}>
                            Privacy Policy
                        </h1>
                    </div>
                    <p className="text-white/50 text-sm">Last updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Ad — top */}
            <div className="max-w-3xl mx-auto px-4 pt-6">
                <AdsenseAd format="horizontal" />
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Section card helper */}
                {[
                    {
                        title: "1. Introduction",
                        content: (
                            <p>
                                Welcome to <strong>{appName}</strong>, a product of <strong>{companyName}</strong>.
                                This Privacy Policy explains how we collect, use, and protect your information when
                                you use our UPI payment QR code management application available at{" "}
                                <a href={appUrl} className="text-blue-600 no-underline hover:underline">{appUrl}</a>.
                                By using our application, you agree to the practices described in this policy.
                            </p>
                        ),
                    },
                    {
                        title: "2. Information We Collect",
                        content: (
                            <div className="space-y-3">
                                <p><strong>Account Information:</strong> When registered by an administrator, we store your name and mobile number to create your account.</p>
                                <p><strong>UPI Account Details:</strong> UPI IDs and associated owner names that you add to generate payment QR codes.</p>
                                <p><strong>QR Generation History:</strong> Records of QR codes generated including amount, note, UPI ID used, and timestamp — stored per user for history tracking.</p>
                                <p><strong>Authentication Data:</strong> A 5-digit PIN used to verify your identity. PINs are stored in our database and used only for login verification.</p>
                                <p><strong>Device Information:</strong> Browser type, device type, and IP address collected automatically for security and analytics purposes.</p>
                                <p><strong>Usage Data:</strong> Pages visited, features used, and time spent on the application to improve our service.</p>
                            </div>
                        ),
                    },
                    {
                        title: "3. How We Use Your Information",
                        content: (
                            <ul className="space-y-2 list-none">
                                {[
                                    "To authenticate you and provide access to the application",
                                    "To generate UPI payment QR codes on your behalf",
                                    "To store and display your QR generation history",
                                    "To manage your UPI account profiles",
                                    "To enforce account limits set by your administrator",
                                    "To improve application performance and user experience",
                                    "To respond to support requests and technical issues",
                                    "To display relevant advertisements via Google AdSense",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ),
                    },
                    {
                        title: "4. Data Storage",
                        content: (
                            <div className="space-y-3">
                                <p>Your data is stored in a secure PostgreSQL database hosted on our servers. Session tokens are stored in your browser&apos;s <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">localStorage</code> to keep you logged in.</p>
                                <p>We do not sell, rent, or share your personal data with third parties except as required by law or as described in this policy (e.g. Google AdSense for ad serving).</p>
                            </div>
                        ),
                    },
                    {
                        title: "5. Google AdSense & Cookies",
                        content: (
                            <div className="space-y-3">
                                <p>
                                    We use <strong>Google AdSense</strong> to display advertisements on our public pages.
                                    Google AdSense uses cookies and similar tracking technologies to serve ads based on
                                    your prior visits to our website and other sites on the internet.
                                </p>
                                <p>
                                    Google&apos;s use of advertising cookies enables it and its partners to serve ads based on
                                    your visit to our site and other sites on the Internet. You may opt out of personalized
                                    advertising by visiting{" "}
                                    <a href="https://www.google.com/settings/ads" className="text-blue-600 no-underline hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Ads Settings
                                    </a>.
                                </p>
                                <p>
                                    For more information on how Google uses data, visit{" "}
                                    <a href="https://policies.google.com/technologies/partner-sites" className="text-blue-600 no-underline hover:underline" target="_blank" rel="noopener noreferrer">
                                        How Google uses data when you use our partners&apos; sites or apps
                                    </a>.
                                </p>
                            </div>
                        ),
                    },
                    {
                        title: "6. UPI & Payment Data",
                        content: (
                            <div className="space-y-3">
                                <p>
                                    <strong>{appName}</strong> generates UPI QR codes locally using standard UPI deep-link
                                    format (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">upi://pay?...</code>).
                                    We do <strong>not</strong> process, initiate, or have access to any actual payment transactions.
                                </p>
                                <p>
                                    All payment processing happens directly between the payer&apos;s UPI app and the payee&apos;s
                                    bank. We have no visibility into whether a payment is completed, failed, or pending.
                                </p>
                            </div>
                        ),
                    },
                    {
                        title: "7. Data Security",
                        content: (
                            <div className="space-y-3">
                                <p>We implement industry-standard security measures including:</p>
                                <ul className="space-y-2 list-none">
                                    {[
                                        "JWT-based authentication with 30-day token expiry",
                                        "HTTPS encryption for all data in transit",
                                        "Database-level access controls",
                                        "No storage of actual payment or transaction data",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ),
                    },
                    {
                        title: "8. Your Rights",
                        content: (
                            <div className="space-y-3">
                                <p>You have the right to:</p>
                                <ul className="space-y-2 list-none">
                                    {[
                                        "Request access to your personal data",
                                        "Request correction of inaccurate data",
                                        "Request deletion of your account and associated data",
                                        "Opt out of personalized advertising via Google Ads Settings",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p>To exercise any of these rights, contact us using the details below.</p>
                            </div>
                        ),
                    },
                    {
                        title: "9. Children's Privacy",
                        content: (
                            <p>
                                {appName} is not intended for use by individuals under the age of 18.
                                We do not knowingly collect personal information from minors.
                                If you believe a minor has provided us with personal information, please contact us immediately.
                            </p>
                        ),
                    },
                    {
                        title: "10. Changes to This Policy",
                        content: (
                            <p>
                                We may update this Privacy Policy from time to time. We will notify registered users of
                                significant changes. The &quot;Last updated&quot; date at the top of this page reflects the most
                                recent revision. Continued use of the application after changes constitutes acceptance
                                of the updated policy.
                            </p>
                        ),
                    },
                    {
                        title: "11. Contact Us",
                        content: (
                            <div className="space-y-2">
                                <p>If you have questions about this Privacy Policy or your data, contact us:</p>
                                <div className="bg-blue-50 rounded-xl p-4 space-y-1.5 mt-3">
                                    <p className="font-semibold text-blue-900 text-sm">{companyName}</p>
                                    <p className="text-slate-600 text-sm">
                                        Email:{" "}
                                        <a href={`mailto:${contactEmail}`} className="text-blue-600 no-underline hover:underline">
                                            {contactEmail}
                                        </a>
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Phone:{" "}
                                        <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="text-blue-600 no-underline hover:underline">
                                            {contactPhone}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        ),
                    },
                ].map(({ title, content }) => (
                    <div key={title} className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-50 shadow-sm">
                        <h2
                            className="text-slate-800 font-bold text-base mb-3"
                            style={{ fontFamily: "var(--font-sora)" }}
                        >
                            {title}
                        </h2>
                        <div className="text-slate-600 text-sm leading-relaxed">{content}</div>
                    </div>
                ))}

                {/* Ad — bottom */}
                <AdsenseAd format="rectangle" />

                {/* Footer note */}
                <p className="text-center text-slate-400 text-xs -mb-4">
                    © {new Date().getFullYear()} {companyName}. All rights reserved.
                </p>

                 <p className="text-center text-slate-400 text-xs -mt-4">
                    Developed By <span className="text-black font-semibold">Siddhesh Kulkarni</span>
                </p>
            </div>
        </div>
    );
}