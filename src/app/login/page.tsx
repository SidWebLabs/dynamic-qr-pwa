"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiPhone, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiAlertCircle,
} from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { user, login, isLoading } = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") || "/";

  const [mobile, setMobile]   = useState("");
  const [pin, setPin]         = useState(["", "", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ mobile?: string; pin?: string }>({});
  const [submitting, setSubmitting]   = useState(false);
  const [shake, setShake]             = useState(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isLoading && user) router.replace(redirect);
  }, [user, isLoading, router, redirect]);

  // ── Validators ───────────────────────────────────────────
  const validateMobile = (val: string) => {
    if (!val.trim()) return "Mobile number is required.";
    if (!/^\d{10}$/.test(val.trim())) return "Enter a valid 10-digit mobile number.";
    return "";
  };

  const validatePin = (digits: string[]) => {
    const filled = digits.filter((d) => d !== "").length;
    if (filled === 0) return "PIN is required.";
    if (filled < 5)   return "Enter all 5 PIN digits.";
    return "";
  };

  // ── PIN handlers ─────────────────────────────────────────
  const handlePinChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...pin];
    next[idx] = val.slice(-1);
    setPin(next);
    setError(null);
    setFieldErrors((p) => ({ ...p, pin: validatePin(next) || undefined }));
    if (val && idx < 4) pinRefs.current[idx + 1]?.focus();
  };

  const handlePinKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const next = [...pin];
      if (!pin[idx] && idx > 0) {
        next[idx - 1] = "";
        setPin(next);
        pinRefs.current[idx - 1]?.focus();
      } else {
        next[idx] = "";
        setPin(next);
      }
      setFieldErrors((p) => ({ ...p, pin: undefined }));
    }
    if (e.key === "Enter") handleSubmit();
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!text) return;
    e.preventDefault();
    const next = [...pin];
    text.split("").forEach((c, i) => { next[i] = c; });
    setPin(next);
    pinRefs.current[Math.min(text.length, 4)]?.focus();
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async () => {
    const mErr = validateMobile(mobile);
    const pErr = validatePin(pin);
    if (mErr || pErr) {
      setFieldErrors({ mobile: mErr || undefined, pin: pErr || undefined });
      triggerShake();
      return;
    }

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const result = await login({ mobile_no: mobile.trim(), pin: pin.join("") });

    if (result.success) {
      router.replace(redirect);
    } else {
      setError(result.error ?? "Login failed.");
      triggerShake();
      setSubmitting(false);
    }
  };

  const pinFilled = pin.every((p) => p !== "");
  const canSubmit = /^\d{10}$/.test(mobile) && pinFilled && !submitting;

  if (isLoading) return null;

  return (
    <div
      className="min-h-[calc(100vh-57px)] flex flex-col"
      style={{ background: "linear-gradient(160deg,#0a0f2e 0%,#0e2060 45%,#1a3a8f 75%,#1e50c8 100%)" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%,rgba(37,99,235,0.4) 0%,transparent 65%)" }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-900/50">
            <RiQrCodeLine size={32} color="white" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-1" style={{ fontFamily: "var(--font-sora)" }}>
            Welcome Back
          </h1>
          <p className="text-white/50 text-sm">Sign in to QR Pay Manager</p>
        </div>

        {/* Card */}
        <div
          className={`w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl ${shake ? "animate-shake" : ""}`}
        >
          {/* Global error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30">
              <FiAlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {/* Mobile number */}
          <div className="mb-5">
            <label className="block text-white/70 text-xs font-medium mb-2">
              Mobile Number
            </label>
            <div className="relative">
              {/* Country code badge */}
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium flex items-center gap-1.5 border-r border-white/20 pr-2.5">
                <FiPhone size={13} /> +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobile(val);
                  setError(null);
                  setFieldErrors((p) => ({ ...p, mobile: validateMobile(val) || undefined }));
                }}
                onKeyDown={(e) => { if (e.key === "Enter") pinRefs.current[0]?.focus(); }}
                className={`w-full pl-20 pr-4 py-3.5 rounded-xl bg-white/10 border text-white placeholder-white/30 text-sm focus:bg-white/15 transition-colors outline-none tracking-widest font-mono ${
                  fieldErrors.mobile ? "border-red-400" : "border-white/20 focus:border-blue-400"
                }`}
              />
            </div>
            {fieldErrors.mobile && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={11} /> {fieldErrors.mobile}
              </p>
            )}
          </div>

          {/* PIN */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/70 text-xs font-medium flex items-center gap-1.5">
                <FiLock size={11} /> 5-Digit PIN
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-white/40 hover:text-white/70 transition-colors flex items-center gap-1 text-xs"
              >
                {showPin ? <FiEyeOff size={12} /> : <FiEye size={12} />}
                {showPin ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex gap-2 justify-between" onPaste={handlePinPaste}>
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { pinRefs.current[idx] = el; }}
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(idx, e)}
                  onFocus={(e) => e.target.select()}
                  className={`w-[52px] h-[52px] sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
                    ${digit
                      ? "bg-blue-600 border-blue-500 text-white scale-105"
                      : "bg-white/10 border-white/20 text-white"
                    } focus:border-blue-400 focus:bg-blue-600/30`}
                />
              ))}
            </div>
            {fieldErrors.pin && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <FiAlertCircle size={11} /> {fieldErrors.pin}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-4 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-900/40"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>Login <FiArrowRight size={16} /></>
            )}
          </button>
        </div>

        {/* New user note */}
        <div className="mt-6 w-full max-w-sm">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
            <p className="text-white/45 text-xs leading-relaxed">
              New user? To register, please contact us on
            </p>
            <a
              href="tel:7741973805"
              className="inline-flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors no-underline"
            >
              <FiPhone size={14} /> +91 77419 73805
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.45s ease; }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}   