# Al Rayes Digital Ecosystem - Apps

This directory contains the core applications of the ecosystem.

## Backend (Microkernel)

A FastAPI-based microkernel that dynamically loads department modules as plugins.

### Structure

- `main.py`: Entry point, initializes the FastAPI app and PluginManager.
- `core/`: Core microkernel logic (BasePlugin, PluginManager).
- `plugins/`: Department modules (Auth, Laundry, Finance, etc.).
- `models/`: SQLAlchemy database models.
- `schemas/`: Pydantic validation schemas.
- `utils/`: Common utilities (security, helpers).

### Running the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend (PWA)

A Vue.js 3 Progressive Web App (PWA) built with Vite and Tailwind CSS.

### Structure

- `src/store/`: Pinia stores (including dynamic theming).
- `src/views/`: Portal-specific views.
- `src/components/`: Reusable AR-components.

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```
