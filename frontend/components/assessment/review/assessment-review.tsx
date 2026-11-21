"use client";

import {
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  Home,
  Loader2,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import type { ApplicantRequest } from "@/lib/types";

interface AssessmentReviewProps {
  values: ApplicantRequest;
  onEditStep: (step: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

interface ReviewSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({
  title,
  description,
  icon: Icon,
  onEdit,
  children,
}: ReviewSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 via-white to-cyan-50/30 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
            <Icon size={20} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
              {title}
            </h3>
            <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-label={`Edit ${title}`}
        >
          <Pencil size={13} />
          Edit
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
          {children}
        </dl>
      </div>
    </section>
  );
}

interface ReviewFieldProps {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function ReviewField({ label, value, highlight = false }: ReviewFieldProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3 transition-colors hover:border-blue-100 hover:bg-blue-50/30">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>

      <dd
        className={`mt-1.5 break-words text-sm ${
          highlight
            ? "font-bold text-slate-950"
            : "font-semibold text-slate-800"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(value: number) {
  return value === 1 ? "1 year" : `${formatNumber(value)} years`;
}

function formatNotProvided() {
  return (
    <span className="font-normal italic text-slate-400">Not provided</span>
  );
}

function formatNullableNumber(value: number | null) {
  return value === null ? formatNotProvided() : formatNumber(value);
}

function formatYesNoBadge(value: "Y" | "N") {
  const isYes = value === "Y";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
        isYes
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-500/10"
      }`}
    >
      {isYes ? <Check size={12} /> : <X size={12} />}
      {isYes ? "Yes" : "No"}
    </span>
  );
}

function formatContractType(value: ApplicantRequest["contract_type"]) {
  return value === "Cash loans" ? "Cash loan" : "Revolving loan";
}

function formatExternalScore(value: number | null) {
  if (value === null) {
    return formatNotProvided();
  }

  return (
    <span className="font-mono text-sm font-semibold tracking-tight text-slate-900">
      {value.toFixed(3)}
    </span>
  );
}

export function AssessmentReview({
  values,
  onEditStep,
  onBack,
  onConfirm,
  isSubmitting = false,
}: AssessmentReviewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Review introduction */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50/70 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
            <FileCheck2 size={21} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Review applicant information
              </h3>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                <Check size={11} />
                Final review
              </span>
            </div>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
              Verify the information before submitting it for credit risk
              evaluation. You can edit any section if something needs to be
              corrected.
            </p>
          </div>
        </div>
      </div>

      {/* Applicant information */}
      <div className="space-y-5">
        <ReviewSection
          title="Applicant Details"
          description="Personal, household, and demographic information"
          icon={UserRound}
          onEdit={() => onEditStep(1)}
        >
          <ReviewField
            label="Contract type"
            value={formatContractType(values.contract_type)}
          />

          <ReviewField
            label="Gender"
            value={values.gender === "M" ? "Male" : "Female"}
          />

          <ReviewField label="Age" value={formatYears(values.age_years)} />

          <ReviewField
            label="Children count"
            value={formatNumber(values.children_count, 0)}
          />

          <ReviewField
            label="Family members"
            value={formatNumber(values.family_members)}
          />

          <ReviewField label="Family status" value={values.family_status} />

          <ReviewField label="Education type" value={values.education_type} />

          <ReviewField label="Income type" value={values.income_type} />

          <ReviewField
            label="Occupation"
            value={values.occupation_type ?? formatNotProvided()}
          />

          <ReviewField label="Housing type" value={values.housing_type} />

          <ReviewField
            label="Owns a car"
            value={formatYesNoBadge(values.owns_car)}
          />

          <ReviewField
            label="Owns realty"
            value={formatYesNoBadge(values.owns_realty)}
          />
        </ReviewSection>

        {/* Financial information */}
        <ReviewSection
          title="Financial Profile"
          description="Income, credit amount, and requested financing"
          icon={CircleDollarSign}
          onEdit={() => onEditStep(2)}
        >
          <ReviewField
            label="Annual income"
            value={formatCurrency(values.annual_income)}
            highlight
          />

          <ReviewField
            label="Credit amount"
            value={formatCurrency(values.credit_amount)}
            highlight
          />

          <ReviewField
            label="Annuity amount"
            value={formatCurrency(values.annuity_amount)}
          />

          <ReviewField
            label="Goods price"
            value={
              values.goods_price === null
                ? formatNotProvided()
                : formatCurrency(values.goods_price)
            }
          />
        </ReviewSection>

        {/* Employment and history */}
        <ReviewSection
          title="Employment & History"
          description="Employment experience and official record duration"
          icon={BriefcaseBusiness}
          onEdit={() => onEditStep(3)}
        >
          <ReviewField
            label="Employment duration"
            value={formatYears(values.employment_years)}
          />

          <ReviewField
            label="Registration duration"
            value={formatYears(values.registration_years)}
          />

          <ReviewField
            label="ID published duration"
            value={formatYears(values.id_published_years)}
          />

          <ReviewField
            label="Car age"
            value={
              values.car_age === null
                ? formatNotProvided()
                : formatYears(values.car_age)
            }
          />
        </ReviewSection>

        {/* External signals */}
        <ReviewSection
          title="External Signals & Ratings"
          description="Regional information and external scoring indicators"
          icon={Home}
          onEdit={() => onEditStep(4)}
        >
          <ReviewField
            label="Region population relative"
            value={formatNullableNumber(values.region_population_relative)}
          />

          <ReviewField
            label="Region rating"
            value={formatNullableNumber(values.region_rating)}
          />

          <ReviewField
            label="City rating"
            value={formatNullableNumber(values.region_rating_city)}
          />

          <ReviewField
            label="External source 1"
            value={formatExternalScore(values.external_source_1)}
          />

          <ReviewField
            label="External source 2"
            value={formatExternalScore(values.external_source_2)}
          />

          <ReviewField
            label="External source 3"
            value={formatExternalScore(values.external_source_3)}
          />
        </ReviewSection>
      </div>

      {/* Assessment confirmation */}
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-slate-900/[0.03]">
        <div className="flex items-start gap-3.5 bg-gradient-to-r from-blue-50/70 to-cyan-50/40 p-5 sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-600 shadow-sm">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Ready to run the assessment?
            </h4>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              CrediSense will analyze the submitted applicant information and
              estimate the probability of loan default using its trained machine
              learning model.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-slate-700">Important:</span>{" "}
            This is a model-generated risk estimate, not a definitive lending
            decision. Results should support, not replace, appropriate human
            review.
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back to information
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Evaluating model...
            </>
          ) : (
            <>
              <ShieldCheck size={17} />
              Run assessment
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
