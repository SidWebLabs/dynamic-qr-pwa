"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiZap, FiChevronDown } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { UPIProfile, QRRecord } from "@/types/index";
import {
  getProfiles, deleteProfile, saveQRRecord,
  buildUPIString, generateId,
} from "@/lib/storage";
import UPIProfileModal from "@/components/ui/UPIProfileModal";
import QRDisplayModal from "@/components/ui/QRDisplayModal";

export default function PaymentQRPage() {
  const [profiles, setProfiles] = useState<UPIProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UPIProfile | null>(null);

  const [qrRecord, setQrRecord] = useState<QRRecord | null>(null);
  const [qrString, setQrString] = useState("");

  const reload = useCallback(() => {
    const p = getProfiles();
    setProfiles(p);
    if (p.length > 0 && !selectedId) setSelectedId(p[0].id);
  }, [selectedId]);

  useEffect(() => { reload(); }, [reload]);

  const selectedProfile = profiles.find((p) => p.id === selectedId);

  const handleGenerate = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setAmountError("Enter a valid amount greater than 0");
      return;
    }
    if (!selectedProfile) { setAmountError("Select a UPI ID first"); return; }

    const upiStr = buildUPIString(selectedProfile.upiId, selectedProfile.name, val, note);
    const record: QRRecord = {
      id: generateId(),
      upiProfileId: selectedProfile.id,
      upiId: selectedProfile.upiId,
      name: selectedProfile.name,
      label: selectedProfile.label,
      amount: val,
      note: note.trim(),
      generatedAt: new Date().toISOString(),
    };
    saveQRRecord(record);
    setQrString(upiStr);
    setQrRecord(record);
    setAmountError(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this UPI ID?")) return;
    deleteProfile(id);
    if (selectedId === id) setSelectedId("");
    reload();
  };

  const handleEdit = (p: UPIProfile) => {
    setEditing(p);
    setModalOpen(true);
  };

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header strip */}
      <div
        className="rounded-2xl px-5 py-5 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0e2060 0%, #1a3a8f 100%)" }}
      >
        <div
          className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(30%,-30%)" }}
        />
        <div className="flex items-center gap-3 mb-1">
          <RiQrCodeLine size={20} />
          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-sora)" }}>
            Payment QR Generator
          </span>
        </div>
        <p className="text-white/60 text-xs">Select a UPI ID and enter amount to generate QR</p>
      </div>

      {/* UPI ID selector */}
      <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-700 font-semibold text-sm" style={{ fontFamily: "var(--font-sora)" }}>
            Select UPI ID
          </p>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FiPlus size={13} /> Add New
          </button>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <RiQrCodeLine size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm">No UPI IDs yet</p>
            <p className="text-slate-300 text-xs mt-1">Tap "Add New" to get started</p>
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 appearance-none focus:border-blue-400 focus:bg-white transition-colors"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {p.name} ({p.upiId})
                </option>
              ))}
            </select>
            <FiChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        )}

        {/* Selected profile card */}
        {selectedProfile && (
          <div className="mt-3 bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-semibold text-sm">{selectedProfile.name}</p>
              <p className="text-blue-500 text-xs font-mono mt-0.5">{selectedProfile.upiId}</p>
              <span className="inline-block mt-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {selectedProfile.label}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(selectedProfile)}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(selectedProfile.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* All UPI IDs quick list */}
      {profiles.length > 1 && (
        <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">All UPI IDs</p>
          <div className="space-y-2">
            {profiles.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  p.id === selectedId
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100"
                }`}
              >
                <div>
                  <p className={`text-sm font-medium ${p.id === selectedId ? "text-white" : "text-slate-700"}`}>
                    {p.label} — {p.name}
                  </p>
                  <p className={`text-xs font-mono mt-0.5 ${p.id === selectedId ? "text-blue-200" : "text-slate-400"}`}>
                    {p.upiId}
                  </p>
                </div>
                <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(p)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      p.id === selectedId ? "text-blue-200 hover:text-white hover:bg-blue-500" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      p.id === selectedId ? "text-red-300 hover:text-white hover:bg-red-500" : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amount input */}
      <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
        <p className="text-slate-700 font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-sora)" }}>
          Payment Details
        </p>

        {/* Amount */}
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
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors font-semibold"
            />
          </div>
          {amountError && (
            <p className="text-red-500 text-xs mt-1.5">{amountError}</p>
          )}
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Note (optional)</label>
          <input
            type="text"
            placeholder="e.g. Rent, Groceries..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>

        {/* Generate button */}
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
      />

      <QRDisplayModal
        record={qrRecord}
        upiString={qrString}
        onClose={() => { setQrRecord(null); setQrString(""); }}
      />
    </div>
  );
}