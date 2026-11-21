"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileSearch,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import type { AssessmentHistoryItem } from "@/lib/api";

interface AssessmentHistoryProps {
  assessments: AssessmentHistoryItem[];
  loading: boolean;
  error: string | null;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatProbability(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function DecisionBadge({
  decision,
}: {
  decision: AssessmentHistoryItem["decision"];
}) {
  const isRisk = decision === "DEFAULT RISK";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        isRisk
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {isRisk ? <CircleAlert size={12} /> : <CheckCircle2 size={12} />}

      {isRisk ? "Default Risk" : "No Default Risk"}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-36 rounded-md bg-slate-200" />
              <div className="h-3 w-24 rounded-md bg-slate-100" />
            </div>

            <div className="h-6 w-28 rounded-full bg-slate-100" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="h-9 rounded-lg bg-slate-100" />
            <div className="h-9 rounded-lg bg-slate-100" />
            <div className="h-9 rounded-lg bg-slate-100" />
            <div className="h-9 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-14 text-center sm:px-6">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
        <FileSearch size={25} strokeWidth={1.8} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">
        No assessments yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Your completed credit risk assessments will appear here. Start by
        evaluating your first applicant.
      </p>

      <Link
        href="/assessment"
        className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        New assessment
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="px-5 py-12 text-center sm:px-6">
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600">
        <CircleAlert size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900">
        Unable to load assessment history
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {error}
      </p>

      <p className="mt-3 text-xs text-slate-400">
        Please refresh the page and try again.
      </p>
    </div>
  );
}

function AssessmentRow({ assessment }: { assessment: AssessmentHistoryItem }) {
  return (
    <Link
      href={`/dashboard/assessments/${assessment.id}`}
      className="group grid grid-cols-[1.5fr_1.3fr_1fr_1fr_0.9fr] items-center gap-4 px-6 py-4 transition-colors hover:bg-blue-50/40 focus-visible:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">
          {formatDate(assessment.created_at)}
        </p>

        <p className="mt-1 text-xs text-slate-400">Completed assessment</p>
      </div>

      <DecisionBadge decision={assessment.decision} />

      <div>
        <p className="text-sm font-bold tabular-nums text-slate-900">
          {formatProbability(assessment.default_probability)}
        </p>
      </div>

      <p className="text-sm font-medium tabular-nums text-slate-600">
        {formatProbability(assessment.decision_threshold)}
      </p>

      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-slate-500">
          {assessment.model_version}
        </span>

        <ChevronRight
          size={16}
          className="shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600"
        />
      </div>
    </Link>
  );
}

function AssessmentMobileCard({
  assessment,
}: {
  assessment: AssessmentHistoryItem;
}) {
  return (
    <Link
      href={`/dashboard/assessments/${assessment.id}`}
      className="group block px-5 py-5 transition-colors hover:bg-blue-50/40 focus-visible:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-slate-500">
            <CalendarDays size={13} />

            <p className="text-xs font-medium">
              {formatDate(assessment.created_at)}
            </p>
          </div>

          <p className="mt-1.5 truncate text-xs text-slate-400">
            Model: {assessment.model_version}
          </p>
        </div>

        <DecisionBadge decision={assessment.decision} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-500">
            Default probability
          </p>

          <p className="mt-1.5 text-lg font-bold tabular-nums text-slate-900">
            {formatProbability(assessment.default_probability)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-500">
            Decision threshold
          </p>

          <p className="mt-1.5 text-lg font-bold tabular-nums text-slate-900">
            {formatProbability(assessment.decision_threshold)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
        View assessment
        <ChevronRight size={14} />
      </div>
    </Link>
  );
}

export default function AssessmentHistory({
  assessments,
  loading,
  error,
}: AssessmentHistoryProps) {
  return (
    <section
      id="assessment-history"
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 via-white to-cyan-50/30 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
            <Clock3 size={20} strokeWidth={1.9} />
          </div>

          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              Assessment History
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
              Review your previously completed credit risk assessments.
            </p>
          </div>
        </div>

        {!loading && !error && assessments.length > 0 && (
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="size-2 rounded-full bg-blue-500" />

            <span className="text-xs font-semibold text-slate-600">
              {assessments.length}{" "}
              {assessments.length === 1 ? "record" : "records"}
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingState />}

      {/* Error */}
      {!loading && error && <ErrorState error={error} />}

      {/* Empty */}
      {!loading && !error && assessments.length === 0 && <EmptyState />}

      {/* Assessment records */}
      {!loading && !error && assessments.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.5fr_1.3fr_1fr_1fr_0.9fr] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Assessment date
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Classification
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Probability
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Threshold
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Model version
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {assessments.map((assessment) => (
                  <AssessmentRow key={assessment.id} assessment={assessment} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile records */}
          <div className="divide-y divide-slate-100 md:hidden">
            {assessments.map((assessment) => (
              <AssessmentMobileCard
                key={assessment.id}
                assessment={assessment}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-slate-500">
              Showing {assessments.length} available assessment{" "}
              {assessments.length === 1 ? "record" : "records"}.
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <ShieldCheck size={13} />
              Company assessment records
            </div>
          </div>
        </>
      )}
    </section>
  );
}
