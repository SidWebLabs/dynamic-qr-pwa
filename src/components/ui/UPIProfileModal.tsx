"use client";

import { useState, useEffect } from "react";
import { FiX, FiCheck, FiAlertCircle, FiStar } from "react-icons/fi";
import { UPIProfile } from "@/types/index";
import { validateUPI } from "@/lib/storage";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: UPIProfile | null;
  accountCount: number;
  maxLimit: number;
}

export default function UPIProfileModal({
  open, onClose, onSaved, editing, accountCount, maxLimit,
}: Props) {
  const [ownerName, setOwnerName] = useState("");
  const [ownerUpiId, setOwnerUpiId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setOwnerName(editing?.owner_name ?? "");
      setOwnerUpiId(editing?.owner_upi_id ?? "");
      setError(null);
    }
  }, [open, editing]);

  const atLimit = !editing && accountCount >= maxLimit;

  const handleSave = async () => {
    if (!ownerName.trim()) { setError("Owner name is required"); return; }
    const upiError = validateUPI(ownerUpiId);
    if (upiError) { setError(upiError); return; }

    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await api.put(`/accounts/${editing.id}`, {
          owner_name: ownerName.trim(),
          owner_upi_id: ownerUpiId.trim(),
        });
      } else {
        await api.post("/accounts", {
          owner_name: ownerName.trim(),
          owner_upi_id: ownerUpiId.trim(),
        });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl px-6 pt-5 pb-8 shadow-2xl z-10 animate-slide-up">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-800 font-bold text-base" style={{ fontFamily: "var(--font-sora)" }}>
              {editing ? "Edit UPI Account" : "Add New UPI Account"}
            </h2>
            {!editing && (
              <p className="text-slate-400 text-xs mt-0.5">
                {accountCount} / {maxLimit} accounts used
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        {/* Limit warning */}
        {atLimit && (
          <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
            <FiAlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs leading-relaxed">
              You have reached your limit of <strong>{maxLimit}</strong> UPI accounts.
              Delete an existing account to add a new one.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Owner Name */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Owner Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={ownerName}
              disabled={atLimit}
              onChange={(e) => { setOwnerName(e.target.value); setError(null); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">UPI ID</label>
            <input
              type="text"
              placeholder="e.g. rahul@oksbi, 9876543210@ybl"
              value={ownerUpiId}
              disabled={atLimit}
              onChange={(e) => { setOwnerUpiId(e.target.value); setError(null); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors font-mono outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* First account info */}
          {!editing && accountCount === 0 && (
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2.5 rounded-lg border border-blue-100">
              <FiStar size={12} className="flex-shrink-0 text-amber-500" />
              First account will be set as your primary UPI automatically.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
              <FiAlertCircle size={13} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || atLimit}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiCheck size={16} />
                {editing ? "Save Changes" : "Add UPI Account"}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.25s ease; }
      `}</style>
    </div>
  );
}