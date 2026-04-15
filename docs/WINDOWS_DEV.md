# Windows Development Guide

## Prerequisites
- **Node.js**: 20.x or higher (LTS recommended)
- **PostgreSQL**: 15.x or higher (Running locally or via Docker)
- **PowerShell**: 7+ recommended for optimal script execution

## Environment Setup
The ecosystem is optimized for Windows engineering teams. Use the provided PowerShell script to initialize the environment:

```powershell
.\scripts\dev-setup.ps1
```

## Running the Application
Use standard npm commands. The application utilizes cross-platform compatible paths:

```cmd
npm run dev
```

## Database Management
For local PostgreSQL administration on Windows, we recommend **pgAdmin 4** or **DBeaver**.

## Docker on Windows
If using Docker Desktop, ensure **WSL 2** backend is enabled for maximum performance.
