import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: FormSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
      {/* Section heading */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-white to-cyan-50/40 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
              <Icon size={20} strokeWidth={1.9} />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="px-5 py-6 sm:px-7 sm:py-7">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
          {children}
        </div>
      </div>
    </section>
  );
}
