/** Must stay in sync with backend CONSTANTS */
export const SPLIT_MIN_EXCLUSIVE = 2000;
export const SPLIT_MAX_EXCLUSIVE = 5000;
export const SPLIT_PARTS = 3;
export const SPLIT_MAX_PER_PART = 2000;

/** Amounts strictly above ₹2000 and below ₹5000 use split payment (3 QRs). */
export function shouldSplitAmount(amount: number): boolean {
  return (
    Number.isFinite(amount) &&
    amount > SPLIT_MIN_EXCLUSIVE &&
    amount < SPLIT_MAX_EXCLUSIVE
  );
}

export function getSplitHint(amount: number): string | null {
  if (!shouldSplitAmount(amount)) return null;
  return `This amount will be randomly split into ${SPLIT_PARTS} QRs (each ≤ ₹${SPLIT_MAX_PER_PART})`;
}
