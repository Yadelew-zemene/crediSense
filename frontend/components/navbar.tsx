"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Our model", href: "#model" },
  { label: "Responsible AI", href: "#responsible-ai" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { isAuthenticated, isLoading } = useAuth();

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          aria-label="CrediSense home"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
            <ShieldCheck size={23} strokeWidth={2.2} />
          </span>

          <span>
            <span className="block text-[19px] font-bold leading-tight tracking-tight text-slate-950">
              CrediSense
            </span>

            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Credit Intelligence
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-9 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop account actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoading && isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              <LayoutDashboard size={16} />
              Dashboard
              <ArrowUpRight size={15} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 ${
                  isLoading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className={`group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 ${
                  isLoading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Create account
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white shadow-xl md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-5 py-5 sm:px-6"
          >
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              {!isLoading && isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <LayoutDashboard size={17} />
                  Go to Dashboard
                  <ArrowUpRight size={16} />
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex h-12 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="flex h-12 items-center justify-center gap-1 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Get started
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
