# Architecture & Strategic Evaluation

## 1. Executive Summary
TSysLab is an industrial-grade, multi-tenant ecosystem designed to manage IT Infrastructure and Laundry Operations. It utilizes a Modular Monolith architecture for ease of deployment while maintaining microservices-adjacent partitioning for future scalability.

## 2. Strategic Evaluation (SWOT)

### IT Management Module
| **Strengths** | **Weaknesses** |
| :--- | :--- |
| Centralized asset and ticket tracking; SLA-driven workflows. | High dependency on manual data entry for legacy hardware. |
| **Opportunities** | **Threats** |
| Automated network discovery via SNMP integration. | Rapid hardware turnover leading to asset data staleness. |

### Laundry Management Module
| **Strengths** | **Weaknesses** |
| :--- | :--- |
| Full lifecycle tracking (Order -> Process -> Delivery). | Complex logistics scheduling for high-density routes. |
| **Opportunities** | **Threats** |
| Mobile driver app and RFID garment tagging integration. | Operational garment misidentification without strict tagging. |

## 3. Tool Choice Comparison

### Core Framework: Next.js vs. FastAPI
- **FastAPI**: Excellent for pure-API performance, but requires a separate frontend stack (React/Vue).
- **Next.js (Chosen)**: Provides a unified Full-Stack environment with React 18/19. The App Router allows for server-side security with a seamless client-side "mobile-first" experience. **Decision: Next.js** for cohesive development and "Agentic" readability.

### Database ORM: Prisma vs. TypeORM
- **TypeORM**: Flexible but requires extensive manual class definitions.
- **Prisma (Chosen)**: Auto-generates types from a single schema file. Superior DX and type-safety, ensuring the "Elite Architect" standard for zero-bug database interactions. **Decision: Prisma.**
- **Note on Engines**: **SQLite** is utilized for development, local testing, and Proof-of-Concept (PoC) stages to ensure rapid iteration. **PostgreSQL** is the mandatory target for all production and industrial-grade deployments to support high concurrency and advanced features.

## 4. Multi-tenancy Model
We use a **Shared Database / Shared Schema** model. Logical isolation is enforced via `tenantId` on every model.
- **Pros**: Cost-effective, easier migrations, global reporting.
- **Cons**: Requires strict RLS (Row Level Security) or Middleware enforcement to prevent data leakage.
- **Implementation**: Handled via `withTenant` Higher-Order Function in API routes.

## 5. Security Protocol
- **JWT**: Stateless session management via `jose`.
- **Bcrypt**: Industrial-grade password hashing.
- **CORS/Headers**: Restricted to tenant-specific domains in future production iterations.
