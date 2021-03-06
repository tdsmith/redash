"""Incremental query results aggregation

Revision ID: 9d7678c47452
Revises: 15041b7085fe
Create Date: 2018-03-08 04:36:12.802199

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9d7678c47452'
down_revision = '15041b7085fe'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('query_resultsets',
    sa.Column('query_id', sa.Integer(), nullable=False),
    sa.Column('result_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['query_id'], ['queries.id'], ),
    sa.ForeignKeyConstraint(['result_id'], ['query_results.id'], ),
    sa.PrimaryKeyConstraint('query_id', 'result_id')
    )
    op.add_column(u'queries', sa.Column('schedule_resultset_size', sa.Integer(), nullable=True))
1

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column(u'queries', 'schedule_resultset_size')
    op.drop_table('query_resultsets')
    # ### end Alembic commands ###
