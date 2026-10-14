"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { FiX, FiDownload, FiShare2 } from "react-icons/fi";
import { QRRecord } from "@/types";

interface Props {
  record: QRRecord | null;
  upiString: string;
  onClose: () => void;
}

export default function QRDisplayModal({ record, upiString, onClose }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!record) return null;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${record.owner_name}-₹${record.amount}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Pay ₹${record.amount} to ${record.owner_name}`,
        text: `UPI: ${record.owner_upi_id}`,
        url: upiString,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end !mt-0 justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-amber-50 rounded-t-3xl sm:rounded-2xl px-6 pt-5 pb-8 shadow-2xl z-10 animate-slide-up text-center border border-amber-100">
        <div className="w-10 h-1 bg-amber-200 rounded-full mx-auto mb-4 sm:hidden" />

        <button onClick={onClose} className="absolute top-5 right-5 text-amber-700/50 hover:text-amber-900">
          <FiX size={20} />
        </button>

        <h3 className="text-amber-950 font-bold text-lg mb-1" style={{ fontFamily: "var(--font-sora)" }}>
          {record.owner_name}
        </h3>
        <p className="text-amber-800/60 text-xs mb-1 font-mono">{record.owner_upi_id}</p>

        <div className="my-4">
          <span className="text-3xl font-bold text-amber-700" style={{ fontFamily: "var(--font-sora)" }}>
            ₹{Number(record.amount).toLocaleString("en-IN")}
          </span>
          {record.note && <p className="text-amber-800/50 text-xs mt-1">{record.note}</p>}
        </div>

        <div ref={qrRef} className="flex justify-center mb-5">
          <div className="p-4 bg-white rounded-2xl border-2 border-amber-200 shadow-inner inline-block">
            <QRCode value={upiString} size={180} fgColor="#92400e" bgColor="#ffffff" />
          </div>
        </div>

        <p className="text-amber-800/50 text-xs mb-6">Scan to pay via any UPI app</p>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-amber-900 font-semibold py-3 rounded-xl text-sm hover:bg-amber-100 border border-amber-100 transition-colors"
          >
            <FiDownload size={15} /> Download
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-amber-500 transition-colors"
          >
            <FiShare2 size={15} /> Share
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