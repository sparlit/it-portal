from ....core.base_plugin import BasePlugin
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .models import BusinessDevelopmentConfig

class BusinessDevelopmentPlugin(BasePlugin):
    name: str = "business_dev"
    description: str = "Market Research, Partnership Management, Tender Management"
    version: str = "0.1.0"
    permissions: list[str] = ["business_dev:read", "business_dev:write", "business_dev:admin"]

    def setup_routes(self):
        @self.router.get("/")
        async def root():
            return {"message": f"Welcome to the Market Research, Partnership Management, Tender Management department API"}
            
        @self.router.get("/config")
        async def get_config(db: AsyncSession = Depends(get_db)):
            # Placeholder for retrieving department config from DB
            return {"status": "success", "config": []}
