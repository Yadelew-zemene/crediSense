from typing import Literal
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field,EmailStr, ConfigDict



class ApplicantRequest(BaseModel):
    """
    User-facing loan application data.

    The API converts this human-friendly representation
    into the raw Home Credit feature format expected by
    the machine learning pipeline.
    """

    contract_type: Literal["Cash loans", "Revolving loans"]

    gender: Literal["M", "F"]

    owns_car: Literal["Y", "N"]

    owns_realty: Literal["Y", "N"]

    children_count: int = Field(ge=0)

    family_members: float = Field(gt=0)

    family_status: str

    education_type: str

    income_type: str

    occupation_type: str | None = None

    housing_type: str

    annual_income: float = Field(gt=0)

    credit_amount: float = Field(gt=0)

    annuity_amount: float = Field(gt=0)

    goods_price: float | None = Field(default=None, gt=0)

    age_years: float = Field(gt=18, lt=100)

    employment_years: float = Field(ge=0)

    registration_years: float = Field(ge=0)

    id_published_years: float = Field(ge=0)

    car_age: float | None = Field(default=None, ge=0)

    region_population_relative: float | None = Field(
        default=None,
        ge=0,
    )

    region_rating: int | None = Field(
        default=None,
        ge=1,
        le=3,
    )

    region_rating_city: int | None = Field(
        default=None,
        ge=1,
        le=3,
    )

    external_source_1: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    external_source_2: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    external_source_3: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )
class AssessmentHistoryItem(BaseModel):
    id: UUID
    created_at: datetime
    model_version: str
    default_probability: float
    decision_threshold: float
    prediction: int
    decision: str

class AssessmentDetail(BaseModel):
    id: UUID
    created_at: datetime
    model_version: str

    contract_type: str
    gender: str
    owns_car: str
    owns_realty: str
    children_count: int
    family_members: int
    family_status: str
    education_type: str
    income_type: str
    occupation_type: str | None
    housing_type: str

    annual_income: float
    credit_amount: float
    annuity_amount: float
    goods_price: float | None

    age_years: float
    employment_years: float
    registration_years: float
    id_published_years: float
    car_age: float | None

    region_population_relative: float | None
    region_rating: int | None
    region_rating_city: int | None
    external_source_1: float | None
    external_source_2: float | None
    external_source_3: float | None

    default_probability: float
    decision_threshold: float
    prediction: int
    decision: str

class CompanyRegistrationRequest(BaseModel):
    company_name: str = Field(min_length=2, max_length=255)
    company_email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    industry: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)
    address: str | None = None

    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class CompanyResponse(BaseModel):
    id: UUID
    company_name: str
    email: EmailStr
    phone: str | None
    industry: str | None
    country: str | None
    address: str | None

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    id: UUID
    company_id: UUID
    full_name: str
    email: EmailStr
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    user: UserResponse
    company: CompanyResponse