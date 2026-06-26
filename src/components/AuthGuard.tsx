"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Public routes — never redirect these, Google bot must reach them freely
const PUBLIC_ROUTES = ["/", "/login", "/privacy"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isLoading) return;
    if (!user && !isPublic) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, isPublic, pathname, router]);

  // Always render public routes immediately — no loading gate
  if (isPublic) return <>{children}</>;

  // Protected route — show nothing while auth loads or redirect fires
  if (isLoading || !user) return null;

  return <>{children}</>;
}