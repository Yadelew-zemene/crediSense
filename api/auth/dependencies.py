import uuid
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from api.auth.security import decode_access_token
from api.db.database import get_db
from api.db.models import User


def get_current_user(
    access_token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
) -> User:
    """Retrieve the authenticated user from the access-token cookie."""

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not access_token:
        raise credentials_exception

    payload = decode_access_token(access_token)

    if not payload or not payload.get("sub"):
        raise credentials_exception

    try:
        user_id = uuid.UUID(payload["sub"])
    except (ValueError, TypeError):
        raise credentials_exception

    user = db.scalar(
        select(User).where(User.id == user_id)
    )

    if user is None or not user.is_active:
        raise credentials_exception

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]