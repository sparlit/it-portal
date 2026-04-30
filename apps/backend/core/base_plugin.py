from fastapi import APIRouter
from typing import Optional

class BasePlugin:
    """
    Base class for all department plugins.
    Ensures strict decoupling and standard interface.
    """
    name: str = "base_plugin"
    description: str = "Base plugin description"
    version: str = "0.1.0"
    
    def __init__(self):
        self.router = APIRouter(prefix=f"/{self.name}", tags=[self.name])
        self.setup_routes()

    def setup_routes(self):
        """
        To be implemented by subclasses to define plugin-specific routes.
        """
        pass

    async def on_startup(self):
        """
        Lifecycle hook: called when the application starts.
        """
        pass

    async def on_shutdown(self):
        """
        Lifecycle hook: called when the application stops.
        """
        pass
