from ....core.base_plugin import BasePlugin
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .models import MultiBranchConfig

class MultiBranchPlugin(BasePlugin):
    name: str = "multi_branch"
    description: str = "Inter-Branch Transfers, Regional Consolidation, Branch Performance"
    version: str = "0.1.0"
    permissions: list[str] = ["multi_branch:read", "multi_branch:write", "multi_branch:admin"]

    def setup_routes(self):
        @self.router.get("/")
        async def root():
            return {"message": f"Welcome to the Inter-Branch Transfers, Regional Consolidation, Branch Performance department API"}
            
        @self.router.get("/config")
        async def get_config(db: AsyncSession = Depends(get_db)):
            # Placeholder for retrieving department config from DB
            return {"status": "success", "config": []}
