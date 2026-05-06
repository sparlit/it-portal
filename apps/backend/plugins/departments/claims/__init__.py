from ....core.base_plugin import BasePlugin
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .models import ClaimsConfig

class ClaimsPlugin(BasePlugin):
    name: str = "claims"
    description: str = "Claims Processing, Garment Valuation, Insurance Management"
    version: str = "0.1.0"
    permissions: list[str] = ["claims:read", "claims:write", "claims:admin"]

    def setup_routes(self):
        @self.router.get("/")
        async def root():
            return {"message": f"Welcome to the Claims Processing, Garment Valuation, Insurance Management department API"}
            
        @self.router.get("/config")
        async def get_config(db: AsyncSession = Depends(get_db)):
            # Placeholder for retrieving department config from DB
            return {"status": "success", "config": []}
