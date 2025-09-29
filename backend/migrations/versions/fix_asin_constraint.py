"""Fix ASIN marketplace constraint for multi-tenancy

Revision ID: fix_asin_constraint
Revises: 0b6eca6fd5da
Create Date: 2025-09-29 18:40:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'fix_asin_constraint'
down_revision = '0b6eca6fd5da'
branch_labels = None
depends_on = None

def upgrade():
    # Drop the incorrect global constraint 
    op.drop_constraint("uq_products_asin_marketplace", "products", type_="unique")
    
    # Create correct multi-tenant constraint allowing same ASIN across different stores
    op.create_unique_constraint(
        "uq_products_store_asin_marketplace", 
        "products", 
        ["store_id", "asin", "marketplace_id"]
    )

def downgrade():
    # Reverse the changes
    op.drop_constraint("uq_products_store_asin_marketplace", "products", type_="unique")
    op.create_unique_constraint("uq_products_asin_marketplace", "products", ["asin", "marketplace_id"])