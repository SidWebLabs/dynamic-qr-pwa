"use client";

import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";

export default function InstallPWA() {
    const [prompt, setPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => { e.preventDefault(); setPrompt(e); };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!prompt) return;
        prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === "accepted") console.log("App installed");
        setPrompt(null);
    };

    if (!prompt) return null;

    return (
        <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
        >
            <FiDownload size={12} />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
        </button>
    );
}