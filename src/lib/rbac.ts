export type Role = 'SUPERADMIN' | 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'CUSTOMER';

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  subject: 'User' | 'Tenant' | 'Asset' | 'Ticket' | 'InventoryItem' | 'LaundryOrder' | 'LaundryCustomer' | 'Report' | 'Setting' | 'ITTicket' | 'LaundryTicket';
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPERADMIN: [
    { action: 'manage', subject: 'Tenant' },
    { action: 'manage', subject: 'User' },
    { action: 'manage', subject: 'Asset' },
    { action: 'manage', subject: 'Ticket' },
    { action: 'manage', subject: 'InventoryItem' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'LaundryCustomer' },
    { action: 'manage', subject: 'Report' },
    { action: 'manage', subject: 'Setting' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryTicket' },
  ],
  ADMIN: [
    { action: 'manage', subject: 'User' },
    { action: 'manage', subject: 'Asset' },
    { action: 'manage', subject: 'Ticket' },
    { action: 'manage', subject: 'InventoryItem' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'LaundryCustomer' },
    { action: 'manage', subject: 'Report' },
    { action: 'manage', subject: 'Setting' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryTicket' },
  ],
  MANAGER: [
    { action: 'read', subject: 'User' },
    { action: 'manage', subject: 'Asset' },
    { action: 'manage', subject: 'Ticket' },
    { action: 'manage', subject: 'InventoryItem' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'LaundryCustomer' },
    { action: 'read', subject: 'Report' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryTicket' },
  ],
  OPERATOR: [
    { action: 'read', subject: 'Asset' },
    { action: 'manage', subject: 'Ticket' },
    { action: 'manage', subject: 'InventoryItem' },
    { action: 'manage', subject: 'LaundryOrder' },
    { action: 'read', subject: 'LaundryCustomer' },
    { action: 'manage', subject: 'ITTicket' },
    { action: 'manage', subject: 'LaundryTicket' },
  ],
  CUSTOMER: [
    { action: 'read', subject: 'LaundryOrder' },
    { action: 'manage', subject: 'Ticket' },
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
