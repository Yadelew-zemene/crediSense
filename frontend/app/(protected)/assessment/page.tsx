"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import {
  AssessmentShell,
  type AssessmentStep,
} from "@/components/assessment/assessment-shell";

import { ApplicantForm } from "@/components/assessment/applicant-form";

import { AssessmentResult } from "@/components/assessment/results/assessment-result";

import type { ApplicantRequest, PredictionResponse } from "@/lib/types";

import { predictApplicant } from "@/lib/api";

// -----------------------------------------------------------------------------
// Assessment configuration
// -----------------------------------------------------------------------------

const assessmentSteps: AssessmentStep[] = [
  {
    id: 1,
    title: "Applicant information",
    description: "Basic demographic and household information",
  },
  {
    id: 2,
    title: "Financial information",
    description: "Income, credit, and loan details",
  },
  {
    id: 3,
    title: "Employment & history",
    description: "Employment and applicant history",
  },
  {
    id: 4,
    title: "Additional signals",
    description: "Regional and external model inputs",
  },
];

// -----------------------------------------------------------------------------
// Response validation
// -----------------------------------------------------------------------------

function isValidPrediction(value: unknown): value is PredictionResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const prediction = value as Record<string, unknown>;

  return (
    typeof prediction.default_probability === "number" &&
    Number.isFinite(prediction.default_probability) &&
    prediction.default_probability >= 0 &&
    prediction.default_probability <= 1 &&
    typeof prediction.threshold === "number" &&
    Number.isFinite(prediction.threshold) &&
    prediction.threshold >= 0 &&
    prediction.threshold <= 1 &&
    (prediction.prediction === 0 || prediction.prediction === 1) &&
    (prediction.decision === "DEFAULT RISK" ||
      prediction.decision === "NO DEFAULT RISK")
  );
}

// -----------------------------------------------------------------------------
// Submission states
// -----------------------------------------------------------------------------

function ProcessingState() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 px-4 backdrop-blur-[3px]"
      role="status"
      aria-live="polite"
      aria-label="Analyzing applicant risk"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-2xl shadow-slate-900/10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600" />
        </div>

        <h2 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
          Assessment in progress
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          CrediSense is analyzing the submitted applicant information. This may
          take a few seconds.
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>

        <p className="mt-3 text-xs font-medium text-slate-400">
          Please keep this page open.
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Invalid response state
// -----------------------------------------------------------------------------

function EmptyResultState({
  onRetry,
  onNewAssessment,
  isSubmitting,
}: {
  onRetry: () => void;
  onNewAssessment: () => void;
  isSubmitting: boolean;
}) {
  return (
    <section
      className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      role="status"
    >
      <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50/60 px-6 py-8 text-center sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-600">
          <AlertCircle className="h-6 w-6" />
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
          No assessment result
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The assessment request completed, but the response did not contain a
          valid prediction. You can retry using the submitted information.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>

          <button
            type="button"
            onClick={onNewAssessment}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700"
          >
            Start new assessment
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-3 text-center">
        <p className="text-xs text-slate-400">
          Your submitted information has not been changed.
        </p>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Request error state
// -----------------------------------------------------------------------------

function SubmissionError({
  message,
  onRetry,
  onDismiss,
  isSubmitting,
}: {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div
      role="alert"
      className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm"
    >
      <div className="flex items-start gap-3 bg-red-50/70 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <AlertCircle className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-red-800">
            Assessment could not be completed
          </h2>

          <p className="mt-1 text-sm leading-5 text-red-700/80">{message}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-red-100 px-5 py-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          disabled={isSubmitting}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try again
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Back to review
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<PredictionResponse | null>(null);

  const [lastSubmittedValues, setLastSubmittedValues] =
    useState<ApplicantRequest | null>(null);

  const [showEmptyState, setShowEmptyState] = useState(false);

  // ---------------------------------------------------------------------------
  // Submit assessment
  // ---------------------------------------------------------------------------

  async function handleSubmit(values: ApplicantRequest) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setShowEmptyState(false);
    setLastSubmittedValues(values);

    try {
      const prediction = await predictApplicant(values);

      if (!isValidPrediction(prediction)) {
        setShowEmptyState(true);
        return;
      }

      setResult(prediction);
    } catch (err) {
      console.error("Prediction failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete the assessment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Retry assessment
  // ---------------------------------------------------------------------------

  async function handleRetry() {
    if (!lastSubmittedValues || isSubmitting) {
      return;
    }

    await handleSubmit(lastSubmittedValues);
  }

  // ---------------------------------------------------------------------------
  // Start a new assessment
  // ---------------------------------------------------------------------------

  function handleNewAssessment() {
    setResult(null);
    setError(null);
    setShowEmptyState(false);
    setLastSubmittedValues(null);
    setCurrentStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ---------------------------------------------------------------------------
  // Result page
  // ---------------------------------------------------------------------------

  if (result) {
    return (
      <AssessmentResult result={result} onNewAssessment={handleNewAssessment} />
    );
  }

  // ---------------------------------------------------------------------------
  // Assessment form
  // ---------------------------------------------------------------------------

  return (
    <AssessmentShell currentStep={currentStep} steps={assessmentSteps}>
      {/* Assessment introduction */}
      {!showEmptyState && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-cyan-50/50 px-4 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Applicant risk assessment
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Complete the four sections below to generate a model-based credit
              risk estimate. Review the information before submitting.
            </p>
          </div>
        </div>
      )}

      {/* Invalid response */}
      {showEmptyState ? (
        <EmptyResultState
          onRetry={handleRetry}
          onNewAssessment={handleNewAssessment}
          isSubmitting={isSubmitting}
        />
      ) : (
        <>
          {/* Request error */}
          {error && (
            <SubmissionError
              message={error}
              onRetry={handleRetry}
              onDismiss={() => setError(null)}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Applicant form */}
          <ApplicantForm
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onNext={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      {/* Processing overlay */}
      {isSubmitting && <ProcessingState />}
    </AssessmentShell>
  );
}
