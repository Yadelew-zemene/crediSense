from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache
from uuid import UUID
from sqlalchemy.orm import Session

from api.adapter import applicant_to_model_input
from api.db.database import get_db
from api.schemas import ApplicantRequest

from pydantic import BaseModel
from scripts.inference import load_model_artifact, predict_applicant

from api.db.repository import get_assessments,save_assessment,get_assessment
from api.schemas import AssessmentHistoryItem,AssessmentDetail

from api.auth.router import router as auth_router
from api.auth.dependencies import CurrentUser

app = FastAPI(
    title="Loan Default Prediction API",
    description="API for predicting loan default risk.",
    version="1.0.0",
)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def get_model_artifact():
    return load_model_artifact()


class PredictionResponse(BaseModel):
    """
    Prediction returned by the production inference pipeline.
    """

    default_probability: float
    threshold: float
    prediction: int
    decision: str


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
def predict(
    current_user: CurrentUser,
    request: ApplicantRequest,
    db: Session = Depends(get_db),
    
):
    """
    Predict loan default risk for one applicant.
    """
    try:
        artifact = get_model_artifact()

        applicant = applicant_to_model_input(
            request,
            artifact=artifact,
        )

        result = predict_applicant(
            applicant,
            artifact=artifact,
        )

        save_assessment(
            db,
            request,
            result,
            company_id=current_user.company_id,
        )

        return result

    except HTTPException:
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Prediction service encountered an internal error.",
        )
@app.get(
    "/assessments",
    response_model=list[AssessmentHistoryItem],
)
def get_assessment_history(
    current_user: CurrentUser,
    db: Session = Depends(get_db),
):
    assessments = get_assessments(db,company_id=current_user.company_id)

    return [
        AssessmentHistoryItem(
            id=assessment.id,
            created_at=assessment.created_at,
            model_version=assessment.model_version,
            default_probability=float(assessment.default_probability),
            decision_threshold=float(assessment.decision_threshold),
            prediction=assessment.prediction,
            decision=assessment.decision,
        )
        for assessment in assessments
    ]
@app.get(
    "/assessments/{assessment_id}",
    response_model=AssessmentDetail,
)
def get_assessment_detail(
    current_user: CurrentUser,
    assessment_id: UUID,
    db: Session = Depends(get_db),
):
    assessment = get_assessment(db, assessment_id,company_id=current_user.company_id,)

    if assessment is None:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found.",
        )

    return AssessmentDetail(
        id=assessment.id,
        created_at=assessment.created_at,
        model_version=assessment.model_version,

        contract_type=assessment.contract_type,
        gender=assessment.gender,
        owns_car=assessment.owns_car,
        owns_realty=assessment.owns_realty,
        children_count=assessment.children_count,
        family_members=assessment.family_members,
        family_status=assessment.family_status,
        education_type=assessment.education_type,
        income_type=assessment.income_type,
        occupation_type=assessment.occupation_type,
        housing_type=assessment.housing_type,

        annual_income=float(assessment.annual_income),
        credit_amount=float(assessment.credit_amount),
        annuity_amount=float(assessment.annuity_amount),
        goods_price=(
            float(assessment.goods_price)
            if assessment.goods_price is not None
            else None
        ),

        age_years=float(assessment.age_years),
        employment_years=float(assessment.employment_years),
        registration_years=float(assessment.registration_years),
        id_published_years=float(assessment.id_published_years),
        car_age=(
            float(assessment.car_age)
            if assessment.car_age is not None
            else None
        ),

        region_population_relative=(
            float(assessment.region_population_relative)
            if assessment.region_population_relative is not None
            else None
        ),
        region_rating=assessment.region_rating,
        region_rating_city=assessment.region_rating_city,
        external_source_1=(
            float(assessment.external_source_1)
            if assessment.external_source_1 is not None
            else None
        ),
        external_source_2=(
            float(assessment.external_source_2)
            if assessment.external_source_2 is not None
            else None
        ),
        external_source_3=(
            float(assessment.external_source_3)
            if assessment.external_source_3 is not None
            else None
        ),

        default_probability=float(assessment.default_probability),
        decision_threshold=float(assessment.decision_threshold),
        prediction=assessment.prediction,
        decision=assessment.decision,
    )