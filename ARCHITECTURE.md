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
- **Django**: "Batteries included," excellent for rapid admin-heavy builds but can be bloated.
- **FastAPI (Chosen)**: Superior performance for high-concurrency industrial apps, native async support, and modern Type-hinting. **Decision: FastAPI.** (Note: Next.js API routes are used for frontend integration).

### Landing: Next.js vs. SvelteKit
- **SvelteKit**: Faster initial load, less boilerplate, extremely small bundles.
- **Next.js (Chosen)**: Robust enterprise ecosystem, "App Router" handles complex multi-portal state better, and massive community support for "Agentic" teammates. **Decision: Next.js.**

## 4. Multi-tenancy Model
We use a **Shared Database / Shared Schema** model. Logical isolation is enforced via `tenantId` on every model.
- **Pros**: Cost-effective, easier migrations, global reporting.
- **Cons**: Requires strict RLS (Row Level Security) or Middleware enforcement to prevent data leakage.
- **Implementation**: Handled via `withTenant` Higher-Order Function in API routes.

## 5. Security Protocol
- **JWT**: Stateless session management via `jose`.
- **Bcrypt**: Industrial-grade password hashing.
- **CORS/Headers**: Restricted to tenant-specific domains in future production iterations.
