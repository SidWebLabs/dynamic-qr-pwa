"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_ROUTES = ["/", "/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isLoading) return;
    // Not logged in + trying to access protected route → kick to login
    if (!user && !isPublic) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, isPublic, pathname, router]);

  // Show nothing while checking auth on a protected route
  if (isLoading && !isPublic) return null;

  // Logged-out user on protected route — render nothing while redirect fires
  if (!isLoading && !user && !isPublic) return null;

  return <>{children}</>;
}