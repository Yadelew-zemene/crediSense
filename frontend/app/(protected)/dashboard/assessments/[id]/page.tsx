"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Home,
  Info,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import {
  getAssessment,
  type AssessmentDetail,
} from "@/lib/api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
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

function LoadingState() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-9 w-72 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-100" />

          <div className="mt-8 h-64 rounded-2xl border border-slate-200 bg-white" />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
            <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Info className="h-5 w-5" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-slate-950">
            Unable to load assessment
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {message}
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

function DetailSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

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
        <div key={item.label}>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {item.label}
          </dt>

          <dd className="mt-1.5 text-sm font-medium text-slate-900">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const isRisk = decision === "DEFAULT RISK";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
        isRisk
          ? "bg-red-50 text-red-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isRisk ? "bg-red-500" : "bg-emerald-500"
        }`}
      />
      {decision}
    </span>
  );
}

function ProbabilityBar({
  probability,
  threshold,
}: {
  probability: number;
  threshold: number;
}) {
  const probabilityPercent = Math.min(
    Math.max(probability * 100, 0),
    100,
  );

  const thresholdPercent = Math.min(
    Math.max(threshold * 100, 0),
    100,
  );

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>0%</span>
        <span>100%</span>
      </div>

      <div className="relative mt-2 h-3 rounded-full bg-slate-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-slate-800"
          style={{ width: `${probabilityPercent}%` }}
        />

        <div
          className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 bg-blue-600"
          style={{ left: `${thresholdPercent}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-800" />
          Estimated probability
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-0.5 bg-blue-600" />
          Decision threshold
        </span>
      </div>
    </div>
  );
}

export default function AssessmentDetailPage() {
  const params = useParams<{ id: string }>();
  const assessmentId = params.id;

  const [assessment, setAssessment] =
    useState<AssessmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      return;
    }

    async function loadAssessment() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAssessment(assessmentId);

        setAssessment(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load assessment.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssessment();
  }, [assessmentId]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !assessment) {
    return (
      <ErrorState
        message={error ?? "Assessment not found."}
      />
    );
  }

  const isRisk = assessment.decision === "DEFAULT RISK";

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <header>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Credit Risk Assessment
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Assessment Detail
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(assessment.created_at)}
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                <span>
                  Model {assessment.model_version}
                </span>
              </div>
            </div>

            <Link
              href="/assessment"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              New Assessment
            </Link>
          </div>
        </header>

        {/* Outcome */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <ShieldCheck className="h-4 w-4" />
                  Assessment outcome
                </div>

                <div className="mt-4">
                  <DecisionBadge decision={assessment.decision} />
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                  {isRisk
                    ? "The estimated probability of default is at or above the configured decision threshold."
                    : "The estimated probability of default is below the configured decision threshold."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-5 lg:min-w-[380px] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Default probability
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    {formatPercentage(
                      assessment.default_probability,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Decision threshold
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    {formatPercentage(
                      assessment.decision_threshold,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <ProbabilityBar
              probability={assessment.default_probability}
              threshold={assessment.decision_threshold}
            />
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

              <p className="text-xs leading-5 text-slate-500">
                This result is model-generated decision support. It
                should be considered alongside institutional lending
                policies, applicant information, and appropriate human
                review.
              </p>
            </div>
          </div>
        </section>

        {/* Applicant information */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
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
                  value:
                    assessment.gender === "M"
                      ? "Male"
                      : assessment.gender === "F"
                        ? "Female"
                        : assessment.gender,
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
                  value: formatValue(
                    assessment.occupation_type,
                  ),
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
                  value: formatNumber(
                    assessment.family_members,
                  ),
                },
                {
                  label: "Children",
                  value: formatNumber(
                    assessment.children_count,
                  ),
                },
                {
                  label: "Owns car",
                  value:
                    assessment.owns_car === "Y"
                      ? "Yes"
                      : assessment.owns_car === "N"
                        ? "No"
                        : assessment.owns_car,
                },
                {
                  label: "Owns realty",
                  value:
                    assessment.owns_realty === "Y"
                      ? "Yes"
                      : assessment.owns_realty === "N"
                        ? "No"
                        : assessment.owns_realty,
                },
              ]}
            />
          </DetailSection>
        </div>

        {/* Financial profile */}
        <div className="mt-6">
          <DetailSection
            title="Financial profile"
            description="Financial values submitted as part of the assessment."
            icon={WalletCards}
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Annual income
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {formatMoney(assessment.annual_income)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Credit amount
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {formatMoney(assessment.credit_amount)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Annuity amount
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {formatMoney(assessment.annuity_amount)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Goods price
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {formatMoney(assessment.goods_price)}
                </p>
              </div>
            </div>
          </DetailSection>
        </div>

        {/* Employment & history */}
        <div className="mt-6">
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
                  value: formatYears(
                    assessment.employment_years,
                  ),
                },
                {
                  label: "Registration history",
                  value: formatYears(
                    assessment.registration_years,
                  ),
                },
                {
                  label: "ID published",
                  value: formatYears(
                    assessment.id_published_years,
                  ),
                },
                {
                  label: "Car age",
                  value: formatYears(assessment.car_age),
                },
              ]}
            />
          </DetailSection>
        </div>

        {/* Additional signals */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
                    assessment.region_population_relative ===
                    null
                      ? "Not provided"
                      : formatNumber(
                          assessment.region_population_relative,
                        ),
                },
                {
                  label: "Region rating",
                  value: formatValue(
                    assessment.region_rating,
                  ),
                },
                {
                  label: "City rating",
                  value: formatValue(
                    assessment.region_rating_city,
                  ),
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
                      : formatPercentage(
                          assessment.external_source_1,
                        ),
                },
                {
                  label: "External source 2",
                  value:
                    assessment.external_source_2 === null
                      ? "Not provided"
                      : formatPercentage(
                          assessment.external_source_2,
                        ),
                },
                {
                  label: "External source 3",
                  value:
                    assessment.external_source_3 === null
                      ? "Not provided"
                      : formatPercentage(
                          assessment.external_source_3,
                        ),
                },
              ]}
            />
          </DetailSection>
        </div>

        {/* Model information */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <FileText className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Model information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Metadata recorded with this assessment.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">
                  Model version
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {assessment.model_version}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Prediction
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {assessment.prediction}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <Link
            href="/assessment"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <CheckCircle2 className="h-4 w-4" />
            Start new assessment
          </Link>
        </div>
      </section>
    </main>
  );
}