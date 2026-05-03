"use client";

import Link from "next/link";
import {
    FiGlobe, FiFile, FiImage, FiVideo, FiMusic, FiWifi,
    FiBook, FiBriefcase, FiLink, FiTag, FiUser, FiSmartphone,
} from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";

const QR_TYPES = [
    { label: "Website", sub: "Start a URL", bg: "bg-blue-50", icon: FiGlobe, color: "text-blue-600" },
    { label: "PDF", sub: "Share a PDF", bg: "bg-red-50", icon: FiFile, color: "text-red-500" },
    { label: "Images", sub: "Image gallery", bg: "bg-green-50", icon: FiImage, color: "text-green-600" },
    { label: "Video", sub: "Share a link", bg: "bg-amber-50", icon: FiVideo, color: "text-amber-500" },
    { label: "MP3", sub: "Play audio file", bg: "bg-purple-50", icon: FiMusic, color: "text-purple-600" },
    { label: "Wi-Fi", sub: "Connect to Wi-Fi", bg: "bg-blue-50", icon: FiWifi, color: "text-blue-500" },
    { label: "Menu", sub: "Restaurant menu", bg: "bg-green-50", icon: FiBook, color: "text-green-600" },
    { label: "Business", sub: "vCard / contact", bg: "bg-red-50", icon: FiBriefcase, color: "text-red-500" },
    { label: "Links", sub: "Group links", bg: "bg-green-50", icon: FiLink, color: "text-green-500" },
    { label: "Coupon", sub: "Promo coupon", bg: "bg-amber-50", icon: FiTag, color: "text-amber-500" },
    { label: "vCard", sub: "Virtual business", bg: "bg-blue-50", icon: FiUser, color: "text-blue-600" },
    { label: "Apps", sub: "Redirect to app", bg: "bg-purple-50", icon: FiSmartphone, color: "text-purple-600" },
];

export default function Hero() {
    return (
        <div>
            {/* ── Dark hero gradient ── */}
            <div
                className="relative overflow-hidden"
                style={{
                    background: "linear-gradient(160deg,#0a0f2e 0%,#0e2060 40%,#1a3a8f 70%,#1e50c8 100%)",
                }}
            >
                {/* Radial glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 50% at 50% 20%,rgba(37,99,235,0.35) 0%,transparent 70%)",
                    }}
                />

                {/* Hero text */}
                <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-14 sm:pt-20 lg:pt-24">
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
                        style={{ fontFamily: "var(--font-sora)" }}
                    >
                        We make{" "}
                        <span className="text-blue-400">QR Codes</span> easy
                    </h1>

                    <p className="text-white/60 text-sm sm:text-base max-w-md sm:max-w-xl mx-auto mb-7 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna,
                        cursus molestie scelerisque ac quis. Gravida nisl eu lorem praim
                        dolor commodo.
                    </p>

                    <Link
                        href="/payment-qr"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-7 py-3.5 rounded-full no-underline transition-colors"
                        style={{ boxShadow: "0 4px 24px rgba(37,99,235,0.5)" }}
                    >
                        <RiQrCodeLine size={16} />
                        Create QR Code
                    </Link>

                    {/* Feature badges */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 mb-8">
                        {[
                            "Generate dynamic, editable QR codes",
                            "Track performance with analytics",
                            "Design QR codes with logo, colors & shapes",
                        ].map((text) => (
                            <span key={text} className="flex items-center gap-1.5 text-white/65 text-xs sm:text-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                                {text}
                            </span>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-2 mb-0">
                        {["Scan", "✦ Customize", "Download"].map((tab, i) => (
                            <button
                                key={tab}
                                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium border-none cursor-pointer transition-all ${i === 0
                                        ? "bg-white text-blue-900"
                                        : "bg-white/10 text-white/70 hover:bg-white/15"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── QR Type Card ── */}
                    <div className="relative z-20 bg-white rounded-t-2xl mt-6 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 shadow-[0_-8px_40px_rgba(14,32,96,0.2)]">
                        <h2
                            className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2"
                            style={{ fontFamily: "var(--font-sora)" }}
                        >
                            <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                1
                            </span>
                            Select a type of QR
                        </h2>

                        <div className="flex gap-4 lg:gap-6">
                            {/* Grid — 4 cols on mobile, 6 cols on lg */}
                            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5 flex-1">
                                {QR_TYPES.map(({ label, sub, bg, icon: Icon, color }) => (
                                    <Link
                                        key={label}
                                        href="/payment-qr"
                                        className="flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl border border-blue-50 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all no-underline group"
                                    >
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${bg}`}>
                                            <Icon size={14} className={`sm:text-base ${color}`} />
                                        </div>
                                        <span className="text-[9px] sm:text-[10.5px] text-slate-600 font-medium text-center leading-tight">
                                            {label}
                                        </span>
                                        <span className="text-[8px] sm:text-[9px] text-slate-400 text-center leading-tight hidden sm:block">
                                            {sub}
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            {/* Phone mockup — hidden on small, visible md+ */}
                            <div className="hidden md:flex w-32 lg:w-36 flex-shrink-0 bg-slate-900 rounded-2xl p-2.5 flex-col items-center gap-2">
                                <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
                                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center">
                                    <MiniQR />
                                </div>
                                <p className="text-[9px] text-white/50 text-center px-1 leading-snug">
                                    Select a type of QR in the left column
                                </p>
                            </div>
                        </div>

                        {/* Bottom padding so it doesn't cut off */}
                        <div className="h-6" />
                    </div>
                </div>

                {/* Curve to white bg */}
                <div
                    className="h-6 bg-[#f0f4ff]"
                    style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
                />
            </div>
        </div>
    );
}

function MiniQR() {
    return (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <rect x="5" y="5" width="24" height="24" rx="2" fill="#1a3a8f" />
            <rect x="9" y="9" width="16" height="16" rx="1" fill="white" />
            <rect x="12" y="12" width="10" height="10" rx="0.5" fill="#1a3a8f" />
            <rect x="41" y="5" width="24" height="24" rx="2" fill="#1a3a8f" />
            <rect x="45" y="9" width="16" height="16" rx="1" fill="white" />
            <rect x="48" y="12" width="10" height="10" rx="0.5" fill="#1a3a8f" />
            <rect x="5" y="41" width="24" height="24" rx="2" fill="#1a3a8f" />
            <rect x="9" y="45" width="16" height="16" rx="1" fill="white" />
            <rect x="12" y="48" width="10" height="10" rx="0.5" fill="#1a3a8f" />
            <rect x="41" y="41" width="4" height="4" fill="#1a3a8f" />
            <rect x="47" y="41" width="4" height="4" fill="#1a3a8f" />
            <rect x="53" y="41" width="4" height="4" fill="#1a3a8f" />
            <rect x="59" y="41" width="4" height="4" fill="#1a3a8f" />
            <rect x="41" y="47" width="4" height="4" fill="#1a3a8f" />
            <rect x="53" y="47" width="4" height="4" fill="#1a3a8f" />
            <rect x="41" y="53" width="4" height="4" fill="#1a3a8f" />
            <rect x="47" y="53" width="4" height="4" fill="#1a3a8f" />
            <rect x="59" y="53" width="4" height="4" fill="#1a3a8f" />
            <rect x="41" y="59" width="4" height="4" fill="#1a3a8f" />
            <rect x="53" y="59" width="4" height="4" fill="#1a3a8f" />
            <rect x="59" y="59" width="4" height="4" fill="#1a3a8f" />
        </svg>
    );
}