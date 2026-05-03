"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import Drawer from "@/components/layout/Drawer";
import InstallPWA from "@/components/InstallPWA";

const NAV = [
    { href: "/", label: "Home" },
    { href: "/payment-qr", label: "Payment QR" },
    { href: "/history", label: "History" },
];

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <header
                className="sticky top-0 z-30 w-full border-b border-white/10"
                style={{ background: "linear-gradient(135deg,#0a0f2e 0%,#0e2060 100%)" }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3.5">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 no-underline">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <RiQrCodeLine size={18} color="white" />
                        </div>
                        <span
                            className="text-white font-bold text-sm tracking-tight hidden sm:block"
                            style={{ fontFamily: "var(--font-sora)" }}
                        >
                            QR Generator
                        </span>
                    </Link>

                    {/* Desktop nav links (center) */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV.map(({ href, label }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all ${active
                                            ? "bg-blue-600 text-white"
                                            : "text-white/65 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <InstallPWA />
                        {/* Hamburger — mobile/tablet only */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="lg:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors -mr-1"
                            aria-label="Open menu"
                        >
                            <FiMenu size={22} />
                        </button>
                    </div>
                </div>
            </header>

            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}