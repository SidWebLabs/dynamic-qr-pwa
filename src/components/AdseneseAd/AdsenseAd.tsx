"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_DEFAULT_SLOT } from "@/config/adsense";

interface Props {
    slot?: string;
    format?: "auto" | "rectangle" | "vertical" | "horizontal";
    className?: string;
}

export default function AdsenseAd({
    slot = ADSENSE_DEFAULT_SLOT,
    format = "auto",
    className = "",
}: Props) {
    useEffect(() => {
        if (!slot) return;

        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, [slot]);

    if (!slot) {
        return null;
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={ADSENSE_CLIENT_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}