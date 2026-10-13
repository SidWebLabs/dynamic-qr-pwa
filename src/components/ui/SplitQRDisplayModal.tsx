"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { FiX, FiDownload, FiShare2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SplitPaymentRecord } from "@/types";
import { buildUPIString } from "@/lib/storage";

interface Props {
  record: SplitPaymentRecord | null;
  onClose: () => void;
}

function formatAmount(value: number) {
  const n = Number(value);
  const isWhole = Math.abs(n - Math.round(n)) < 1e-9;
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  });
}

export default function SplitQRDisplayModal({ record, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => [...(record?.items ?? [])].sort((a, b) => a.sequence_no - b.sequence_no),
    [record]
  );

  const partsSum = useMemo(
    () => items.reduce((s, it) => s + Number(it.amount), 0),
    [items]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [record?.id]);

  if (!record || items.length === 0) return null;

  const item = items[activeIndex];
  const amount = Number(item.amount);
  const upiString = buildUPIString(
    record.owner_upi_id,
    record.owner_name,
    amount,
    item.note ?? record.note ?? ""
  );

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-split-${item.sequence_no}-₹${amount}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Pay ₹${amount} to ${record.owner_name} (Part ${item.sequence_no})`,
        text: `UPI: ${record.owner_upi_id}`,
        url: upiString,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end !mt-0 justify-center sm:items-center">
      <div className="absolute inset-0 m-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-amber-50 rounded-t-3xl sm:rounded-2xl px-6 pt-5 pb-8 shadow-2xl z-10 animate-slide-up text-center border border-amber-100">
        <div className="w-10 h-1 bg-amber-200 rounded-full mx-auto mb-4 sm:hidden" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-amber-700/50 hover:text-amber-900"
        >
          <FiX size={20} />
        </button>

        <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3">
          Split Payment · {items.length} QRs
        </div>

        <h3
          className="text-amber-950 font-bold text-lg mb-1"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          {record.owner_name}
        </h3>
        <p className="text-amber-800/60 text-xs mb-1 font-mono">{record.owner_upi_id}</p>
        <p className="text-amber-800/70 text-xs mb-1">
          Total ₹{formatAmount(Number(record.total_amount))}
          {record.note ? ` · ${record.note}` : ""}
        </p>
        <p className="text-amber-700/80 text-[11px] mb-4 font-medium">
          {items.map((it) => `₹${formatAmount(Number(it.amount))}`).join(" + ")}
          {" = "}₹{formatAmount(partsSum)}
        </p>

        {/* Part tabs */}
        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          {items.map((it, idx) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                idx === activeIndex
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-amber-800/70 hover:bg-amber-100 border border-amber-100"
              }`}
            >
              Part {it.sequence_no}
              <span className="ml-1 opacity-80">
                ₹{formatAmount(Number(it.amount))}
              </span>
            </button>
          ))}
        </div>

        <div className="my-2 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            className="p-2 rounded-full bg-white text-amber-700 border border-amber-100 disabled:opacity-30"
            aria-label="Previous QR"
          >
            <FiChevronLeft size={16} />
          </button>

          <div>
            <span
              className="text-3xl font-bold text-amber-700"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              ₹{formatAmount(amount)}
            </span>
            <p className="text-amber-800/50 text-xs mt-1">
              Part {item.sequence_no} of {items.length}
            </p>
          </div>

          <button
            type="button"
            disabled={activeIndex === items.length - 1}
            onClick={() => setActiveIndex((i) => Math.min(items.length - 1, i + 1))}
            className="p-2 rounded-full bg-white text-amber-700 border border-amber-100 disabled:opacity-30"
            aria-label="Next QR"
          >
            <FiChevronRight size={16} />
          </button>
        </div>

        <div ref={qrRef} className="flex justify-center mb-5 mt-3">
          <div className="p-4 bg-white rounded-2xl border-2 border-amber-200 shadow-inner inline-block">
            <QRCode value={upiString} size={180} fgColor="#92400e" bgColor="#ffffff" />
          </div>
        </div>

        <p className="text-amber-800/50 text-xs mb-6">
          Scan this QR for part {item.sequence_no}, then open the next
        </p>

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
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease;
        }
      `}</style>
    </div>
  );
}
