"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface AuthUser {
    username: string;
    mobile?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (identifier: string, pin: string) => { success: boolean; error?: string };
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "registered_users";
const SESSION_KEY = "qr_session";

// ── Dummy / seed users — always available ─────────────────────
const SEED_USERS = [
    { username: "admin", mobile: "7741973805", pin: "11111" },
    { username: "rahul", mobile: "9876543210", pin: "22222" },
    { username: "demo", mobile: "9000000000", pin: "12345" },
    { username: "Shivam", mobile: "9850818859", pin: "55555"}
];

function initUsers() {
    if (typeof window === "undefined") return;
    try {
        const existing: typeof SEED_USERS = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        // Merge: add seed users that aren't already present
        const merged = [...existing];
        for (const seed of SEED_USERS) {
            const found = merged.find(
                (u) => u.username === seed.username || u.mobile === seed.mobile
            );
            if (!found) merged.push(seed);
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(merged));
    } catch { }
}

function getUsers(): typeof SEED_USERS {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
    catch { return []; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        initUsers(); // seed on first load
        try {
            const saved = localStorage.getItem(SESSION_KEY);
            if (saved) setUser(JSON.parse(saved));
        } catch { }
        setLoading(false);
    }, []);

    const login = (identifier: string, pin: string): { success: boolean; error?: string } => {
        const id = identifier.trim();

        if (!id) return { success: false, error: "Please enter your username or mobile number." };
        const isMobile = /^\d+$/.test(id);
        if (isMobile && id.length !== 10)
            return { success: false, error: "Mobile number must be exactly 10 digits." };
        if (!isMobile && id.length < 3)
            return { success: false, error: "Username must be at least 3 characters." };
        if (!isMobile && /[^a-zA-Z0-9._]/.test(id))
            return { success: false, error: "Username can only contain letters, numbers, dots or underscores." };
        if (!pin) return { success: false, error: "Please enter your 5-digit PIN." };
        if (pin.length !== 5) return { success: false, error: "PIN must be exactly 5 digits." };
        if (!/^\d{5}$/.test(pin)) return { success: false, error: "PIN must contain digits only." };

        const users = getUsers();
        const found = users.find(
            (u) =>
                (u.username.toLowerCase() === id.toLowerCase() || u.mobile === id) &&
                u.pin === pin
        );

        if (!found)
            return { success: false, error: "Invalid credentials. Please check and try again." };

        const authUser: AuthUser = { username: found.username, mobile: found.mobile };
        localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
        setUser(authUser);
        return { success: true };
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}