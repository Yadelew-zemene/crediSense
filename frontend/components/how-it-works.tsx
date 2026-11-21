import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Gauge,
  UserRound,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserRound,
    title: "Enter applicant details",
    description:
      "Provide the applicant's personal, employment, financial, and loan information through a structured form.",
    color: "blue",
  },
  {
    number: "02",
    icon: FileText,
    title: "Process the information",
    description:
      "CrediSense prepares the submitted information and transforms it into the format required by the prediction model.",
    color: "indigo",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Analyze credit risk",
    description:
      "The trained machine-learning model evaluates the applicant profile and estimates the likelihood of default.",
    color: "cyan",
  },
  {
    number: "04",
    icon: Gauge,
    title: "Review the results",
    description:
      "See the predicted default probability and corresponding risk classification to support your assessment.",
    color: "emerald",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate scroll-mt-24 overflow-hidden border-y border-blue-100/80 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-40 top-20 size-96 rounded-full bg-blue-200/30 blur-[120px]" />

        <div className="absolute -right-40 bottom-0 size-96 rounded-full bg-cyan-200/30 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(#60a5fa 0.8px, transparent 0.8px)",
            backgroundSize: "26px 26px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-sm">
            <BrainCircuit size={15} />
            Simple assessment process
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            From applicant information
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              to actionable insights.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            A straightforward process that transforms applicant data into
            machine-learning-powered credit risk predictions.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 lg:block"
          />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative rounded-2xl border border-blue-100/80 bg-white/85 p-6 shadow-sm shadow-blue-950/[0.025] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/[0.06]"
              >
                {/* Number and icon */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.16em] text-blue-600/70">
                    STEP {step.number}
                  </span>

                  <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 transition-all duration-300 group-hover:border-blue-200 group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:text-white">
                    <Icon size={21} strokeWidth={1.9} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-7 text-base font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 h-1 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:w-16" />
              </article>
            );
          })}
        </div>

        {/* Bottom summary */}
        <div className="mt-9 flex flex-col items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white/70 px-6 py-5 shadow-sm shadow-blue-900/[0.02] sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                A clear assessment, all in one place.
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Review predictions and use them as supporting information.
              </p>
            </div>
          </div>

          <ArrowRight size={20} className="hidden text-blue-500 sm:block" />
        </div>
      </div>
    </section>
  );
}
