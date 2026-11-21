"use client";

import { useState } from "react";
import { useForm, type FieldPath, type RegisterOptions } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Home,
  Landmark,
  UserRound,
} from "lucide-react";

import { applicantSchema, type ApplicantFormValues } from "@/lib/validation";

import type { ApplicantRequest } from "@/lib/types";

import { FormSection } from "./form-section";
import { AssessmentReview } from "./review/assessment-review";

interface ApplicantFormProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: (values: ApplicantRequest) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

const TOTAL_STEPS = 4;

type FieldOption = {
  label: string;
  value: string | number;
};

type FieldDefinition = {
  name: FieldPath<ApplicantFormValues>;
  label: string;
  type: "text" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  nullable?: boolean;
  options?: FieldOption[];
};

type FormStepDefinition = {
  title: string;
  description: string;
  icon: typeof UserRound;
  fields: FieldDefinition[];
};

const formSteps: FormStepDefinition[] = [
  {
    title: "Applicant profile",
    description:
      "Basic demographic, household, and personal information about the applicant.",
    icon: UserRound,
    fields: [
      {
        name: "contract_type",
        label: "Loan type",
        type: "select",
        required: true,
        options: [
          { label: "Cash loan", value: "Cash loans" },
          { label: "Revolving loan", value: "Revolving loans" },
        ],
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "M" },
          { label: "Female", value: "F" },
        ],
      },
      {
        name: "age_years",
        label: "Age",
        type: "number",
        required: true,
        min: 18,
        max: 100,
        step: 0.1,
        placeholder: "e.g. 35",
      },
      {
        name: "children_count",
        label: "Number of children",
        type: "number",
        required: true,
        min: 0,
        step: 1,
        placeholder: "e.g. 2",
      },
      {
        name: "family_members",
        label: "Family members",
        type: "number",
        required: true,
        min: 1,
        step: 1,
        placeholder: "e.g. 4",
      },
      {
        name: "family_status",
        label: "Family status",
        type: "select",
        required: true,
        options: [
          { label: "Select status", value: "" },
          { label: "Single / not married", value: "Single / not married" },
          { label: "Married", value: "Married" },
          { label: "Civil marriage", value: "Civil marriage" },
          { label: "Widow", value: "Widow" },
          { label: "Separated", value: "Separated" },
          { label: "Unknown", value: "Unknown" },
        ],
      },
      {
        name: "education_type",
        label: "Education",
        type: "select",
        required: true,
        options: [
          { label: "Select education", value: "" },
          { label: "Lower secondary", value: "Lower secondary" },
          {
            label: "Secondary",
            value: "Secondary / secondary special",
          },
          { label: "Incomplete higher", value: "Incomplete higher" },
          { label: "Higher education", value: "Higher education" },
          { label: "Academic degree", value: "Academic degree" },
        ],
      },
      {
        name: "income_type",
        label: "Income type",
        type: "select",
        required: true,
        options: [
          { label: "Select income type", value: "" },
          { label: "Working", value: "Working" },
          { label: "Commercial associate", value: "Commercial associate" },
          { label: "Pensioner", value: "Pensioner" },
          { label: "State servant", value: "State servant" },
          { label: "Student", value: "Student" },
          { label: "Businessman", value: "Businessman" },
          { label: "Maternity leave", value: "Maternity leave" },
          { label: "Unemployed", value: "Unemployed" },
        ],
      },
      {
        name: "occupation_type",
        label: "Occupation",
        type: "text",
        placeholder: "e.g. IT staff",
      },
      {
        name: "housing_type",
        label: "Housing type",
        type: "select",
        required: true,
        options: [
          { label: "Select housing", value: "" },
          { label: "House / apartment", value: "House / apartment" },
          { label: "With parents", value: "With parents" },
          { label: "Municipal apartment", value: "Municipal apartment" },
          { label: "Rented apartment", value: "Rented apartment" },
          { label: "Office apartment", value: "Office apartment" },
          { label: "Co-op apartment", value: "Co-op apartment" },
        ],
      },
      {
        name: "owns_car",
        label: "Owns a car",
        type: "select",
        required: true,
        options: [
          { label: "No", value: "N" },
          { label: "Yes", value: "Y" },
        ],
      },
      {
        name: "owns_realty",
        label: "Owns real estate",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
    ],
  },
  {
    title: "Financial information",
    description:
      "Provide the applicant's income and loan-related financial information.",
    icon: Landmark,
    fields: [
      {
        name: "annual_income",
        label: "Annual income",
        type: "number",
        required: true,
        min: 1,
        step: 0.01,
        placeholder: "e.g. 180000",
      },
      {
        name: "credit_amount",
        label: "Credit amount",
        type: "number",
        required: true,
        min: 1,
        step: 0.01,
        placeholder: "e.g. 500000",
      },
      {
        name: "annuity_amount",
        label: "Annuity amount",
        type: "number",
        required: true,
        min: 1,
        step: 0.01,
        placeholder: "e.g. 25000",
      },
      {
        name: "goods_price",
        label: "Goods price",
        type: "number",
        min: 1,
        step: 0.01,
        nullable: true,
        placeholder: "Optional",
      },
    ],
  },
  {
    title: "Employment & history",
    description: "Provide employment duration and relevant applicant history.",
    icon: BriefcaseBusiness,
    fields: [
      {
        name: "employment_years",
        label: "Employment duration",
        type: "number",
        required: true,
        min: 0,
        step: 0.1,
        placeholder: "Years",
      },
      {
        name: "registration_years",
        label: "Registration duration",
        type: "number",
        required: true,
        min: 0,
        step: 0.1,
        placeholder: "Years",
      },
      {
        name: "id_published_years",
        label: "ID publication duration",
        type: "number",
        required: true,
        min: 0,
        step: 0.1,
        placeholder: "Years",
      },
      {
        name: "car_age",
        label: "Car age",
        type: "number",
        min: 0,
        step: 0.1,
        nullable: true,
        placeholder: "Optional",
      },
    ],
  },
  {
    title: "Additional signals",
    description:
      "Provide optional regional and external model inputs when available.",
    icon: Home,
    fields: [
      {
        name: "region_population_relative",
        label: "Region population relative",
        type: "number",
        min: 0,
        step: 0.000001,
        nullable: true,
        placeholder: "Optional",
      },
      {
        name: "region_rating",
        label: "Region rating",
        type: "select",
        nullable: true,
        options: [
          { label: "Not provided", value: "" },
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
        ],
      },
      {
        name: "region_rating_city",
        label: "Region city rating",
        type: "select",
        nullable: true,
        options: [
          { label: "Not provided", value: "" },
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
        ],
      },
      {
        name: "external_source_1",
        label: "External source 1",
        type: "number",
        min: 0,
        max: 1,
        step: 0.000001,
        nullable: true,
        placeholder: "0 to 1",
      },
      {
        name: "external_source_2",
        label: "External source 2",
        type: "number",
        min: 0,
        max: 1,
        step: 0.000001,
        nullable: true,
        placeholder: "0 to 1",
      },
      {
        name: "external_source_3",
        label: "External source 3",
        type: "number",
        min: 0,
        max: 1,
        step: 0.000001,
        nullable: true,
        placeholder: "0 to 1",
      },
    ],
  },
];

