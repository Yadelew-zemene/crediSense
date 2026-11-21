import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const workflow = [
  {
    number: "01",
    title: "Applicant information",
    description: "Enter the applicant's financial details.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Risk analysis",
    description: "Machine learning evaluates default risk.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Assessment results",
    description: "Review the predicted risk and probability.",
    icon: CheckCircle2,
  },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[120px]" />

        <div className="absolute -right-40 top-40 size-[400px] rounded-full bg-cyan-100/40 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(#93c5fd 0.8px, transparent 0.8px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Hero content */}
          <div className="max-w-2xl">
            {/* Label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-2 shadow-sm shadow-blue-900/[0.03]">
              <ShieldCheck size={15} className="text-blue-600" />
              <span className="text-xs font-semibold tracking-wide text-blue-700">
                AI-powered credit intelligence
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[60px]">
              Understand credit risk.
              <span className="mt-1 block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Make informed decisions.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Assess loan applicants with machine-learning-powered risk
              predictions. Turn financial information into clear insights that
              support more informed lending decisions.
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25"
              >
                Get started
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700"
              >
                Explore how it works
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Supporting message */}
            <div className="mt-7 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
              <span>
                Designed to support—not replace—human lending decisions.
              </span>
            </div>
          </div>

          {/* Product workflow preview */}
          <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute inset-10 rounded-full bg-blue-200/50 blur-[80px]"
            />

            <div className="relative rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-blue-950/[0.07] backdrop-blur-xl sm:p-8">
              {/* Preview header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BrainCircuit size={21} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Credit assessment
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      A simple assessment workflow
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
                  CrediSense
                </span>
              </div>

              {/* Workflow */}
              <div className="relative mt-7 space-y-7">
                {/* Connecting line */}
                <div
                  aria-hidden="true"
                  className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-cyan-200"
                />

                {workflow.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.number}
                      className="relative flex items-start gap-4"
                    >
                      <div
                        className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                          index === 0
                            ? "border-blue-200 bg-blue-50 text-blue-600"
                            : "border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold tracking-wider text-blue-600">
                            STEP {step.number}
                          </span>
                        </div>

                        <h3 className="mt-1 text-sm font-semibold text-slate-900">
                          {step.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {step.description}
                        </p>
                      </div>

                      {index === 0 && (
                        <span className="mt-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                          Start here
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Preview footer */}
              <div className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/90 to-cyan-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <SlidersHorizontal size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Clear, structured risk insights
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Review prediction results and supporting assessment
                      information in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small decorative element */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-3 -z-10 size-32 rounded-full bg-cyan-200/40 blur-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
