"use client";

import { ShieldCheck, Sparkles } from "lucide-react";

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
    <div className="relative min-h-full overflow-hidden bg-[#F7FAFF]">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[450px] rounded-full bg-blue-100/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 size-[400px] rounded-full bg-cyan-100/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        {/* =====================================================
            Page Introduction
        ===================================================== */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                <ShieldCheck size={14} />
                Credit Intelligence
                <span className="size-1 rounded-full bg-blue-400" />
                Assessment Workspace
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                Assess applicant risk.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Enter applicant information to generate a machine-learning
                credit risk prediction and support informed lending decisions.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 shadow-sm sm:flex">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Sparkles size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-800">
                  AI-powered analysis
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Decision support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Progress Navigation
        ===================================================== */}
        {showProgress && (
          <section className="mb-8 rounded-2xl border border-blue-100/80 bg-white/90 p-4 shadow-sm shadow-blue-950/[0.03] backdrop-blur-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Assessment progress
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Complete each step to generate your assessment.
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                Step {currentStep} of {steps.length}
              </span>
            </div>

            <ProgressIndicator currentStep={currentStep} steps={steps} />
          </section>
        )}

        {/* =====================================================
            Current Step
        ===================================================== */}
        {currentStepData && (
          <section className="mb-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-md shadow-blue-600/15">
                {String(currentStepData.id).padStart(2, "0")}
              </div>

              <div className="min-w-0 pt-0.5">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {currentStepData.title}
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            Assessment Form
        ===================================================== */}
        <section>{children}</section>

        {/* =====================================================
            Footer Notice
        ===================================================== */}
        <div className="mt-8 flex items-start gap-2.5 border-t border-blue-100/70 pt-5">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-blue-500" />

          <p className="text-xs leading-5 text-slate-400">
            Applicant information is processed to generate a model-based credit
            risk prediction. Predictions are decision-support estimates and
            should be reviewed using human judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
