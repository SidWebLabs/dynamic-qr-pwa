"use client";

import {
    createContext, useContext, useEffect,
    useState, ReactNode, useCallback,
} from "react";
import { api } from "@/lib/api";

// ── Types — match exactly what backend returns ────────────────
export interface AuthUser {
    id: string;
    name: string;           // backend: name
    mobile_no: string;      // backend: mobile_no
    pin?: number;
    max_account_limit: number;
    is_active: boolean;
    created_by: number;
    created_on: string;
    modified_by: number | null;
    modified_on: string;
}

interface LoginPayload {
    mobile_no: string;
    pin: string;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const TOKEN_KEY = "qr_token";
const SESSION_KEY = "qr_session";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem(TOKEN_KEY);
            const savedSession = localStorage.getItem(SESSION_KEY);
            if (savedToken && savedSession) {
                setToken(savedToken);
                setUser(JSON.parse(savedSession));
            }
        } catch { }
        setLoading(false);
    }, []);

    // ── Login ─────────────────────────────────────────────────
    const login = useCallback(
        async (payload: LoginPayload): Promise<{ success: boolean; error?: string }> => {
            const { mobile_no, pin } = payload;

            // Client-side validation
            if (!mobile_no.trim())
                return { success: false, error: "Please enter your mobile number." };
            if (!/^\d{10}$/.test(mobile_no.trim()))
                return { success: false, error: "Mobile number must be exactly 10 digits." };
            if (!pin || pin.length !== 5)
                return { success: false, error: "PIN must be exactly 5 digits." };
            if (!/^\d{5}$/.test(pin))
                return { success: false, error: "PIN must contain digits only." };

            try {
                const res = await api.post<{ user: AuthUser; token: string }>(
                    "/auth/login",
                    { mobile_no: mobile_no.trim(), pin }
                );

                if (!res.success || !res.data) {
                    return { success: false, error: res.message || "Login failed." };
                }

                const { user: apiUser, token: apiToken } = res.data;

                // Strip sensitive fields before storing
                const safeUser: AuthUser = { ...apiUser, pin: undefined };

                localStorage.setItem(TOKEN_KEY, apiToken);
                localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));

                setToken(apiToken);
                setUser(safeUser);

                return { success: true };
            } catch (err: any) {
                const msg: string = err?.message || "Login failed.";
                if (msg.toLowerCase().includes("not found"))
                    return { success: false, error: "No account found with this mobile number." };
                if (msg.toLowerCase().includes("invalid pin") || msg.toLowerCase().includes("pin"))
                    return { success: false, error: "Incorrect PIN. Please try again." };
                return { success: false, error: msg };
            }
        },
        []
    );

    // ── Logout ────────────────────────────────────────────────
    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}