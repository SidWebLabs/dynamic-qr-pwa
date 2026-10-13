"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { api } from "@/lib/api";
import { UPIProfile } from "@/types/index";
import { useAuth } from "@/context/AuthContext";

interface AccountsContextType {
  accounts: UPIProfile[];
  isLoading: boolean;
  error: string | null;
  /** Fetches only if not loaded yet (unless force=true). */
  loadAccounts: (force?: boolean) => Promise<void>;
  /** Force refresh after create / edit / delete / set primary. */
  refreshAccounts: () => Promise<void>;
  clearAccounts: () => void;
}

const AccountsContext = createContext<AccountsContextType | null>(null);

export function AccountsProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [accounts, setAccounts] = useState<UPIProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);
  const inflightRef = useRef<Promise<void> | null>(null);

  const clearAccounts = useCallback(() => {
    setAccounts([]);
    setError(null);
    setIsLoading(false);
    loadedRef.current = false;
    inflightRef.current = null;
  }, []);

  const fetchAccounts = useCallback(async () => {
    if (!token) {
      clearAccounts();
      return;
    }

    // Deduplicate parallel calls (e.g. two pages mounting together)
    if (inflightRef.current) {
      await inflightRef.current;
      return;
    }

    const run = (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get<UPIProfile[]>("/accounts");
        setAccounts(res.data ?? []);
        loadedRef.current = true;
      } catch (err: any) {
        setError(err?.message ?? "Failed to load accounts");
        console.error("Failed to load accounts", err);
      } finally {
        setIsLoading(false);
        inflightRef.current = null;
      }
    })();

    inflightRef.current = run;
    await run;
  }, [token, clearAccounts]);

  const loadAccounts = useCallback(
    async (force = false) => {
      if (!token) {
        clearAccounts();
        return;
      }
      if (!force && loadedRef.current) return;
      await fetchAccounts();
    },
    [token, clearAccounts, fetchAccounts]
  );

  const refreshAccounts = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  // Load once when user logs in; clear on logout
  useEffect(() => {
    if (user && token) {
      loadAccounts(false);
    } else {
      clearAccounts();
    }
  }, [user, token, loadAccounts, clearAccounts]);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        isLoading,
        error,
        loadAccounts,
        refreshAccounts,
        clearAccounts,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const ctx = useContext(AccountsContext);
  if (!ctx) throw new Error("useAccounts must be used inside AccountsProvider");
  return ctx;
}
