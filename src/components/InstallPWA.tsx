"use client";

import { useEffect, useState } from "react";

export default function InstallPWA() {
    const [prompt, setPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!prompt) return;

        prompt.prompt();
        const choice = await prompt.userChoice;

        if (choice.outcome === "accepted") {
            console.log("App installed");
        }

        setPrompt(null);
    };

    if (!prompt) return null;

    return (
        <button
            onClick={handleInstall}
            className="bg-green-500 text-white px-6 py-2 rounded-full"
        >
            Download App
        </button>
    );
}