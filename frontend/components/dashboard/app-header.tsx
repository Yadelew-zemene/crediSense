"use client";

import { Menu } from "lucide-react";

interface AppHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function AppHeader({ onMenuClick, title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {title}
          </h1>
        </div>
      </div>

      {/* Subtle brand accent */}
      <div
        aria-hidden="true"
        className="ml-auto hidden h-8 w-24 rounded-full bg-gradient-to-r from-blue-50 via-blue-100/70 to-cyan-50 sm:block"
      />
    </header>
  );
}
