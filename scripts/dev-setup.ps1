# Windows Development Setup Script for TSysLab Industrial Ecosystem
# Requires: Node.js 20+, PostgreSQL 15+, and Docker Desktop (optional but recommended)

Write-Host "TSysLab Industrial Ecosystem: Windows Dev Initialization" -ForegroundColor Cyan

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "Creating default .env from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    } else {
        # Create minimal .env for Windows
        "@echo off
DATABASE_URL=`"postgresql://postgres:postgres@localhost:5432/tsyslab?schema=public`"
JWT_SECRET=`"industrial-grade-secret-key-2024`"
NODE_ENV=`"development`"" | Out-File -FilePath ".env" -Encoding utf8
    }
}

# Install dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "Initialization Complete. Run 'npm run dev' to start." -ForegroundColor Green
