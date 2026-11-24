"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please check your credentials and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7FAFF]">
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            aria-label="CrediSense homepage"
            className="flex items-center gap-2.5"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-500/20">
              <ShieldCheck size={21} strokeWidth={2.2} />
            </span>

            <span className="text-xl font-bold tracking-tight text-slate-950">
              CrediSense
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              New to CrediSense?
            </span>

            <Link
              href="/register"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Create account
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Login content */}
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-blue-100/50 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-cyan-100/40 blur-3xl"
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
              <ShieldCheck size={27} strokeWidth={1.8} />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Secure account access
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Sign in to your CrediSense workspace to manage your organizations
              credit risk assessments.
            </p>
          </div>

          {/* Login card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/[0.04]">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />

            <div className="p-6 sm:p-8">
              <div className="mb-7">
                <h2 className="text-lg font-bold text-slate-900">
                  Sign in to your account
                </h2>

                <p className="mt-1.5 text-sm text-slate-500">
                  Enter your administrator credentials to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                      !
                    </span>

                    <p className="leading-6">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Administrator email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder="you@company.com"
                    className={inputClassName}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      disabled={isSubmitting}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your password"
                      className={`${inputClassName} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/15 transition hover:from-blue-700 hover:to-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to your workspace
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Registration */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                  >
                    Register your organization
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Security information */}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
            <LockKeyhole size={14} />
            Secure access to your organization workspace.
          </div>

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-200/80 pt-5">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} />
                CrediSense
              </span>

              <span>Credit intelligence platform</span>

              <Link href="/" className="transition hover:text-blue-600">
                Homepage
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
