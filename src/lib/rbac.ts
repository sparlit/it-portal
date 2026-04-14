export type Role = 'SUPERADMIN' | 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'CUSTOMER';

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  subject: 'User' | 'Tenant' | 'Asset' | 'ITTicket' | 'LaundryOrder' | 'LaundryCustomer' | 'LaundryTicket' | 'Report' | 'Setting';
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPERADMIN: [
    { action: 'manage', subject: 'Tenant' },
    { action: 'manage', subject: 'User' },
    { action: 'manage', subject: 'Asset' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'LaundryCustomer' },
    { action: 'manage', subject: 'LaundryTicket' },
    { action: 'manage', subject: 'Report' },
    { action: 'manage', subject: 'Setting' },
  ],
  ADMIN: [
    { action: 'manage', subject: 'User' },
    { action: 'manage', subject: 'Asset' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'LaundryCustomer' },
    { action: 'manage', subject: 'LaundryTicket' },
    { action: 'manage', subject: 'Report' },
    { action: 'manage', subject: 'Setting' },
  ],
  MANAGER: [
    { action: 'read', subject: 'User' },
    { action: 'manage', subject: 'Asset' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'LaundryCustomer' },
    { action: 'manage', subject: 'LaundryTicket' },
    { action: 'read', subject: 'Report' },
  ],
  OPERATOR: [
    { action: 'read', subject: 'Asset' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'read', subject: 'LaundryCustomer' },
    { action: 'create', subject: 'LaundryTicket' },
  ],
  CUSTOMER: [
    { action: 'read', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'LaundryTicket' },
  ],
};

export function hasPermission(role: Role, action: Permission['action'], subject: Permission['subject']): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.some(p =>
    (p.action === 'manage' || p.action === action) && p.subject === subject
  );
}
