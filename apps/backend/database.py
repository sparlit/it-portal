import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost/alrayes")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def fetch_next_task(session: AsyncSession):
    """
    Example of PostgreSQL SKIP LOCKED for queueing.
    Fetches the next available task and locks it.
    """
    query = text("""
        UPDATE background_tasks
        SET status = 'processing', updated_at = NOW()
        WHERE id = (
            SELECT id
            FROM background_tasks
            WHERE status = 'pending'
            ORDER BY created_at
            FOR UPDATE SKIP LOCKED
            LIMIT 1
        )
        RETURNING *;
    """)
    result = await session.execute(query)
    return result.fetchone()
