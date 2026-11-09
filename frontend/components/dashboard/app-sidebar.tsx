"use client";

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
    exact: true,
  },
  {
    label: "New Assessment",
    href: "/assessment",
    icon: FilePlus2,
    exact: true,
  },
  {
    label: "Assessment History",
    href: "/dashboard#assessment-history",
    icon: ClipboardList,
    exact: false,
  },
];

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, company, logout } = useAuth();

  const isHistoryActive =
    pathname.startsWith("/dashboard/assessments/") ||
    (pathname === "/dashboard" &&
      typeof window !== "undefined" &&
      window.location.hash === "#assessment-history");

  async function handleLogout() {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-[#0B1120] text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/[0.07] px-6">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <ShieldCheck size={22} />
            </span>

            <div>
              <span className="block text-lg font-bold tracking-tight">
                CrediSense
              </span>
              <span className="text-[11px] font-medium tracking-wide text-slate-500">
                CREDIT INTELLIGENCE
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-8">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <div className="space-y-1">
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
                  className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={19}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-300"
                      }
                    />
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight size={16} className="text-blue-200" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Account */}
        <div className="shrink-0 border-t border-white/[0.07] p-4">
          <div className="mb-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-sm font-bold text-blue-400">
                {(company?.company_name ?? "C").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {company?.company_name ?? "Your Company"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Company workspace
                </p>
              </div>
            </div>

            <div className="mt-3 border-t border-white/[0.07] pt-3">
              <p className="truncate text-sm font-medium text-slate-300">
                {user?.full_name ?? "Credit Analyst"}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {user?.email ?? ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
