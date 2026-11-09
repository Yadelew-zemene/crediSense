from datetime import timedelta
import os

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from api.auth.dependencies import CurrentUser
from api.auth.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    hash_password,
    verify_password,
)
from api.db.database import get_db
from api.db.models import Company, User
from api.schemas import (
    AuthResponse,
    CompanyRegistrationRequest,
    CompanyResponse,
    LoginRequest,
    UserResponse,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])

COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"


def set_auth_cookie(response: Response, user_id: str) -> None:
    token = create_access_token(subject=user_id)

    response.set_cookie(
        key="access_token",
        value=token,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/",
    )


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_company(
    request: CompanyRegistrationRequest,
    db: Session = Depends(get_db),
):
    company = Company(
        company_name=request.company_name.strip(),
        email=str(request.company_email).lower(),
        phone=request.phone,
        industry=request.industry,
        country=request.country,
        address=request.address,
    )

    user = User(
        company=company,
        full_name=request.full_name.strip(),
        email=str(request.email).lower(),
        password_hash=hash_password(request.password),
    )

    try:
        db.add(company)
        db.add(user)
        db.commit()
        db.refresh(company)
        db.refresh(user)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Company email or analyst email is already registered.",
        )

    return AuthResponse(
        user=UserResponse.model_validate(user),
        company=CompanyResponse.model_validate(company),
    )


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(
            User.email == str(request.email).lower()
        )
    )

    if (
        user is None
        or not user.is_active
        or not verify_password(request.password, user.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    set_auth_cookie(response, str(user.id))

    return AuthResponse(
        user=UserResponse.model_validate(user),
        company=CompanyResponse.model_validate(user.company),
    )


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/",
    )

    return {"message": "Successfully logged out."}


@router.get("/me", response_model=AuthResponse)
def get_current_account(current_user: CurrentUser):
    return AuthResponse(
        user=UserResponse.model_validate(current_user),
        company=CompanyResponse.model_validate(current_user.company),
    )