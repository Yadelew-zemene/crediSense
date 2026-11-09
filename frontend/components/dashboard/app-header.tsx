"use client";

import { Menu, Bell } from "lucide-react";

interface AppHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function AppHeader({ onMenuClick, title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-950">
            {title}
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            Credit risk management workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:inline-flex">
          <span className="mr-2 mt-1 size-1.5 rounded-full bg-emerald-500" />
          System operational
        </span>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
