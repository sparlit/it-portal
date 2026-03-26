-- PostgreSQL Database Setup for IT Portal
-- Run this script as postgres superuser

-- Create database
CREATE DATABASE it_portal;

-- Create user
CREATE USER portal_user WITH ENCRYPTED PASSWORD 'Portal@123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE it_portal TO portal_user;

-- Connect to the database
\c it_portal

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO portal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO portal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO portal_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO portal_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO portal_user;
