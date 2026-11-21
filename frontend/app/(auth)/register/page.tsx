"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClassName = "text-sm font-semibold text-slate-700";

const requiredMark = <span className="ml-1 text-red-500">*</span>;

export default function RegisterPage() {
  const { registerCompany } = useAuth();

  const [form, setForm] = useState({
    company_name: "",
    company_email: "",
    phone: "",
    industry: "",
    country: "",
    address: "",
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerCompany({
        company_name: form.company_name.trim(),
        company_email: form.company_email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        industry: form.industry.trim() || null,
        country: form.country.trim() || null,
        address: form.address.trim() || null,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again.",
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
              Already registered?
            </span>

            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Sign in
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-blue-100/50 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-cyan-100/40 blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          {/* Page heading */}
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
              <Building2 size={26} strokeWidth={1.8} />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Organization registration
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Create your company account
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Set up your organization and administrator account to begin
              managing credit risk assessments with CrediSense.
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

              <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={34} strokeWidth={1.8} />
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                  Registration successful
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Your company workspace has been created successfully. You can
                  now sign in using your administrator email address.
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Administrator email
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {form.email.trim().toLowerCase()}
                  </p>
                </div>

                <Link
                  href="/login"
                  className="mt-7 inline-flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Continue to sign in
                  <ArrowRight size={17} />
                </Link>

                <p className="mt-4 text-xs text-slate-400">
                  Your account is ready. Sign in to access your workspace.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error message */}
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

              {/* Company information */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-cyan-50/40 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Company information
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Tell us about your organization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="company_name" className={labelClassName}>
                      Company name {requiredMark}
                    </label>
                    <input
                      id="company_name"
                      name="company_name"
                      required
                      autoComplete="organization"
                      value={form.company_name}
                      onChange={handleChange}
                      placeholder="e.g. Acme Financial Services"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company_email" className={labelClassName}>
                      Company email {requiredMark}
                    </label>
                    <input
                      id="company_email"
                      name="company_email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.company_email}
                      onChange={handleChange}
                      placeholder="info@company.com"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className={labelClassName}>
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+251 9..."
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="industry" className={labelClassName}>
                      Industry
                    </label>
                    <input
                      id="industry"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      placeholder="e.g. Banking, Microfinance"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className={labelClassName}>
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="e.g. Ethiopia"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="address" className={labelClassName}>
                      Company address
                    </label>
                    <input
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="City, area, or street address"
                      className={inputClassName}
                    />
                  </div>
                </div>
              </section>

              {/* Administrator information */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-cyan-50/40 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Administrator account
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Create the primary account for your organization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="full_name" className={labelClassName}>
                      Full name {requiredMark}
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      required
                      autoComplete="name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="email" className={labelClassName}>
                      Administrator email {requiredMark}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="username"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className={inputClassName}
                    />
                    <p className="text-xs leading-5 text-slate-400">
                      This email address will be used to sign in to CrediSense.
                    </p>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className={labelClassName}>
                      Password {requiredMark}
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        className={`${inputClassName} pr-12`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-blue-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">
                      Use at least 8 characters.
                    </p>
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm_password"
                      className={labelClassName}
                    >
                      Confirm password {requiredMark}
                    </label>

                    <div className="relative">
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className={`${inputClassName} pr-12`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-blue-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security information */}
              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <LockKeyhole
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Your organization has a separate workspace
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your company account and its assessment records are
                    separated from other organizations.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="space-y-5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/15 transition hover:from-blue-700 hover:to-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating your company account...
                    </>
                  ) : (
                    <>
                      Create company account
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Footer */}
          <footer className="mt-9 border-t border-slate-200/80 pt-6">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} />
                CrediSense
              </span>
              <span>Credit intelligence platform</span>
              <Link href="/" className="transition hover:text-blue-600">
                Back to homepage
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
