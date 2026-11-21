import { Check } from "lucide-react";

export interface AssessmentStep {
  id: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: AssessmentStep[];
  currentStep: number;
}

export function ProgressIndicator({
  steps,
  currentStep,
}: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  const progress =
    steps.length > 1
      ? (Math.max(currentIndex, 0) / (steps.length - 1)) * 100
      : 100;

  const currentStepData = steps[currentIndex];

  return (
    <nav aria-label="Assessment progress" className="w-full">
      {/* Desktop and tablet progress */}
      <ol className="hidden sm:flex sm:items-start">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <li
              key={step.id}
              className={`relative flex min-w-0 flex-1 ${
                index === steps.length - 1 ? "flex-none" : ""
              }`}
            >
              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-10 right-0 top-4 h-0.5 bg-slate-100"
                >
                  <div
                    className={`h-full origin-left bg-gradient-to-r from-blue-600 to-cyan-500 transition-transform duration-500 ${
                      isCompleted ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </div>
              )}

              {/* Step content */}
              <div className="relative z-10 flex min-w-0 flex-col items-start">
                <div
                  className={[
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                    isCompleted
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                      : "",
                    isCurrent
                      ? "border-blue-600 bg-white text-blue-700 ring-4 ring-blue-50"
                      : "",
                    isUpcoming
                      ? "border-slate-200 bg-white text-slate-400"
                      : "",
                  ].join(" ")}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check size={15} strokeWidth={2.5} />
                  ) : (
                    step.id
                  )}
                </div>

                <div className="mt-3 max-w-36 pr-3">
                  <p
                    className={`text-xs font-bold leading-5 lg:text-sm ${
                      isCurrent
                        ? "text-blue-700"
                        : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile progress */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-700">
              Step {Math.max(currentIndex + 1, 1)} of {steps.length}
            </p>

            <p className="mt-1 truncate text-sm font-bold text-slate-900">
              {currentStepData?.title ?? "Assessment"}
            </p>
          </div>

          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
            {Math.round(((Math.max(currentIndex, 0) + 1) / steps.length) * 100)}
            %
          </span>
        </div>

        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={Math.max(currentIndex + 1, 1)}
          aria-label="Assessment progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
            style={{
              width: `${((Math.max(currentIndex, 0) + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
