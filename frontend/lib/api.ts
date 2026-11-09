import type {
  ApplicantRequest,
  PredictionResponse,
  AssessmentHistoryItem,
  AssessmentDetail,
  CompanyRegistrationRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
} from "./types";
export type {
  AssessmentHistoryItem,
  AssessmentDetail,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "An unexpected error occurred.";

    try {
      const data = await response.json();

      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail
          .map((error: { msg?: string }) => error.msg)
          .filter(Boolean)
          .join(", ");
      }
    } catch {
      // Keep the generic message if the response is not JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Authentication

export async function registerCompany(
  registration: CompanyRegistrationRequest,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(registration),
  });
}

export async function login(
  credentials: LoginRequest,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logout(): Promise<void> {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/me");
}

// Assessments

export async function predictApplicant(
  applicant: ApplicantRequest,
): Promise<PredictionResponse> {
  return apiRequest<PredictionResponse>("/predict", {
    method: "POST",
    body: JSON.stringify(applicant),
  });
}

export async function getAssessments(): Promise<AssessmentHistoryItem[]> {
  return apiRequest<AssessmentHistoryItem[]>("/assessments");
}

export async function getAssessment(
  assessmentId: string,
): Promise<AssessmentDetail> {
  return apiRequest<AssessmentDetail>(
    `/assessments/${assessmentId}`,
  );
}