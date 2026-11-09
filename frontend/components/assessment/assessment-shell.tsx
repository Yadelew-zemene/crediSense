"use client";

import { ProgressIndicator } from "./progress-indicator";

export interface AssessmentStep {
  id: number;
  title: string;
  description: string;
}

interface AssessmentShellProps {
  currentStep: number;
  steps: AssessmentStep[];
  children: React.ReactNode;
  showProgress?: boolean;
}

export function AssessmentShell({
  currentStep,
  steps,
  children,
  showProgress = true,
}: AssessmentShellProps) {
  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Assessment heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Credit risk assessment
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Assess applicant risk
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Enter the applicant information below to generate an AI-powered
            credit risk assessment.
          </p>
        </div>

        {/* Progress indicator */}
        {showProgress && (
          <div className="mb-8">
            <ProgressIndicator currentStep={currentStep} steps={steps} />
          </div>
        )}

        {/* Current step information */}
        {currentStepData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary-dark">
              {currentStepData.title}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {currentStepData.description}
            </p>
          </div>
        )}

        {/* Assessment form */}
        {children}
      </div>
    </div>
  );
}
