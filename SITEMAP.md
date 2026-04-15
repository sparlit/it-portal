# TSysLab Industrial Ecosystem Sitemap

## Core Modules
- **Authentication**: JWT-based session management (`/api/core/auth/login`, `/api/core/auth/logout`, `/api/core/auth/session`)
- **Users & RBAC**: Role-based access control with Subject-specific permissions (`/api/core/users`)
- **Global Metrics**: Unified KPI dashboard with real-time DB calculations (`/api/core/metrics`, `src/components/modules/core/GlobalMetrics.tsx`)
- **Audit Trail**: System-wide activity logging (`/api/core/audit`, `src/components/modules/core/AuditTrail.tsx`)
- **Reception Desk**: Visitor and meeting management (`/api/core/visitors`, `src/components/modules/core/ReceptionDesk.tsx`)

## IT Management Module
- **Asset Inventory**: Enterprise hardware/software tracking (`/api/it/assets`, `src/components/modules/it/AssetInventory.tsx`)
- **Infrastructure Monitor**: Real-time server health tracking using TCP Socket verification (`/api/it/monitoring`, `src/components/modules/it/InfrastructureMonitor.tsx`)
- **Security Vault**: AES-256-CBC encrypted credential and secret management (`/api/it/vault`, `src/components/modules/it/SecretVault.tsx`)
- **IT Ticketing**: Internal support stream with collision-resistant IDs and hardened UI (`/api/it/tickets`, `src/components/modules/it/ITTicketDashboard.tsx`)

## Laundry Management Module
- **Order Management**: End-to-end lifecycle tracking with ActivityLog and Industrial Polling (`/api/laundry/orders`, `src/components/modules/laundry/LaundryOrderManager.tsx`)
- **Customer CRM**: Loyalty tracking and order history (`/api/laundry/customers`, `src/components/modules/laundry/LaundryCustomerManager.tsx`)
- **CS Support Ticketing**: Customer-facing service stream (`/api/laundry/tickets`, `src/components/modules/laundry/LaundryTicketDashboard.tsx`)
- **Logistics Dashboard**: Mobile-optimized driver portal (`/driver`)

## Service Layer (Architecture)
- `TicketingService.ts`: Unified logic for IT/Laundry tickets.
- `AssetService.ts`: Business logic for asset lifecycle.
- `CustomerService.ts`: CRM and loyalty logic.
- `InfrastructureService.ts`: Real-world health check orchestration using `net.Socket`.
- `VaultService.ts`: Cryptographic secret handling using AES-256-CBC.
- `LaundryService.ts`: Centralized order lifecycle and logistics state machine.
