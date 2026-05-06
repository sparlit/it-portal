from ....core.base_plugin import BasePlugin
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .models import FranchiseConfig

class FranchisePlugin(BasePlugin):
    name: str = "franchise"
    description: str = "Royalty Calculator, Franchisee Portal, Brand Compliance"
    version: str = "0.1.0"
    permissions: list[str] = ["franchise:read", "franchise:write", "franchise:admin"]

    def setup_routes(self):
        @self.router.get("/")
        async def root():
            return {"message": f"Welcome to the Royalty Calculator, Franchisee Portal, Brand Compliance department API"}
            
        @self.router.get("/config")
        async def get_config(db: AsyncSession = Depends(get_db)):
            # Placeholder for retrieving department config from DB
            return {"status": "success", "config": []}
