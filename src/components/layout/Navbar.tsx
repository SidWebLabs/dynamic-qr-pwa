"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiLogOut, FiLogIn } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import Drawer from "@/components/layout/Drawer";
import InstallPWA from "@/components/InstallPWA";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/payment-qr", label: "Payment QR" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  // user.name comes from backend — safely get first char
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() ?? "U";
  const displayName = user?.name ?? "";

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header
        className="sticky top-0 z-30 w-full border-b border-white/10"
        style={{ background: "linear-gradient(135deg,#0a0f2e 0%,#0e2060 100%)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <RiQrCodeLine size={18} color="white" />
            </div>
            <span
              className="text-white font-bold text-sm tracking-tight hidden sm:block"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              QR Generator
            </span>
          </Link>

          {/* Desktop nav — only when logged in */}
          {user && (
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
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <InstallPWA />

            {!isLoading && (
              user ? (
                /* User avatar + dropdown */
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {avatarLetter}
                    </div>
                    <span className="hidden sm:block max-w-[90px] truncate">{displayName}</span>
                  </button>

                  {dropOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-blue-50 z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-slate-800 font-semibold text-sm truncate" style={{ fontFamily: "var(--font-sora)" }}>
                            {displayName}
                          </p>
                          <p className="text-slate-400 text-xs mt-0.5">+91 {user.mobile_no}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                          <FiLogOut size={14} /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Login button */
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-semibold px-3.5 py-2 rounded-full no-underline transition-colors"
                >
                  <FiLogIn size={13} />
                  <span>Login</span>
                </Link>
              )
            )}

            {/* Hamburger — only when logged in */}
            {user && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors -mr-1"
                aria-label="Open menu"
              >
                <FiMenu size={22} />
              </button>
            )}

            <Link href="/privacy" className="text-white hover:text-white/70 text-xs no-underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}