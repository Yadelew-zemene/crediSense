import uuid
from datetime import datetime
from sqlalchemy import Index
from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
) 


class Base(DeclarativeBase):
    pass

class Company(Base):
    __tablename__ = "companies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    company_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    industry: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    user: Mapped["User | None"] = relationship(
        back_populates="company",
        uselist=False,
    )

    assessments: Mapped[list["Assessment"]] = relationship(
        back_populates="company",
    )
class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="RESTRICT"),
        nullable=False,
        unique=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    password_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    company: Mapped["Company"] = relationship(
        back_populates="user",
    )
class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="RESTRICT"),
        nullable=False,
    )

    company: Mapped["Company"] = relationship(
        back_populates="assessments",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    model_version: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="loan-model-v1",
        server_default="loan-model-v1",
    )

    # Applicant information
    contract_type: Mapped[str] = mapped_column(String(50), nullable=False)
    gender: Mapped[str] = mapped_column(String(1), nullable=False)
    owns_car: Mapped[str] = mapped_column(String(1), nullable=False)
    owns_realty: Mapped[str] = mapped_column(String(1), nullable=False)

    children_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    family_members: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    family_status: Mapped[str] = mapped_column(Text, nullable=False)
    education_type: Mapped[str] = mapped_column(Text, nullable=False)
    income_type: Mapped[str] = mapped_column(Text, nullable=False)
    occupation_type: Mapped[str | None] = mapped_column(Text, nullable=True)
    housing_type: Mapped[str] = mapped_column(Text, nullable=False)

    # Financial information
    annual_income: Mapped[float] = mapped_column(
        Numeric(15, 2),
        nullable=False,
    )

    credit_amount: Mapped[float] = mapped_column(
        Numeric(15, 2),
        nullable=False,
    )

    annuity_amount: Mapped[float] = mapped_column(
        Numeric(15, 2),
        nullable=False,
    )

    goods_price: Mapped[float | None] = mapped_column(
        Numeric(15, 2),
        nullable=True,
    )

    # Employment and history
    age_years: Mapped[float] = mapped_column(
        Numeric(6, 2),
        nullable=False,
    )

    employment_years: Mapped[float] = mapped_column(
        Numeric(6, 2),
        nullable=False,
    )

    registration_years: Mapped[float] = mapped_column(
        Numeric(6, 2),
        nullable=False,
    )

    id_published_years: Mapped[float] = mapped_column(
        Numeric(6, 2),
        nullable=False,
    )

    car_age: Mapped[float | None] = mapped_column(
        Numeric(6, 2),
        nullable=True,
    )

    # Additional signals
    region_population_relative: Mapped[float | None] = mapped_column(
        Numeric(12, 8),
        nullable=True,
    )

    region_rating: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    region_rating_city: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    external_source_1: Mapped[float | None] = mapped_column(
        Numeric(8, 6),
        nullable=True,
    )

    external_source_2: Mapped[float | None] = mapped_column(
        Numeric(8, 6),
        nullable=True,
    )

    external_source_3: Mapped[float | None] = mapped_column(
        Numeric(8, 6),
        nullable=True,
    )

    # Prediction
    default_probability: Mapped[float] = mapped_column(
        Numeric(8, 6),
        nullable=False,
    )

    decision_threshold: Mapped[float] = mapped_column(
        Numeric(8, 6),
        nullable=False,
    )

    prediction: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
    )

    decision: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "contract_type IN ('Cash loans', 'Revolving loans')",
            name="ck_assessments_contract_type",
        ),
        CheckConstraint(
            "gender IN ('M', 'F')",
            name="ck_assessments_gender",
        ),
        CheckConstraint(
            "owns_car IN ('Y', 'N')",
            name="ck_assessments_owns_car",
        ),
        CheckConstraint(
            "owns_realty IN ('Y', 'N')",
            name="ck_assessments_owns_realty",
        ),
        CheckConstraint(
            "children_count >= 0",
            name="ck_assessments_children_count",
        ),
        CheckConstraint(
            "family_members > 0",
            name="ck_assessments_family_members",
        ),
        CheckConstraint(
            "annual_income >= 0",
            name="ck_assessments_annual_income",
        ),
        CheckConstraint(
            "credit_amount >= 0",
            name="ck_assessments_credit_amount",
        ),
        CheckConstraint(
            "annuity_amount >= 0",
            name="ck_assessments_annuity_amount",
        ),
        CheckConstraint(
            "goods_price IS NULL OR goods_price >= 0",
            name="ck_assessments_goods_price",
        ),
        CheckConstraint(
            "age_years >= 0",
            name="ck_assessments_age_years",
        ),
        CheckConstraint(
            "employment_years >= 0",
            name="ck_assessments_employment_years",
        ),
        CheckConstraint(
            "registration_years >= 0",
            name="ck_assessments_registration_years",
        ),
        CheckConstraint(
            "id_published_years >= 0",
            name="ck_assessments_id_published_years",
        ),
        CheckConstraint(
            "car_age IS NULL OR car_age >= 0",
            name="ck_assessments_car_age",
        ),
        CheckConstraint(
            "region_population_relative IS NULL "
            "OR region_population_relative >= 0",
            name="ck_assessments_region_population_relative",
        ),
        CheckConstraint(
            "region_rating IS NULL OR region_rating BETWEEN 1 AND 3",
            name="ck_assessments_region_rating",
        ),
        CheckConstraint(
            "region_rating_city IS NULL "
            "OR region_rating_city BETWEEN 1 AND 3",
            name="ck_assessments_region_rating_city",
        ),
        CheckConstraint(
            "external_source_1 IS NULL "
            "OR external_source_1 BETWEEN 0 AND 1",
            name="ck_assessments_external_source_1",
        ),
        CheckConstraint(
            "external_source_2 IS NULL "
            "OR external_source_2 BETWEEN 0 AND 1",
            name="ck_assessments_external_source_2",
        ),
        CheckConstraint(
            "external_source_3 IS NULL "
            "OR external_source_3 BETWEEN 0 AND 1",
            name="ck_assessments_external_source_3",
        ),
        CheckConstraint(
            "default_probability BETWEEN 0 AND 1",
            name="ck_assessments_default_probability",
        ),
        CheckConstraint(
            "decision_threshold BETWEEN 0 AND 1",
            name="ck_assessments_decision_threshold",
        ),
        CheckConstraint(
            "prediction IN (0, 1)",
            name="ck_assessments_prediction",
        ),
        CheckConstraint(
            "decision IN ('DEFAULT RISK', 'NO DEFAULT RISK')",
            name="ck_assessments_decision",
        ),
    )
Index(
    "idx_assessments_created_at",
    Assessment.created_at.desc(),
)

Index(
    "idx_assessments_decision_created_at",
    Assessment.decision,
    Assessment.created_at.desc(),
)
Index(
    "idx_assessments_company_created_at",
    Assessment.company_id,
    Assessment.created_at.desc(),
)