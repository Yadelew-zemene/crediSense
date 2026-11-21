import { Eye, Scale, ShieldCheck } from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "Transparent predictions",
    description:
      "View predicted default probability alongside the decision threshold.",
  },
  {
    icon: Scale,
    title: "Human judgment matters",
    description:
      "Use model predictions as supporting information, not automatic lending decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible assessment",
    description:
      "Consider fairness, relevant applicant context, and applicable lending policies.",
  },
];

export function ResponsibleAI() {
  return (
    <section
      id="responsible-ai"
      className="border-y border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-cyan-50/40"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <ShieldCheck size={21} />
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Responsible AI, informed decisions.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Credit risk predictions should be transparent, carefully evaluated,
            and supported by human judgment.
          </p>
        </div>

        {/* Principles */}
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;

            return (
              <article
                key={principle.title}
                className="rounded-2xl border border-blue-100/80 bg-white/80 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.04]"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {principle.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {principle.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          CrediSense provides decision-support predictions, not guarantees of
          repayment or substitutes for responsible lending decisions.
        </p>
      </div>
    </section>
  );
}
