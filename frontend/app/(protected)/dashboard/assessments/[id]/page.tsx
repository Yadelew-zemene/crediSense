"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import { getAssessment, type AssessmentDetail } from "@/lib/api";

// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatPercentage(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMoney(value: number | null) {
  if (value === null) {
    return "Not provided";
  }

  return formatNumber(value);
}

function formatYears(value: number | null) {
  if (value === null) {
    return "Not provided";
  }

  return `${value.toFixed(1)} years`;
}

function formatValue(value: string | number | null) {
  if (value === null || value === "") {
    return "Not provided";
  }

  return String(value);
}

function formatOwnership(value: string) {
  if (value === "Y") return "Yes";
  if (value === "N") return "No";

  return value;
}

function formatGender(value: string) {
  if (value === "M") return "Male";
  if (value === "F") return "Female";

  return value;
}

// -----------------------------------------------------------------------------
// Shared styles
// -----------------------------------------------------------------------------

const cardClass =
  "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]";

const primaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

// -----------------------------------------------------------------------------
// Loading state
// -----------------------------------------------------------------------------

function LoadingState() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse space-y-7 px-4 py-7 sm:px-6 lg:px-8">
      <div>
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="mt-5 h-9 w-64 rounded-lg bg-slate-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-100" />
      </div>

      <div className="h-64 rounded-2xl border border-slate-200 bg-white" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl border border-slate-200 bg-white" />
        <div className="h-64 rounded-2xl border border-slate-200 bg-white" />
      </div>

      <div className="h-48 rounded-2xl border border-slate-200 bg-white" />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Error state
// -----------------------------------------------------------------------------

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Info className="h-6 w-6" />
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
          Unable to load assessment
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {message}
        </p>

        <Link href="/dashboard" className={`${primaryButtonClass} mt-7`}>
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Section components
// -----------------------------------------------------------------------------

