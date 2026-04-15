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
| **Strengths** | **Weaknesses** |
| :--- | :--- |
| Multi-stream (IT/CS) routing; Date-prefixed unique IDs; Logical tenant isolation. | Potential performance bottlenecks in high-concurrency without DB partitioning. |
| **Opportunities** | **Threats** |
| AI-driven auto-resolution; Automated SLA monitoring integration. | Token collision in high concurrency; Data drift between assets and tickets. |

### Inventory Module
| **S** | **W** | **O** | **T** |
| :--- | :--- | :--- | :--- |
| Real-time hardware tracking. | Manual entry dependency. | RFID/IoT integration. | Data staleness without active polling. |

### Landing Module
| **S** | **W** | **O** | **T** |
| :--- | :--- | :--- | :--- |
| High-impact, data-driven entry. | Heavy asset load on mobile. | SEO and public order intake. | Branding drift between sub-portals. |

## 3. Tool Choice Comparison

### Backend: FastAPI vs. Django vs. Next.js
- **Django**: "Batteries included," excellent for rapid admin-heavy builds but can be bloated.
- **FastAPI**: Superior performance for high-concurrency industrial apps, native async support.
- **Next.js (Chosen)**: Robust enterprise ecosystem, "App Router" handles complex multi-portal state better, and seamless full-stack integration for "Agentic" teammates. **Decision: Next.js API Routes with Service Layer.**

### Ticketing: Off-the-shelf (Zammad) vs. Custom
- **Zammad/GLPI**: High feature set but difficult to maintain deep logical coupling with the Laundry order lifecycle and multi-tenant billing.
- **Custom Modular Monolith (Chosen)**: Zero licensing costs, 100% control over the schema, and seamless integration with the existing `Tenant` and `AuditLog` systems. **Decision: Custom Implementation.**

### Landing: Next.js vs. SvelteKit
- **SvelteKit**: Faster initial load, less boilerplate, extremely small bundles.
- **Next.js (Chosen)**: Enterprise-grade stability, massive community support, and better handling of complex multi-portal routing. **Decision: Next.js.**

## 4. Multi-tenancy Model
We use a **Shared Database / Shared Schema** model. Logical isolation is enforced via `tenantId` on every model.
- **Pros**: Cost-effective, easier migrations, global reporting.
- **Cons**: Requires strict RLS (Row Level Security) or Middleware enforcement to prevent data leakage.
- **Implementation**: Handled via `withRBAC` Higher-Order Function in API routes.

## 5. Security Protocol
- **JWT**: Stateless session management via `jose`.
- **AES-256-CBC**: Industrial-grade encryption for sensitive credentials in the Vault.
- **Zod**: Mandatory schema validation for all API inputs to ensure data integrity.
- **Audit Logging**: Immutable activity stream for all destructive and sensitive actions.
