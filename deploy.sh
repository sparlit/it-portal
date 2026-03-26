#!/bin/bash
# IT Portal Deployment Script
# For Al Rayes Laundry - IT Management Portal

set -e

echo "=========================================="
echo "IT Portal Deployment Script"
echo "=========================================="

# Configuration
DEPLOY_DIR="/var/www/it-portal"
DB_NAME="it_portal"
DB_USER="portal_user"
DB_PASS="Portal@123!"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root or with sudo"
    exit 1
fi

# Create deployment directory
log_info "Creating deployment directory..."
mkdir -p $DEPLOY_DIR

# Copy files
log_info "Copying application files..."
cp -r .next/standalone/* $DEPLOY_DIR/
cp -r .next/static $DEPLOY_DIR/.next/
cp -r public $DEPLOY_DIR/
cp prisma $DEPLOY_DIR/ -r
cp package.json $DEPLOY_DIR/
cp .env.production $DEPLOY_DIR/.env

# Copy PostgreSQL schema
cp prisma/schema.postgresql.prisma $DEPLOY_DIR/prisma/schema.prisma

log_info "Deployment files copied successfully!"

# Set permissions
log_info "Setting permissions..."
chown -R www-data:www-data $DEPLOY_DIR
chmod -R 755 $DEPLOY_DIR

# Install production dependencies
log_info "Installing production dependencies..."
cd $DEPLOY_DIR
npm install --production prisma @prisma/client

# Generate Prisma client
log_info "Generating Prisma client..."
npx prisma generate

# Run database migrations
log_info "Running database migrations..."
npx prisma db push

# Run seed script
log_info "Seeding database..."
npx tsx prisma/seed.ts

log_info "=========================================="
log_info "Deployment completed successfully!"
log_info "=========================================="
log_info ""
log_info "Next steps:"
log_info "1. Configure Nginx reverse proxy"
log_info "2. Start the application with PM2"
log_info "3. Configure SSL certificate"
log_info ""
