"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import QRCode from "react-qr-code";
import { FiCalendar, FiTrash2, FiFilter, FiClock } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { QRRecord } from "@/types/index";
import { buildUPIString } from "@/lib/storage";
import { api } from "@/lib/api";
import QRDisplayModal from "@/components/ui/QRDisplayModal";

type FilterMode = "all" | "today" | "week" | "custom";

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
  const [history, setHistory] = useState<QRRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [customDate, setCustomDate] = useState("");
  const [viewing, setViewing] = useState<QRRecord | null>(null);
  const [viewUpi, setViewUpi] = useState("");

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      if (filter === "custom" && customDate) params.set("date", customDate);

      const res = await api.get<QRRecord[]>(`/history?${params.toString()}`);
      setHistory(res.data ?? []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  }, [filter, customDate]);

  useEffect(() => { reload(); }, [reload]);

  // Group by date (client-side, after server filter)
  const grouped = useMemo(() => {
    const map: Record<string, QRRecord[]> = {};
    history.forEach((r) => {
      const key = formatDate(r.created_on);
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [history]);

  const totalAmount = useMemo(
    () => history.reduce((s, r) => s + Number(r.amount), 0),
    [history]
  );

  const handleView = (r: QRRecord) => {
    setViewUpi(buildUPIString(r.owner_upi_id, r.owner_name, Number(r.amount), r.note ?? ""));
    setViewing(r);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this QR record?")) return;
    try {
      await api.delete(`/history/${id}`);
      reload();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete record");
    }
  };

  const FILTERS: { label: string; value: FilterMode }[] = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "Custom Date", value: "custom" },
  ];

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      {/* Header */}
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
            {history.length}
          </span>
          <span className="text-white/60 text-sm">QRs generated</span>
          <span className="ml-auto text-emerald-300 font-bold text-lg" style={{ fontFamily: "var(--font-sora)" }}>
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Filters */}
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-400 text-sm">
          <span className="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          Loading history...
        </div>
      )}

      {/* Empty */}
      {!loading && history.length === 0 && (
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

      {/* Grouped records */}
      {!loading && Object.entries(grouped).map(([date, records]) => (
        <div key={date} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{date}</p>
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300">{records.length} QR{records.length > 1 ? "s" : ""}</span>
          </div>

          {records.map((r) => (
            <div
              key={r.id}
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
                onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
              >
                <button className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                  <FiTrash2 size={12} /> Delete record
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* QR view modal */}
      <QRDisplayModal
        record={viewing ? {
          ...viewing,
        } : null}
        upiString={viewUpi}
        onClose={() => { setViewing(null); setViewUpi(""); }}
      />
    </div>
  );
}