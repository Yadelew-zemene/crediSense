"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AssessmentHistory from "@/components/dashboard/assessment-history";
import {
  getAssessments,
  type AssessmentHistoryItem,
} from "@/lib/api";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<
    AssessmentHistoryItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssessments() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAssessments();

        setAssessments(data);
      } catch {
        setError("Unable to load assessment data.");
      } finally {
        setLoading(false);
      }
    }

    loadAssessments();
  }, []);

  const totalAssessments = assessments.length;

  const defaultRiskCount = assessments.filter(
    (assessment) => assessment.decision === "DEFAULT RISK"
  ).length;

  const noDefaultRiskCount = assessments.filter(
    (assessment) => assessment.decision === "NO DEFAULT RISK"
  ).length;

  const defaultRiskRate =
    totalAssessments > 0
      ? ((defaultRiskCount / totalAssessments) * 100).toFixed(1)
      : "0.0";

  const noDefaultRiskRate =
    totalAssessments > 0
      ? ((noDefaultRiskCount / totalAssessments) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-full bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Credit Risk Assessment
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Your overview
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Review assessment activity and monitor credit-risk outcomes from
              one place.
            </p>
          </div>

          <Link
            href="/assessment"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + New Assessment
          </Link>
        </div>

        {/* Summary */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Assessments
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {loading ? "—" : totalAssessments}
            </p>

            <p className="mt-2 text-sm text-slate-500">Completed assessments</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Default Risk</p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {loading ? "—" : defaultRiskCount}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {loading ? "Loading..." : `${defaultRiskRate}% of assessments`}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              No Default Risk
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {loading ? "—" : noDefaultRiskCount}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {loading ? "Loading..." : `${noDefaultRiskRate}% of assessments`}
            </p>
          </div>
        </section>

        {/* Recent Assessments */}
        <div className="mt-8">
          <AssessmentHistory
            assessments={assessments}
            loading={loading}
            error={error}
          />
        </div>
      </section>
    </div>
  );
}