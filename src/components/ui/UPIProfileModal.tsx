"use client";

import { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { UPIProfile } from "@/types/index";
import { validateUPI, generateId, saveProfile } from "@/lib/storage";

const UPI_LABELS = [
  "SBI QR", "HDFC QR", "ICICI QR", "Axis QR",
  "GPay", "PhonePe", "Paytm", "Amazon Pay",
  "BHIM UPI", "Other",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: UPIProfile | null;
}

export default function UPIProfileModal({ open, onClose, onSaved, editing }: Props) {
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [label, setLabel] = useState(UPI_LABELS[0]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setUpiId(editing?.upiId ?? "");
      setLabel(editing?.label ?? UPI_LABELS[0]);
      setError(null);
    }
  }, [open, editing]);

  const handleSave = () => {
    const upiError = validateUPI(upiId);
    if (upiError) { setError(upiError); return; }
    if (!name.trim()) { setError("Owner name is required"); return; }

    setSaving(true);
    const profile: UPIProfile = {
      id: editing?.id ?? generateId(),
      upiId: upiId.trim(),
      name: name.trim(),
      label,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };
    saveProfile(profile);
    setSaving(false);
    onSaved();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl px-6 pt-5 pb-8 shadow-2xl z-10 animate-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-800 font-bold text-base" style={{ fontFamily: "var(--font-sora)" }}>
            {editing ? "Edit UPI ID" : "Add New UPI ID"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Owner name */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Owner Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">UPI ID</label>
            <input
              type="text"
              placeholder="e.g. rahul@oksbi, 9876543210@ybl"
              value={upiId}
              onChange={(e) => { setUpiId(e.target.value); setError(null); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors font-mono"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">QR Label / Bank</label>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors"
            >
              {UPI_LABELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-60"
          >
            <FiCheck size={16} />
            {editing ? "Save Changes" : "Add UPI ID"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.25s ease; }
      `}</style>
    </div>
  );
}