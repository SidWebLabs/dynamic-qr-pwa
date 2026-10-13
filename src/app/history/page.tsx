"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import QRCode from "react-qr-code";
import { FiCalendar, FiTrash2, FiFilter, FiClock } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { QRRecord, SplitPaymentRecord } from "@/types/index";
import { buildUPIString } from "@/lib/storage";
import { api } from "@/lib/api";
import QRDisplayModal from "@/components/ui/QRDisplayModal";
import SplitQRDisplayModal from "@/components/ui/SplitQRDisplayModal";

type FilterMode = "all" | "today" | "week" | "custom";

type HistoryEntry =
  | { kind: "single"; sortKey: string; record: QRRecord }
  | { kind: "split"; sortKey: string; record: SplitPaymentRecord };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [customDate, setCustomDate] = useState("");
  const [viewing, setViewing] = useState<QRRecord | null>(null);
  const [viewUpi, setViewUpi] = useState("");
  const [viewingSplit, setViewingSplit] = useState<SplitPaymentRecord | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      if (filter === "custom" && customDate) params.set("date", customDate);
      const qs = params.toString();

      const [historyRes, splitRes] = await Promise.all([
        api.get<QRRecord[]>(`/history?${qs}`),
        api.get<SplitPaymentRecord[]>(`/split-payments?${qs}`),
      ]);

      const singles: HistoryEntry[] = (historyRes.data ?? []).map((record) => ({
        kind: "single" as const,
        sortKey: record.created_on,
        record,
      }));

      const splits: HistoryEntry[] = (splitRes.data ?? []).map((record) => ({
        kind: "split" as const,
        sortKey: record.created_on,
        record: {
          ...record,
          items: [...(record.items ?? [])].sort(
            (a, b) => a.sequence_no - b.sequence_no
          ),
        },
      }));

      setEntries(
        [...singles, ...splits].sort(
          (a, b) => new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  }, [filter, customDate]);

  useEffect(() => { reload(); }, [reload]);

  const grouped = useMemo(() => {
    const map: Record<string, HistoryEntry[]> = {};
    entries.forEach((entry) => {
      const key = formatDate(entry.sortKey);
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return map;
  }, [entries]);

  const totalAmount = useMemo(
    () =>
      entries.reduce((sum, entry) => {
        if (entry.kind === "single") return sum + Number(entry.record.amount);
        return sum + Number(entry.record.total_amount);
      }, 0),
    [entries]
  );

  const handleView = (r: QRRecord) => {
    setViewUpi(buildUPIString(r.owner_upi_id, r.owner_name, Number(r.amount), r.note ?? ""));
    setViewing(r);
  };

  const handleDeleteSingle = async (id: string) => {
    if (!confirm("Delete this QR record?")) return;
    try {
      await api.delete(`/history/${id}`);
      reload();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete record");
    }
  };

  const handleDeleteSplit = async (id: string) => {
    if (!confirm("Delete this split payment and all its QR parts?")) return;
    try {
      await api.delete(`/split-payments/${id}`);
      reload();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete split payment");
    }
  };

  const FILTERS: { label: string; value: FilterMode }[] = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "Custom Date", value: "custom" },
  ];

  return (
    <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
      <div
        className="rounded-2xl px-5 py-5 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)" }}
      >
        <div
          className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(30%,-30%)" }}
        />
        <div className="flex items-center gap-3 mb-2">
          <FiClock size={18} />
          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-sora)" }}>
            QR History
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-sora)" }}>
            {entries.length}
          </span>
          <span className="text-white/60 text-sm">payments</span>
          <span className="ml-auto text-emerald-300 font-bold text-lg" style={{ fontFamily: "var(--font-sora)" }}>
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter size={14} className="text-slate-400" />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Filter</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filter === "custom" && (
          <div className="mt-3 relative">
            <FiCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm bg-slate-50 focus:border-blue-400 transition-colors outline-none"
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-400 text-sm">
          <span className="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          Loading history...
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RiQrCodeLine size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm font-medium">No QR records found</p>
          <p className="text-slate-300 text-xs mt-1">
            {filter !== "all" ? "Try a different filter" : "Generate your first QR from the Payment QR screen"}
          </p>
        </div>
      )}

      {!loading && Object.entries(grouped).map(([date, dayEntries]) => (
        <div key={date} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{date}</p>
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300">
              {dayEntries.length} payment{dayEntries.length > 1 ? "s" : ""}
            </span>
          </div>

          {dayEntries.map((entry) => {
            if (entry.kind === "single") {
              const r = entry.record;
              return (
                <div
                  key={`single-${r.id}`}
                  onClick={() => handleView(r)}
                  className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 p-1.5">
                      <QRCode
                        value={buildUPIString(r.owner_upi_id, r.owner_name, Number(r.amount), r.note ?? "")}
                        size={36}
                        fgColor="#1a3a8f"
                        bgColor="transparent"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-semibold text-sm truncate" style={{ fontFamily: "var(--font-sora)" }}>
                        {r.owner_name}
                      </p>
                      <p className="text-slate-400 text-xs font-mono truncate">{r.owner_upi_id}</p>
                      {r.note && <p className="text-slate-300 text-xs truncate mt-0.5">{r.note}</p>}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-blue-700 font-bold text-base" style={{ fontFamily: "var(--font-sora)" }}>
                        ₹{Number(r.amount).toLocaleString("en-IN")}
                      </p>
                      <p className="text-slate-300 text-[10px] mt-0.5">{formatTime(r.created_on)}</p>
                    </div>
                  </div>

                  <div
                    className="mt-3 pt-3 border-t border-slate-50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); handleDeleteSingle(r.id); }}
                  >
                    <button className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                      <FiTrash2 size={12} /> Delete record
                    </button>
                  </div>
                </div>
              );
            }

            const r = entry.record;
            const first = r.items?.[0];
            const previewUpi = first
              ? buildUPIString(r.owner_upi_id, r.owner_name, Number(first.amount), first.note ?? "")
              : "";

            return (
              <div
                key={`split-${r.id}`}
                onClick={() => setViewingSplit(r)}
                className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 p-1.5">
                    {previewUpi ? (
                      <QRCode value={previewUpi} size={36} fgColor="#b45309" bgColor="transparent" />
                    ) : (
                      <RiQrCodeLine size={22} className="text-amber-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-slate-800 font-semibold text-sm truncate" style={{ fontFamily: "var(--font-sora)" }}>
                        {r.owner_name}
                      </p>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                        Split · {r.split_count || r.items?.length || 3} QRs
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-mono truncate">{r.owner_upi_id}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                      {(r.items ?? [])
                        .map((it) => {
                          const n = Number(it.amount);
                          const whole = Math.abs(n - Math.round(n)) < 1e-9;
                          return `₹${n.toLocaleString("en-IN", {
                            minimumFractionDigits: whole ? 0 : 2,
                            maximumFractionDigits: whole ? 0 : 2,
                          })}`;
                        })
                        .join(" + ")}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-amber-700 font-bold text-base" style={{ fontFamily: "var(--font-sora)" }}>
                      ₹{Number(r.total_amount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-slate-300 text-[10px] mt-0.5">{formatTime(r.created_on)}</p>
                  </div>
                </div>

                <div
                  className="mt-3 pt-3 border-t border-slate-50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); handleDeleteSplit(r.id); }}
                >
                  <button className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                    <FiTrash2 size={12} /> Delete split
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <QRDisplayModal
        record={viewing}
        upiString={viewUpi}
        onClose={() => { setViewing(null); setViewUpi(""); }}
      />

      <SplitQRDisplayModal
        record={viewingSplit}
        onClose={() => setViewingSplit(null)}
      />
    </div>
  );
}
