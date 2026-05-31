"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiZap, FiChevronDown, FiStar } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { UPIProfile, QRRecord } from "@/types/index";
import { saveQRRecord, buildUPIString, generateId } from "@/lib/storage";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import UPIProfileModal from "@/components/ui/UPIProfileModal";
import QRDisplayModal from "@/components/ui/QRDisplayModal";

export default function PaymentQRPage() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<UPIProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UPIProfile | null>(null);

  const [qrRecord, setQrRecord] = useState<QRRecord | null>(null);
  const [qrString, setQrString] = useState("");

  // ── Fetch accounts from API ───────────────────────────────
  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<UPIProfile[]>("/accounts");
      const list = res.data ?? [];
      setProfiles(list);
      // Auto-select primary, or first
      if (list.length > 0 && !selectedId) {
        const primary = list.find((p) => p.is_primary) ?? list[0];
        setSelectedId(String(primary.id));
      }
    } catch (err) {
      console.error("Failed to load accounts", err);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { reload(); }, []);

  const selectedProfile = profiles.find((p) => String(p.id) === selectedId);

  // ── Generate QR ───────────────────────────────────────────
  const handleGenerate = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setAmountError("Enter a valid amount greater than ₹0");
      return;
    }
    if (!selectedProfile) {
      setAmountError("Please select a UPI account first");
      return;
    }

    const upiStr = buildUPIString(selectedProfile.owner_upi_id, selectedProfile.owner_name, val, note);
    const record: QRRecord = {
      id: generateId(),
      upiProfileId: String(selectedProfile.id),
      owner_upi_id: selectedProfile.owner_upi_id,
      owner_name: selectedProfile.owner_name,
      amount: val,
      note: note.trim(),
      generatedAt: new Date().toISOString(),
    };
    saveQRRecord(record);
    setQrString(upiStr);
    setQrRecord(record);
    setAmountError(null);
  };

  // ── Delete account via API ────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this UPI account?")) return;
    try {
      await api.delete(`/accounts/${id}`);
      if (selectedId === id) setSelectedId("");
      await reload();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete account");
    }
  };

  // ── Set primary via API ───────────────────────────────────
  const handleSetPrimary = async (id: string) => {
    try {
      await api.patch(`/accounts/${id}/primary`);
      await reload();
    } catch (err: any) {
      alert(err?.message ?? "Failed to set primary");
    }
  };

  const maxLimit = user?.max_account_limit ?? 3;

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      {/* Header strip */}
      <div
        className="rounded-2xl px-5 py-5 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0e2060 0%,#1a3a8f 100%)" }}
      >
        <div className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10 bg-white"
          style={{ transform: "translate(30%,-30%)" }} />
        <div className="flex items-center gap-3 mb-1">
          <RiQrCodeLine size={20} />
          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-sora)" }}>
            Payment QR Generator
          </span>
        </div>
        <p className="text-white/60 text-xs">Select a UPI account and enter amount to generate QR</p>
      </div>

      {/* UPI Account selector */}
      <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-slate-700 font-semibold text-sm" style={{ fontFamily: "var(--font-sora)" }}>
              Select UPI Account
            </p>
            <p className="text-slate-400 text-xs mt-0.5">{profiles.length} / {maxLimit} accounts</p>
          </div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FiPlus size={13} /> Add New
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-sm">
            <span className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            Loading accounts...
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <RiQrCodeLine size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm">No UPI accounts yet</p>
            <p className="text-slate-300 text-xs mt-1">Tap "Add New" to get started</p>
          </div>
        ) : (
          <>
            {/* Dropdown */}
            <div className="relative mb-3">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 appearance-none focus:border-blue-400 focus:bg-white transition-colors outline-none"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.is_primary ? "⭐ " : ""}{p.owner_name} — {p.owner_upi_id}
                  </option>
                ))}
              </select>
              <FiChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Selected profile card */}
            {selectedProfile && (
              <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-blue-800 font-semibold text-sm">{selectedProfile.owner_name}</p>
                    {selectedProfile.is_primary && (
                      <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                        <FiStar size={9} /> Primary
                      </span>
                    )}
                  </div>
                  <p className="text-blue-500 text-xs font-mono mt-0.5">{selectedProfile.owner_upi_id}</p>
                </div>
                <div className="flex gap-1.5">
                  {!selectedProfile.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(String(selectedProfile.id))}
                      title="Set as primary"
                      className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <FiStar size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => { setEditing(selectedProfile); setModalOpen(true); }}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
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

      {/* All accounts list */}
      {profiles.length > 1 && (
        <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">All UPI Accounts</p>
          <div className="space-y-2">
            {profiles.map((p) => {
              const active = String(p.id) === selectedId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(String(p.id))}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100"
                    }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${active ? "text-white" : "text-slate-700"}`}>
                        {p.owner_name}
                      </p>
                      {p.is_primary && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600"
                          }`}>
                          Primary
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-mono mt-0.5 truncate ${active ? "text-blue-200" : "text-slate-400"}`}>
                      {p.owner_upi_id}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                    {!p.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(String(p.id))}
                        className={`p-1.5 rounded-lg transition-colors ${active ? "text-white/60 hover:text-white hover:bg-white/20" : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"
                          }`}
                      >
                        <FiStar size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => { setEditing(p); setModalOpen(true); }}
                      className={`p-1.5 rounded-lg transition-colors ${active ? "text-white/70 hover:text-white hover:bg-white/20" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(String(p.id))}
                      className={`p-1.5 rounded-lg transition-colors ${active ? "text-red-300 hover:text-white hover:bg-red-500" : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Amount & Note */}
      <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
        <p className="text-slate-700 font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-sora)" }}>
          Payment Details
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setAmountError(null); }}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors outline-none font-semibold"
            />
          </div>
          {amountError && <p className="text-red-500 text-xs mt-1.5">{amountError}</p>}
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Note (optional)</label>
          <input
            type="text"
            placeholder="e.g. Rent, Groceries..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedProfile || !amount}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
        >
          <FiZap size={16} />
          Generate QR Code
        </button>
      </div>

      {/* Modals */}
      <UPIProfileModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSaved={reload}
        editing={editing}
        accountCount={profiles.length}
        maxLimit={maxLimit}
      />

      <QRDisplayModal
        record={qrRecord}
        upiString={qrString}
        onClose={() => { setQrRecord(null); setQrString(""); }}
      />
    </div>
  );
}