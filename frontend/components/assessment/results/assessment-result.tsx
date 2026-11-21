"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Copy,
  Info,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import type { PredictionResponse } from "@/lib/types";

interface AssessmentResultProps {
  result: PredictionResponse;
  onNewAssessment: () => void;
}

function getResultMetadata(isDefaultRisk: boolean) {
  if (isDefaultRisk) {
    return {
      label: "Default Risk",
      description:
        "The model classified this applicant as having an estimated default probability at or above the configured decision threshold.",
      accent: "text-rose-700",
      iconBackground: "bg-rose-100",
      icon: CircleAlert,
      border: "border-rose-200",
      background: "from-rose-50 via-white to-rose-50/50",
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      bar: "bg-rose-500",
      indicator: "bg-rose-500",
    };
  }

  return {
    label: "No Default Risk",
    description:
      "The model classified this applicant as having an estimated default probability below the configured decision threshold.",
    accent: "text-emerald-700",
    iconBackground: "bg-emerald-100",
    icon: CheckCircle2,
    border: "border-emerald-200",
    background: "from-emerald-50 via-white to-emerald-50/50",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
    indicator: "bg-emerald-500",
  };
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <p className="mt-2 break-words text-xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}

export function AssessmentResult({
  result,
  onNewAssessment,
}: AssessmentResultProps) {
  const [copied, setCopied] = useState(false);

  const probabilityPercent = result.default_probability * 100;
  const thresholdPercent = result.threshold * 100;
  const isDefaultRisk = result.prediction === 1;

  const resultMeta = getResultMetadata(isDefaultRisk);
  const ResultIcon = resultMeta.icon;

  const probabilityDistance = Math.abs(probabilityPercent - thresholdPercent);

  const safeProbability = Math.min(Math.max(probabilityPercent, 0), 100);

  const safeThreshold = Math.min(Math.max(thresholdPercent, 0), 100);

  const handleCopyReport = async () => {
    const summary = [
      "CrediSense - Credit Risk Assessment",
      "-----------------------------------",
      `Decision: ${result.decision}`,
      `Estimated default probability: ${probabilityPercent.toFixed(1)}%`,
      `Decision threshold: ${thresholdPercent.toFixed(1)}%`,
      `Classification: ${resultMeta.label}`,
      `Distance from threshold: ${probabilityDistance.toFixed(1)} percentage points`,
      "",
      "This is a machine-learning prediction intended to support human review.",
      "It is not a final lending decision.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-full bg-[#F7FAFF] pb-16">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-700"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>

            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <ShieldCheck size={17} />
              </span>

              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Credit Intelligence
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Assessment Results
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review the model&apos;s prediction and its decision threshold.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:self-center"
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-600" />
                Summary copied
              </>
            ) : (
              <>
                <Copy size={15} />
                Copy summary
              </>
            )}
          </button>
        </div>

        {/* Main result */}
        <section
          className={`overflow-hidden rounded-2xl border bg-white shadow-sm shadow-slate-900/[0.03] ${resultMeta.border}`}
        >
          {/* Classification */}
          <div
            className={`border-b p-5 sm:p-8 ${resultMeta.border} bg-gradient-to-br ${resultMeta.background}`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${resultMeta.iconBackground} ${resultMeta.accent}`}
                >
                  <ResultIcon size={29} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Assessment completed
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${resultMeta.badge}`}
                    >
                      {resultMeta.label}
                    </span>
                  </div>

                  <h2
                    className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${resultMeta.accent}`}
                  >
                    {result.decision}
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    {resultMeta.description}
                  </p>
                </div>
              </div>

              {/* Probability highlight */}
              <div className="rounded-2xl border border-white bg-white/90 p-5 shadow-sm shadow-slate-900/[0.03] lg:min-w-56">
                <p className="text-xs font-semibold text-slate-500">
                  Estimated default probability
                </p>

                <p
                  className={`mt-2 text-4xl font-extrabold tracking-tight ${resultMeta.accent}`}
                >
                  {probabilityPercent.toFixed(1)}%
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Model-generated probability
                </p>
              </div>
            </div>
          </div>

          {/* Probability analysis */}
          <div className="space-y-6 p-5 sm:p-8">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Probability Analysis
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Comparison of the estimated probability against the
                    model&apos;s configured decision threshold.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="size-2 rounded-full bg-slate-800" />
                  <span className="text-xs font-semibold text-slate-700">
                    Threshold: {thresholdPercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Probability bar */}
              <div className="mt-10 px-1">
                <div className="relative h-3.5 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${resultMeta.bar}`}
                    style={{
                      width: `${safeProbability}%`,
                    }}
                  />

                  {/* Threshold marker */}
                  <div
                    className="absolute -bottom-2 -top-2 z-[1] w-0.5 bg-slate-900"
                    style={{
                      left: `${safeThreshold}%`,
                    }}
                  />

                  {/* Probability marker */}
                  <div
                    className={`absolute top-1/2 z-[2] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-md ${resultMeta.indicator}`}
                    style={{
                      left: `${safeProbability}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-[11px] font-medium text-slate-400">
                  <span>0%</span>
                  <span>100%</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`size-2.5 rounded-full ${resultMeta.indicator}`}
                    />
                    Estimated probability
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-0.5 bg-slate-900" />
                    Decision threshold
                  </span>
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Info size={17} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Understanding this prediction
                  </h4>

                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    The model estimated a{" "}
                    <strong className="font-bold text-slate-900">
                      {probabilityPercent.toFixed(1)}%
                    </strong>{" "}
                    probability of default, which is{" "}
                    <strong className="font-bold text-slate-900">
                      {probabilityDistance.toFixed(1)} percentage points
                    </strong>{" "}
                    {isDefaultRisk ? "above" : "below"} the configured decision
                    threshold of{" "}
                    <strong className="font-bold text-slate-900">
                      {thresholdPercent.toFixed(1)}%
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction metrics */}
          <div className="border-t border-slate-100 bg-slate-50/40 p-5 sm:p-8">
            <div className="mb-5">
              <h3 className="text-base font-bold text-slate-900">
                Prediction Details
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Values returned by the CrediSense prediction API.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="Default probability"
                value={`${probabilityPercent.toFixed(1)}%`}
                description="Estimated probability of loan default"
              />

              <MetricCard
                label="Decision threshold"
                value={`${thresholdPercent.toFixed(1)}%`}
                description="Configured classification threshold"
              />

              <MetricCard
                label="Model classification"
                value={resultMeta.label}
                description="Binary prediction returned by the model"
              />
            </div>
          </div>
        </section>

        {/* Responsible AI */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Responsible AI & Human Oversight
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                This prediction is generated by a machine-learning model and is
                intended to support qualified lending professionals. It should
                not be treated as a final lending decision. Human review,
                institutional policies, and applicable regulations should guide
                any actual lending decision.
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <button
            type="button"
            onClick={onNewAssessment}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <RotateCcw size={16} />
            Assess another applicant
          </button>
        </div>
      </div>
    </main>
  );
}
