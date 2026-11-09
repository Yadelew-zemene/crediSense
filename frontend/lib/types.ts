export type ContractType = "Cash loans" | "Revolving loans";

export type Gender = "M" | "F";

export type YesNo = "Y" | "N";


export interface ApplicantRequest {
  contract_type: ContractType;
  gender: Gender;
  owns_car: YesNo;
  owns_realty: YesNo;

  children_count: number;
  family_members: number;

  family_status: string;
  education_type: string;
  income_type: string;
  occupation_type: string | null;
  housing_type: string;

  annual_income: number;
  credit_amount: number;
  annuity_amount: number;
  goods_price: number | null;

  age_years: number;
  employment_years: number;
  registration_years: number;
  id_published_years: number;

  car_age: number | null;

  region_population_relative: number | null;
  region_rating: number | null;
  region_rating_city: number | null;

  external_source_1: number | null;
  external_source_2: number | null;
  external_source_3: number | null;
}

export interface PredictionResponse {
  default_probability: number;
  threshold: number;
  prediction: 0 | 1;
  decision: "DEFAULT RISK" | "NO DEFAULT RISK";
}
export interface AssessmentHistoryItem {
  id: string;
  created_at: string;
  model_version: string;
  default_probability: number;
  decision_threshold: number;
  prediction: number;
  decision: string;
}
export interface AssessmentDetail {
  id: string;
  created_at: string;
  model_version: string;

  contract_type: string;
  gender: string;
  owns_car: string;
  owns_realty: string;
  children_count: number;
  family_members: number;
  family_status: string;
  education_type: string;
  income_type: string;
  occupation_type: string | null;
  housing_type: string;

  annual_income: number;
  credit_amount: number;
  annuity_amount: number;
  goods_price: number | null;

  age_years: number;
  employment_years: number;
  registration_years: number;
  id_published_years: number;
  car_age: number | null;

  region_population_relative: number | null;
  region_rating: number | null;
  region_rating_city: number | null;
  external_source_1: number | null;
  external_source_2: number | null;
  external_source_3: number | null;

  default_probability: number;
  decision_threshold: number;
  prediction: number;
  decision: string;
}

export interface CompanyRegistrationRequest {
  company_name: string;
  company_email: string;
  phone?: string | null;
  industry?: string | null;
  country?: string | null;
  address?: string | null;
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CompanyResponse {
  id: string;
  company_name: string;
  email: string;
  phone: string | null;
  industry: string | null;
  country: string | null;
  address: string | null;
}

export interface UserResponse {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  is_active: boolean;
}

export interface AuthResponse {
  user: UserResponse;
  company: CompanyResponse;
}