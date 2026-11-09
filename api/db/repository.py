from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from api.db.models import Assessment
from api.schemas import ApplicantRequest


def save_assessment(
    db: Session,
    applicant: ApplicantRequest,
    prediction: dict,
    company_id: UUID,
) -> Assessment:
    assessment = Assessment(
        company_id=company_id,
        contract_type=applicant.contract_type,
        gender=applicant.gender,
        owns_car=applicant.owns_car,
        owns_realty=applicant.owns_realty,
        children_count=applicant.children_count,
        family_members=applicant.family_members,
        family_status=applicant.family_status,
        education_type=applicant.education_type,
        income_type=applicant.income_type,
        occupation_type=applicant.occupation_type,
        housing_type=applicant.housing_type,
        annual_income=applicant.annual_income,
        credit_amount=applicant.credit_amount,
        annuity_amount=applicant.annuity_amount,
        goods_price=applicant.goods_price,
        age_years=applicant.age_years,
        employment_years=applicant.employment_years,
        registration_years=applicant.registration_years,
        id_published_years=applicant.id_published_years,
        car_age=applicant.car_age,
        region_population_relative=applicant.region_population_relative,
        region_rating=applicant.region_rating,
        region_rating_city=applicant.region_rating_city,
        external_source_1=applicant.external_source_1,
        external_source_2=applicant.external_source_2,
        external_source_3=applicant.external_source_3,
        default_probability=prediction["default_probability"],
        decision_threshold=prediction["threshold"],
        prediction=prediction["prediction"],
        decision=prediction["decision"],
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return assessment


def get_assessments(
    db: Session,
    company_id: UUID,
    limit: int = 20,
) -> list[Assessment]:
    statement = (
        select(Assessment)
        .where(Assessment.company_id == company_id)
        .order_by(Assessment.created_at.desc())
        .limit(limit)
    )

    return list(db.scalars(statement).all())


def get_assessment(
    db: Session,
    assessment_id: UUID,
    company_id: UUID,
) -> Assessment | None:
    statement = select(Assessment).where(
        Assessment.id == assessment_id,
        Assessment.company_id == company_id,
    )

    return db.scalar(statement)