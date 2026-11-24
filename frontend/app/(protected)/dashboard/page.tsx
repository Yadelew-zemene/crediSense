"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import AssessmentHistory from "@/components/dashboard/assessment-history";
import { getAssessments, type AssessmentHistoryItem } from "@/lib/api";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<AssessmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssessments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAssessments();
      setAssessments(data);
    } catch {
      setError("Unable to load assessment data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  let isActive = true;

  const fetchInitialAssessments = async () => {
    try {
      const data = await getAssessments();

      if (isActive) {
        setAssessments(data);
      }
    } catch {
      if (isActive) {
        setError("Unable to load assessment data. Please try again.");
      }
    } finally {
      if (isActive) {
        setLoading(false);
      }
    }
  };

  void fetchInitialAssessments();

  return () => {
    isActive = false;
  };
}, []);

  // Assessment statistics
  const totalAssessments = assessments.length;

  const defaultRiskCount = assessments.filter(
    (assessment) => assessment.decision === "DEFAULT RISK",
  ).length;

  const noDefaultRiskCount = assessments.filter(
    (assessment) => assessment.decision === "NO DEFAULT RISK",
  ).length;

  const defaultRiskRate =
    totalAssessments > 0 ? (defaultRiskCount / totalAssessments) * 100 : 0;

  const noDefaultRiskRate =
    totalAssessments > 0 ? (noDefaultRiskCount / totalAssessments) * 100 : 0;

  return (
    <div className="min-h-full bg-[#F7FAFF]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            Dashboard Introduction
        ===================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-gradient-to-br from-white via-white to-blue-50/80 p-6 shadow-sm sm:p-8">
          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-blue-100/50 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-1/3 size-64 rounded-full bg-cyan-100/40 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <ShieldCheck size={14} />
                Credit Intelligence Workspace
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Credit risk at a glance.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Monitor your assessment activity, review predicted risk
                outcomes, and make more informed lending decisions.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <Link
                href="/assessment"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/25"
              >
                <FilePlus2 size={18} />
                New Assessment
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={loadAssessments}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh data
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            Error State
        ===================================================== */}
        {error && (
          <section
            role="alert"
            className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <ShieldAlert size={20} className="mt-0.5 shrink-0 text-red-600" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to load dashboard data
                </p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadAssessments}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </section>
        )}

        {/* =====================================================
            KPI Cards
        ===================================================== */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Assessment Overview
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Summary of your company&apos;s assessment activity.
              </p>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200/70 sm:inline-flex">
              <span className="size-1.5 rounded-full bg-blue-500" />
              All records
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Total assessments */}
            <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-950/5 sm:p-6">
              <div className="absolute right-0 top-0 size-28 rounded-full bg-blue-50 opacity-70 blur-2xl transition group-hover:bg-blue-100" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Assessments
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? (
                      <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
                    ) : (
                      totalAssessments.toLocaleString()
                    )}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Total completed assessments
                  </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                  <ClipboardList size={21} />
                </div>
              </div>
            </div>

            {/* Default risk */}
            <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-orange-950/5 sm:p-6">
              <div className="absolute right-0 top-0 size-28 rounded-full bg-orange-50 opacity-70 blur-2xl transition group-hover:bg-orange-100" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Default Risk
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? (
                      <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
                    ) : (
                      defaultRiskCount.toLocaleString()
                    )}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {loading
                      ? "Calculating..."
                      : `${defaultRiskRate.toFixed(1)}% of assessments`}
                  </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-100">
                  <ShieldAlert size={21} />
                </div>
              </div>
            </div>

            {/* No default risk */}
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-emerald-950/5 sm:col-span-2 xl:col-span-1 sm:p-6">
              <div className="absolute right-0 top-0 size-28 rounded-full bg-emerald-50 opacity-70 blur-2xl transition group-hover:bg-emerald-100" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    No Default Risk
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? (
                      <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
                    ) : (
                      noDefaultRiskCount.toLocaleString()
                    )}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {loading
                      ? "Calculating..."
                      : `${noDefaultRiskRate.toFixed(1)}% of assessments`}
                  </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                  <CheckCircle2 size={21} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Risk Distribution
        ===================================================== */}
        <section className="grid gap-6 lg:grid-cols-5">
          {/* Distribution */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={19} className="text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Risk Distribution
                  </h3>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Breakdown of predicted assessment outcomes.
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {loading ? "Loading" : `${totalAssessments} records`}
              </span>
            </div>

            {loading ? (
              <div className="mt-8 space-y-4">
                <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 animate-pulse rounded-xl bg-slate-50" />
                  <div className="h-20 animate-pulse rounded-xl bg-slate-50" />
                </div>
              </div>
            ) : totalAssessments === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
                <BarChart3 size={28} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No assessment data yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Complete your first assessment to see the risk distribution.
                </p>
              </div>
            ) : (
              <>
                {/* Distribution bar */}
                <div
                  className="mt-8 flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
                  role="img"
                  aria-label={`${defaultRiskCount} default risk assessments and ${noDefaultRiskCount} no default risk assessments`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700"
                    style={{ width: `${defaultRiskRate}%` }}
                  />

                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                    style={{ width: `${noDefaultRiskRate}%` }}
                  />
                </div>

                {/* Distribution details */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-orange-500" />
                        <span className="text-sm font-medium text-slate-600">
                          Default Risk
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-orange-700">
                        {defaultRiskRate.toFixed(1)}%
                      </span>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {defaultRiskCount.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Predicted default risk
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-slate-600">
                          No Default Risk
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-emerald-700">
                        {noDefaultRiskRate.toFixed(1)}%
                      </span>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {noDefaultRiskCount.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Not classified as default risk
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick action */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 text-white shadow-lg shadow-blue-900/10 lg:col-span-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border border-white/10"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-cyan-400/10 blur-3xl"
            />

            <div className="relative">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <TrendingUp size={22} className="text-cyan-200" />
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight">
                Start a new assessment
              </h3>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                Evaluate applicant information and generate an AI-powered credit
                risk prediction in your workspace.
              </p>
            </div>

            <Link
              href="/assessment"
              className="relative mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Create assessment
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* =====================================================
            Assessment History
        ===================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Assessments
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review your company&apos;s previous credit risk assessments.
              </p>
            </div>

            <Link
              href="/dashboard#assessment-history"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View assessment history
              <ArrowRight size={15} />
            </Link>
          </div>

          <AssessmentHistory
            assessments={assessments}
            loading={loading}
            error={error}
          />
        </section>

        {/* =====================================================
            Responsible AI Notice
        ===================================================== */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-4">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Decision-support information
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              CrediSense predictions are model-generated risk estimates. They
              should support, not replace, human judgment and responsible
              lending decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
