import { UPIProfile, QRRecord } from "@/types";

const PROFILES_KEY = "upi_profiles";
const HISTORY_KEY = "qr_history";

// ── UPI Profiles ──────────────────────────────────────────────
export function getProfiles(): UPIProfile[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]"); }
    catch { return []; }
}

export function saveProfile(profile: UPIProfile): void {
    const list = getProfiles();
    const idx = list.findIndex((p) => p.id === profile.id);
    if (idx >= 0) list[idx] = profile; else list.push(profile);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
}

export function deleteProfile(id: string): void {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(getProfiles().filter((p) => p.id !== id)));
}

// ── QR History ────────────────────────────────────────────────
export function getHistory(): QRRecord[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
    catch { return []; }
}

export function saveQRRecord(record: QRRecord): void {
    const list = getHistory();
    list.unshift(record);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function deleteQRRecord(id: string): void {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter((r) => r.id !== id)));
}

// ── Validation ────────────────────────────────────────────────
export function validateUPI(upiId: string): string | null {
    if (!upiId.trim()) return "UPI ID is required";
    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim()))
        return "Invalid UPI ID (e.g. name@upi, 9876543210@oksbi)";
    return null;
}

// ── Helpers ───────────────────────────────────────────────────
export function buildUPIString(upiId: string, name: string, amount: number, note: string): string {
    return `upi://pay?${new URLSearchParams({ pa: upiId, pn: name, am: amount.toFixed(2), cu: "INR", tn: note || "Payment" })}`;
}

export function generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}