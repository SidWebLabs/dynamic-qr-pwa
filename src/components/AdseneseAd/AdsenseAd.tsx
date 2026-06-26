"use client";

import { useEffect } from "react";

interface Props {
    slot?: string;
    format?: "auto" | "rectangle" | "vertical" | "horizontal";
    className?: string;
}

export default function AdsenseAd({
    slot = "7154228562",
    format = "auto",
    className = "",
}: Props) {
    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-1212835646767214"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}