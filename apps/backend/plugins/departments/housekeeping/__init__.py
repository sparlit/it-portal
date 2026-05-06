from ....core.base_plugin import BasePlugin
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .models import HousekeepingConfig

class HousekeepingPlugin(BasePlugin):
    name: str = "housekeeping"
    description: str = "Task Scheduling, Supply Inventory, Janitorial Logs, Bio-hazard Disposal"
    version: str = "0.1.0"
    permissions: list[str] = ["housekeeping:read", "housekeeping:write", "housekeeping:admin"]

    def setup_routes(self):
        @self.router.get("/")
        async def root():
            return {"message": f"Welcome to the Task Scheduling, Supply Inventory, Janitorial Logs, Bio-hazard Disposal department API"}
            
        @self.router.get("/config")
        async def get_config(db: AsyncSession = Depends(get_db)):
            # Placeholder for retrieving department config from DB
            return {"status": "success", "config": []}
