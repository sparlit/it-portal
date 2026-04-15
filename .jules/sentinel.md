## 2024-04-15 - [RBAC Enforcement on User Management]
**Vulnerability:** Missing Role-Based Access Control (RBAC) on user management endpoints.
**Learning:** Endpoints were using `withTenant` which only verified tenant context but not user roles, allowing any authenticated user in a tenant to manage other users.
**Prevention:** Always use `withRBAC` for sensitive endpoints and perform a full scan of API routes for authorization gaps.
