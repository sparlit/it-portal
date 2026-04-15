# Artemis Industrial Ecosystem - Definitive Site Map

This document provides an exhaustive map of all portals, functional modules, and API branches within the Artemis ecosystem.

## 1. Primary Entry Points & Authentication
- **Landing Page** (`/`): Unified gateway to all industrial portals.
- **Global Login** (`/login`): Standardized authentication entry point.
- **Driver Mobile Interface** (`/driver`): Specialized UI for logistics personnel.

---

## 2. Departmental Portals (UI)
Each portal is isolated with its own authentication gateway and specialized dashboard.

### A. System Administration Portal
- **Admin Dashboard** (`/portal/admin`)
- **Admin Login** (`/portal/admin/login`)
- **Modules**:
  - Identity Management (User list & RBAC)
  - System Provisioning (User creation & Portal assignment)
  - Security Overrides (Master key rotation, Session resets)
  - Node Statistics

### B. IT Operations Portal
- **IT Dashboard** (`/portal/it`)
- **IT Login** (`/portal/it/login`)
- **Modules**:
  - IT Asset Inventory
  - Infrastructure Monitor (Server health & IP tracking)
  - IT Support (Ticket lifecycle management)
  - Secret Vault (Encrypted credential management)
  - Knowledge Base (Internal documentation wiki)
  - Procurement Indent (Internal requisition form)
  - Operational Analytics (Aggregated IT data)

### C. Laundry Management Portal
- **Laundry Dashboard** (`/portal/laundry`)
- **Laundry Login** (`/portal/laundry/login`)
- **Modules**:
  - Order Lifecycle Manager (Sorting, Processing, Ready, Delivery)
  - Customer Manager (CRM & Loyalty tracking)
  - Service & Pricing Catalog
  - Laundry Support (Complaint & Feedback tickets)
  - Logistics & Driver Scheduling
  - Procurement Indent
  - Performance Analytics

### D. CRM & Sales Portal
- **CRM Dashboard** (`/portal/crm`)
- **CRM Login** (`/portal/crm/login`)
- **Modules**:
  - Sales Pipeline (Lead management & conversion)
  - Customer 360 View (Unified client profiles)
  - Marketing Campaigns (Omnichannel placeholders)
  - Revenue Data Analytics

### E. Maintenance Management Portal
- **Maintenance Dashboard** (`/portal/maintenance`)
- **Maintenance Login** (`/portal/maintenance/login`)
- **Modules**:
  - Work Order System (Corrective & Emergency tasks)
  - Preventive Maintenance Schedule
  - Spare Parts Inventory
  - Procurement Indent
  - Reliability Analytics

### F. Stores & Purchase Portal
- **Stores Dashboard** (`/portal/stores`)
- **Stores Login** (`/portal/stores/login`)
- **Modules**:
  - Inventory Overview (SKU tracking, Stock alerts)
  - Purchase Requisitions (Inbound requests from departments)
  - Supplier Database (Strategic procurement)
  - Internal Indent Stream
  - Valuation Data Analytics

### G. Transport Department Portal
- **Transport Dashboard** (`/portal/transport`)
- **Transport Login** (`/portal/transport/login`)
- **Modules**:
  - Live Fleet Tracking (OSM/Leaflet integration)
  - Duty Scheduling (Driver rosters)
  - Vehicle Maintenance Logs
  - Procurement Indent
  - Logistics Intelligence Analytics

### H. Production & Process Portal
- **Production Dashboard** (`/portal/production`)
- **Production Login** (`/portal/production/login`)
- **Modules**:
  - Active Batch Monitoring (Real-time throughput)
  - Quality Control (QC checkpoints & Pass/Fail status)
  - OEE Metrics (Overall Equipment Effectiveness)
  - Procurement Indent
  - Process Data Analytics

---

## 3. Backend API Infrastructure (`/api`)

### Core Services (`/api/core`)
- **Auth**: `login`, `logout`, `session`
- **Admin**: `admin/users` (Provisioning/Listing), `admin/portals`
- **User Services**: `user/theme` (Branding persistence)
- **Shared**: `audit`, `metrics`, `settings`, `visitors`

### IT Services (`/api/it`)
- `assets`, `assets/[id]`
- `licenses`
- `monitoring`
- `tickets`, `tickets/[id]`
- `vault`

### Laundry Services (`/api/laundry`)
- `customers`
- `orders`, `orders/[id]/status`
- `services`
- `tickets`, `tickets/[id]`

### Procurement Services (`/api/procurement`)
- `requisitions` (List/Create PRs)
- `requisitions/[id]/approve` (Multi-level approval engine)

### CRM Services (`/api/crm`)
- `leads` (Lead lifecycle management)

### Maintenance Services (`/api/maintenance`)
- `tasks` (Work order CRUD)

### Stores Services (`/api/stores`)
- `items` (Master inventory list)

### Transport Services (`/api/transport`)
- `vehicles` (Fleet database)
- `trips` (Tracking & Route history)

### Production Services (`/api/production`)
- `batches` (Manufacturing/Process monitoring)

---

## 4. Shared Component Library
- **Procurement**: `RequisitionManager` (Integrated in all portals)
- **Dashboards**: `IndustrialDashboard` (Global data aggregator)
- **Forms**: `UserProvisioningForm`
- **Utility**: `ThemeProvider` (Dynamic branding context)
