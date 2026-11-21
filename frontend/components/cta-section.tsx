import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-blue-200/40 blur-[100px]"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 rounded-3xl border border-blue-100 bg-white/75 px-6 py-9 shadow-sm shadow-blue-900/[0.03] backdrop-blur-sm sm:px-10 md:flex-row md:py-10">
        {/* Content */}
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <ShieldCheck size={15} />
            Get started with CrediSense
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Make your next lending decision more informed.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Create your account to assess applicants and review AI-powered
            credit risk insights.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:w-auto">
          <Link
            href="/register"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-400 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl sm:w-auto"
          >
            Create your account
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <p className="text-xs text-slate-500">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
