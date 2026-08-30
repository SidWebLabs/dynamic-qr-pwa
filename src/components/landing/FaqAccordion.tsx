"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="space-y-3">
            {items.map(({ q, a }, index) => {
                const isOpen = openIndex === index;

                return (
                    <article
                        key={q}
                        className={`rounded-2xl border transition-all ${
                            isOpen
                                ? "border-blue-100 bg-blue-50/40 shadow-sm"
                                : "border-blue-50 bg-white shadow-sm hover:border-blue-100"
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? -1 : index)}
                            aria-expanded={isOpen}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer bg-transparent border-0"
                        >
                            <h3
                                className={`text-sm sm:text-base font-semibold leading-snug ${
                                    isOpen ? "text-blue-900" : "text-slate-800"
                                }`}
                                style={{ fontFamily: "var(--font-sora)" }}
                            >
                                {q}
                            </h3>
                            <span
                                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                    isOpen ? "bg-blue-600 text-white rotate-180" : "bg-blue-50 text-blue-600"
                                }`}
                            >
                                <FiChevronDown size={16} />
                            </span>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${
                                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <p className="px-5 pb-4 text-slate-500 text-sm leading-relaxed">{a}</p>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
