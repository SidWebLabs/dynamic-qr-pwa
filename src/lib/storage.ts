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

export function validateUPI(upiId: string): string | null {
  if (!upiId.trim()) return "UPI ID is required";
  if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim()))
    return "Invalid UPI ID format (e.g. name@upi, 9876543210@oksbi)";
  return null;
}