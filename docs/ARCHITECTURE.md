# Architecture & Strategic Evaluation

## 1. Executive Summary
TSysLab is an industrial-grade, multi-tenant ecosystem designed to manage IT Infrastructure and Laundry Operations. It utilizes a Modular Monolith architecture with Universal OS compatibility via Docker.

## 2. Strategic Evaluation (SWOT)

### Ticketing Module
| **S** | **W** | **O** | **T** |
| :--- | :--- | :--- | :--- |
| Multi-stream (IT/CS) routing. | High volume latency risks. | AI-driven auto-resolution. | Token collision in high concurrency. |

### Inventory Module
| **S** | **W** | **O** | **T** |
| :--- | :--- | :--- | :--- |
| Real-time hardware tracking. | Manual entry dependency. | RFID/IoT integration. | Data staleness without active polling. |

### Laundry Module
| **S** | **W** | **O** | **T** |
| :--- | :--- | :--- | :--- |
| Full lifecycle operational flow. | Complex logistics edge cases. | Doha-specific route optimization. | Operational garment misidentification. |

### Landing Module
| **S** | **W** | **O** | **T** |
| :--- | :--- | :--- | :--- |
| High-impact, data-driven entry. | Heavy asset load on mobile. | SEO and public order intake. | Branding drift between sub-portals. |

## 3. Tool Choice Comparison

### Backend: FastAPI vs. Django
- **Django**: "Batteries included," excellent for rapid admin-heavy builds.
- **FastAPI (Chosen)**: Superior performance for high-concurrency industrial apps, native async support. **Decision: FastAPI.** (Note: Next.js API routes used for FE integration).

### Database: PostgreSQL vs. SQLite
- **SQLite**: Local file-based, excellent for testing.
- **PostgreSQL (Chosen)**: Mandatory industrial standard for high-concurrency, robust multi-tenant data isolation, and universal OS scalability. **Decision: PostgreSQL.**

### Deployment: Docker vs. PM2
- **PM2**: Lightweight, but relies on host OS consistency.
- **Docker (Chosen)**: Guaranteed universal cross-platform behavior (Linux, Windows, macOS) through immutable containerization. **Decision: Docker.**

## 4. Multi-tenancy Model
Shared Database / Shared Schema model. Logical isolation via 'tenantId' on every model. RBAC enforced at the API level via 'withRBAC'.

## 5. Universal OS Support
The application is fully containerized. A standard 'docker-compose up' command initializes both the PostgreSQL node and the standalone Next.js application on any supported Operating System.
