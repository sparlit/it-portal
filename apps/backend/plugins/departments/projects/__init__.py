from ....core.base_plugin import BasePlugin
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .models import ProjectsConfig

class ProjectsPlugin(BasePlugin):
    name: str = "projects"
    description: str = "Gantt Charting, Budget vs. Actual, New Branch Fit-out"
    version: str = "0.1.0"
    permissions: list[str] = ["projects:read", "projects:write", "projects:admin"]

    def setup_routes(self):
        @self.router.get("/")
        async def root():
            return {"message": f"Welcome to the Gantt Charting, Budget vs. Actual, New Branch Fit-out department API"}
            
        @self.router.get("/config")
        async def get_config(db: AsyncSession = Depends(get_db)):
            # Placeholder for retrieving department config from DB
            return {"status": "success", "config": []}
