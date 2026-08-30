"use client";

import Link from "next/link";
import { FiZap, FiClock, FiShield, FiArrowRight } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

const STATS = [
    { val: "UPI", sub: "Payment QR" },
    { val: "5-Pin", sub: "Secure Login" },
    { val: "Offline", sub: "PWA Ready" },
];

const FEATURES = [
    { icon: FiZap, label: "Generate dynamic, editable QR codes" },
    { icon: FiClock, label: "Track all payments by date in History" },
    { icon: FiShield, label: "Data stored locally — 100% private" },
];

const CARDS = [
    {
        icon: FiZap, title: "Payment QR",
        desc: "Add UPI IDs with name and label. Select from dropdown, enter amount and generate instantly.",
        authHref: "/payment-qr", guestHref: "/login",
        color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-200",
    },
    {
        icon: FiClock, title: "QR History",
        desc: "All generated QRs saved locally. Filter by today, this week or any date. Re-view and share.",
        authHref: "/history", guestHref: "/login",
        color: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-200",
    },
    {
        icon: FiShield, title: "Secure & Offline",
        desc: "No server, no account sync. Everything lives on your device. Works fully offline as a PWA.",
        authHref: "/", guestHref: "/",
        color: "text-amber-500", bg: "bg-amber-50", border: "hover:border-amber-200",
    },
];

export default function Hero() {
    const { user } = useAuth();

    return (
        <div className="overflow-x-hidden">
            {/* ── Gradient hero ── */}
            <div
                className="relative"
                style={{ background: "linear-gradient(160deg,#0a0f2e 0%,#0e2060 40%,#1a3a8f 70%,#1e50c8 100%)" }}
            >
                {/* Glow blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-25"
                        style={{ background: "radial-gradient(ellipse,#3b82f6 0%,transparent 70%)" }}
                    />
                    <div
                        className="absolute top-1/3 -right-40 w-72 h-72 rounded-full opacity-10"
                        style={{ background: "radial-gradient(ellipse,#60a5fa 0%,transparent 70%)" }}
                    />
                    <div
                        className="absolute bottom-0 -left-20 w-48 h-48 rounded-full opacity-10"
                        style={{ background: "radial-gradient(ellipse,#818cf8 0%,transparent 70%)" }}
                    />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 lg:pt-28">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <span className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            UPI QR Payment Manager
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-center text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-5 tracking-tight"
                        style={{ fontFamily: "var(--font-sora)" }}
                    >
                        UPI Payment{" "}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(90deg,#60a5fa 0%,#a5b4fc 100%)" }}
                        >
                            QR Generator
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-center text-white/55 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                        Generate UPI payment QR codes instantly. Manage multiple UPI IDs,
                        track payment history and share with ease.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                        <Link
                            href={user ? "/payment-qr" : "/login"}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-8 py-3.5 rounded-full no-underline transition-all active:scale-95"
                            style={{ boxShadow: "0 4px 24px rgba(37,99,235,0.5)" }}
                        >
                            <RiQrCodeLine size={16} />
                            {user ? "Create QR Code" : "Get Started"}
                            <FiArrowRight size={14} />
                        </Link>
                        {user && (
                            <Link
                                href="/history"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold px-8 py-3.5 rounded-full no-underline transition-all"
                            >
                                <FiClock size={14} />
                                View History
                            </Link>
                        )}
                    </div>

                    {/* Feature bullets */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
                        {FEATURES.map(({ icon: Icon, label }) => (
                            <span key={label} className="flex items-center gap-1.5 text-white/55 text-xs sm:text-sm">
                                <Icon size={13} className="text-blue-400 flex-shrink-0" />
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="max-w-xs sm:max-w-sm mx-auto grid grid-cols-3 gap-4 pb-10 sm:pb-14">
                        {STATS.map(({ val, sub }) => (
                            <div key={val} className="text-center">
                                <p className="text-white font-bold text-base sm:text-lg" style={{ fontFamily: "var(--font-sora)" }}>
                                    {val}
                                </p>
                                <p className="text-white/40 text-xs mt-0.5">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SVG wave */}
                <div className="relative h-14 sm:h-20 -mb-px">
                    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg"
                        className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff" />
                    </svg>
                </div>
            </div>

            {/* ── Feature cards ── */}
            <div className="bg-[#f0f4ff] px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {CARDS.map(({ icon: Icon, title, desc, authHref, guestHref, color, bg, border }) => (
                        <Link
                            key={title}
                            href={user ? authHref : guestHref}
                            className={`bg-white rounded-2xl p-5 sm:p-6 border border-blue-50 ${border} shadow-sm hover:shadow-lg transition-all no-underline group`}
                        >
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
                                <Icon size={20} className={color} />
                            </div>
                            <h3 className="text-slate-800 font-semibold text-sm mb-2" style={{ fontFamily: "var(--font-sora)" }}>
                                {title}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                            <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                Explore <FiArrowRight size={12} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}