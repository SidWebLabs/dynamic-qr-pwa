"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiX, FiHome, FiZap, FiClock } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";

interface DrawerProps { open: boolean; onClose: () => void; }

const NAV = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/payment-qr", label: "Payment QR", icon: FiZap },
    { href: "/history", label: "History", icon: FiClock },
];

export default function Drawer({ open, onClose }: DrawerProps) {
    const pathname = usePathname();

    useEffect(() => {
        const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", k);
        return () => document.removeEventListener("keydown", k);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />
            {/* Panel */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{
                    background: "linear-gradient(170deg,#0a0f2e 0%,#0e2060 60%,#1a3a8f 100%)",
                    boxShadow: "8px 0 40px rgba(14,32,96,0.4)",
                }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <RiQrCodeLine size={18} color="white" />
                        </div>
                        <span className="text-white font-bold text-base tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
                            QR Generator
                        </span>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <FiX size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${active
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                        : "text-white/65 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-6 py-5 border-t border-white/10">
                    <p className="text-white/30 text-xs text-center">UPI Payment QR Manager</p>
                </div>
            </aside>
        </>
    );
}