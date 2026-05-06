from ....core.base_plugin import BasePlugin
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .models import FinanceConfig

class FinancePlugin(BasePlugin):
    name: str = "finance"
    description: str = "GL, AP/AR, Fixed Assets, Multi-Branch Reconciliation, Qatar VAT Invoicing"
    version: str = "0.1.0"
    permissions: list[str] = ["finance:read", "finance:write", "finance:admin"]

    def setup_routes(self):
        @self.router.get("/")
        async def root():
            return {"message": f"Welcome to the GL, AP/AR, Fixed Assets, Multi-Branch Reconciliation, Qatar VAT Invoicing department API"}
            
        @self.router.get("/config")
        async def get_config(db: AsyncSession = Depends(get_db)):
            # Placeholder for retrieving department config from DB
            return {"status": "success", "config": []}
