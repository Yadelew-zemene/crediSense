"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  LogOut,
  ShieldCheck,
  X,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "New Assessment",
    href: "/assessment",
    icon: FilePlus2,
  },
  {
    label: "Assessment History",
    href: "/dashboard#assessment-history",
    icon: ClipboardList,
  },
];

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, company, logout } = useAuth();

  const [currentHash, setCurrentHash] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Keep the active navigation state synchronized with URL hash changes.
  useEffect(() => {
    function updateHash() {
      setCurrentHash(window.location.hash);
    }

    updateHash();

    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, [pathname]);

  const isHistoryActive =
    pathname.startsWith("/dashboard/assessments/") ||
    (pathname === "/dashboard" && currentHash === "#assessment-history");

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden border-r border-blue-100/80 bg-gradient-to-b from-white via-blue-50/50 to-white text-slate-800 shadow-xl shadow-blue-950/5 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-blue-100/50 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-24 size-72 rounded-full bg-cyan-100/40 blur-3xl"
        />

        {/* Brand */}
        <div className="relative flex h-[76px] shrink-0 items-center justify-between border-b border-blue-100/70 px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20 transition duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-600/30">
              <ShieldCheck size={22} strokeWidth={2.2} />
            </span>

            <div>
              <span className="block text-lg font-bold tracking-tight text-slate-950">
                CrediSense
              </span>

              <span className="block text-[10px] font-semibold tracking-[0.16em] text-blue-600">
                CREDIT INTELLIGENCE
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>

            <span className="size-1.5 rounded-full bg-blue-500" />
          </div>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.label === "Assessment History"
                  ? isHistoryActive
                  : item.label === "Overview"
                    ? pathname === "/dashboard" && !isHistoryActive
                    : pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:translate-x-0.5 hover:bg-white hover:text-blue-700 hover:shadow-sm hover:shadow-blue-950/5"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-blue-600"
                      }`}
                    />

                    {item.label}
                  </span>

                  {isActive ? (
                    <ChevronRight size={16} className="text-blue-100" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-transparent transition-colors group-hover:bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Workspace information */}
          <div className="mt-10 rounded-xl border border-blue-100/80 bg-gradient-to-br from-blue-50/80 to-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" />

              <p className="text-xs font-semibold text-slate-800">
                Credit Intelligence
              </p>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Your workspace for managing credit risk assessments and reviewing
              applicant insights.
            </p>
          </div>
        </nav>

        {/* Account section */}
        <div className="relative shrink-0 border-t border-blue-100/80 bg-white/70 p-4 backdrop-blur-sm">
          {/* Company and user information */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-900/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-sm font-bold text-blue-700">
                {(company?.company_name ?? "C").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {company?.company_name ?? "Your Company"}
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Company workspace
                </p>
              </div>
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="truncate text-sm font-semibold text-slate-700">
                {user?.full_name ?? "Credit Analyst"}
              </p>

              <p className="mt-1 truncate text-xs text-slate-400">
                {user?.email ?? ""}
              </p>
            </div>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} />

            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>

          <p className="mt-3 text-center text-[10px] font-medium tracking-wide text-slate-300">
            CrediSense · Credit Intelligence
          </p>
        </div>
      </aside>
    </>
  );
}
