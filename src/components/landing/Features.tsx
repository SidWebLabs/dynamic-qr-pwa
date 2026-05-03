import Link from "next/link";
import { FiZap, FiClock, FiShield, FiDatabase } from "react-icons/fi";

const FEATURES = [
    {
        icon: FiZap,
        title: "High-tech QR codes",
        desc: "Generate UPI payment QR codes instantly with custom amount, note and owner name. Works with all UPI apps.",
        href: "/payment-qr",
        color: "text-blue-600",
        bg: "bg-blue-50",
        dot: "bg-blue-500",
    },
    {
        icon: FiClock,
        title: "High conversion rates",
        desc: "Clean, scannable QR codes designed for maximum compatibility across GPay, PhonePe, Paytm and BHIM.",
        href: "/payment-qr",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        dot: "bg-emerald-500",
    },
    {
        icon: FiDatabase,
        title: "Real-time analytics",
        desc: "View all generated QRs grouped by date. Filter by today, this week or a custom date range in History.",
        href: "/history",
        color: "text-amber-500",
        bg: "bg-amber-50",
        dot: "bg-amber-400",
    },
    {
        icon: FiShield,
        title: "Easy landing pages",
        desc: "All your UPI IDs stored securely on your device. No server, no account required — 100% offline ready.",
        href: "/",
        color: "text-purple-600",
        bg: "bg-purple-50",
        dot: "bg-purple-500",
    },
];

const BOTTOM = [
    { label: "Multiple types of QR codes", dot: "bg-blue-500" },
    { label: "Full customization", dot: "bg-emerald-500" },
    { label: "Easily download, share & edit", dot: "bg-amber-400" },
    { label: "Get started fast!", dot: "bg-purple-500" },
];

export default function Features() {
    return (
        <section className="bg-[#f0f4ff] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-14">
                    <h2
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 leading-tight"
                        style={{ fontFamily: "var(--font-sora)" }}
                    >
                        Best QR Code Management and
                        <br className="hidden sm:block" /> Marketing Features
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-sm mx-auto">
                        Trusted QR Code platform with advanced features
                    </p>
                </div>

                {/* Feature cards — 1 col mobile, 2 col sm, 4 col lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                    {FEATURES.map(({ icon: Icon, title, desc, href, color, bg, dot }) => (
                        <Link
                            key={title}
                            href={href}
                            className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-md hover:border-blue-100 transition-all no-underline group"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
                                <Icon size={20} className={color} />
                            </div>
                            <h3
                                className="text-slate-800 font-semibold text-sm mb-2"
                                style={{ fontFamily: "var(--font-sora)" }}
                            >
                                {title}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Bottom labels row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BOTTOM.map(({ label, dot }) => (
                        <div key={label} className="bg-white rounded-xl px-4 py-3 border border-blue-50 flex items-center gap-2.5 shadow-sm">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                            <span className="text-slate-500 text-xs font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}