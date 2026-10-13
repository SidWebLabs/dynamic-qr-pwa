"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiZap, FiChevronDown, FiStar } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { UPIProfile, SplitPaymentRecord } from "@/types/index";
import { api } from "@/lib/api";
import {
  shouldSplitAmount,
  SPLIT_MIN_EXCLUSIVE,
  SPLIT_MAX_EXCLUSIVE,
  SPLIT_PARTS,
  SPLIT_MAX_PER_PART,
} from "@/lib/splitPayment";
import { useAuth } from "@/context/AuthContext";
import { useAccounts } from "@/context/AccountsContext";
import UPIProfileModal from "@/components/ui/UPIProfileModal";
import SplitQRDisplayModal from "@/components/ui/SplitQRDisplayModal";
import AmountInput from "@/components/ui/AmountInput";

export default function SplitPaymentPage() {
  const { user } = useAuth();
  const { accounts: profiles, isLoading: loading, refreshAccounts } = useAccounts();

  const [selectedId, setSelectedId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UPIProfile | null>(null);
  const [splitRecord, setSplitRecord] = useState<SplitPaymentRecord | null>(null);

  useEffect(() => {
    if (profiles.length === 0) {
      setSelectedId("");
      return;
    }
    const stillValid = profiles.some((p) => String(p.id) === selectedId);
    if (!stillValid) {
      const primary = profiles.find((p) => p.is_primary) ?? profiles[0];
      setSelectedId(String(primary.id));
    }
  }, [profiles, selectedId]);

  const selectedProfile = profiles.find((p) => String(p.id) === selectedId);
  const amountNum = parseInt(amount, 10);
  const amountInRange =
    amount !== "" && /^\d+$/.test(amount) && !isNaN(amountNum) && shouldSplitAmount(amountNum);

  const handleGenerate = async () => {
    const val = parseInt(amount, 10);
    if (!amount || isNaN(val) || val <= 0) {
      setAmountError("Enter a valid whole amount greater than ₹0");
      return;
    }
    if (!/^\d+$/.test(amount) || amount.includes(".") || amount.includes(",")) {
      setAmountError("Decimal / point values are not allowed. Enter whole rupees only.");
      return;
    }
    if (!shouldSplitAmount(val)) {
      setAmountError(
        `Split payment only works for amounts above ₹${SPLIT_MIN_EXCLUSIVE} and below ₹${SPLIT_MAX_EXCLUSIVE}`
      );
      return;
    }
    if (!selectedProfile) {
      setAmountError("Please select a UPI account first");
      return;
    }

    setGenerating(true);
    setAmountError(null);

    try {
      const res = await api.post<SplitPaymentRecord>("/split-payments", {
        account_id: Number(selectedProfile.id),
        amount: val,
        note: note.trim(),
      });
      setSplitRecord(res.data!);
      setAmount("");
      setNote("");
    } catch (err: any) {
      setAmountError(err?.message ?? "Failed to generate split QRs. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this UPI account?")) return;
    try {
      await api.delete(`/accounts/${id}`);
      if (selectedId === id) setSelectedId("");
      await refreshAccounts();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete account");
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await api.patch(`/accounts/${id}/primary`);
      await refreshAccounts();
    } catch (err: any) {
      alert(err?.message ?? "Failed to set primary");
    }
  };

  const maxLimit = user?.max_account_limit ?? 3;

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div
        className="rounded-2xl px-5 py-5 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#7c2d12 0%,#b45309 50%,#d97706 100%)" }}
      >
        <div
          className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10 bg-white"
          style={{ transform: "translate(30%,-30%)" }}
        />
        <div className="flex items-center gap-2 mb-1">
          <RiQrCodeLine size={20} />
          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-sora)" }}>
            Split Payment
          </span>
          <span className="text-[10px] font-bold bg-white text-amber-700 px-2 py-0.5 rounded-full tracking-wide">
            NEW
          </span>
        </div>
        <p className="text-white/70 text-xs leading-relaxed">
          Enter an amount above ₹{SPLIT_MIN_EXCLUSIVE} and below ₹{SPLIT_MAX_EXCLUSIVE}.
          It will be randomly split into {SPLIT_PARTS} QRs (each ≤ ₹{SPLIT_MAX_PER_PART}).
        </p>
      </div>

      {/* UPI Account selector */}
      <div className="bg-white rounded-2xl p-5 border border-amber-50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-slate-700 font-semibold text-sm" style={{ fontFamily: "var(--font-sora)" }}>
              Select UPI Account
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              {profiles.length} / {maxLimit} accounts
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <FiPlus size={13} /> Add New
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-sm">
            <span className="w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
            Loading accounts...
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <RiQrCodeLine size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm">No UPI accounts yet</p>
            <p className="text-slate-300 text-xs mt-1">Tap &quot;Add New&quot; to get started</p>
          </div>
        ) : (
          <>
            <div className="relative mb-3">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 appearance-none focus:border-amber-400 focus:bg-white transition-colors outline-none"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.is_primary ? "⭐ " : ""}
                    {p.owner_name} — {p.owner_upi_id}
                  </option>
                ))}
              </select>
              <FiChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {selectedProfile && (
              <div className="bg-amber-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-amber-900 font-semibold text-sm">{selectedProfile.owner_name}</p>
                    {selectedProfile.is_primary && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                        <FiStar size={9} /> Primary
                      </span>
                    )}
                  </div>
                  <p className="text-amber-600 text-xs font-mono mt-0.5">{selectedProfile.owner_upi_id}</p>
                </div>
                <div className="flex gap-1.5">
                  {!selectedProfile.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(String(selectedProfile.id))}
                      title="Set as primary"
                      className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      <FiStar size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditing(selectedProfile);
                      setModalOpen(true);
                    }}
                    className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(String(selectedProfile.id))}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Amount & Note */}
      <div className="bg-white rounded-2xl p-5 border border-amber-50 shadow-sm">
        <p className="text-slate-700 font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-sora)" }}>
          Split Payment Details
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            Amount (₹{SPLIT_MIN_EXCLUSIVE + 1} – ₹{SPLIT_MAX_EXCLUSIVE - 1}) — whole rupees only
          </label>
          <AmountInput
            value={amount}
            onChange={setAmount}
            onError={setAmountError}
            placeholder="e.g. 2499"
            focusClassName="focus:border-amber-400"
          />
          {amountError && <p className="text-red-500 text-xs mt-1.5">{amountError}</p>}
          {amountInRange && (
            <p className="text-amber-700 text-xs mt-1.5 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              This amount will be randomly split into {SPLIT_PARTS} QRs (each ≤ ₹{SPLIT_MAX_PER_PART}).
            </p>
          )}
          {amount !== "" && /^\d+$/.test(amount) && !isNaN(amountNum) && !shouldSplitAmount(amountNum) && (
            <p className="text-red-500 text-xs mt-1.5">
              Enter an amount above ₹{SPLIT_MIN_EXCLUSIVE} and below ₹{SPLIT_MAX_EXCLUSIVE}.
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Note (optional)</label>
          <input
            type="text"
            placeholder="e.g. Rent, Invoice..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-amber-400 focus:bg-white transition-colors outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedProfile || !amountInRange || generating}
          className="w-full bg-amber-600 text-white font-semibold py-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-amber-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-200"
        >
          {generating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Splitting...
            </>
          ) : (
            <>
              <FiZap size={16} />
              Generate {SPLIT_PARTS} Split QR Codes
            </>
          )}
        </button>
      </div>

      <UPIProfileModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSaved={refreshAccounts}
        editing={editing}
        accountCount={profiles.length}
        maxLimit={maxLimit}
      />

      <SplitQRDisplayModal record={splitRecord} onClose={() => setSplitRecord(null)} />
    </div>
  );
}
