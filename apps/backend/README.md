# Al Rayes Backend Microkernel

A FastAPI-based microkernel designed for Al Rayes Laundry Operations.

## Features
- **Dynamic Plugin Loading**: Automatically loads department modules from the `plugins/` directory.
- **Multi-tier Auth & RBAC**: Advanced authentication for B2C, B2B, and Internal staff.
- **Asynchronous Task Queue**: Native `asyncio.Queue` for background processing.
- **PostgreSQL SKIP LOCKED**: High-concurrency task fetching logic.
- **Security-First**: Integrated CORS, TrustedHost, and custom security headers.

## Setup
1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application (from the project root):
   ```bash
   export PYTHONPATH=$PYTHONPATH:.
   uvicorn apps.backend.main:app --reload
   ```

## Structure
- `core/`: Base classes and plugin manager.
- `plugins/`: Pluggable department modules.
- `models/`: Database models.
- `schemas/`: Pydantic schemas.
- `utils/`: Security and helper utilities.
