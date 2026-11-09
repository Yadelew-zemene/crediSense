"use client";

import Link from "next/link";

import type { AssessmentHistoryItem } from "@/lib/api";

interface AssessmentHistoryProps {
  assessments: AssessmentHistoryItem[];
  loading: boolean;
  error: string | null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        isRisk
          ? "bg-red-50 text-red-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          isRisk ? "bg-red-500" : "bg-emerald-500"
        }`}
      />
      {decision}
    </span>
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
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          Recent assessments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your latest completed credit-risk assessments.
        </p>
      </div>

      {loading && (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse px-5 py-5 sm:px-6">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-48 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="px-5 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-red-600">
            !
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            Unable to load assessments
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && assessments.length === 0 && (
        <div className="px-5 py-14 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            +
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No assessments yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
            Complete your first applicant assessment and the result will appear
            here.
          </p>

          <Link
            href="/assessment"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Start an assessment
          </Link>
        </div>
      )}

      {!loading && !error && assessments.length > 0 && (
        <>
          <div className="hidden md:block">
            <div className="grid grid-cols-[1.5fr_1.4fr_1fr_1fr_0.7fr] border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
              <span>Date</span>
              <span>Decision</span>
              <span>Probability</span>
              <span>Threshold</span>
              <span>Model</span>
            </div>

            <div className="divide-y divide-slate-100">
              {assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/dashboard/assessments/${assessment.id}`}
                  className="group grid grid-cols-[1.5fr_1.4fr_1fr_1fr_0.7fr] items-center px-6 py-4 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(assessment.created_at)}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Assessment completed
                    </p>
                  </div>

                  <DecisionBadge decision={assessment.decision} />

                  <span className="text-sm font-semibold text-slate-900">
                    {formatProbability(assessment.default_probability)}
                  </span>

                  <span className="text-sm text-slate-600">
                    {formatProbability(assessment.decision_threshold)}
                  </span>

                  <span className="text-sm text-slate-600">
                    {assessment.model_version}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {assessments.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/dashboard/assessments/${assessment.id}`}
                className="group block px-5 py-5 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatDate(assessment.created_at)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {assessment.model_version}
                    </p>
                  </div>

                  <DecisionBadge decision={assessment.decision} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Default probability
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatProbability(assessment.default_probability)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Decision threshold</p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatProbability(assessment.decision_threshold)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}