"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { useAuth } from "@/context/auth-context";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7FAFF] px-4">
        <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-200/80 bg-white px-8 py-10 shadow-sm">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20">
            <ShieldCheck className="size-7 text-white" strokeWidth={2} />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            CrediSense
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Credit intelligence platform
          </p>

          <div
            className="mt-8 size-7 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600"
            role="status"
            aria-label="Loading"
          />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking your session...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait while we verify your account.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