function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/40 px-5 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-slate-950">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className={cardClass}>
      <SectionHeader title={title} description={description} icon={icon} />

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function DetailGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
  }>;
}) {
  return (
    <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {item.label}
          </dt>

          <dd className="mt-1.5 break-words text-sm font-medium text-slate-800">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// -----------------------------------------------------------------------------
// Assessment outcome
// -----------------------------------------------------------------------------

function DecisionBadge({ decision }: { decision: string }) {
  const isRisk = decision === "DEFAULT RISK";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold ${
        isRisk
          ? "border-red-100 bg-red-50 text-red-700"
          : "border-emerald-100 bg-emerald-50 text-emerald-700"
      }`}
    >
      {isRisk ? (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}

      {decision}
    </span>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {value}
      </p>

      <p className="mt-1.5 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function ProbabilityBar({
  probability,
  threshold,
}: {
  probability: number;
  threshold: number;
}) {
  const probabilityPercent = Math.min(Math.max(probability * 100, 0), 100);

  const thresholdPercent = Math.min(Math.max(threshold * 100, 0), 100);

  return (
    <div className="mt-7 border-t border-slate-100 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Probability comparison
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Estimated default probability against the configured threshold.
          </p>
        </div>

        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          Threshold: {formatPercentage(threshold)}
        </span>
      </div>

      <div
        className="mt-5"
        role="img"
        aria-label={`Estimated default probability ${formatPercentage(probability)}. Decision threshold ${formatPercentage(threshold)}.`}
      >
        <div className="relative h-3 rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
            style={{ width: `${probabilityPercent}%` }}
          />

          <div
            className="absolute top-1/2 z-10 h-5 w-1 -translate-y-1/2 rounded-full bg-slate-800 ring-2 ring-white"
            style={{
              left: `${thresholdPercent}%`,
              transform: `translate(-50%, -50%)`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-blue-500 to-cyan-500" />
          Estimated probability
        </span>

        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <span className="h-3 w-1 rounded-full bg-slate-800" />
          Decision threshold
        </span>
      </div>
    </div>
  );
}

function OutcomeSection({ assessment }: { assessment: AssessmentDetail }) {
  const isRisk = assessment.decision === "DEFAULT RISK";

  return (
    <section className={cardClass}>
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/50 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">
          <ShieldCheck className="h-4 w-4" />
          Assessment outcome
        </div>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <DecisionBadge decision={assessment.decision} />

            <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              {isRisk
                ? "Default risk identified"
                : "Below the configured risk threshold"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isRisk
                ? "The estimated probability of default is at or above the configured decision threshold."
                : "The estimated probability of default is below the configured decision threshold."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[380px]">
            <MetricCard
              label="Default probability"
              value={formatPercentage(assessment.default_probability)}
              description="Model-estimated probability"
            />

            <MetricCard
              label="Decision threshold"
              value={formatPercentage(assessment.decision_threshold)}
              description="Configured classification threshold"
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-7">
        <ProbabilityBar
          probability={assessment.default_probability}
          threshold={assessment.decision_threshold}
        />
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

          <p className="text-xs leading-5 text-slate-500">
            This result is model-generated decision support, not a final lending
            decision. It should be considered alongside institutional lending
            policies, applicant information, and appropriate human review.
          </p>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Financial profile
// -----------------------------------------------------------------------------

function FinancialMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 transition hover:border-blue-100">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function FinancialSection({ assessment }: { assessment: AssessmentDetail }) {
  return (
    <DetailSection
      title="Financial profile"
      description="Financial values submitted as part of the assessment."
      icon={WalletCards}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinancialMetric
          label="Annual income"
          value={formatMoney(assessment.annual_income)}
        />

        <FinancialMetric
          label="Credit amount"
          value={formatMoney(assessment.credit_amount)}
        />

        <FinancialMetric
          label="Annuity amount"
          value={formatMoney(assessment.annuity_amount)}
        />

        <FinancialMetric
          label="Goods price"
          value={formatMoney(assessment.goods_price)}
        />
      </div>
    </DetailSection>
  );
}

// -----------------------------------------------------------------------------
// Model information
// -----------------------------------------------------------------------------

function ModelInformation({ assessment }: { assessment: AssessmentDetail }) {
  return (
    <section className={cardClass}>
      <SectionHeader
        title="Model information"
        description="Technical metadata recorded with this assessment."
        icon={FileText}
      />

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Model version
          </p>

          <p className="mt-2 break-words text-sm font-semibold text-slate-900">
            {assessment.model_version}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Prediction output
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {assessment.prediction}
          </p>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Main page
// -----------------------------------------------------------------------------

export default function AssessmentDetailPage() {
  const params = useParams<{ id: string }>();
  const assessmentId = params.id;

  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      setLoading(false);
      setError("Assessment ID is missing.");
      return;
    }

    let cancelled = false;

    async function loadAssessment() {
      try {
        setLoading(true);
        setError(null);
        setAssessment(null);

        const data = await getAssessment(assessmentId);

        if (!cancelled) {
          setAssessment(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load assessment.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAssessment();

    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !assessment) {
    return <ErrorState message={error ?? "Assessment not found."} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-7 sm:px-6 lg:px-8">
      {/* Page header */}
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              Credit Risk Assessment
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Assessment Details
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                {formatDate(assessment.created_at)}
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-400" />
                Model {assessment.model_version}
              </span>
            </div>
          </div>

          <Link href="/assessment" className={primaryButtonClass}>
            New assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Assessment outcome */}
      <OutcomeSection assessment={assessment} />

      {/* Applicant and household information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DetailSection
          title="Applicant information"
          description="Personal and application characteristics recorded for this assessment."
          icon={UserRound}
        >
          <DetailGrid
            items={[
              {
                label: "Contract type",
                value: assessment.contract_type,
              },
              {
                label: "Gender",
                value: formatGender(assessment.gender),
              },
              {
                label: "Education",
                value: assessment.education_type,
              },
              {
                label: "Income type",
                value: assessment.income_type,
              },
              {
                label: "Occupation",
                value: formatValue(assessment.occupation_type),
              },
              {
                label: "Housing type",
                value: assessment.housing_type,
              },
            ]}
          />
        </DetailSection>

        <DetailSection
          title="Household & ownership"
          description="Household composition and ownership indicators."
          icon={Users}
        >
          <DetailGrid
            items={[
              {
                label: "Family status",
                value: assessment.family_status,
              },
              {
                label: "Family members",
                value: formatNumber(assessment.family_members),
              },
              {
                label: "Children",
                value: formatNumber(assessment.children_count),
              },
              {
                label: "Owns car",
                value: formatOwnership(assessment.owns_car),
              },
              {
                label: "Owns realty",
                value: formatOwnership(assessment.owns_realty),
              },
            ]}
          />
        </DetailSection>
      </div>

      {/* Financial profile */}
      <FinancialSection assessment={assessment} />

      {/* Employment history */}
      <DetailSection
        title="Employment & history"
        description="Time-based applicant information used in the assessment."
        icon={Clock3}
      >
        <DetailGrid
          items={[
            {
              label: "Age",
              value: formatYears(assessment.age_years),
            },
            {
              label: "Employment",
              value: formatYears(assessment.employment_years),
            },
            {
              label: "Registration history",
              value: formatYears(assessment.registration_years),
            },
            {
              label: "ID published",
              value: formatYears(assessment.id_published_years),
            },
            {
              label: "Car age",
              value: formatYears(assessment.car_age),
            },
          ]}
        />
      </DetailSection>

      {/* Regional and external information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DetailSection
          title="Regional information"
          description="Regional indicators recorded for the assessment."
          icon={MapPin}
        >
          <DetailGrid
            items={[
              {
                label: "Population relative",
                value:
                  assessment.region_population_relative === null
                    ? "Not provided"
                    : formatNumber(assessment.region_population_relative),
              },
              {
                label: "Region rating",
                value: formatValue(assessment.region_rating),
              },
              {
                label: "City rating",
                value: formatValue(assessment.region_rating_city),
              },
            ]}
          />
        </DetailSection>

        <DetailSection
          title="External model signals"
          description="External source values stored with the assessment."
          icon={Building2}
        >
          <DetailGrid
            items={[
              {
                label: "External source 1",
                value:
                  assessment.external_source_1 === null
                    ? "Not provided"
                    : formatPercentage(assessment.external_source_1),
              },
              {
                label: "External source 2",
                value:
                  assessment.external_source_2 === null
                    ? "Not provided"
                    : formatPercentage(assessment.external_source_2),
              },
              {
                label: "External source 3",
                value:
                  assessment.external_source_3 === null
                    ? "Not provided"
                    : formatPercentage(assessment.external_source_3),
              },
            ]}
          />
        </DetailSection>
      </div>

      {/* Model metadata */}
      <ModelInformation assessment={assessment} />

      {/* Footer actions */}
      <footer className="flex flex-col gap-3 border-t border-slate-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard" className={secondaryButtonClass}>
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <Link href="/assessment" className={primaryButtonClass}>
          <CheckCircle2 className="h-4 w-4" />
          Start new assessment
        </Link>
      </footer>
    </div>
  );
}
