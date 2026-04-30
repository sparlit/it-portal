import importlib
import os
import inspect
import sys
from typing import List, Dict
from fastapi import FastAPI
from .base_plugin import BasePlugin

class PluginManager:
    def __init__(self, app: FastAPI, plugins_dir: str = "plugins"):
        self.app = app
        self.plugins_dir = plugins_dir
        self.plugins: Dict[str, BasePlugin] = {}

    def load_plugins(self):
        """
        Dynamically load plugins from the plugins directory.
        """
        # Get the absolute path to the plugins directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(current_dir)
        plugins_path = os.path.join(backend_dir, self.plugins_dir)

        if not os.path.exists(plugins_path):
            os.makedirs(plugins_path)
            return

        # Determine the package prefix
        # This assumes the backend is running as part of a package
        package_prefix = "apps.backend"
        
        for item in os.listdir(plugins_path):
            item_path = os.path.join(plugins_path, item)
            if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, "__init__.py")):
                module_path = f"{package_prefix}.{self.plugins_dir}.{item}"
                self._load_plugin_from_module(module_path)

    def _load_plugin_from_module(self, module_path: str):
        try:
            module = importlib.import_module(module_path)
            for name, obj in inspect.getmembers(module):
                if inspect.isclass(obj) and issubclass(obj, BasePlugin) and obj is not BasePlugin:
                    plugin_instance = obj()
                    self.plugins[plugin_instance.name] = plugin_instance
                    self.app.include_router(plugin_instance.router)
                    print(f"Loaded plugin: {plugin_instance.name}")
        except Exception as e:
            print(f"Failed to load plugin from {module_path}: {e}")

    async def startup_plugins(self):
        for plugin in self.plugins.values():
            await plugin.on_startup()

    async def shutdown_plugins(self):
        for plugin in self.plugins.values():
            await plugin.on_shutdown()
