"""add company and user accounts

Revision ID: 7923b401df7f
Revises: 1b5f1dcf278b
"""

import uuid
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7923b401df7f"
down_revision: Union[str, Sequence[str], None] = "1b5f1dcf278b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create companies.
    op.create_table(
        "companies",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(30), nullable=True),
        sa.Column("industry", sa.String(100), nullable=True),
        sa.Column("country", sa.String(100), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )

    # 2. Create users.
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("true"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["company_id"],
            ["companies.id"],
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("company_id"),
        sa.UniqueConstraint("email"),
    )

    # 3. Add company_id as nullable temporarily.
    op.add_column(
        "assessments",
        sa.Column("company_id", sa.UUID(), nullable=True),
    )

    # 4. Preserve existing assessments under a legacy company.
    connection = op.get_bind()

    assessment_count = connection.execute(
        sa.text("SELECT COUNT(*) FROM assessments")
    ).scalar_one()

    if assessment_count > 0:
        legacy_company_id = uuid.uuid4()

        connection.execute(
            sa.text("""
                INSERT INTO companies (
                    id,
                    company_name,
                    email,
                    industry,
                    country
                )
                VALUES (
                    :id,
                    :company_name,
                    :email,
                    :industry,
                    :country
                )
            """),
            {
                "id": legacy_company_id,
                "company_name": "Legacy Assessments",
                "email": "legacy-assessments@internal.invalid",
                "industry": "Legacy Data",
                "country": "Unknown",
            },
        )

        connection.execute(
            sa.text("""
                UPDATE assessments
                SET company_id = :company_id
                WHERE company_id IS NULL
            """),
            {"company_id": legacy_company_id},
        )

    # 5. Make company_id mandatory after backfilling.
    op.alter_column(
        "assessments",
        "company_id",
        existing_type=sa.UUID(),
        nullable=False,
    )

    # 6. Add foreign key and company-scoped index.
    op.create_foreign_key(
        "fk_assessments_company_id_companies",
        "assessments",
        "companies",
        ["company_id"],
        ["id"],
        ondelete="RESTRICT",
    )

    op.create_index(
        "idx_assessments_company_created_at",
        "assessments",
        ["company_id", sa.literal_column("created_at DESC")],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "idx_assessments_company_created_at",
        table_name="assessments",
    )

    op.drop_constraint(
        "fk_assessments_company_id_companies",
        "assessments",
        type_="foreignkey",
    )

    op.drop_column("assessments", "company_id")

    op.drop_table("users")
    op.drop_table("companies")