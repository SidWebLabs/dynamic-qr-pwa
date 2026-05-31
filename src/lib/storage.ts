import { QRRecord } from "@/types";

// ── QR History (stays in localStorage — no backend needed) ────
const HISTORY_KEY = "qr_history";

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
    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(getHistory().filter((r) => r.id !== id))
    );
}

// ── UPI string builder ────────────────────────────────────────
export function buildUPIString(
    owner_upi_id: string,
    owner_name: string,
    amount: number,
    note: string
): string {
    return `upi://pay?${new URLSearchParams({
        pa: owner_upi_id,
        pn: owner_name,
        am: amount.toFixed(2),
        cu: "INR",
        tn: note || "Payment",
    })}`;
}

export function generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── UPI ID validation (client-side) ──────────────────────────
export function validateUPI(upiId: string): string | null {
    if (!upiId.trim()) return "UPI ID is required";
    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim()))
        return "Invalid UPI ID format (e.g. name@upi, 9876543210@oksbi)";
    return null;
}