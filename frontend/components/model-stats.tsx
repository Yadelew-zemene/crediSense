import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Database,
  Gauge,
  ShieldCheck,
} from "lucide-react";

const metrics = [
  {
    value: "0.7700",
    label: "ROC-AUC",
    description:
      "Ability to distinguish between default and non-default cases.",
    icon: Gauge,
  },
  {
    value: "0.2564",
    label: "PR-AUC",
    description: "Precision-recall performance on an imbalanced dataset.",
    icon: BarChart3,
  },
];

const highlights = [
  {
    value: "307K+",
    label: "Applications",
    description: "Records in the original training dataset.",
    icon: Database,
  },
  {
    value: "252",
    label: "Processed features",
    description: "Variables prepared for model training.",
    icon: BrainCircuit,
  },
  {
    value: "0.65",
    label: "Decision threshold",
    description: "Selected using validation data.",
    icon: ShieldCheck,
  },
];

export function ModelStats() {
  return (
    <section
      id="model"
      className="relative scroll-mt-24 overflow-hidden border-y border-blue-100 bg-gradient-to-b from-white via-blue-50/40 to-white"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 size-96 rounded-full bg-blue-200/20 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <BrainCircuit size={14} />
            THE TECHNOLOGY BEHIND CREDISENSE
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Intelligence built on{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              data and evidence.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Behind every assessment is a machine-learning model trained on
            real-world lending data and evaluated using a separate, previously
            unseen test set.
          </p>
        </div>

        {/* Performance metrics */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-950/5 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Test set
                  </span>
                </div>

                <div className="mt-7 flex items-baseline gap-3">
                  <p className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                    {metric.value}
                  </p>

                  <p className="text-sm font-semibold text-blue-700">
                    {metric.label}
                  </p>
                </div>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Model foundation */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-2xl border border-blue-100/80 bg-white/80 p-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon size={19} />
                </div>

                <div>
                  <p className="text-xl font-bold tracking-tight text-slate-950">
                    {item.value}
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-800">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Model description */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                A machine-learning decision-support system
              </p>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                CrediSense uses a tuned XGBoost classifier to estimate applicant
                default risk. Its predictions support human assessment rather
                than replace lending decisions.
              </p>
            </div>
          </div>

          <a
            href="#responsible-ai"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
          >
            Our approach to responsible AI
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Evaluation note */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Evaluation results are from the held-out test set. Model performance
          on future applicants may differ.
        </p>
      </div>
    </section>
  );
}
