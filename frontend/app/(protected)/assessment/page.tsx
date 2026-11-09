"use client";

import { useState } from "react";

import {
  AssessmentShell,
  type AssessmentStep,
} from "@/components/assessment/assessment-shell";

import { ApplicantForm } from "@/components/assessment/applicant-form";

import { AssessmentResult } from "@/components/assessment/results/assessment-result";

import type {
  ApplicantRequest,
  PredictionResponse,
} from "@/lib/types";

import { predictApplicant } from "@/lib/api";

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

function isValidPrediction(
  value: unknown,
): value is PredictionResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const prediction = value as Record<string, unknown>;

  return (
    typeof prediction.default_probability === "number" &&
    typeof prediction.threshold === "number" &&
    (prediction.prediction === 0 || prediction.prediction === 1) &&
    (prediction.decision === "DEFAULT RISK" ||
      prediction.decision === "NO DEFAULT RISK")
  );
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [lastSubmittedValues, setLastSubmittedValues] =
    useState<ApplicantRequest | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);

  async function handleSubmit(values: ApplicantRequest) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setShowEmptyState(false);
    setLastSubmittedValues(values);

    try {
      const prediction = await predictApplicant(values);

      if (!isValidPrediction(prediction)) {
        setShowEmptyState(true);
        return;
      }

      setResult(prediction);
    } catch (error) {
      console.error("Prediction failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete the assessment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRetry() {
    if (!lastSubmittedValues || isSubmitting) {
      return;
    }

    await handleSubmit(lastSubmittedValues);
  }

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

  if (result) {
    return (
      <AssessmentResult
        result={result}
        onNewAssessment={handleNewAssessment}
      />
    );
  }

  return (
    <AssessmentShell
      currentStep={currentStep}
      steps={assessmentSteps}
    >
      {showEmptyState ? (
        <section
          className="mx-auto max-w-xl rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-xs sm:px-8"
          role="status"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl font-semibold text-primary">?</span>
          </div>

          <h1 className="mt-5 text-lg font-bold text-primary-dark">
            No assessment result
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            The assessment request completed, but no valid prediction was
            returned. Please try the assessment again.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRetry}
              disabled={isSubmitting || !lastSubmittedValues}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Try again
            </button>

            <button
              type="button"
              onClick={handleNewAssessment}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-surface-muted"
            >
              Start new assessment
            </button>
          </div>
        </section>
      ) : (
        <>
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-4 text-sm text-danger"
            >
              <p className="font-semibold">
                Assessment couldn't be completed
              </p>

              <p className="mt-1 leading-5">
                {error}
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isSubmitting || !lastSubmittedValues}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-danger px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Try again
                </button>

                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-danger/20 bg-surface px-4 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/5"
                >
                  Back to review
                </button>
              </div>
            </div>
          )}

          <ApplicantForm
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onNext={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      {isSubmitting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/20 px-5 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Analyzing applicant risk"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface px-6 py-7 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            </div>

            <p className="mt-4 text-sm font-semibold text-primary-dark">
              Assessment in progress
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              CrediSense is analyzing the submitted applicant information.
              This may take a few seconds.
            </p>
          </div>
        </div>
      )}
    </AssessmentShell>
  );
}