import asyncio
import os
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from .core.plugin_manager import PluginManager

# Background task queue - Replacing Redis/Celery for Phase 1
task_queue = asyncio.Queue()

async def worker():
    """
    Background worker that processes tasks from the queue.
    """
    while True:
        task_func, args, kwargs = await task_queue.get()
        try:
            if asyncio.iscoroutinefunction(task_func):
                await task_func(*args, **kwargs)
            else:
                task_func(*args, **kwargs)
        except Exception as e:
            print(f"Error executing background task: {e}")
        finally:
            task_queue.task_done()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize PluginManager and load modules
    app.state.plugin_manager = PluginManager(app)
    app.state.plugin_manager.load_plugins()
    await app.state.plugin_manager.startup_plugins()
    
    # Start background worker
    worker_task = asyncio.create_task(worker())
    
    print("Al Rayes Digital Ecosystem API Microkernel Started")
    yield
    
    # Shutdown: Cleanup plugins and worker
    await app.state.plugin_manager.shutdown_plugins()
    worker_task.cancel()
    try:
        await worker_task
    except asyncio.CancelledError:
        pass
    print("Al Rayes Digital Ecosystem API Microkernel Shutting Down")

app = FastAPI(
    title="Al Rayes Digital Ecosystem API",
    description="Unified Microkernel for Al Rayes Laundry Operations",
    version="1.0.0",
    lifespan=lifespan
)

# --- SECURITY MIDDLEWARE ---

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host Middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.alrayeslaundry.com"]
)

# Custom Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Al Rayes Microkernel",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