const stepFields: FieldPath<ApplicantFormValues>[][] = [
  formSteps[0].fields.map((field) => field.name),
  formSteps[1].fields.map((field) => field.name),
  formSteps[2].fields.map((field) => field.name),
  formSteps[3].fields.map((field) => field.name),
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600">
      <span aria-hidden="true">•</span>
      {message}
    </p>
  );
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-[13px] font-semibold text-slate-700">
      {label}
      {required && (
        <span className="ml-1 text-red-500" aria-label="required">
          *
        </span>
      )}
      {!required && (
        <span className="ml-2 text-[11px] font-normal text-slate-400">
          Optional
        </span>
      )}
    </label>
  );
}

function InputShell({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={[
        "flex min-h-12 items-center rounded-xl border bg-white transition-all duration-200",
        error
          ? "border-red-300 bg-red-50/30 ring-2 ring-red-100"
          : "border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function getFieldError(
  errors: Record<string, unknown>,
  name: string,
): string | undefined {
  const error = errors[name] as { message?: string } | undefined;

  return error?.message;
}

function getRegisterOptions(
  field: FieldDefinition,
): RegisterOptions<ApplicantFormValues> {
  if (field.type === "number") {
    if (field.nullable) {
      return {
        setValueAs: (value) => (value === "" ? null : Number(value)),
      };
    }

    return {
      valueAsNumber: true,
    };
  }

  if (field.type === "select" && field.nullable) {
    return {
      setValueAs: (value) => (value === "" ? null : Number(value)),
    };
  }

  return {};
}

export function ApplicantForm({
  currentStep,
  onStepChange,
  onNext,
  onBack,
  isSubmitting = false,
}: ApplicantFormProps) {
  const [isReviewing, setIsReviewing] = useState(false);

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    mode: "onTouched",
    shouldFocusError: true,

    defaultValues: {
      contract_type: "Cash loans",
      gender: "M",
      owns_car: "N",
      owns_realty: "Y",

      children_count: 0,
      family_members: 1,

      family_status: "",
      education_type: "",
      income_type: "",
      occupation_type: null,
      housing_type: "",

      annual_income: undefined,
      credit_amount: undefined,
      annuity_amount: undefined,
      goods_price: null,

      age_years: undefined,
      employment_years: 0,
      registration_years: 0,
      id_published_years: 0,
      car_age: null,

      region_population_relative: null,
      region_rating: null,
      region_rating_city: null,

      external_source_1: null,
      external_source_2: null,
      external_source_3: null,
    },
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleNext() {
    const fields = stepFields[currentStep - 1];

    if (!fields || isSubmitting) return;

    const valid = await trigger(fields, {
      shouldFocus: true,
    });

    if (!valid) return;

    if (currentStep < TOTAL_STEPS) {
      onStepChange(currentStep + 1);
      scrollToTop();
      return;
    }

    setIsReviewing(true);
    scrollToTop();
  }

  function handleBack() {
    if (isSubmitting) return;

    if (currentStep > 1) {
      onStepChange(currentStep - 1);
      scrollToTop();
      return;
    }

    onBack?.();
  }

  function handleReviewEdit(step: number) {
    if (isSubmitting) return;

    setIsReviewing(false);
    onStepChange(step);
    scrollToTop();
  }

  function handleReviewBack() {
    if (isSubmitting) return;

    setIsReviewing(false);
    onStepChange(TOTAL_STEPS);
    scrollToTop();
  }

  function handleReviewConfirm() {
    if (isSubmitting) return;

    const values = getValues();
    onNext(values as ApplicantRequest);
  }

  if (isReviewing) {
    return (
      <AssessmentReview
        values={getValues() as ApplicantRequest}
        onEditStep={handleReviewEdit}
        onBack={handleReviewBack}
        onConfirm={handleReviewConfirm}
        isSubmitting={isSubmitting}
      />
    );
  }

  const currentStepData = formSteps[currentStep - 1];

  if (!currentStepData) return null;

  const currentFields = stepFields[currentStep - 1] ?? [];

  const errorCount = Object.keys(errors).filter((key) =>
    currentFields.includes(key as FieldPath<ApplicantFormValues>),
  ).length;

  return (
    <div className="space-y-5">
      {/* Form section */}
      <FormSection
        title={currentStepData.title}
        description={currentStepData.description}
        icon={currentStepData.icon}
      >
        {currentStepData.fields.map((field) => {
          const fieldError = getFieldError(
            errors as Record<string, unknown>,
            field.name,
          );

          const registration = register(field.name, getRegisterOptions(field));

          const inputClassName =
            "w-full bg-transparent px-4 py-3 text-sm font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400";

          return (
            <div key={field.name} className="min-w-0">
              <FieldLabel label={field.label} required={field.required} />

              <InputShell error={!!fieldError}>
                {field.type === "select" ? (
                  <select
                    {...registration}
                    disabled={isSubmitting}
                    className={`${inputClassName} cursor-pointer`}
                  >
                    {field.options?.map((option) => (
                      <option
                        key={`${field.name}-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...registration}
                    type={field.type}
                    disabled={isSubmitting}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={field.placeholder}
                    className={inputClassName}
                  />
                )}
              </InputShell>

              <FieldError message={fieldError} />
            </div>
          );
        })}
      </FormSection>

      {/* Validation summary */}
      {errorCount > 0 && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3"
        >
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <span className="text-sm font-bold">!</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-red-700">
              Some information needs attention
            </p>
            <p className="mt-0.5 text-xs leading-5 text-red-600">
              Please review the {errorCount} highlighted field
              {errorCount !== 1 ? "s" : ""} before continuing.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting || (currentStep === 1 && !onBack)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Step indicator and continue */}
          <div className="flex items-center gap-3">
            {errorCount > 0 && (
              <span className="hidden text-xs font-medium text-red-600 md:block">
                {errorCount} field{errorCount !== 1 ? "s" : ""} need attention
              </span>
            )}

            <span className="text-xs font-medium text-slate-400 sm:hidden">
              {currentStep}/{TOTAL_STEPS}
            </span>

            <button
              type="button"
              onClick={() => void handleNext()}
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/15 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:px-6"
            >
              {currentStep === TOTAL_STEPS ? (
                <>
                  <span>Review assessment</span>
                  <CheckCircle2 size={16} />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
