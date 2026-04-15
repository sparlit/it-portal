import { z } from 'zod';

// ==========================================
// IT TICKETING SCHEMAS
// ==========================================

export const ITTicketCreateSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.string().min(2).max(50),
  requester: z.string().min(2).max(100),
  assignedTo: z.string().optional(),
  slaDeadline: z.string().optional(),
});

export const ITTicketUpdateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']).optional(),
  category: z.string().min(2).max(50).optional(),
  assignedTo: z.string().optional(),
  resolution: z.string().optional(),
  slaDeadline: z.string().optional(),
});

// ==========================================
// LAUNDRY TICKETING SCHEMAS
// ==========================================

export const LaundryTicketCreateSchema = z.object({
  customerId: z.string().cuid(),
  orderId: z.string().optional(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  type: z.enum(['complaint', 'feedback', 'inquiry']).default('complaint'),
});

export const LaundryTicketUpdateSchema = z.object({
  subject: z.string().min(5).max(200).optional(),
  message: z.string().min(10).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']).optional(),
  type: z.enum(['complaint', 'feedback', 'inquiry']).optional(),
  resolution: z.string().optional(),
});
