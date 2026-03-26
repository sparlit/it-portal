'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Monitor, Server, Network, Ticket, Key, HardDrive, Phone, 
  Plus, Search, Edit, Trash2, CheckCircle, XCircle, AlertTriangle,
  Clock, User, Building, Printer, Wifi, Shield, Database,
  Mail, PhoneCall, Calendar, Activity, Settings, FileText,
  Eye, EyeOff, Copy, Menu, Bell, Download, Filter,
  Lock, LogOut, LogIn, BarChart3, Zap, RefreshCw, AlertCircle,
  ChevronRight, ChevronDown, ChevronUp, TrendingUp, PieChart,
  Book, CalendarDays, Clipboard, History, Users, Target,
  Clock3, Star, Pin, Command, Palette, X, Save, EyeIcon,
  FileSpreadsheet, FileText as FileTextIcon, Printer as PrinterIcon,
  RefreshCcw, Maximize2, Minimize2, Info, HelpCircle, MessageSquare,
  MapPin, Globe, ExternalLink, Sliders, Video, VideoOff, Play,
  FileCheck, Folder, FolderOpen, Bold, Italic, List, AlignLeft
} from 'lucide-react'
import { toast, Toaster } from 'sonner'

// ===================== TYPES =====================
interface User {
  username: string
  role: 'admin' | 'user'
  name: string
}

interface ITAsset {
  id: string
  type: 'computer' | 'server' | 'printer' | 'network' | 'other'
  name: string
  model: string
  serialNumber: string
  location: string
  ipAddress: string
  status: 'active' | 'inactive' | 'maintenance'
  assignedTo: string
  purchaseDate: string
  warrantyEnd: string
  notes: string
}

interface ITTicket {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  category: string
  requester: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  resolution: string
  slaDeadline: string
}

interface Credential {
  id: string
  system: string
  username: string
  password: string
  url: string
  notes: string
  lastUpdated: string
  category: string
}

interface BackupJob {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  schedule: string
  lastRun: string
  nextRun: string
  status: 'success' | 'failed' | 'running' | 'warning'
  size: string
  retention: string
}

interface DailyCheck {
  id: string
  task: string
  category: string
  completed: boolean
  timestamp: string
}

interface QuickNote {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
  pinned: boolean
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  type: 'maintenance' | 'warranty' | 'license' | 'meeting' | 'reminder'
  reminder: boolean
}

interface License {
  id: string
  software: string
  vendor: string
  licenseKey: string
  purchaseDate: string
  expiryDate: string
  seats: number
  usedSeats: number
  cost: string
  category: string
}

interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  views: number
}

interface ActivityLog {
  id: string
  user: string
  action: string
  category: string
  details: string
  timestamp: string
  ip?: string
}

interface ServerMonitor {
  id: string
  name: string
  ip: string
  status: 'online' | 'offline' | 'warning'
  cpu: number
  memory: number
  disk: number
  uptime: string
}

interface QuickActionItem {
  id: string
  label: string
  icon: string
  targetTab: string
  action?: string
  enabled: boolean
}

interface SystemStatusItem {
  id: string
  name: string
  icon: string
  status: 'ok' | 'warning' | 'error' | 'maintenance'
  targetTab: string
  enabled: boolean
}

interface SiteSettings {
  companyName: string
  companyLocation: string
  portalName: string
  version: string
  defaultSlaHours: { low: number; medium: number; high: number; critical: number }
  alertEmails: string[]
  maintenanceWindow: string
  backupRetentionDays: number
  maxLoginAttempts: number
  sessionTimeoutMinutes: number
  mapLatitude: number
  mapLongitude: number
  mapZoom: number
  factoryNetwork: string
  managementNetwork: string
  quickActions: QuickActionItem[]
  systemStatus: SystemStatusItem[]
}

// Meeting Scheduler Interface
interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number // in minutes
  organizer: string
  participants: string[]
  meetingType: 'video' | 'in-person' | 'hybrid'
  platform: 'jitsi' | 'google-meet' | 'zoom' | 'teams' | 'other'
  meetingLink: string
  location: string
  agenda: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  notes: string
  createdAt: string
}

// Programme Charter Interface
interface ProgrammeCharter {
  id: string
  name: string
  description: string
  objectives: string[]
  scope: string
  outOfScope: string[]
  startDate: string
  endDate: string
  budget: string
  sponsor: string
  projectManager: string
  stakeholders: { name: string; role: string; email: string }[]
  deliverables: { name: string; dueDate: string; status: string }[]
  milestones: { name: string; date: string; status: string }[]
  risks: { risk: string; impact: string; mitigation: string; owner: string }[]
  successCriteria: string[]
  assumptions: string[]
  constraints: string[]
  status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// Enhanced Notebook Interface
interface NotebookPage {
  id: string
  title: string
  content: string
  folder: string
  tags: string[]
  createdAt: string
  updatedAt: string
  pinned: boolean
  favorite: boolean
  color: string
}

// Visitor Management Interface
interface Visitor {
  id: string
  name: string
  company: string
  email: string
  phone: string
  purpose: string
  hostName: string
  hostDepartment: string
  checkInTime: string
  checkOutTime: string
  status: 'checked-in' | 'checked-out' | 'expected'
  visitorType: 'visitor' | 'contractor' | 'vendor' | 'interview' | 'delivery' | 'other'
  idType: string
  idNumber: string
  photoUrl: string
  badgeNumber: string
  vehicleNumber: string
  notes: string
  createdAt: string
}

// Visitor Badge Template
interface VisitorBadge {
  id: string
  visitorName: string
  company: string
  purpose: string
  hostName: string
  checkInTime: string
  badgeNumber: string
  validUntil: string
}

// Announcement Interface
interface Announcement {
  id: string
  title: string
  content: string
  type: 'general' | 'maintenance' | 'security' | 'hr' | 'urgent'
  priority: 'normal' | 'important' | 'urgent'
  author: string
  createdAt: string
  expiresAt: string
  read: boolean
  pinned: boolean
}

// Vendor Interface
interface Vendor {
  id: string
  name: string
  category: 'hardware' | 'software' | 'services' | 'telecom' | 'other'
  contactPerson: string
  email: string
  phone: string
  address: string
  website: string
  contractStart: string
  contractEnd: string
  contractValue: string
  slaDetails: string
  rating: number
  notes: string
  createdAt: string
}

// Budget Item Interface
interface BudgetItem {
  id: string
  category: 'hardware' | 'software' | 'services' | 'training' | 'other'
  description: string
  amount: number
  date: string
  type: 'budget' | 'expense'
  approvedBy: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string
  createdAt: string
}

// Portal Visit Interface
interface PortalVisit {
  id: string
  date: string
  module: string
  action: string
  user: string
  timestamp: string
}

// Theme type
type Theme = 'light' | 'dark'

// ===================== STORAGE KEYS =====================
const STORAGE_KEYS = {
  assets: 'it_portal_assets',
  tickets: 'it_portal_tickets',
  credentials: 'it_portal_credentials',
  backups: 'it_portal_backups',
  checks: 'it_portal_checks',
  notes: 'it_portal_notes',
  alerts: 'it_portal_alerts',
  user: 'it_portal_user',
  calendar: 'it_portal_calendar',
  licenses: 'it_portal_licenses',
  knowledge: 'it_portal_knowledge',
  logs: 'it_portal_logs',
  pinned: 'it_portal_pinned',
  settings: 'it_portal_settings',
  meetings: 'it_portal_meetings',
  charters: 'it_portal_charters',
  notebook: 'it_portal_notebook',
  visitors: 'it_portal_visitors',
  announcements: 'it_portal_announcements',
  vendors: 'it_portal_vendors',
  budget: 'it_portal_budget',
  visits: 'it_portal_visits',
  theme: 'it_portal_theme',
  recentSearches: 'it_portal_recent_searches',
}

// Valid users
const VALID_USERS: Record<string, { password: string; role: 'admin' | 'user'; name: string }> = {
  'admin': { password: 'Admin@123', role: 'admin', name: 'Administrator' },
  'simon': { password: 'Simon@123', role: 'admin', name: 'Simon Peter' },
  'irfan': { password: 'Irfan@123', role: 'user', name: 'MD Irfan' },
  'hamza': { password: 'Hamza@123', role: 'user', name: 'Hamza' },
  'abraham': { password: 'Abraham@123', role: 'user', name: 'Abraham' },
  'arman': { password: 'Arman@123', role: 'user', name: 'Arman' },
  'demo': { password: 'Demo@123', role: 'user', name: 'Demo User' },
}

// Default site settings
const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'Al Rayes Laundry',
  companyLocation: 'Doha, Qatar',
  portalName: 'IT Management Portal',
  version: '4.0',
  defaultSlaHours: { low: 48, medium: 24, high: 8, critical: 4 },
  alertEmails: ['it@alrayes.com'],
  maintenanceWindow: 'Sunday 2:00 AM - 4:00 AM',
  backupRetentionDays: 30,
  maxLoginAttempts: 3,
  sessionTimeoutMinutes: 60,
  mapLatitude: 25.2854,
  mapLongitude: 51.5310,
  mapZoom: 12,
  factoryNetwork: '192.168.2.0/24',
  managementNetwork: '192.168.100.0/24',
  quickActions: [
    { id: 'qa1', label: 'New Ticket', icon: 'Plus', targetTab: 'tickets', action: 'new', enabled: true },
    { id: 'qa2', label: 'Daily Tasks', icon: 'CheckCircle', targetTab: 'checklist', enabled: true },
    { id: 'qa3', label: 'Calendar', icon: 'CalendarDays', targetTab: 'calendar', enabled: true },
    { id: 'qa4', label: 'Knowledge Base', icon: 'Book', targetTab: 'knowledge', enabled: true },
  ],
  systemStatus: [
    { id: 'ss1', name: 'SAP B1', icon: 'Database', status: 'ok', targetTab: 'monitoring', enabled: true },
    { id: 'ss2', name: 'LMS Server', icon: 'Server', status: 'ok', targetTab: 'monitoring', enabled: true },
    { id: 'ss3', name: 'Network', icon: 'Wifi', status: 'ok', targetTab: 'network', enabled: true },
    { id: 'ss4', name: 'Office 365', icon: 'Mail', status: 'ok', targetTab: 'monitoring', enabled: true },
    { id: 'ss5', name: 'Firewall', icon: 'Shield', status: 'ok', targetTab: 'network', enabled: true },
  ],
}

// Module permissions - define which roles can access which modules
const MODULE_PERMISSIONS: Record<string, { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  adminOnly: boolean;
  description: string;
  category: 'general' | 'sensitive' | 'critical';
}> = {
  'dashboard': { label: 'Dashboard', icon: Activity, adminOnly: false, description: 'System overview and statistics', category: 'general' },
  'monitoring': { label: 'Monitoring', icon: Server, adminOnly: false, description: 'Server health and performance', category: 'general' },
  'checklist': { label: 'Daily Tasks', icon: CheckCircle, adminOnly: false, description: 'Daily IT maintenance tasks', category: 'general' },
  'tickets': { label: 'Tickets', icon: Ticket, adminOnly: false, description: 'IT support ticket management', category: 'general' },
  'assets': { label: 'Assets', icon: Monitor, adminOnly: false, description: 'IT asset inventory', category: 'general' },
  'visitors': { label: 'Visitors', icon: Users, adminOnly: false, description: 'Visitor management and tracking', category: 'general' },
  'meetings': { label: 'Meetings', icon: Video, adminOnly: false, description: 'Meeting scheduler with video conferencing', category: 'general' },
  'calendar': { label: 'Calendar', icon: CalendarDays, adminOnly: false, description: 'Maintenance schedules and events', category: 'general' },
  'charters': { label: 'Charters', icon: FileCheck, adminOnly: false, description: 'Programme and project charters', category: 'sensitive' },
  'licenses': { label: 'Licenses', icon: Clipboard, adminOnly: false, description: 'Software license tracking', category: 'sensitive' },
  'knowledge': { label: 'Knowledge', icon: Book, adminOnly: false, description: 'Documentation and FAQs', category: 'general' },
  'network': { label: 'Network', icon: Network, adminOnly: false, description: 'Network topology and equipment', category: 'sensitive' },
  'passwords': { label: 'Passwords', icon: Key, adminOnly: true, description: 'System credentials vault', category: 'critical' },
  'backups': { label: 'Backups', icon: HardDrive, adminOnly: false, description: 'Backup job monitoring', category: 'sensitive' },
  'notebook': { label: 'Notebook', icon: Folder, adminOnly: false, description: 'Organized notes and documentation', category: 'general' },
  'team': { label: 'Team', icon: Users, adminOnly: false, description: 'IT team directory', category: 'general' },
  'logs': { label: 'Logs', icon: History, adminOnly: true, description: 'Activity and audit logs', category: 'critical' },
  'emergency': { label: 'Emergency', icon: Phone, adminOnly: false, description: 'Emergency contacts and procedures', category: 'general' },
  'accesscontrol': { label: 'Access Control', icon: Shield, adminOnly: true, description: 'User permissions management', category: 'critical' },
  'settings': { label: 'Settings', icon: Settings, adminOnly: true, description: 'Site configuration and parameters', category: 'critical' },
  'reports': { label: 'Reports', icon: BarChart3, adminOnly: false, description: 'Analytics and reports', category: 'general' },
  'announcements': { label: 'Announcements', icon: Bell, adminOnly: false, description: 'Company announcements', category: 'general' },
  'vendors': { label: 'Vendors', icon: Building, adminOnly: false, description: 'Vendor and contract management', category: 'sensitive' },
  'budget': { label: 'Budget', icon: PieChart, adminOnly: false, description: 'IT budget tracking', category: 'sensitive' },
}

// ===================== DEFAULT DATA =====================
const defaultAssets: ITAsset[] = [
  { id: '1', type: 'server', name: 'DC-MAIN-01', model: 'Dell PowerEdge R740', serialNumber: 'SVR-2024-001', location: 'Server Room', ipAddress: '192.168.2.10', status: 'active', assignedTo: 'IT Department', purchaseDate: '2023-01-15', warrantyEnd: '2026-01-15', notes: 'Primary Domain Controller' },
  { id: '2', type: 'server', name: 'SAP-SERVER', model: 'Dell PowerEdge R650', serialNumber: 'SVR-2024-002', location: 'Server Room', ipAddress: '192.168.2.11', status: 'active', assignedTo: 'IT Department', purchaseDate: '2023-03-20', warrantyEnd: '2026-03-20', notes: 'SAP B1 Application Server' },
  { id: '3', type: 'server', name: 'LMS-SERVER', model: 'HP ProLiant DL380', serialNumber: 'SVR-2024-003', location: 'Server Room', ipAddress: '192.168.2.12', status: 'active', assignedTo: 'IT Department', purchaseDate: '2023-05-10', warrantyEnd: '2026-05-10', notes: 'LMS Application Server' },
  { id: '4', type: 'computer', name: 'PC-HRM-01', model: 'Dell OptiPlex 7090', serialNumber: 'PC-2024-101', location: 'HR Manager Office', ipAddress: '192.168.100.50', status: 'active', assignedTo: 'HR Manager', purchaseDate: '2024-01-10', warrantyEnd: '2027-01-10', notes: '' },
  { id: '5', type: 'computer', name: 'PC-ACCOUNTS-01', model: 'HP ProDesk 400', serialNumber: 'PC-2024-102', location: 'Accounts Department', ipAddress: '192.168.100.51', status: 'active', assignedTo: 'Accounts Team', purchaseDate: '2024-02-15', warrantyEnd: '2027-02-15', notes: '' },
  { id: '6', type: 'printer', name: 'PR-FACTORY-01', model: 'HP LaserJet Enterprise', serialNumber: 'PR-2024-001', location: 'Factory Floor', ipAddress: '192.168.2.200', status: 'active', assignedTo: 'Factory', purchaseDate: '2023-06-01', warrantyEnd: '2026-06-01', notes: '' },
  { id: '7', type: 'network', name: 'FW-MAIN', model: 'Fortinet FortiGate 100F', serialNumber: 'FW-2024-001', location: 'Server Room', ipAddress: '192.168.2.1', status: 'active', assignedTo: 'IT Department', purchaseDate: '2023-04-01', warrantyEnd: '2026-04-01', notes: 'Main Firewall' },
  { id: '8', type: 'computer', name: 'PC-RECEPTION-01', model: 'Dell OptiPlex 7090', serialNumber: 'PC-2024-103', location: 'Reception', ipAddress: '192.168.100.52', status: 'maintenance', assignedTo: 'Reception', purchaseDate: '2024-01-20', warrantyEnd: '2027-01-20', notes: 'Under maintenance' },
]

const defaultTickets: ITTicket[] = [
  { id: 'TKT-001', title: 'Printer not working in Factory', description: 'The main factory printer is showing paper jam error', priority: 'high', status: 'open', category: 'Hardware', requester: 'Factory Manager', assignedTo: 'MD Irfan', createdAt: '2026-03-24 08:00', updatedAt: '2026-03-24 08:00', resolution: '', slaDeadline: '2026-03-25 08:00' },
  { id: 'TKT-002', title: 'Cannot access SAP B1', description: 'User unable to login to SAP B1 system', priority: 'critical', status: 'in-progress', category: 'Software', requester: 'Accounts Team', assignedTo: 'Hamza', createdAt: '2026-03-24 09:30', updatedAt: '2026-03-24 10:00', resolution: '', slaDeadline: '2026-03-24 17:30' },
  { id: 'TKT-003', title: 'New employee setup required', description: 'New employee joining tomorrow - needs PC, email, LMS access', priority: 'medium', status: 'open', category: 'Onboarding', requester: 'HR Manager', assignedTo: 'Arman', createdAt: '2026-03-23 14:00', updatedAt: '2026-03-23 14:00', resolution: '', slaDeadline: '2026-03-25 14:00' },
  { id: 'TKT-004', title: 'Internet slow in Management building', description: 'Users reporting slow internet speeds', priority: 'medium', status: 'resolved', category: 'Network', requester: 'Admin Team', assignedTo: 'Abraham', createdAt: '2026-03-22 10:00', updatedAt: '2026-03-23 11:00', resolution: 'Restarted network switch, issue resolved', slaDeadline: '2026-03-24 10:00' },
]

const defaultCredentials: Credential[] = [
  { id: '1', system: 'SAP B1', username: 'manager', password: 'SAP@Admin2024!', url: 'http://192.168.2.11:30010', notes: 'Superuser account', lastUpdated: '2026-03-15', category: 'Enterprise' },
  { id: '2', system: 'LMS (Crystol)', username: 'admin', password: 'LMS#Crytol@24', url: 'http://lms.alrayes.com', notes: 'Main admin account', lastUpdated: '2026-03-10', category: 'Enterprise' },
  { id: '3', system: 'Office 365', username: 'admin@alrayes.com', password: 'O365$Admin!2024', url: 'https://admin.microsoft.com', notes: 'Global admin account', lastUpdated: '2026-03-01', category: 'Cloud' },
  { id: '4', system: 'Matrix Cosec', username: 'admin', password: 'Matrix@Cosec24', url: 'http://192.168.2.15', notes: 'Access control system', lastUpdated: '2026-02-28', category: 'Security' },
  { id: '5', system: 'Fortinet Firewall', username: 'admin', password: 'Forti#Admin!24', url: 'https://192.168.2.1', notes: 'Firewall admin', lastUpdated: '2026-02-20', category: 'Network' },
]

const defaultBackups: BackupJob[] = [
  { id: '1', name: 'SAP Database Backup', type: 'full', schedule: 'Daily 2:00 AM', lastRun: '2026-03-24 02:00', nextRun: '2026-03-25 02:00', status: 'success', size: '45 GB', retention: '30 days' },
  { id: '2', name: 'LMS Database Backup', type: 'incremental', schedule: 'Daily 3:00 AM', lastRun: '2026-03-24 03:00', nextRun: '2026-03-25 03:00', status: 'success', size: '12 GB', retention: '30 days' },
  { id: '3', name: 'File Server Backup', type: 'full', schedule: 'Weekly Sunday 1:00 AM', lastRun: '2026-03-20 01:00', nextRun: '2026-03-27 01:00', status: 'success', size: '250 GB', retention: '90 days' },
  { id: '4', name: 'Email Backup', type: 'incremental', schedule: 'Daily 4:00 AM', lastRun: '2026-03-24 04:00', nextRun: '2026-03-25 04:00', status: 'warning', size: '85 GB', retention: '365 days' },
  { id: '5', name: 'Domain Controller', type: 'full', schedule: 'Weekly Sunday 3:00 AM', lastRun: '2026-03-20 03:00', nextRun: '2026-03-27 03:00', status: 'success', size: '35 GB', retention: '60 days' },
]

const defaultChecks: DailyCheck[] = [
  { id: '1', task: 'Check backup status', category: 'Backups', completed: false, timestamp: '' },
  { id: '2', task: 'Verify server health', category: 'Servers', completed: false, timestamp: '' },
  { id: '3', task: 'Check network connectivity', category: 'Network', completed: false, timestamp: '' },
  { id: '4', task: 'Review pending tickets', category: 'Tickets', completed: false, timestamp: '' },
  { id: '5', task: 'Check firewall logs', category: 'Security', completed: false, timestamp: '' },
  { id: '6', task: 'Verify antivirus updates', category: 'Security', completed: false, timestamp: '' },
  { id: '7', task: 'Check disk space on servers', category: 'Servers', completed: false, timestamp: '' },
  { id: '8', task: 'Review system alerts', category: 'Monitoring', completed: false, timestamp: '' },
]

const defaultNotes: QuickNote[] = [
  { id: '1', title: 'Ooredoo Support Contact', content: 'Call 111 for Ooredoo support. Account number: XXXXXX', category: 'Vendors', createdAt: '2026-03-20', updatedAt: '2026-03-20', pinned: true },
  { id: '2', title: 'SAP License Renewal', content: 'SAP B1 license renewal due: June 2026. Contact vendor 2 months before.', category: 'Licenses', createdAt: '2026-03-15', updatedAt: '2026-03-15', pinned: false },
]

const defaultAlerts: SystemAlert[] = [
  { id: '1', type: 'warning', title: 'Email Backup Warning', message: 'Email backup completed with warnings - storage low', timestamp: '2026-03-24 04:15', read: false },
  { id: '2', type: 'info', title: 'Scheduled Maintenance', message: 'System maintenance scheduled for Sunday 2AM', timestamp: '2026-03-23 10:00', read: false },
  { id: '3', type: 'error', title: 'Critical Ticket', message: 'SAP B1 access issue - assigned to Hamza', timestamp: '2026-03-24 09:30', read: false },
]

const defaultCalendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Server Maintenance', description: 'Monthly server patching and updates', date: '2026-03-28', type: 'maintenance', reminder: true },
  { id: '2', title: 'Fortinet Warranty Expiry', description: 'Fortinet FortiGate 100F warranty expires', date: '2026-04-01', type: 'warranty', reminder: true },
  { id: '3', title: 'SAP License Renewal', description: 'Annual SAP B1 license renewal', date: '2026-06-15', type: 'license', reminder: true },
  { id: '4', title: 'IT Team Meeting', description: 'Weekly IT team sync meeting', date: '2026-03-25', type: 'meeting', reminder: true },
]

const defaultLicenses: License[] = [
  { id: '1', software: 'SAP B1', vendor: 'SAP', licenseKey: 'XXXX-XXXX-XXXX-XXXX', purchaseDate: '2025-06-15', expiryDate: '2026-06-15', seats: 25, usedSeats: 22, cost: 'QAR 50,000', category: 'Enterprise' },
  { id: '2', software: 'Microsoft 365', vendor: 'Microsoft', licenseKey: 'YYYY-YYYY-YYYY-YYYY', purchaseDate: '2025-01-01', expiryDate: '2026-01-01', seats: 100, usedSeats: 85, cost: 'QAR 36,000', category: 'Cloud' },
  { id: '3', software: 'Adobe Acrobat Pro', vendor: 'Adobe', licenseKey: 'ZZZZ-ZZZZ-ZZZZ-ZZZZ', purchaseDate: '2025-03-01', expiryDate: '2026-03-01', seats: 10, usedSeats: 8, cost: 'QAR 4,800', category: 'Productivity' },
  { id: '4', software: 'Fortinet FortiGate', vendor: 'Fortinet', licenseKey: 'AAAA-AAAA-AAAA-AAAA', purchaseDate: '2025-04-01', expiryDate: '2026-04-01', seats: 1, usedSeats: 1, cost: 'QAR 15,000', category: 'Security' },
]

const defaultKnowledge: KnowledgeArticle[] = [
  { id: '1', title: 'How to Reset AD Password', content: '1. Open Active Directory Users and Computers\n2. Find the user account\n3. Right-click and select "Reset Password"\n4. Enter new password\n5. Check "User must change password at next logon"', category: 'User Management', tags: ['AD', 'Password', 'User'], createdAt: '2026-01-15', updatedAt: '2026-01-15', views: 45 },
  { id: '2', title: 'New Employee Setup Checklist', content: '1. Create AD account\n2. Setup email (Office 365)\n3. Add to required groups\n4. Assign workstation\n5. Configure LMS access\n6. Setup phone extension\n7. Issue ID card', category: 'Onboarding', tags: ['New User', 'Setup', 'Checklist'], createdAt: '2026-02-01', updatedAt: '2026-02-01', views: 32 },
  { id: '3', title: 'SAP B1 Common Issues', content: 'Issue: Cannot login\nSolution: Check SQL services, verify user exists, reset password if needed\n\nIssue: Slow performance\nSolution: Clear temp files, check database size, restart application server', category: 'Software', tags: ['SAP', 'Troubleshooting'], createdAt: '2026-02-15', updatedAt: '2026-02-15', views: 28 },
]

const defaultLogs: ActivityLog[] = [
  { id: '1', user: 'Simon Peter', action: 'Created Ticket', category: 'Tickets', details: 'Created TKT-001 - Printer not working', timestamp: '2026-03-24 08:00' },
  { id: '2', user: 'Hamza', action: 'Updated Ticket', category: 'Tickets', details: 'Changed status to In Progress for TKT-002', timestamp: '2026-03-24 09:30' },
  { id: '3', user: 'Administrator', action: 'Added Asset', category: 'Assets', details: 'Added PC-RECEPTION-01', timestamp: '2026-03-23 14:00' },
  { id: '4', user: 'Abraham', action: 'Resolved Ticket', category: 'Tickets', details: 'Resolved TKT-004 - Internet slow', timestamp: '2026-03-23 11:00' },
]

const serverMonitors: ServerMonitor[] = [
  { id: '1', name: 'DC-MAIN-01', ip: '192.168.2.10', status: 'online', cpu: 45, memory: 62, disk: 55, uptime: '45 days' },
  { id: '2', name: 'SAP-SERVER', ip: '192.168.2.11', status: 'online', cpu: 68, memory: 78, disk: 65, uptime: '30 days' },
  { id: '3', name: 'LMS-SERVER', ip: '192.168.2.12', status: 'online', cpu: 35, memory: 45, disk: 40, uptime: '60 days' },
  { id: '4', name: 'FW-MAIN', ip: '192.168.2.1', status: 'online', cpu: 25, memory: 40, disk: 30, uptime: '90 days' },
]

// Default meetings data
const defaultMeetings: Meeting[] = [
  { 
    id: '1', 
    title: 'Weekly IT Team Sync', 
    description: 'Weekly sync meeting to discuss ongoing projects and issues', 
    date: '2026-03-25', 
    time: '10:00',
    duration: 60,
    organizer: 'Simon Peter',
    participants: ['MD Irfan', 'Hamza', 'Abraham', 'Arman'],
    meetingType: 'video',
    platform: 'jitsi',
    meetingLink: 'https://meet.jit.si/AlRayesITWeekly2026',
    location: '',
    agenda: '1. Weekly updates\n2. Pending tickets review\n3. Project status\n4. Any other business',
    status: 'scheduled',
    notes: '',
    createdAt: '2026-03-20'
  },
  { 
    id: '2', 
    title: 'SAP B1 Upgrade Planning', 
    description: 'Planning meeting for upcoming SAP B1 version upgrade', 
    date: '2026-03-26', 
    time: '14:00',
    duration: 90,
    organizer: 'Simon Peter',
    participants: ['Simon Peter', 'MD Irfan', 'SAP Vendor'],
    meetingType: 'hybrid',
    platform: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/example',
    location: 'Conference Room A',
    agenda: '1. Current version status\n2. Upgrade requirements\n3. Timeline discussion\n4. Resource allocation',
    status: 'scheduled',
    notes: '',
    createdAt: '2026-03-22'
  },
  { 
    id: '3', 
    title: 'Network Security Review', 
    description: 'Quarterly network security assessment meeting', 
    date: '2026-03-20', 
    time: '09:00',
    duration: 120,
    organizer: 'Simon Peter',
    participants: ['IT Team', 'Security Team'],
    meetingType: 'in-person',
    platform: 'other',
    meetingLink: '',
    location: 'Main Conference Room',
    agenda: '1. Firewall rules review\n2. VPN access audit\n3. Patch status\n4. Security recommendations',
    status: 'completed',
    notes: 'Completed quarterly review. All systems secure. New firewall rules approved.',
    createdAt: '2026-03-15'
  },
]

// Default programme charters
const defaultCharters: ProgrammeCharter[] = [
  {
    id: '1',
    name: 'IT Infrastructure Modernization',
    description: 'Modernize IT infrastructure including server upgrades, network optimization, and cloud migration',
    objectives: ['Improve system reliability to 99.9% uptime', 'Reduce operational costs by 20%', 'Enable remote work capabilities', 'Enhance security posture'],
    scope: 'Server hardware upgrade, network equipment refresh, cloud migration for non-critical systems, implementation of new monitoring tools',
    outOfScope: ['Desktop PC replacements', 'Software license renewals', 'Phone system upgrades'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    budget: 'QAR 500,000',
    sponsor: 'General Manager',
    projectManager: 'Simon Peter',
    stakeholders: [
      { name: 'General Manager', role: 'Executive Sponsor', email: 'gm@alrayes.com' },
      { name: 'Finance Director', role: 'Budget Approval', email: 'finance@alrayes.com' },
      { name: 'IT Team', role: 'Implementation', email: 'it@alrayes.com' }
    ],
    deliverables: [
      { name: 'New server deployment', dueDate: '2026-03-31', status: 'completed' },
      { name: 'Network upgrade', dueDate: '2026-06-30', status: 'in-progress' },
      { name: 'Cloud migration', dueDate: '2026-09-30', status: 'pending' },
      { name: 'Monitoring implementation', dueDate: '2026-12-31', status: 'pending' }
    ],
    milestones: [
      { name: 'Phase 1 Complete', date: '2026-03-31', status: 'completed' },
      { name: 'Phase 2 Complete', date: '2026-06-30', status: 'in-progress' },
      { name: 'Phase 3 Complete', date: '2026-09-30', status: 'pending' },
      { name: 'Project Closure', date: '2026-12-31', status: 'pending' }
    ],
    risks: [
      { risk: 'Vendor delays', impact: 'High', mitigation: 'Early ordering, multiple vendor options', owner: 'Simon Peter' },
      { risk: 'Budget overrun', impact: 'Medium', mitigation: 'Monthly budget reviews, contingency fund', owner: 'Finance Director' },
      { risk: 'Staff resistance', impact: 'Low', mitigation: 'Training sessions, change management', owner: 'IT Team' }
    ],
    successCriteria: ['99.9% system uptime achieved', 'All systems migrated successfully', 'User satisfaction > 80%', 'Budget variance < 10%'],
    assumptions: ['Budget approval obtained', 'Vendor availability confirmed', 'Staff available for training'],
    constraints: ['Must maintain business continuity', 'Limited downtime windows', 'Budget ceiling of QAR 500,000'],
    status: 'active',
    createdAt: '2025-12-15',
    updatedAt: '2026-03-24'
  },
  {
    id: '2',
    name: 'LMS Enhancement Project',
    description: 'Enhance the Learning Management System with new features and integrations',
    objectives: ['Add RFID integration', 'Improve reporting capabilities', 'Mobile app development', 'API integration with HR system'],
    scope: 'RFID badge integration, custom reports module, mobile application, HR system API',
    outOfScope: ['LMS core platform changes', 'Database migration'],
    startDate: '2026-02-01',
    endDate: '2026-07-31',
    budget: 'QAR 150,000',
    sponsor: 'HR Director',
    projectManager: 'MD Irfan',
    stakeholders: [
      { name: 'HR Director', role: 'Sponsor', email: 'hr@alrayes.com' },
      { name: 'Crystol Technologies', role: 'Vendor', email: 'support@crystol.com' }
    ],
    deliverables: [
      { name: 'RFID Integration', dueDate: '2026-04-15', status: 'in-progress' },
      { name: 'Reports Module', dueDate: '2026-05-31', status: 'pending' },
      { name: 'Mobile App', dueDate: '2026-07-15', status: 'pending' }
    ],
    milestones: [
      { name: 'RFID Integration Complete', date: '2026-04-15', status: 'in-progress' },
      { name: 'Reports Launch', date: '2026-05-31', status: 'pending' },
      { name: 'App Release', date: '2026-07-31', status: 'pending' }
    ],
    risks: [
      { risk: 'Vendor resource constraints', impact: 'Medium', mitigation: 'Early coordination, buffer time', owner: 'MD Irfan' }
    ],
    successCriteria: ['RFID working for all employees', 'Reports generating correctly', 'Mobile app functional'],
    assumptions: ['Vendor cooperation', 'Hardware compatibility'],
    constraints: ['6-month timeline', 'Fixed budget'],
    status: 'active',
    createdAt: '2026-01-20',
    updatedAt: '2026-03-20'
  }
]

// Default notebook pages
const defaultNotebookPages: NotebookPage[] = [
  {
    id: '1',
    title: 'Server Configuration Notes',
    content: '# Server Configuration\n\n## DC-MAIN-01\n- OS: Windows Server 2022\n- RAM: 64GB\n- Storage: 2TB RAID 10\n- Roles: AD, DNS, DHCP\n\n## SAP-SERVER\n- OS: Windows Server 2022\n- RAM: 128GB\n- Storage: 4TB RAID 5\n- SQL Server 2019\n\n## LMS-SERVER\n- OS: Ubuntu 22.04 LTS\n- RAM: 32GB\n- Storage: 1TB SSD',
    folder: 'Servers',
    tags: ['server', 'configuration', 'infrastructure'],
    createdAt: '2026-01-15',
    updatedAt: '2026-03-20',
    pinned: true,
    favorite: true,
    color: '#3B82F6'
  },
  {
    id: '2',
    title: 'Network Diagram Reference',
    content: '# Network Topology\n\n```\nInternet (Ooredoo 1Gbps)\n        |\n   FortiGate 100F (192.168.2.1)\n        |\n   Core Switch\n   /    |    \\\nFactory  Mgmt  Guest\n192.168.2.x  192.168.100.x  192.168.200.x\n```\n\n## VLANs\n- VLAN 10: Factory (192.168.2.0/24)\n- VLAN 20: Management (192.168.100.0/24)\n- VLAN 30: Guest (192.168.200.0/24)',
    folder: 'Network',
    tags: ['network', 'topology', 'vlan'],
    createdAt: '2026-02-01',
    updatedAt: '2026-02-15',
    pinned: false,
    favorite: true,
    color: '#10B981'
  },
  {
    id: '3',
    title: 'Vendor Contacts',
    content: '# Vendor Contact List\n\n## Ooredoo Business\n- Support: 111\n- Account Manager: +974 XXXX XXXX\n- Account #: XXXXXX\n\n## SAP Support\n- Portal: https://support.sap.com\n- Customer ID: XXXXXX\n\n## Crystol Technologies (LMS)\n- Email: support@crystol.com\n- Phone: +974 XXXX XXXX',
    folder: 'Contacts',
    tags: ['vendor', 'contacts', 'support'],
    createdAt: '2026-01-20',
    updatedAt: '2026-03-10',
    pinned: true,
    favorite: false,
    color: '#F59E0B'
  },
  {
    id: '4',
    title: 'Scripts & Commands',
    content: '# Useful Commands\n\n## Active Directory\n```powershell\n# Unlock user account\nUnlock-ADAccount -Identity username\n\n# Reset password\nSet-ADAccountPassword -Identity username -Reset\n```\n\n## SQL Server\n```sql\n-- Check database size\nEXEC sp_spaceused\n\n-- Backup database\nBACKUP DATABASE [SAP_DB] TO DISK = N\'D:\\Backup\\SAP_DB.bak\'\n```\n\n## Linux\n```bash\n# Check disk space\ndf -h\n\n# Check memory\nfree -m\n```',
    folder: 'Scripts',
    tags: ['scripts', 'commands', 'powershell', 'linux'],
    createdAt: '2026-02-10',
    updatedAt: '2026-03-15',
    pinned: false,
    favorite: false,
    color: '#8B5CF6'
  }
]

// Default visitors data
const defaultVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    company: 'Ooredoo Qatar',
    email: 'ahmed.hassan@ooredoo.qa',
    phone: '+974 5012 3456',
    purpose: 'Network equipment installation',
    hostName: 'Simon Peter',
    hostDepartment: 'IT',
    checkInTime: '2026-03-24 09:00',
    checkOutTime: '',
    status: 'checked-in',
    visitorType: 'vendor',
    idType: 'Qatar ID',
    idNumber: '28XXXXXX',
    photoUrl: '',
    badgeNumber: 'V-2026-001',
    vehicleNumber: 'Q-12345',
    notes: 'Installing new network switch in server room',
    createdAt: '2026-03-24'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    company: 'SAP Middle East',
    email: 's.williams@sap.com',
    phone: '+974 5555 7890',
    purpose: 'SAP B1 training session',
    hostName: 'MD Irfan',
    hostDepartment: 'IT',
    checkInTime: '2026-03-24 10:30',
    checkOutTime: '',
    status: 'checked-in',
    visitorType: 'vendor',
    idType: 'Passport',
    idNumber: 'A12345678',
    photoUrl: '',
    badgeNumber: 'V-2026-002',
    vehicleNumber: '',
    notes: 'Conducting SAP training for finance team',
    createdAt: '2026-03-24'
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    company: 'Al Jaber Engineering',
    email: 'm.ali@jabereng.com',
    phone: '+974 4411 2233',
    purpose: 'IT infrastructure consultation',
    hostName: 'Simon Peter',
    hostDepartment: 'IT',
    checkInTime: '2026-03-23 14:00',
    checkOutTime: '2026-03-23 16:30',
    status: 'checked-out',
    visitorType: 'contractor',
    idType: 'Qatar ID',
    idNumber: '29XXXXXX',
    photoUrl: '',
    badgeNumber: 'V-2026-003',
    vehicleNumber: 'Q-54321',
    notes: 'Discussed network expansion for new factory wing',
    createdAt: '2026-03-23'
  },
  {
    id: '4',
    name: 'Jennifer Chen',
    company: 'Self',
    email: 'j.chen@email.com',
    phone: '+974 3344 5566',
    purpose: 'Job Interview - IT Support',
    hostName: 'Simon Peter',
    hostDepartment: 'HR',
    checkInTime: '2026-03-24 11:00',
    checkOutTime: '',
    status: 'expected',
    visitorType: 'interview',
    idType: 'Passport',
    idNumber: 'B98765432',
    photoUrl: '',
    badgeNumber: '',
    vehicleNumber: '',
    notes: 'Interview for IT Support position at 11:00 AM',
    createdAt: '2026-03-24'
  },
  {
    id: '5',
    name: 'DHL Express Courier',
    company: 'DHL Qatar',
    email: 'courier@dhl.com',
    phone: '+974 4455 6677',
    purpose: 'Equipment delivery',
    hostName: 'Arman',
    hostDepartment: 'IT',
    checkInTime: '2026-03-24 08:45',
    checkOutTime: '2026-03-24 09:15',
    status: 'checked-out',
    visitorType: 'delivery',
    idType: 'Staff ID',
    idNumber: 'DHL-7890',
    photoUrl: '',
    badgeNumber: 'V-2026-004',
    vehicleNumber: 'DHL-123',
    notes: 'Delivered new monitors for accounts department',
    createdAt: '2026-03-24'
  }
]

// Default announcements
const defaultAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance Scheduled',
    content: 'Scheduled maintenance will occur on Sunday from 2:00 AM to 4:00 AM. Please save your work before leaving on Saturday.',
    type: 'maintenance',
    priority: 'important',
    author: 'IT Department',
    createdAt: '2026-03-20',
    expiresAt: '2026-03-30',
    read: false,
    pinned: true
  },
  {
    id: '2',
    title: 'New Security Policy Update',
    content: 'All users must change their passwords every 90 days. Please update your password before the end of the month.',
    type: 'security',
    priority: 'urgent',
    author: 'IT Security',
    createdAt: '2026-03-22',
    expiresAt: '2026-04-22',
    read: false,
    pinned: true
  },
  {
    id: '3',
    title: 'Welcome to IT Portal v4.0',
    content: 'The IT Management Portal has been upgraded with new features including Reports, Announcements, Vendor Management, and Budget Tracking.',
    type: 'general',
    priority: 'normal',
    author: 'Simon Peter',
    createdAt: '2026-03-24',
    expiresAt: '2026-04-24',
    read: false,
    pinned: false
  },
  {
    id: '4',
    title: 'IT Training Session',
    content: 'A training session on SAP B1 best practices will be held on March 28th at 2:00 PM in Conference Room A.',
    type: 'hr',
    priority: 'normal',
    author: 'HR Department',
    createdAt: '2026-03-23',
    expiresAt: '2026-03-29',
    read: false,
    pinned: false
  }
]

// Default vendors
const defaultVendors: Vendor[] = [
  {
    id: '1',
    name: 'Ooredoo Qatar',
    category: 'telecom',
    contactPerson: 'Ahmed Al-Mahmoud',
    email: 'business@ooredoo.qa',
    phone: '+974 111',
    address: 'Ooredoo Tower, West Bay, Doha',
    website: 'https://www.ooredoo.qa',
    contractStart: '2025-01-01',
    contractEnd: '2026-12-31',
    contractValue: 'QAR 120,000/year',
    slaDetails: '24/7 support, 4-hour response time for critical issues',
    rating: 4,
    notes: 'Primary internet and telecom provider',
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    name: 'SAP Middle East',
    category: 'software',
    contactPerson: 'Sarah Williams',
    email: 'support@sap.com',
    phone: '+974 5555 7890',
    address: 'Tornado Tower, West Bay, Doha',
    website: 'https://www.sap.com',
    contractStart: '2025-06-01',
    contractEnd: '2026-06-30',
    contractValue: 'QAR 50,000/year',
    slaDetails: 'Business hours support, 8-hour response time',
    rating: 5,
    notes: 'SAP B1 license and support provider',
    createdAt: '2025-06-01'
  },
  {
    id: '3',
    name: 'Crystol Technologies',
    category: 'software',
    contactPerson: 'Rajesh Kumar',
    email: 'support@crystol.com',
    phone: '+974 4411 2233',
    address: 'Crystal Plaza, Al Sadd, Doha',
    website: 'https://www.crystol.com',
    contractStart: '2025-02-01',
    contractEnd: '2026-01-31',
    contractValue: 'QAR 30,000/year',
    slaDetails: '9 AM - 6 PM support, 24-hour response time',
    rating: 4,
    notes: 'LMS (Learning Management System) provider',
    createdAt: '2025-02-01'
  },
  {
    id: '4',
    name: 'Dell Technologies Qatar',
    category: 'hardware',
    contactPerson: 'Mohammed Hassan',
    email: 'sales@dell.com',
    phone: '+974 4444 5555',
    address: 'Al Maha Tower, West Bay, Doha',
    website: 'https://www.dell.com',
    contractStart: '2025-01-01',
    contractEnd: '2025-12-31',
    contractValue: 'QAR 200,000/year',
    slaDetails: 'Next business day on-site support',
    rating: 5,
    notes: 'Primary hardware vendor for servers and workstations',
    createdAt: '2025-01-01'
  },
  {
    id: '5',
    name: 'Fortinet Qatar',
    category: 'hardware',
    contactPerson: 'Ali Rashid',
    email: 'support@fortinet.com',
    phone: '+974 6666 7777',
    address: 'Vegas Tower, West Bay, Doha',
    website: 'https://www.fortinet.com',
    contractStart: '2025-04-01',
    contractEnd: '2026-03-31',
    contractValue: 'QAR 15,000/year',
    slaDetails: '24/7 phone support, firmware updates',
    rating: 4,
    notes: 'Firewall and security appliances',
    createdAt: '2025-04-01'
  }
]

// Default budget items
const defaultBudgetItems: BudgetItem[] = [
  // Budget allocations
  { id: 'b1', category: 'hardware', description: 'Annual Hardware Budget', amount: 200000, date: '2026-01-01', type: 'budget', approvedBy: 'Management', status: 'approved', notes: 'Servers, workstations, peripherals', createdAt: '2026-01-01' },
  { id: 'b2', category: 'software', description: 'Annual Software Budget', amount: 100000, date: '2026-01-01', type: 'budget', approvedBy: 'Management', status: 'approved', notes: 'Licenses, subscriptions, SaaS', createdAt: '2026-01-01' },
  { id: 'b3', category: 'services', description: 'Annual Services Budget', amount: 50000, date: '2026-01-01', type: 'budget', approvedBy: 'Management', status: 'approved', notes: 'Consulting, maintenance contracts', createdAt: '2026-01-01' },
  { id: 'b4', category: 'training', description: 'Annual Training Budget', amount: 20000, date: '2026-01-01', type: 'budget', approvedBy: 'Management', status: 'approved', notes: 'IT certifications, courses', createdAt: '2026-01-01' },
  // Expenses
  { id: 'e1', category: 'hardware', description: 'Dell PowerEdge R740 Server', amount: 45000, date: '2026-02-15', type: 'expense', approvedBy: 'Simon Peter', status: 'approved', notes: 'Replacement for old server', createdAt: '2026-02-15' },
  { id: 'e2', category: 'software', description: 'SAP B1 License Renewal', amount: 50000, date: '2026-03-01', type: 'expense', approvedBy: 'Finance Director', status: 'approved', notes: 'Annual license renewal', createdAt: '2026-03-01' },
  { id: 'e3', category: 'hardware', description: 'HP LaserJet Printers (5 units)', amount: 15000, date: '2026-03-10', type: 'expense', approvedBy: 'Simon Peter', status: 'approved', notes: 'Factory and office printers', createdAt: '2026-03-10' },
  { id: 'e4', category: 'services', description: 'Network Consulting', amount: 8000, date: '2026-03-15', type: 'expense', approvedBy: 'Simon Peter', status: 'pending', notes: 'Network optimization project', createdAt: '2026-03-15' },
  { id: 'e5', category: 'training', description: 'Azure Certification Training', amount: 5000, date: '2026-03-20', type: 'expense', approvedBy: 'HR Director', status: 'approved', notes: 'MD Irfan - AZ-104 certification', createdAt: '2026-03-20' },
  { id: 'e6', category: 'software', description: 'Microsoft 365 Licenses', amount: 36000, date: '2026-01-15', type: 'expense', approvedBy: 'Finance Director', status: 'approved', notes: 'Annual subscription', createdAt: '2026-01-15' },
]

// Default portal visits (for analytics)
const defaultVisits: PortalVisit[] = [
  { id: 'v1', date: '2026-03-24', module: 'dashboard', action: 'view', user: 'Simon Peter', timestamp: '2026-03-24 08:00' },
  { id: 'v2', date: '2026-03-24', module: 'tickets', action: 'create', user: 'Simon Peter', timestamp: '2026-03-24 08:15' },
  { id: 'v3', date: '2026-03-24', module: 'assets', action: 'view', user: 'MD Irfan', timestamp: '2026-03-24 09:00' },
  { id: 'v4', date: '2026-03-24', module: 'checklist', action: 'complete', user: 'Hamza', timestamp: '2026-03-24 09:30' },
  { id: 'v5', date: '2026-03-23', module: 'dashboard', action: 'view', user: 'Abraham', timestamp: '2026-03-23 10:00' },
  { id: 'v6', date: '2026-03-23', module: 'knowledge', action: 'view', user: 'Arman', timestamp: '2026-03-23 11:00' },
  { id: 'v7', date: '2026-03-23', module: 'calendar', action: 'view', user: 'Simon Peter', timestamp: '2026-03-23 14:00' },
  { id: 'v8', date: '2026-03-22', module: 'tickets', action: 'resolve', user: 'Abraham', timestamp: '2026-03-22 16:00' },
  { id: 'v9', date: '2026-03-22', module: 'visitors', action: 'checkin', user: 'Simon Peter', timestamp: '2026-03-22 09:00' },
  { id: 'v10', date: '2026-03-21', module: 'monitoring', action: 'view', user: 'MD Irfan', timestamp: '2026-03-21 08:30' },
]

// ===================== API FETCH FUNCTIONS =====================
const API_BASE = '/api'

async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'API request failed')
  }
  return response.json()
}

// API helper functions for each data type
const api = {
  // Auth
  login: (username: string, password: string) => 
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  
  // Dashboard
  getDashboard: () => apiFetch('/dashboard'),
  
  // Assets
  getAssets: () => apiFetch('/assets'),
  createAsset: (data: any) => apiFetch('/assets', { method: 'POST', body: JSON.stringify(data) }),
  updateAsset: (data: any) => apiFetch('/assets', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAsset: (id: string) => apiFetch(`/assets?id=${id}`, { method: 'DELETE' }),
  
  // Tickets
  getTickets: () => apiFetch('/tickets'),
  createTicket: (data: any) => apiFetch('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateTicket: (data: any) => apiFetch('/tickets', { method: 'PUT', body: JSON.stringify(data) }),
  deleteTicket: (id: string) => apiFetch(`/tickets?id=${id}`, { method: 'DELETE' }),
  
  // Visitors
  getVisitors: () => apiFetch('/visitors'),
  createVisitor: (data: any) => apiFetch('/visitors', { method: 'POST', body: JSON.stringify(data) }),
  updateVisitor: (data: any) => apiFetch('/visitors', { method: 'PUT', body: JSON.stringify(data) }),
  deleteVisitor: (id: string) => apiFetch(`/visitors?id=${id}`, { method: 'DELETE' }),
  
  // Meetings
  getMeetings: () => apiFetch('/meetings'),
  createMeeting: (data: any) => apiFetch('/meetings', { method: 'POST', body: JSON.stringify(data) }),
  updateMeeting: (data: any) => apiFetch('/meetings', { method: 'PUT', body: JSON.stringify(data) }),
  deleteMeeting: (id: string) => apiFetch(`/meetings?id=${id}`, { method: 'DELETE' }),
  
  // Backups
  getBackups: () => apiFetch('/backups'),
  createBackup: (data: any) => apiFetch('/backups', { method: 'POST', body: JSON.stringify(data) }),
  updateBackup: (data: any) => apiFetch('/backups', { method: 'PUT', body: JSON.stringify(data) }),
  deleteBackup: (id: string) => apiFetch(`/backups?id=${id}`, { method: 'DELETE' }),
  
  // Licenses
  getLicenses: () => apiFetch('/licenses'),
  createLicense: (data: any) => apiFetch('/licenses', { method: 'POST', body: JSON.stringify(data) }),
  updateLicense: (data: any) => apiFetch('/licenses', { method: 'PUT', body: JSON.stringify(data) }),
  deleteLicense: (id: string) => apiFetch(`/licenses?id=${id}`, { method: 'DELETE' }),
  
  // Credentials
  getCredentials: () => apiFetch('/credentials'),
  createCredential: (data: any) => apiFetch('/credentials', { method: 'POST', body: JSON.stringify(data) }),
  updateCredential: (data: any) => apiFetch('/credentials', { method: 'PUT', body: JSON.stringify(data) }),
  deleteCredential: (id: string) => apiFetch(`/credentials?id=${id}`, { method: 'DELETE' }),
  
  // Checks
  getChecks: () => apiFetch('/checks'),
  updateCheck: (data: any) => apiFetch('/checks', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Calendar
  getCalendar: () => apiFetch('/calendar'),
  createCalendarEvent: (data: any) => apiFetch('/calendar', { method: 'POST', body: JSON.stringify(data) }),
  deleteCalendarEvent: (id: string) => apiFetch(`/calendar?id=${id}`, { method: 'DELETE' }),
  
  // Announcements
  getAnnouncements: () => apiFetch('/announcements'),
  createAnnouncement: (data: any) => apiFetch('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  updateAnnouncement: (data: any) => apiFetch('/announcements', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) => apiFetch(`/announcements?id=${id}`, { method: 'DELETE' }),
  
  // Knowledge
  getKnowledge: () => apiFetch('/knowledge'),
  createKnowledge: (data: any) => apiFetch('/knowledge', { method: 'POST', body: JSON.stringify(data) }),
  deleteKnowledge: (id: string) => apiFetch(`/knowledge?id=${id}`, { method: 'DELETE' }),
  
  // Notebook
  getNotebook: () => apiFetch('/notebook'),
  createNotebookPage: (data: any) => apiFetch('/notebook', { method: 'POST', body: JSON.stringify(data) }),
  updateNotebookPage: (data: any) => apiFetch('/notebook', { method: 'PUT', body: JSON.stringify(data) }),
  deleteNotebookPage: (id: string) => apiFetch(`/notebook?id=${id}`, { method: 'DELETE' }),
  
  // Vendors
  getVendors: () => apiFetch('/vendors'),
  createVendor: (data: any) => apiFetch('/vendors', { method: 'POST', body: JSON.stringify(data) }),
  updateVendor: (data: any) => apiFetch('/vendors', { method: 'PUT', body: JSON.stringify(data) }),
  deleteVendor: (id: string) => apiFetch(`/vendors?id=${id}`, { method: 'DELETE' }),
  
  // Monitors
  getMonitors: () => apiFetch('/monitors'),
  
  // Alerts
  getAlerts: () => apiFetch('/alerts'),
  updateAlert: (data: any) => apiFetch('/alerts', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Settings
  getSettings: () => apiFetch('/settings'),
  updateSettings: (data: any) => apiFetch('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Logs
  getLogs: () => apiFetch('/logs'),
  createLog: (data: any) => apiFetch('/logs', { method: 'POST', body: JSON.stringify(data) }),
  
  // Charters
  getCharters: () => apiFetch('/charters'),
  createCharter: (data: any) => apiFetch('/charters', { method: 'POST', body: JSON.stringify(data) }),
  updateCharter: (data: any) => apiFetch('/charters', { method: 'PUT', body: JSON.stringify(data) }),
  deleteCharter: (id: string) => apiFetch(`/charters?id=${id}`, { method: 'DELETE' }),
  
  // Budget
  getBudget: () => apiFetch('/budget'),
  createBudgetItem: (data: any) => apiFetch('/budget', { method: 'POST', body: JSON.stringify(data) }),
  updateBudgetItem: (data: any) => apiFetch('/budget', { method: 'PUT', body: JSON.stringify(data) }),
  deleteBudgetItem: (id: string) => apiFetch(`/budget?id=${id}`, { method: 'DELETE' }),
  
  // Notes
  getNotes: () => apiFetch('/notes'),
  createNote: (data: any) => apiFetch('/notes', { method: 'POST', body: JSON.stringify(data) }),
  updateNote: (data: any) => apiFetch('/notes', { method: 'PUT', body: JSON.stringify(data) }),
  deleteNote: (id: string) => apiFetch(`/notes?id=${id}`, { method: 'DELETE' }),
}

// ===================== LOGIN COMPONENT =====================
function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.login(username, password)
      if (response.user) {
        onLogin(response.user)
        toast.success(`Welcome, ${response.user.name}!`)
      } else {
        setError('Invalid username or password')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="mx-auto mb-4 p-3 bg-white/20 rounded-full w-fit">
            <Monitor className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl">Al Rayes Laundry</CardTitle>
          <CardDescription className="text-blue-100">IT Management Portal</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              placeholder="Enter username"
              className="h-11"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="Enter password"
                className="h-11 pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <Button onClick={handleLogin} className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />} 
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center text-xs text-slate-500 pt-3 border-t">
            <p className="font-medium mb-2 text-slate-600">Login Credentials:</p>
            <div className="flex justify-center gap-3">
              <div className="bg-blue-50 rounded-lg px-3 py-2">
                <span className="font-bold text-blue-700">demo</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="font-bold text-blue-700">Demo@123</span>
              </div>
              <div className="bg-purple-50 rounded-lg px-3 py-2">
                <span className="font-bold text-purple-700">admin</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="font-bold text-purple-700">Admin@123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================== MAIN COMPONENT =====================
export default function ITManagementApp() {
  // Auth state
  const [user, setUser] = useState<User | null>(null)
  
  // Loading state
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  
  // UI state
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPassword, setShowPassword] = useState<string | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  
  // Data state - using useState instead of useLocalStorage
  const [assets, setAssets] = useState<ITAsset[]>([])
  const [tickets, setTickets] = useState<ITTicket[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [backups, setBackups] = useState<BackupJob[]>([])
  const [checks, setChecks] = useState<DailyCheck[]>([])
  const [notes, setNotes] = useState<QuickNote[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [licenses, setLicenses] = useState<License[]>([])
  const [knowledge, setKnowledge] = useState<KnowledgeArticle[]>([])
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [charters, setCharters] = useState<ProgrammeCharter[]>([])
  const [notebookPages, setNotebookPages] = useState<NotebookPage[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [portalVisits, setPortalVisits] = useState<PortalVisit[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [serverMonitors, setServerMonitors] = useState<ServerMonitor[]>([])

  // Dialog states
  const [assetDialogOpen, setAssetDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<ITAsset | null>(null)
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<ITTicket | null>(null)
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<QuickNote | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string; name: string } | null>(null)
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false)
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false)
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false)
  const [knowledgeDialogOpen, setKnowledgeDialogOpen] = useState(false)
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [charterDialogOpen, setCharterDialogOpen] = useState(false)
  const [editingCharter, setEditingCharter] = useState<ProgrammeCharter | null>(null)
  const [notebookDialogOpen, setNotebookDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<NotebookPage | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [visitorDialogOpen, setVisitorDialogOpen] = useState(false)
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
  const [visitorFilter, setVisitorFilter] = useState<string>('all')
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false)
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetItem | null>(null)
  const [sessionTimeoutDialogOpen, setSessionTimeoutDialogOpen] = useState(false)
  const [commandSearch, setCommandSearch] = useState('')
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const [reportDateRange, setReportDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })

  // Form states
  const [assetForm, setAssetForm] = useState<Partial<ITAsset>>({})
  const [ticketForm, setTicketForm] = useState<Partial<ITTicket>>({})
  const [credentialForm, setCredentialForm] = useState<Partial<Credential>>({})
  const [noteForm, setNoteForm] = useState<Partial<QuickNote>>({})
  const [calendarForm, setCalendarForm] = useState<Partial<CalendarEvent>>({})
  const [licenseForm, setLicenseForm] = useState<Partial<License>>({})
  const [knowledgeForm, setKnowledgeForm] = useState<Partial<KnowledgeArticle>>({})
  const [meetingForm, setMeetingForm] = useState<Partial<Meeting>>({})
  const [charterForm, setCharterForm] = useState<Partial<ProgrammeCharter>>({})
  const [notebookForm, setNotebookForm] = useState<Partial<NotebookPage>>({})
  const [visitorForm, setVisitorForm] = useState<Partial<Visitor>>({})
  const [announcementForm, setAnnouncementForm] = useState<Partial<Announcement>>({})
  const [vendorForm, setVendorForm] = useState<Partial<Vendor>>({})
  const [budgetForm, setBudgetForm] = useState<Partial<BudgetItem>>({})
  
  // Filter states
  const [assetFilter, setAssetFilter] = useState<string>('all')
  const [ticketFilter, setTicketFilter] = useState<string>('all')
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState<string>('all')
  const [knowledgeSearch, setKnowledgeSearch] = useState('')

  // Fetch all data from API
  const fetchAllData = useCallback(async () => {
    setDataLoading(true)
    try {
      const [
        assetsData,
        ticketsData,
        visitorsData,
        meetingsData,
        backupsData,
        licensesData,
        credentialsData,
        checksData,
        calendarData,
        announcementsData,
        vendorsData,
        budgetData,
        knowledgeData,
        notebookData,
        chartersData,
        notesData,
        alertsData,
        monitorsData,
        settingsData,
        logsData,
      ] = await Promise.all([
        api.getAssets(),
        api.getTickets(),
        api.getVisitors(),
        api.getMeetings(),
        api.getBackups(),
        api.getLicenses(),
        api.getCredentials(),
        api.getChecks(),
        api.getCalendar(),
        api.getAnnouncements(),
        api.getVendors(),
        api.getBudget(),
        api.getKnowledge(),
        api.getNotebook(),
        api.getCharters(),
        api.getNotes(),
        api.getAlerts(),
        api.getMonitors(),
        api.getSettings(),
        api.getLogs(),
      ])
      
      setAssets(assetsData || [])
      setTickets(ticketsData || [])
      setVisitors(visitorsData || [])
      setMeetings(meetingsData || [])
      setBackups(backupsData || [])
      setLicenses(licensesData || [])
      setCredentials(credentialsData || [])
      setChecks(checksData || [])
      setCalendarEvents(calendarData || [])
      setAnnouncements(announcementsData || [])
      setVendors(vendorsData || [])
      setBudgetItems(budgetData || [])
      setKnowledge(knowledgeData || [])
      setNotebookPages(notebookData || [])
      setCharters(chartersData || [])
      setNotes(notesData || [])
      setAlerts(alertsData || [])
      setServerMonitors(monitorsData || [])
      if (settingsData) setSettings(settingsData)
      setLogs(logsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load some data')
    } finally {
      setDataLoading(false)
      setLoading(false)
    }
  }, [])

  // Fetch data when user logs in
  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user, fetchAllData])

  // Add activity log - defined early so other effects can use it
  const addLog = useCallback(async (action: string, category: string, details: string) => {
    if (!user) return
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      user: user.name,
      action,
      category,
      details,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
    setLogs([newLog, ...logs].slice(0, 100)) // Keep last 100 logs
    try {
      await api.createLog(newLog)
    } catch (error) {
      console.error('Failed to save log:', error)
    }
  }, [user, logs])

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  // Handle logout - defined early for session timeout
  const handleLogout = useCallback(() => {
    addLog('Logout', 'Session', 'User logged out')
    localStorage.removeItem(STORAGE_KEYS.user)
    setUser(null)
    toast.success('Logged out successfully')
  }, [addLog, setUser])

  // Session timeout effect
  useEffect(() => {
    if (!user) return
    
    const timeoutMinutes = settings.sessionTimeoutMinutes || 30
    const warningMinutes = 5
    let timeoutId: NodeJS.Timeout
    let warningId: NodeJS.Timeout
    let lastActivity = Date.now()
    
    const resetTimers = () => {
      lastActivity = Date.now()
      clearTimeout(timeoutId)
      clearTimeout(warningId)
      
      warningId = setTimeout(() => {
        setSessionTimeoutDialogOpen(true)
      }, (timeoutMinutes - warningMinutes) * 60 * 1000)
      
      timeoutId = setTimeout(() => {
        handleLogout()
        toast.error('Session expired due to inactivity')
      }, timeoutMinutes * 60 * 1000)
    }
    
    const handleActivity = () => {
      if (Date.now() - lastActivity > 60000) { // Only reset if more than 1 minute since last activity
        resetTimers()
      }
    }
    
    // Listen for user activity
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    
    resetTimers()
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(warningId)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
    }
  }, [user, settings.sessionTimeoutMinutes, handleLogout])

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
        setCommandSearch('')
        setSelectedCommandIndex(0)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Track portal visit
  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().slice(0, 10)
      const newVisit: PortalVisit = {
        id: Date.now().toString(),
        date: today,
        module: activeTab,
        action: 'view',
        user: user.name,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
      }
      // Only add if it's a new day or different module
      const lastVisit = portalVisits[0]
      if (!lastVisit || lastVisit.date !== today || lastVisit.module !== activeTab) {
        setPortalVisits([newVisit, ...portalVisits].slice(0, 1000))
      }
    }
  }, [user, activeTab, portalVisits, setPortalVisits])

  // Extend session
  const extendSession = useCallback(() => {
    setSessionTimeoutDialogOpen(false)
    toast.success('Session extended')
  }, [])

  // Generate ICS content for calendar export
  const generateICS = useCallback((events: CalendarEvent[], eventName: string) => {
    const escapeText = (text: string) => text.replace(/[\\;,\n]/g, (match) => {
      if (match === '\n') return '\\n'
      return '\\' + match
    })
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Al Rayes Laundry//IT Portal//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${escapeText(eventName)}`,
      ...events.map(event => [
        'BEGIN:VEVENT',
        `UID:${event.id}@alrayes.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${event.date.replace(/-/g, '')}`,
        `DTEND:${event.date.replace(/-/g, '')}`,
        `SUMMARY:${escapeText(event.title)}`,
        `DESCRIPTION:${escapeText(event.description)}`,
        `CATEGORIES:${event.type.toUpperCase()}`,
        'END:VEVENT'
      ].join('\r\n')),
      'END:VCALENDAR'
    ].join('\r\n')
    
    return icsContent
  }, [])

  // Export calendar to ICS
  const exportCalendarToICS = useCallback((singleEvent?: CalendarEvent) => {
    const events = singleEvent ? [singleEvent] : calendarEvents
    const filename = singleEvent 
      ? `${singleEvent.title.replace(/[^a-z0-9]/gi, '_')}.ics`
      : 'it_portal_calendar.ics'
    
    const icsContent = generateICS(events, singleEvent?.title || 'IT Portal Events')
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Calendar exported!')
    addLog('Exported Calendar', 'Calendar', `Exported ${events.length} event(s) to ICS`)
  }, [calendarEvents, generateICS, addLog])

  // Import ICS file
  const importICS = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const events: CalendarEvent[] = []
        
        // Parse VEVENT blocks
        const eventMatches = content.split('BEGIN:VEVENT')
        
        for (const match of eventMatches.slice(1)) {
          const endIdx = match.indexOf('END:VEVENT')
          if (endIdx === -1) continue
          
          const eventContent = match.slice(0, endIdx)
          
          const getLine = (key: string) => {
            const regex = new RegExp(`^${key}:(.+)$`, 'm')
            const lineMatch = eventContent.match(regex)
            return lineMatch ? lineMatch[1].trim() : ''
          }
          
          const dateStr = getLine('DTSTART') || getLine('DTSTART;VALUE=DATE')
          const formattedDate = dateStr.length === 8 
            ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
            : dateStr.slice(0, 10)
          
          const event: CalendarEvent = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: getLine('SUMMARY') || 'Imported Event',
            description: getLine('DESCRIPTION') || '',
            date: formattedDate,
            type: 'reminder',
            reminder: true
          }
          
          if (event.date) {
            events.push(event)
          }
        }
        
        if (events.length > 0) {
          setCalendarEvents([...calendarEvents, ...events])
          toast.success(`Imported ${events.length} event(s)`)
          addLog('Imported Calendar', 'Calendar', `Imported ${events.length} event(s) from ICS`)
        } else {
          toast.error('No valid events found in file')
        }
      } catch {
        toast.error('Failed to parse ICS file')
      }
    }
    reader.readAsText(file)
  }, [calendarEvents, setCalendarEvents, addLog])

  // Compute statistics
  const stats = {
    activeAssets: assets.filter(a => a.status === 'active').length,
    maintenanceAssets: assets.filter(a => a.status === 'maintenance').length,
    inactiveAssets: assets.filter(a => a.status === 'inactive').length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
    criticalTickets: tickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length,
    highTickets: tickets.filter(t => t.priority === 'high' && t.status !== 'closed').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    successfulBackups: backups.filter(b => b.status === 'success').length,
    warningBackups: backups.filter(b => b.status === 'warning').length,
    failedBackups: backups.filter(b => b.status === 'failed').length,
    completedChecks: checks.filter(c => c.completed).length,
    totalChecks: checks.length,
    unreadAlerts: alerts.filter(a => !a.read).length,
    expiringWarranties: assets.filter(a => {
      if (!a.warrantyEnd) return false
      const days = Math.ceil((new Date(a.warrantyEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days <= 90 && days > 0
    }).length,
    expiringLicenses: licenses.filter(l => {
      const days = Math.ceil((new Date(l.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days <= 30 && days > 0
    }).length,
    upcomingEvents: calendarEvents.filter(e => {
      const days = Math.ceil((new Date(e.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days <= 7 && days >= 0
    }).length,
    totalComputers: assets.filter(a => a.type === 'computer').length,
    totalServers: assets.filter(a => a.type === 'server').length,
    totalPrinters: assets.filter(a => a.type === 'printer').length,
    totalNetwork: assets.filter(a => a.type === 'network').length,
    slaBreaches: tickets.filter(t => {
      if (t.status === 'resolved' || t.status === 'closed') return false
      return new Date(t.slaDeadline) < new Date()
    }).length,
    // Visitor statistics
    checkedInVisitors: visitors.filter(v => v.status === 'checked-in').length,
    expectedVisitors: visitors.filter(v => v.status === 'expected').length,
    todayVisitors: visitors.filter(v => {
      const today = new Date().toISOString().slice(0, 10)
      return v.createdAt === today || v.checkInTime?.startsWith(today)
    }).length,
    weekVisitors: visitors.filter(v => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return new Date(v.createdAt) >= weekAgo
    }).length,
    monthVisitors: visitors.filter(v => {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return new Date(v.createdAt) >= monthAgo
    }).length,
    totalVisitorsToday: visitors.filter(v => {
      const today = new Date().toISOString().slice(0, 10)
      return v.checkInTime?.startsWith(today) || v.status === 'expected' && v.checkInTime?.startsWith(today)
    }).length,
    // Announcement statistics
    unreadAnnouncements: announcements.filter(a => !a.read && new Date(a.expiresAt) > new Date()).length,
    activeAnnouncements: announcements.filter(a => new Date(a.expiresAt) > new Date()).length,
    pinnedAnnouncements: announcements.filter(a => a.pinned).length,
    urgentAnnouncements: announcements.filter(a => a.priority === 'urgent' && new Date(a.expiresAt) > new Date()).length,
    // Vendor statistics
    totalVendors: vendors.length,
    expiringContracts: vendors.filter(v => {
      const days = Math.ceil((new Date(v.contractEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days <= 60 && days > 0
    }).length,
    avgVendorRating: vendors.length > 0 ? (vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1) : '0',
    // Budget statistics
    totalBudget: budgetItems.filter(b => b.type === 'budget').reduce((sum, b) => sum + b.amount, 0),
    totalExpenses: budgetItems.filter(b => b.type === 'expense' && b.status === 'approved').reduce((sum, b) => sum + b.amount, 0),
    pendingExpenses: budgetItems.filter(b => b.type === 'expense' && b.status === 'pending').reduce((sum, b) => sum + b.amount, 0),
    remainingBudget: budgetItems.filter(b => b.type === 'budget').reduce((sum, b) => sum + b.amount, 0) - budgetItems.filter(b => b.type === 'expense' && b.status === 'approved').reduce((sum, b) => sum + b.amount, 0),
    // Portal visit statistics
    todayVisits: portalVisits.filter(v => v.date === new Date().toISOString().slice(0, 10)).length,
    weekVisits: portalVisits.filter(v => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return new Date(v.date) >= weekAgo
    }).length,
    monthVisits: portalVisits.filter(v => {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return new Date(v.date) >= monthAgo
    }).length,
  }

  // ===================== HANDLERS =====================
  const confirmDelete = useCallback(async () => {
    if (!deleteItem) return
    
    try {
      switch (deleteItem.type) {
        case 'asset':
          await api.deleteAsset(deleteItem.id)
          setAssets(assets.filter(a => a.id !== deleteItem.id))
          addLog('Deleted Asset', 'Assets', `Deleted ${deleteItem.name}`)
          break
        case 'ticket':
          await api.deleteTicket(deleteItem.id)
          setTickets(tickets.filter(t => t.id !== deleteItem.id))
          addLog('Deleted Ticket', 'Tickets', `Deleted ${deleteItem.name}`)
          break
        case 'credential':
          await api.deleteCredential(deleteItem.id)
          setCredentials(credentials.filter(c => c.id !== deleteItem.id))
          break
        case 'note':
          await api.deleteNote(deleteItem.id)
          setNotes(notes.filter(n => n.id !== deleteItem.id))
          break
        case 'calendar':
          await api.deleteCalendarEvent(deleteItem.id)
          setCalendarEvents(calendarEvents.filter(e => e.id !== deleteItem.id))
          break
        case 'license':
          await api.deleteLicense(deleteItem.id)
          setLicenses(licenses.filter(l => l.id !== deleteItem.id))
          break
        case 'knowledge':
          await api.deleteKnowledge(deleteItem.id)
          setKnowledge(knowledge.filter(k => k.id !== deleteItem.id))
          break
        case 'meeting':
          await api.deleteMeeting(deleteItem.id)
          setMeetings(meetings.filter(m => m.id !== deleteItem.id))
          addLog('Deleted Meeting', 'Meetings', `Deleted ${deleteItem.name}`)
          break
        case 'charter':
          await api.deleteCharter(deleteItem.id)
          setCharters(charters.filter(c => c.id !== deleteItem.id))
          addLog('Deleted Charter', 'Charters', `Deleted ${deleteItem.name}`)
          break
        case 'notebook':
          await api.deleteNotebookPage(deleteItem.id)
          setNotebookPages(notebookPages.filter(p => p.id !== deleteItem.id))
          break
        case 'visitor':
          await api.deleteVisitor(deleteItem.id)
          setVisitors(visitors.filter(v => v.id !== deleteItem.id))
          addLog('Deleted Visitor', 'Visitors', `Deleted ${deleteItem.name}`)
          break
        case 'announcement':
          await api.deleteAnnouncement(deleteItem.id)
          setAnnouncements(announcements.filter(a => a.id !== deleteItem.id))
          addLog('Deleted Announcement', 'Announcements', `Deleted ${deleteItem.name}`)
          break
        case 'vendor':
          await api.deleteVendor(deleteItem.id)
          setVendors(vendors.filter(v => v.id !== deleteItem.id))
          addLog('Deleted Vendor', 'Vendors', `Deleted ${deleteItem.name}`)
          break
        case 'budget':
          await api.deleteBudgetItem(deleteItem.id)
          setBudgetItems(budgetItems.filter(b => b.id !== deleteItem.id))
          addLog('Deleted Budget Item', 'Budget', `Deleted ${deleteItem.name}`)
          break
      }
      toast.success('Deleted successfully')
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete')
    } finally {
      setDeleteDialogOpen(false)
      setDeleteItem(null)
    }
  }, [deleteItem, assets, tickets, credentials, notes, calendarEvents, licenses, knowledge, meetings, charters, notebookPages, visitors, announcements, vendors, budgetItems, addLog])

  const handleSaveAsset = useCallback(async () => {
    if (!assetForm.name) {
      toast.error('Please enter asset name')
      return
    }
    
    try {
      if (editingAsset) {
        const updated = await api.updateAsset({ id: editingAsset.id, ...assetForm })
        setAssets(assets.map(a => a.id === editingAsset.id ? updated : a))
        addLog('Updated Asset', 'Assets', `Updated ${assetForm.name}`)
        toast.success('Asset updated')
      } else {
        const newAsset = await api.createAsset({
          type: assetForm.type || 'computer',
          name: assetForm.name || '',
          model: assetForm.model || '',
          serialNumber: assetForm.serialNumber || '',
          location: assetForm.location || '',
          ipAddress: assetForm.ipAddress || '',
          status: assetForm.status || 'active',
          assignedTo: assetForm.assignedTo || '',
          purchaseDate: assetForm.purchaseDate || '',
          warrantyEnd: assetForm.warrantyEnd || '',
          notes: assetForm.notes || ''
        })
        setAssets([...assets, newAsset])
        addLog('Added Asset', 'Assets', `Added ${assetForm.name}`)
        toast.success('Asset added')
      }
      setAssetDialogOpen(false)
      setEditingAsset(null)
      setAssetForm({})
    } catch (error) {
      console.error('Failed to save asset:', error)
      toast.error('Failed to save asset')
    }
  }, [editingAsset, assetForm, assets, addLog])

  const handleSaveTicket = useCallback(async () => {
    if (!ticketForm.title) {
      toast.error('Please enter ticket title')
      return
    }
    
    const slaHours = ticketForm.priority === 'critical' ? 4 : ticketForm.priority === 'high' ? 8 : ticketForm.priority === 'medium' ? 24 : 48
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' ')
    
    try {
      if (editingTicket) {
        const updated = await api.updateTicket({ id: editingTicket.id, ...ticketForm, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') })
        setTickets(tickets.map(t => t.id === editingTicket.id ? updated : t))
        addLog('Updated Ticket', 'Tickets', `Updated ${ticketForm.title}`)
        toast.success('Ticket updated')
      } else {
        const newTicket = await api.createTicket({
          title: ticketForm.title || '',
          description: ticketForm.description || '',
          priority: ticketForm.priority || 'medium',
          status: 'open',
          category: ticketForm.category || 'Other',
          requester: ticketForm.requester || '',
          assignedTo: ticketForm.assignedTo || '',
          resolution: '',
          slaDeadline
        })
        setTickets([...tickets, newTicket])
        addLog('Created Ticket', 'Tickets', `Created ${ticketForm.title}`)
        toast.success('Ticket created')
      }
      setTicketDialogOpen(false)
      setEditingTicket(null)
      setTicketForm({})
    } catch (error) {
      console.error('Failed to save ticket:', error)
      toast.error('Failed to save ticket')
    }
  }, [editingTicket, ticketForm, tickets, addLog])

  const handleSaveCredential = useCallback(async () => {
    if (!credentialForm.system || !credentialForm.username || !credentialForm.password) {
      toast.error('Please fill required fields')
      return
    }
    try {
      const newCred = await api.createCredential({
        system: credentialForm.system || '',
        username: credentialForm.username || '',
        password: credentialForm.password || '',
        url: credentialForm.url || '',
        notes: credentialForm.notes || '',
        category: credentialForm.category || 'General'
      })
      setCredentials([...credentials, newCred])
      toast.success('Credential saved')
      setCredentialDialogOpen(false)
      setCredentialForm({})
    } catch (error) {
      console.error('Failed to save credential:', error)
      toast.error('Failed to save credential')
    }
  }, [credentialForm, credentials])

  const handleSaveNote = useCallback(async () => {
    if (!noteForm.title || !noteForm.content) {
      toast.error('Please fill title and content')
      return
    }
    try {
      if (editingNote) {
        const updated = await api.updateNote({ id: editingNote.id, ...noteForm, updatedAt: new Date().toISOString().slice(0, 10) })
        setNotes(notes.map(n => n.id === editingNote.id ? updated : n))
        toast.success('Note updated')
      } else {
        const newNote = await api.createNote({
          title: noteForm.title || '',
          content: noteForm.content || '',
          category: noteForm.category || 'General',
          pinned: false
        })
        setNotes([...notes, newNote])
        toast.success('Note created')
      }
      setNoteDialogOpen(false)
      setEditingNote(null)
      setNoteForm({})
    } catch (error) {
      console.error('Failed to save note:', error)
      toast.error('Failed to save note')
    }
  }, [editingNote, noteForm, notes])

  const handleSaveCalendarEvent = useCallback(() => {
    if (!calendarForm.title || !calendarForm.date) {
      toast.error('Please fill title and date')
      return
    }
    const newEvent: CalendarEvent = { id: Date.now().toString(), title: calendarForm.title || '', description: calendarForm.description || '', date: calendarForm.date || '', type: calendarForm.type || 'reminder', reminder: calendarForm.reminder ?? true }
    setCalendarEvents([...calendarEvents, newEvent])
    addLog('Added Event', 'Calendar', `Added ${calendarForm.title}`)
    toast.success('Event added')
    setCalendarDialogOpen(false)
    setCalendarForm({})
  }, [calendarForm, calendarEvents, setCalendarEvents, addLog])

  const handleSaveLicense = useCallback(() => {
    if (!licenseForm.software || !licenseForm.expiryDate) {
      toast.error('Please fill software name and expiry date')
      return
    }
    const newLicense: License = { id: Date.now().toString(), software: licenseForm.software || '', vendor: licenseForm.vendor || '', licenseKey: licenseForm.licenseKey || '', purchaseDate: licenseForm.purchaseDate || '', expiryDate: licenseForm.expiryDate || '', seats: licenseForm.seats || 1, usedSeats: licenseForm.usedSeats || 0, cost: licenseForm.cost || '', category: licenseForm.category || 'General' }
    setLicenses([...licenses, newLicense])
    addLog('Added License', 'Licenses', `Added ${licenseForm.software}`)
    toast.success('License added')
    setLicenseDialogOpen(false)
    setLicenseForm({})
  }, [licenseForm, licenses, setLicenses, addLog])

  const handleSaveKnowledge = useCallback(() => {
    if (!knowledgeForm.title || !knowledgeForm.content) {
      toast.error('Please fill title and content')
      return
    }
    const newArticle: KnowledgeArticle = { id: Date.now().toString(), title: knowledgeForm.title || '', content: knowledgeForm.content || '', category: knowledgeForm.category || 'General', tags: knowledgeForm.tags || [], createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10), views: 0 }
    setKnowledge([...knowledge, newArticle])
    toast.success('Article created')
    setKnowledgeDialogOpen(false)
    setKnowledgeForm({})
  }, [knowledgeForm, knowledge, setKnowledge])

  // ===================== NEW MODULE HANDLERS =====================
  // Announcement handlers
  const handleSaveAnnouncement = useCallback(() => {
    if (!announcementForm.title || !announcementForm.content) {
      toast.error('Please fill title and content')
      return
    }
    
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...announcementForm } : a))
      addLog('Updated Announcement', 'Announcements', `Updated ${announcementForm.title}`)
      toast.success('Announcement updated')
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: announcementForm.title || '',
        content: announcementForm.content || '',
        type: announcementForm.type || 'general',
        priority: announcementForm.priority || 'normal',
        author: user?.name || 'Unknown',
        createdAt: new Date().toISOString().slice(0, 10),
        expiresAt: announcementForm.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        read: false,
        pinned: announcementForm.pinned || false
      }
      setAnnouncements([newAnnouncement, ...announcements])
      addLog('Created Announcement', 'Announcements', `Created ${announcementForm.title}`)
      toast.success('Announcement created')
    }
    setAnnouncementDialogOpen(false)
    setEditingAnnouncement(null)
    setAnnouncementForm({})
  }, [editingAnnouncement, announcementForm, announcements, setAnnouncements, addLog, user])

  const markAnnouncementRead = useCallback((id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, read: true } : a))
  }, [announcements, setAnnouncements])

  const toggleAnnouncementPin = useCallback((id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a))
    toast.success('Pin status updated')
  }, [announcements, setAnnouncements])

  // Vendor handlers
  const handleSaveVendor = useCallback(() => {
    if (!vendorForm.name || !vendorForm.contactPerson) {
      toast.error('Please fill vendor name and contact person')
      return
    }
    
    if (editingVendor) {
      setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...vendorForm } : v))
      addLog('Updated Vendor', 'Vendors', `Updated ${vendorForm.name}`)
      toast.success('Vendor updated')
    } else {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        name: vendorForm.name || '',
        category: vendorForm.category || 'other',
        contactPerson: vendorForm.contactPerson || '',
        email: vendorForm.email || '',
        phone: vendorForm.phone || '',
        address: vendorForm.address || '',
        website: vendorForm.website || '',
        contractStart: vendorForm.contractStart || '',
        contractEnd: vendorForm.contractEnd || '',
        contractValue: vendorForm.contractValue || '',
        slaDetails: vendorForm.slaDetails || '',
        rating: vendorForm.rating || 3,
        notes: vendorForm.notes || '',
        createdAt: new Date().toISOString().slice(0, 10)
      }
      setVendors([...vendors, newVendor])
      addLog('Added Vendor', 'Vendors', `Added ${vendorForm.name}`)
      toast.success('Vendor added')
    }
    setVendorDialogOpen(false)
    setEditingVendor(null)
    setVendorForm({})
  }, [editingVendor, vendorForm, vendors, setVendors, addLog])

  // Budget handlers
  const handleSaveBudgetItem = useCallback(() => {
    if (!budgetForm.description || !budgetForm.amount) {
      toast.error('Please fill description and amount')
      return
    }
    
    if (editingBudgetItem) {
      setBudgetItems(budgetItems.map(b => b.id === editingBudgetItem.id ? { ...b, ...budgetForm } : b))
      addLog('Updated Budget Item', 'Budget', `Updated ${budgetForm.description}`)
      toast.success('Budget item updated')
    } else {
      const newBudgetItem: BudgetItem = {
        id: Date.now().toString(),
        category: budgetForm.category || 'other',
        description: budgetForm.description || '',
        amount: budgetForm.amount || 0,
        date: budgetForm.date || new Date().toISOString().slice(0, 10),
        type: budgetForm.type || 'expense',
        approvedBy: budgetForm.approvedBy || '',
        status: budgetForm.status || 'pending',
        notes: budgetForm.notes || '',
        createdAt: new Date().toISOString().slice(0, 10)
      }
      setBudgetItems([...budgetItems, newBudgetItem])
      addLog('Added Budget Item', 'Budget', `Added ${budgetForm.description}`)
      toast.success('Budget item added')
    }
    setBudgetDialogOpen(false)
    setEditingBudgetItem(null)
    setBudgetForm({})
  }, [editingBudgetItem, budgetForm, budgetItems, setBudgetItems, addLog])

  // Export data function - defined early for use in command palette
  const exportData = useCallback(() => {
    const data = { assets, tickets, credentials, backups, checks, notes, calendarEvents, licenses, knowledge, announcements, vendors, budgetItems, exportDate: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `it_portal_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    addLog('Exported Data', 'System', 'Exported all portal data')
    toast.success('Data exported!')
  }, [assets, tickets, credentials, backups, checks, notes, calendarEvents, licenses, knowledge, announcements, vendors, budgetItems, addLog])

  // Export report function
  const exportReport = useCallback((type: 'assets' | 'tickets' | 'licenses') => {
    let csvContent = ''
    let filename = ''
    
    if (type === 'assets') {
      csvContent = 'Name,Type,Model,Location,IP,Status,Warranty\n' + assets.map(a => `${a.name},${a.type},${a.model},${a.location},${a.ipAddress},${a.status},${a.warrantyEnd}`).join('\n')
      filename = 'assets_report.csv'
    } else if (type === 'tickets') {
      csvContent = 'ID,Title,Priority,Status,Category,Requester,Assigned,Created\n' + tickets.map(t => `${t.id},"${t.title}",${t.priority},${t.status},${t.category},${t.requester},${t.assignedTo},${t.createdAt}`).join('\n')
      filename = 'tickets_report.csv'
    } else if (type === 'licenses') {
      csvContent = 'Software,Vendor,Seats,Used,Expiry,Cost\n' + licenses.map(l => `${l.software},${l.vendor},${l.seats},${l.usedSeats},${l.expiryDate},${l.cost}`).join('\n')
      filename = 'licenses_report.csv'
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report exported!')
    addLog('Exported Report', 'Reports', `Exported ${type} report`)
  }, [assets, tickets, licenses, addLog])

  // Command palette search results
  const getCommandPaletteResults = useCallback(() => {
    if (!commandSearch.trim()) return []
    
    const results: { type: string; id: string; title: string; description: string; action: () => void }[] = []
    const search = commandSearch.toLowerCase()
    
    // Search assets
    assets.filter(a => a.name.toLowerCase().includes(search) || a.model.toLowerCase().includes(search)).slice(0, 3).forEach(a => {
      results.push({ type: 'Asset', id: a.id, title: a.name, description: `${a.type} - ${a.location}`, action: () => { setActiveTab('assets'); setCommandPaletteOpen(false) } })
    })
    
    // Search tickets
    tickets.filter(t => t.title.toLowerCase().includes(search) || t.id.toLowerCase().includes(search)).slice(0, 3).forEach(t => {
      results.push({ type: 'Ticket', id: t.id, title: t.title, description: `${t.priority} - ${t.status}`, action: () => { setActiveTab('tickets'); setCommandPaletteOpen(false) } })
    })
    
    // Search knowledge
    knowledge.filter(k => k.title.toLowerCase().includes(search)).slice(0, 3).forEach(k => {
      results.push({ type: 'Knowledge', id: k.id, title: k.title, description: k.category, action: () => { setActiveTab('knowledge'); setCommandPaletteOpen(false) } })
    })
    
    // Search vendors
    vendors.filter(v => v.name.toLowerCase().includes(search)).slice(0, 3).forEach(v => {
      results.push({ type: 'Vendor', id: v.id, title: v.name, description: v.category, action: () => { setActiveTab('vendors'); setCommandPaletteOpen(false) } })
    })
    
    // Quick actions
    const quickActions = [
      { title: 'Create New Ticket', description: 'Open ticket creation form', action: () => { setTicketForm({}); setEditingTicket(null); setTicketDialogOpen(true); setCommandPaletteOpen(false) } },
      { title: 'Create New Asset', description: 'Open asset creation form', action: () => { setAssetForm({}); setEditingAsset(null); setAssetDialogOpen(true); setCommandPaletteOpen(false) } },
      { title: 'Create New Announcement', description: 'Open announcement creation form', action: () => { setAnnouncementForm({}); setEditingAnnouncement(null); setAnnouncementDialogOpen(true); setCommandPaletteOpen(false) } },
      { title: 'Go to Dashboard', description: 'Navigate to dashboard', action: () => { setActiveTab('dashboard'); setCommandPaletteOpen(false) } },
      { title: 'Go to Reports', description: 'Navigate to reports', action: () => { setActiveTab('reports'); setCommandPaletteOpen(false) } },
      { title: 'Go to Settings', description: 'Navigate to settings', action: () => { setActiveTab('settings'); setCommandPaletteOpen(false) } },
      { title: 'Toggle Dark Mode', description: 'Switch between light and dark theme', action: () => { toggleTheme(); setCommandPaletteOpen(false) } },
      { title: 'Export All Data', description: 'Download portal backup', action: () => { exportData(); setCommandPaletteOpen(false) } },
      { title: 'Export Calendar', description: 'Download ICS calendar file', action: () => { exportCalendarToICS(); setCommandPaletteOpen(false) } },
    ]
    
    quickActions.filter(a => a.title.toLowerCase().includes(search)).forEach(a => {
      results.push({ type: 'Action', id: a.title, title: a.title, description: a.description, action: a.action })
    })
    
    return results.slice(0, 10)
  }, [commandSearch, assets, tickets, knowledge, vendors, toggleTheme, exportData, exportCalendarToICS])

  // Save search to recent searches
  const saveSearch = useCallback((term: string) => {
    if (term.trim() && !recentSearches.includes(term.trim())) {
      setRecentSearches([term.trim(), ...recentSearches].slice(0, 5))
    }
  }, [recentSearches, setRecentSearches])

  const toggleCheck = useCallback((id: string) => {
    setChecks(checks.map(c => c.id === id ? { ...c, completed: !c.completed, timestamp: !c.completed ? new Date().toISOString().slice(0, 16).replace('T', ' ') : '' } : c))
  }, [checks, setChecks])

  const resetChecks = useCallback(() => {
    setChecks(checks.map(c => ({ ...c, completed: false, timestamp: '' })))
    toast.success('Checklist reset')
  }, [checks, setChecks])

  const markAlertRead = useCallback((id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a))
  }, [alerts, setAlerts])

  const clearAllAlerts = useCallback(() => {
    setAlerts(alerts.map(a => ({ ...a, read: true })))
    toast.success('All marked as read')
  }, [alerts, setAlerts])

  const toggleNotePin = useCallback((id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }, [notes, setNotes])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  // Filters
  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.model.toLowerCase().includes(searchTerm.toLowerCase()) || a.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = assetFilter === 'all' || a.type === assetFilter || a.status === assetFilter
    return matchesSearch && matchesFilter
  })

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.requester.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = ticketFilter === 'all' || t.status === ticketFilter
    const matchesPriority = ticketPriorityFilter === 'all' || t.priority === ticketPriorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const filteredKnowledge = knowledge.filter(k => 
    k.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
    k.content.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
    k.tags.some(t => t.toLowerCase().includes(knowledgeSearch.toLowerCase()))
  )

  // Check admin
  const isAdmin = user?.role === 'admin'

  // Show login if not authenticated
  if (!user) {
    return <LoginScreen onLogin={setUser} />
  }

  // ===================== RENDER =====================
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col transition-all duration-300 fixed h-full z-50`}>
        <div className="p-3 border-b border-blue-600">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
              <Monitor className="w-4 h-4" />
            </div>
            {sidebarOpen && <div><h1 className="font-bold text-sm">IT Portal</h1><p className="text-[10px] text-blue-200">Al Rayes Laundry</p></div>}
          </div>
        </div>
        
        <nav className="flex-1 p-1.5 space-y-0.5 overflow-y-auto text-xs">
          {/* General Modules */}
          <div className="px-2 py-1 text-[10px] text-blue-300 font-medium uppercase tracking-wide">General</div>
          {Object.entries(MODULE_PERMISSIONS)
            .filter(([id, perm]) => perm.category === 'general' && (!perm.adminOnly || isAdmin))
            .map(([id, perm]) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all ${activeTab === id ? 'bg-white text-blue-700 font-medium shadow' : 'hover:bg-white/10 text-white/90'}`}>
                <perm.icon className="w-3.5 h-3.5 shrink-0" />
                {sidebarOpen && <span>{perm.label}</span>}
              </button>
            ))}
          
          {/* Sensitive Modules */}
          <div className="px-2 py-1 mt-2 text-[10px] text-blue-300 font-medium uppercase tracking-wide">Sensitive</div>
          {Object.entries(MODULE_PERMISSIONS)
            .filter(([id, perm]) => perm.category === 'sensitive' && (!perm.adminOnly || isAdmin))
            .map(([id, perm]) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all ${activeTab === id ? 'bg-white text-blue-700 font-medium shadow' : 'hover:bg-white/10 text-white/90'}`}>
                <perm.icon className="w-3.5 h-3.5 shrink-0" />
                {sidebarOpen && <span>{perm.label}</span>}
              </button>
            ))}
          
          {/* Critical Modules - Admin Only */}
          {isAdmin && (
            <>
              <div className="px-2 py-1 mt-2 text-[10px] text-amber-300 font-medium uppercase tracking-wide flex items-center gap-1"><Lock className="w-2.5 h-2.5" />Critical (Admin Only)</div>
              {Object.entries(MODULE_PERMISSIONS)
                .filter(([id, perm]) => perm.category === 'critical' && perm.adminOnly)
                .map(([id, perm]) => (
                  <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all ${activeTab === id ? 'bg-white text-blue-700 font-medium shadow' : 'hover:bg-white/10 text-white/90'}`}>
                    <perm.icon className="w-3.5 h-3.5 shrink-0" />
                    {sidebarOpen && <span>{perm.label}</span>}
                    {sidebarOpen && <Lock className="w-2.5 h-2.5 ml-auto text-amber-300" />}
                  </button>
                ))}
            </>
          )}
        </nav>
        
        <div className="p-1.5 border-t border-blue-600 space-y-0.5 text-xs">
          <button onClick={exportData} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 text-white/90">
            <Download className="w-3.5 h-3.5" /> {sidebarOpen && 'Export Data'}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-500/20 text-white/90 hover:text-red-200">
            <LogOut className="w-3.5 h-3.5" /> {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all ${sidebarOpen ? 'ml-56' : 'ml-14'}`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 sticky top-0 z-40 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-white/20 rounded text-white">
                <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded">
                  <Monitor className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-bold text-white">IT Management Portal</h1>
                  <p className="text-[10px] text-blue-100">Al Rayes Laundry, Doha</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Command Palette Button */}
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/80 text-xs border border-white/20 transition-colors"
              >
                <Command className="w-3.5 h-3.5" />
                <span>Search...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘K</kbd>
              </button>
              
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-200" />
                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 w-48 h-7 text-sm bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20" />
              </div>
              
              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/20" onClick={toggleTheme}>
                {theme === 'dark' ? <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg> : <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
              </Button>
              
              {/* Announcements */}
              <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:bg-white/20" onClick={() => setActiveTab('announcements')}>
                <Bell className="w-4 h-4 text-white" />
                {stats.unreadAnnouncements > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">{stats.unreadAnnouncements}</span>}
              </Button>
              
              {/* Alerts */}
              <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:bg-white/20" onClick={() => setAlertsDialogOpen(true)}>
                <AlertCircle className="w-4 h-4 text-white" />
                {stats.unreadAlerts > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{stats.unreadAlerts}</span>}
              </Button>
              
              <div className="flex items-center gap-2 pl-2 border-l border-white/30">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-white">{user.name}</p>
                  <p className="text-[10px] text-blue-200 capitalize">{user.role}</p>
                </div>
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* ===== DASHBOARD ===== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Welcome */}
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-lg font-bold">Welcome, {user.name}!</h1>
                      <p className="text-blue-100 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <Badge className="bg-white/20 text-white text-xs"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />All Systems OK</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {(stats.unreadAlerts > 0 || stats.slaBreaches > 0 || stats.expiringLicenses > 0) && (
                <div className="grid sm:grid-cols-3 gap-2">
                  {stats.unreadAlerts > 0 && <Alert className="border-amber-200 bg-amber-50 py-2"><AlertTriangle className="h-3 w-3 text-amber-600" /><AlertDescription className="text-xs">{stats.unreadAlerts} unread alerts</AlertDescription></Alert>}
                  {stats.slaBreaches > 0 && <Alert className="border-red-200 bg-red-50 py-2"><AlertCircle className="h-3 w-3 text-red-600" /><AlertDescription className="text-xs">{stats.slaBreaches} SLA breach(es)</AlertDescription></Alert>}
                  {stats.expiringLicenses > 0 && <Alert className="border-orange-200 bg-orange-50 py-2"><Clock className="h-3 w-3 text-orange-600" /><AlertDescription className="text-xs">{stats.expiringLicenses} license(s) expiring soon</AlertDescription></Alert>}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <Card className="border-l-4 border-l-blue-500"><CardContent className="pt-3 pb-2"><div className="flex justify-between items-start"><div><p className="text-[10px] text-slate-500 uppercase">Assets</p><p className="text-2xl font-bold">{assets.length}</p><p className="text-[10px] text-green-600">{stats.activeAssets} active</p></div><Monitor className="w-6 h-6 text-blue-500 opacity-50" /></div></CardContent></Card>
                <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-3 pb-2"><div className="flex justify-between items-start"><div><p className="text-[10px] text-slate-500 uppercase">Tickets</p><p className="text-2xl font-bold">{stats.openTickets}</p><p className="text-[10px] text-red-600">{stats.criticalTickets} critical</p></div><Ticket className="w-6 h-6 text-amber-500 opacity-50" /></div></CardContent></Card>
                <Card className="border-l-4 border-l-green-500"><CardContent className="pt-3 pb-2"><div className="flex justify-between items-start"><div><p className="text-[10px] text-slate-500 uppercase">Tasks</p><p className="text-2xl font-bold">{stats.completedChecks}/{stats.totalChecks}</p><Progress value={(stats.completedChecks / stats.totalChecks) * 100} className="h-1 mt-1" /></div><CheckCircle className="w-6 h-6 text-green-500 opacity-50" /></div></CardContent></Card>
                <Card className="border-l-4 border-l-purple-500"><CardContent className="pt-3 pb-2"><div className="flex justify-between items-start"><div><p className="text-[10px] text-slate-500 uppercase">Backups</p><p className="text-2xl font-bold">{stats.successfulBackups}/{backups.length}</p><p className="text-[10px] text-amber-600">{stats.warningBackups} warnings</p></div><HardDrive className="w-6 h-6 text-purple-500 opacity-50" /></div></CardContent></Card>
                <Card className="border-l-4 border-l-red-500"><CardContent className="pt-3 pb-2"><div className="flex justify-between items-start"><div><p className="text-[10px] text-slate-500 uppercase">SLA</p><p className="text-2xl font-bold">{stats.slaBreaches}</p><p className="text-[10px] text-slate-500">breaches</p></div><Target className="w-6 h-6 text-red-500 opacity-50" /></div></CardContent></Card>
                <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-3 pb-2"><div className="flex justify-between items-start"><div><p className="text-[10px] text-slate-500 uppercase">Visitors</p><p className="text-2xl font-bold">{stats.checkedInVisitors}</p><p className="text-[10px] text-blue-600">{stats.expectedVisitors} expected</p></div><Users className="w-6 h-6 text-teal-500 opacity-50" /></div></CardContent></Card>
              </div>

              {/* Dashboard Charts */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Ticket Status Pie Chart */}
                <Card>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5 text-blue-500" />
                      Ticket Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-6">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          {/* Open tickets */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" 
                            strokeDasharray={`${(tickets.filter(t => t.status === 'open').length / Math.max(tickets.length, 1)) * 251.2} 251.2`} 
                            strokeDashoffset="0" />
                          {/* In Progress */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" 
                            strokeDasharray={`${(tickets.filter(t => t.status === 'in-progress').length / Math.max(tickets.length, 1)) * 251.2} 251.2`} 
                            strokeDashoffset={`${-(tickets.filter(t => t.status === 'open').length / Math.max(tickets.length, 1)) * 251.2}`} />
                          {/* Resolved */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="20" 
                            strokeDasharray={`${(tickets.filter(t => t.status === 'resolved').length / Math.max(tickets.length, 1)) * 251.2} 251.2`} 
                            strokeDashoffset={`${-((tickets.filter(t => t.status === 'open').length + tickets.filter(t => t.status === 'in-progress').length) / Math.max(tickets.length, 1)) * 251.2}`} />
                          {/* Closed */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#94a3b8" strokeWidth="20" 
                            strokeDasharray={`${(tickets.filter(t => t.status === 'closed').length / Math.max(tickets.length, 1)) * 251.2} 251.2`} 
                            strokeDashoffset={`${-((tickets.filter(t => t.status === 'open').length + tickets.filter(t => t.status === 'in-progress').length + tickets.filter(t => t.status === 'resolved').length) / Math.max(tickets.length, 1)) * 251.2}`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-xl font-bold">{tickets.length}</p>
                            <p className="text-[10px] text-slate-500">Total</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span>Open ({tickets.filter(t => t.status === 'open').length})</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span>In Progress ({tickets.filter(t => t.status === 'in-progress').length})</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span>Resolved ({tickets.filter(t => t.status === 'resolved').length})</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400" /><span>Closed ({tickets.filter(t => t.status === 'closed').length})</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Asset Distribution Chart */}
                <Card>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                      Asset Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { label: 'Computers', count: stats.totalComputers, color: 'bg-blue-500', icon: Monitor },
                        { label: 'Servers', count: stats.totalServers, color: 'bg-purple-500', icon: Server },
                        { label: 'Printers', count: stats.totalPrinters, color: 'bg-amber-500', icon: Printer },
                        { label: 'Network', count: stats.totalNetwork, color: 'bg-green-500', icon: Network },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-xs w-20">{item.label}</span>
                          <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${(item.count / Math.max(assets.length, 1)) * 100}%` }} />
                          </div>
                          <span className="text-xs font-medium w-8 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* SLA Compliance Chart */}
                <Card>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-red-500" />
                      SLA Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="10" 
                            strokeDasharray={`${((tickets.length - stats.slaBreaches) / Math.max(tickets.length, 1)) * 251.2} 251.2`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{Math.round(((tickets.length - stats.slaBreaches) / Math.max(tickets.length, 1)) * 100)}%</p>
                            <p className="text-[10px] text-slate-500">Compliance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-3 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-green-600">{tickets.length - stats.slaBreaches}</p>
                        <p className="text-slate-500">On Time</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-red-600">{stats.slaBreaches}</p>
                        <p className="text-slate-500">Breached</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Overview */}
                <Card>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      Budget Overview (QAR)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Total Budget</span>
                        <span className="text-sm font-bold text-green-600">{stats.totalBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Spent</span>
                        <span className="text-sm font-bold text-red-600">{stats.totalExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Pending</span>
                        <span className="text-sm font-bold text-amber-600">{stats.pendingExpenses.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Remaining</span>
                          <span className={`text-sm font-bold ${stats.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stats.remainingBudget.toLocaleString()}</span>
                        </div>
                        <Progress value={(stats.remainingBudget / Math.max(stats.totalBudget, 1)) * 100} className="h-2 mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Visitors on Premises Alert */}
              {stats.checkedInVisitors > 0 && (
                <Alert className="border-green-200 bg-green-50">
                  <Users className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-700 text-sm">Visitors on Premises</AlertTitle>
                  <AlertDescription className="text-xs text-green-600">
                    {stats.checkedInVisitors} visitor(s) currently checked in. 
                    {visitors.filter(v => v.status === 'checked-in').slice(0, 3).map(v => (
                      <span key={v.id} className="ml-2 inline-flex items-center">
                        <Badge variant="outline" className="text-[10px] mr-1">{v.name}</Badge>
                      </span>
                    ))}
                    <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-xs text-green-700" onClick={() => setActiveTab('visitors')}>View all →</Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid lg:grid-cols-3 gap-4">
                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" />Quick Actions</CardTitle></CardHeader>
                  <CardContent className="grid gap-1.5">
                    {settings.quickActions.filter(a => a.enabled).map(action => (
                      <Button 
                        key={action.id} 
                        variant="outline" 
                        size="sm" 
                        className="justify-start h-7 text-xs cursor-pointer hover:bg-blue-50 hover:border-blue-300" 
                        onClick={() => {
                          if (action.action === 'new' && action.targetTab === 'tickets') {
                            setTicketForm({})
                            setEditingTicket(null)
                            setTicketDialogOpen(true)
                          } else {
                            setActiveTab(action.targetTab)
                          }
                        }}
                      >
                        {action.icon === 'Plus' && <Plus className="w-3 h-3 mr-1.5 text-blue-600" />}
                        {action.icon === 'CheckCircle' && <CheckCircle className="w-3 h-3 mr-1.5 text-green-600" />}
                        {action.icon === 'CalendarDays' && <CalendarDays className="w-3 h-3 mr-1.5 text-purple-600" />}
                        {action.icon === 'Book' && <Book className="w-3 h-3 mr-1.5 text-amber-600" />}
                        {action.icon === 'Star' && <Star className="w-3 h-3 mr-1.5 text-amber-600" />}
                        {!['Plus', 'CheckCircle', 'CalendarDays', 'Book', 'Star'].includes(action.icon) && <ChevronRight className="w-3 h-3 mr-1.5 text-slate-400" />}
                        {action.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-green-500" />System Status</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5">
                    {settings.systemStatus.filter(s => s.enabled).map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-2 p-1.5 rounded border bg-slate-50 text-xs cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={() => setActiveTab(item.targetTab)}
                      >
                        {item.icon === 'Database' && <Database className="w-3.5 h-3.5 text-green-500" />}
                        {item.icon === 'Server' && <Server className="w-3.5 h-3.5 text-green-500" />}
                        {item.icon === 'Wifi' && <Wifi className="w-3.5 h-3.5 text-green-500" />}
                        {item.icon === 'Mail' && <Mail className="w-3.5 h-3.5 text-green-500" />}
                        {item.icon === 'Shield' && <Shield className="w-3.5 h-3.5 text-green-500" />}
                        {!['Database', 'Server', 'Wifi', 'Mail', 'Shield'].includes(item.icon) && <Server className="w-3.5 h-3.5 text-green-500" />}
                        <span className="flex-1 font-medium">{item.name}</span>
                        <Badge className={`${item.status === 'ok' ? 'bg-green-100 text-green-700' : item.status === 'warning' ? 'bg-amber-100 text-amber-700' : item.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'} text-[10px] px-1.5 py-0`}>
                          {item.status === 'ok' ? 'OK' : item.status === 'warning' ? 'Warn' : item.status === 'error' ? 'Error' : 'Maint'}
                        </Badge>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming */}
                <Card>
                  <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-purple-500" />Upcoming</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5">
                    {calendarEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 4).map(e => (
                      <div 
                        key={e.id} 
                        className="flex items-center gap-2 p-1.5 rounded border bg-slate-50 text-xs cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={() => setActiveTab('calendar')}
                      >
                        <div className={`p-1 rounded ${e.type === 'maintenance' ? 'bg-amber-100' : e.type === 'warranty' ? 'bg-red-100' : e.type === 'license' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                          {e.type === 'maintenance' ? <Settings className="w-3 h-3 text-amber-600" /> : e.type === 'warranty' ? <AlertTriangle className="w-3 h-3 text-red-600" /> : e.type === 'license' ? <Clipboard className="w-3 h-3 text-purple-600" /> : <Calendar className="w-3 h-3 text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{e.title}</p>
                          <p className="text-[10px] text-slate-500">{e.date}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Location Map */}
              <Card>
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500" />Company Location</CardTitle>
                    <a href={`https://www.openstreetmap.org/?mlat=${settings.mapLatitude}&mlon=${settings.mapLongitude}#map=${settings.mapZoom}/${settings.mapLatitude}/${settings.mapLongitude}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                      Open in Maps <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="rounded-lg overflow-hidden border h-48 bg-slate-100">
                        <iframe 
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${settings.mapLongitude - 0.02}%2C${settings.mapLatitude - 0.01}%2C${settings.mapLongitude + 0.02}%2C${settings.mapLatitude + 0.01}&layer=mapnik&marker=${settings.mapLatitude}%2C${settings.mapLongitude}`}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }}
                          loading="lazy"
                          title={`${settings.companyName} Location`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-1.5 text-blue-700 font-medium mb-1">
                          <Building className="w-3.5 h-3.5" />
                          {settings.companyName}
                        </div>
                        <p className="text-slate-600 text-[11px]">{settings.companyLocation}</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium mb-1">
                          <Globe className="w-3.5 h-3.5" />
                          Coordinates
                        </div>
                        <p className="text-slate-600 text-[11px] font-mono">{settings.mapLatitude.toFixed(4)}° N, {settings.mapLongitude.toFixed(4)}° E</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium mb-1">
                          <Wifi className="w-3.5 h-3.5" />
                          Network Zones
                        </div>
                        <div className="space-y-0.5 text-[10px]">
                          <div className="flex justify-between"><span className="text-slate-500">Factory:</span><span className="font-mono">{settings.factoryNetwork}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Management:</span><span className="font-mono">{settings.managementNetwork}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Tickets */}
              <Card>
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" />Recent Tickets</CardTitle>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setActiveTab('tickets')}>View All <ChevronRight className="w-3 h-3 ml-0.5" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {tickets.slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center gap-2 p-2 rounded border hover:bg-blue-50 cursor-pointer text-xs" onClick={() => { setEditingTicket(t); setTicketForm(t); setTicketDialogOpen(true); }}>
                      <div className={`w-1.5 h-8 rounded-full ${t.priority === 'critical' ? 'bg-red-500' : t.priority === 'high' ? 'bg-amber-500' : t.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{t.title}</p>
                        <p className="text-[10px] text-slate-500">{t.id} • {t.requester} • {t.assignedTo && `→ ${t.assignedTo}`}</p>
                      </div>
                      <Badge className={`text-[10px] ${t.status === 'open' ? 'bg-red-100 text-red-700' : t.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{t.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== MONITORING ===== */}
          {activeTab === 'monitoring' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold">System Monitoring</h2><p className="text-xs text-slate-500">Real-time server health status</p></div>
                <Button variant="outline" size="sm"><RefreshCw className="w-3 h-3 mr-1" />Refresh</Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {serverMonitors.map(s => (
                  <Card key={s.id} className={`border-l-4 ${s.status === 'online' ? 'border-l-green-500' : s.status === 'warning' ? 'border-l-amber-500' : 'border-l-red-500'}`}>
                    <CardContent className="pt-3 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Server className="w-3.5 h-3.5 text-slate-600" />
                          <span className="font-medium text-sm">{s.name}</span>
                        </div>
                        <Badge className={`text-[10px] ${s.status === 'online' ? 'bg-green-100 text-green-700' : s.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{s.status}</Badge>
                      </div>
                      <div className="space-y-1.5 text-[10px]">
                        <div><span className="text-slate-500">CPU:</span><Progress value={s.cpu} className={`h-1 ml-1 inline-block w-16 ${s.cpu > 80 ? 'bg-red-100' : s.cpu > 60 ? 'bg-amber-100' : ''}`} /><span className="ml-1">{s.cpu}%</span></div>
                        <div><span className="text-slate-500">Mem:</span><Progress value={s.memory} className={`h-1 ml-1 inline-block w-16 ${s.memory > 80 ? 'bg-red-100' : s.memory > 60 ? 'bg-amber-100' : ''}`} /><span className="ml-1">{s.memory}%</span></div>
                        <div><span className="text-slate-500">Disk:</span><Progress value={s.disk} className={`h-1 ml-1 inline-block w-16 ${s.disk > 80 ? 'bg-red-100' : s.disk > 60 ? 'bg-amber-100' : ''}`} /><span className="ml-1">{s.disk}%</span></div>
                        <div className="text-slate-500">Uptime: <span className="text-slate-700">{s.uptime}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Network Connectivity</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Internet (Ooredoo)', status: 'Connected', speed: '1 Gbps' },
                    { name: 'Factory Network', status: 'Active', devices: '120 devices' },
                    { name: 'Management Network', status: 'Active', devices: '45 devices' },
                  ].map(n => (
                    <div key={n.name} className="p-3 rounded-lg border bg-green-50 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{n.name}</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-slate-500 mt-1">{n.speed || n.devices}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== DAILY CHECKLIST ===== */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold">Daily Tasks</h2><p className="text-xs text-slate-500">Complete your daily IT maintenance</p></div>
                <Button variant="outline" size="sm" onClick={resetChecks}><RefreshCw className="w-3 h-3 mr-1" />Reset</Button>
              </div>

              <div className="grid lg:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="w-full h-full -rotate-90"><circle cx="40" cy="40" r="35" stroke="#e2e8f0" strokeWidth="6" fill="none" /><circle cx="40" cy="40" r="35" stroke="#2563eb" strokeWidth="6" fill="none" strokeDasharray={`${(stats.completedChecks / stats.totalChecks) * 220} 220`} strokeLinecap="round" /></svg>
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold">{Math.round((stats.completedChecks / stats.totalChecks) * 100)}%</span></div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{stats.completedChecks}/{stats.totalChecks} completed</p>
                  </CardContent>
                </Card>

                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Array.from(new Set(checks.map(c => c.category))).map(cat => {
                    const total = checks.filter(c => c.category === cat).length
                    const done = checks.filter(c => c.category === cat && c.completed).length
                    return (
                      <Card key={cat} className="p-3">
                        <div className="flex justify-between text-xs mb-1"><span className="font-medium">{cat}</span><Badge variant="outline" className="text-[10px]">{done}/{total}</Badge></div>
                        <Progress value={(done / total) * 100} className="h-1.5" />
                      </Card>
                    )
                  })}
                </div>
              </div>

              <Card>
                <CardContent className="p-0 divide-y">
                  {checks.map(c => (
                    <div key={c.id} className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 text-sm ${c.completed ? 'bg-green-50/50' : ''}`} onClick={() => toggleCheck(c.id)}>
                      <Checkbox checked={c.completed} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                      <div className="flex-1"><p className={c.completed ? 'line-through text-slate-400' : ''}>{c.task}</p><p className="text-[10px] text-slate-500">{c.category}</p></div>
                      {c.completed && c.timestamp && <Badge className="bg-green-100 text-green-700 text-[10px]"><CheckCircle className="w-2.5 h-2.5 mr-0.5" />{c.timestamp}</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== TICKETS ===== */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div><h2 className="text-lg font-semibold">Support Tickets</h2><p className="text-xs text-slate-500">Track and manage IT requests</p></div>
                <div className="flex gap-2">
                  <Select value={ticketFilter} onValueChange={setTicketFilter}><SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent></Select>
                  <Select value={ticketPriorityFilter} onValueChange={setTicketPriorityFilter}><SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Priority</SelectItem><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select>
                  <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingTicket(null); setTicketForm({ priority: 'medium' }); setTicketDialogOpen(true); }}><Plus className="w-3 h-3 mr-1" />New</Button>
                </div>
              </div>

              {/* Ticket Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-red-600">{tickets.filter(t => t.status === 'open').length}</p><p className="text-[10px] text-slate-500">Open</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-blue-600">{tickets.filter(t => t.status === 'in-progress').length}</p><p className="text-[10px] text-slate-500">In Progress</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-green-600">{stats.resolvedTickets}</p><p className="text-[10px] text-slate-500">Resolved</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-amber-600">{stats.criticalTickets + stats.highTickets}</p><p className="text-[10px] text-slate-500">High Priority</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-red-600">{stats.slaBreaches}</p><p className="text-[10px] text-slate-500">SLA Breach</p></Card>
              </div>

              {/* Ticket List */}
              <div className="grid gap-2">
                {filteredTickets.map(t => {
                  const slaStatus = new Date(t.slaDeadline) < new Date() && t.status !== 'resolved' && t.status !== 'closed' ? 'breach' : new Date(t.slaDeadline) < new Date(Date.now() + 4 * 60 * 60 * 1000) ? 'warning' : 'ok'
                  return (
                    <Card key={t.id} className={`overflow-hidden cursor-pointer hover:shadow transition-shadow ${t.status === 'closed' ? 'opacity-60' : ''}`} onClick={() => { setEditingTicket(t); setTicketForm(t); setTicketDialogOpen(true); }}>
                      <div className={`h-1 ${t.priority === 'critical' ? 'bg-red-500' : t.priority === 'high' ? 'bg-amber-500' : t.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-mono text-[10px] text-slate-400">{t.id}</span>
                              <Badge className={`text-[10px] ${t.priority === 'critical' ? 'bg-red-100 text-red-700' : t.priority === 'high' ? 'bg-amber-100 text-amber-700' : t.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{t.priority}</Badge>
                              <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                              {slaStatus === 'breach' && <Badge className="bg-red-500 text-white text-[10px]">SLA!</Badge>}
                            </div>
                            <p className="font-medium text-sm truncate">{t.title}</p>
                            <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                              <span><User className="w-2.5 h-2.5 inline mr-0.5" />{t.requester}</span>
                              {t.assignedTo && <span>→ {t.assignedTo}</span>}
                              <span><Clock className="w-2.5 h-2.5 inline mr-0.5" />{t.createdAt}</span>
                            </div>
                          </div>
                          <Badge className={`shrink-0 self-center ${t.status === 'open' ? 'bg-red-100 text-red-700' : t.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{t.status}</Badge>
                        </div>
                        {t.resolution && <div className="mt-2 p-1.5 bg-green-50 rounded text-xs text-green-700"><strong>Resolved:</strong> {t.resolution}</div>}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* ===== ASSETS ===== */}
          {activeTab === 'assets' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div><h2 className="text-lg font-semibold">IT Assets</h2><p className="text-xs text-slate-500">Manage equipment inventory</p></div>
                <div className="flex gap-2">
                  <Select value={assetFilter} onValueChange={setAssetFilter}><SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="computer">Computers</SelectItem><SelectItem value="server">Servers</SelectItem><SelectItem value="printer">Printers</SelectItem><SelectItem value="network">Network</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => exportReport('assets')}><Download className="w-3 h-3 mr-1" />Export</Button>
                  <Dialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen}>
                    <DialogTrigger asChild><Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingAsset(null); setAssetForm({ type: 'computer', status: 'active' }); }}><Plus className="w-3 h-3 mr-1" />Add</Button></DialogTrigger>
                    <DialogContent className="max-w-md"><DialogHeader><DialogTitle>{editingAsset ? 'Edit' : 'Add'} Asset</DialogTitle></DialogHeader><div className="grid gap-3 py-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Type</Label><Select value={assetForm.type} onValueChange={(v) => setAssetForm({...assetForm, type: v as ITAsset['type']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="computer">Computer</SelectItem><SelectItem value="server">Server</SelectItem><SelectItem value="printer">Printer</SelectItem><SelectItem value="network">Network</SelectItem></SelectContent></Select></div>
                          <div className="space-y-1"><Label>Status</Label><Select value={assetForm.status} onValueChange={(v) => setAssetForm({...assetForm, status: v as ITAsset['status']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="space-y-1"><Label>Name *</Label><Input value={assetForm.name || ''} onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Model</Label><Input value={assetForm.model || ''} onChange={(e) => setAssetForm({...assetForm, model: e.target.value})} /></div>
                          <div className="space-y-1"><Label>Serial #</Label><Input value={assetForm.serialNumber || ''} onChange={(e) => setAssetForm({...assetForm, serialNumber: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Location</Label><Input value={assetForm.location || ''} onChange={(e) => setAssetForm({...assetForm, location: e.target.value})} /></div>
                          <div className="space-y-1"><Label>IP Address</Label><Input value={assetForm.ipAddress || ''} onChange={(e) => setAssetForm({...assetForm, ipAddress: e.target.value})} /></div>
                        </div>
                        <div className="space-y-1"><Label>Assigned To</Label><Input value={assetForm.assignedTo || ''} onChange={(e) => setAssetForm({...assetForm, assignedTo: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Purchase Date</Label><Input type="date" value={assetForm.purchaseDate || ''} onChange={(e) => setAssetForm({...assetForm, purchaseDate: e.target.value})} /></div>
                          <div className="space-y-1"><Label>Warranty End</Label><Input type="date" value={assetForm.warrantyEnd || ''} onChange={(e) => setAssetForm({...assetForm, warrantyEnd: e.target.value})} /></div>
                        </div>
                      </div><DialogFooter><Button variant="outline" size="sm" onClick={() => setAssetDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveAsset}>Save</Button></DialogFooter></DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-blue-600">{assets.length}</p><p className="text-[10px] text-slate-500">Total</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-green-600">{stats.activeAssets}</p><p className="text-[10px] text-slate-500">Active</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-amber-600">{stats.maintenanceAssets}</p><p className="text-[10px] text-slate-500">Maintenance</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-red-600">{stats.inactiveAssets}</p><p className="text-[10px] text-slate-500">Inactive</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-orange-600">{stats.expiringWarranties}</p><p className="text-[10px] text-slate-500">Expiring</p></Card>
              </div>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow className="bg-slate-50 text-xs"><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Location</TableHead><TableHead>IP</TableHead><TableHead>Status</TableHead><TableHead>Warranty</TableHead><TableHead className="w-16">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredAssets.map(a => {
                        const warrantyDays = a.warrantyEnd ? Math.ceil((new Date(a.warrantyEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
                        return (
                          <TableRow key={a.id} className="hover:bg-blue-50/50 text-xs">
                            <TableCell><p className="font-medium">{a.name}</p><p className="text-[10px] text-slate-500">{a.model}</p></TableCell>
                            <TableCell><Badge variant="outline" className="capitalize text-[10px]">{a.type}</Badge></TableCell>
                            <TableCell>{a.location}</TableCell>
                            <TableCell className="font-mono">{a.ipAddress}</TableCell>
                            <TableCell><Badge className={`text-[10px] ${a.status === 'active' ? 'bg-green-100 text-green-700' : a.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{a.status}</Badge></TableCell>
                            <TableCell className={warrantyDays !== null && warrantyDays <= 90 ? (warrantyDays < 0 ? 'text-red-600' : 'text-amber-600') : ''}>{warrantyDays !== null ? (warrantyDays < 0 ? 'Expired' : `${warrantyDays}d`) : '-'}</TableCell>
                            <TableCell>
                              <div className="flex gap-0.5">
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditingAsset(a); setAssetForm(a); setAssetDialogOpen(true); }}><Edit className="w-3 h-3 text-blue-600" /></Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setDeleteItem({ type: 'asset', id: a.id, name: a.name }); setDeleteDialogOpen(true); }}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== CALENDAR ===== */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold">IT Calendar</h2><p className="text-xs text-slate-500">Maintenance, warranties, licenses, events</p></div>
                <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
                  <DialogTrigger asChild><Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => setCalendarForm({ reminder: true })}><Plus className="w-3 h-3 mr-1" />Add Event</Button></DialogTrigger>
                  <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader><div className="grid gap-3 py-3 text-sm">
                      <div className="space-y-1"><Label>Title *</Label><Input value={calendarForm.title || ''} onChange={(e) => setCalendarForm({...calendarForm, title: e.target.value})} /></div>
                      <div className="space-y-1"><Label>Description</Label><Textarea value={calendarForm.description || ''} onChange={(e) => setCalendarForm({...calendarForm, description: e.target.value})} rows={2} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Date *</Label><Input type="date" value={calendarForm.date || ''} onChange={(e) => setCalendarForm({...calendarForm, date: e.target.value})} /></div>
                        <div className="space-y-1"><Label>Type</Label><Select value={calendarForm.type} onValueChange={(v) => setCalendarForm({...calendarForm, type: v as CalendarEvent['type']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="maintenance">Maintenance</SelectItem><SelectItem value="warranty">Warranty</SelectItem><SelectItem value="license">License</SelectItem><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="reminder">Reminder</SelectItem></SelectContent></Select></div>
                      </div>
                    </div><DialogFooter><Button variant="outline" size="sm" onClick={() => setCalendarDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveCalendarEvent}>Save</Button></DialogFooter></DialogContent>
                </Dialog>
              </div>

              <div className="grid sm:grid-cols-4 gap-2">
                <Card className="p-2.5 text-center border-l-4 border-l-amber-500"><p className="text-lg font-bold">{calendarEvents.filter(e => e.type === 'maintenance').length}</p><p className="text-[10px] text-slate-500">Maintenance</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-red-500"><p className="text-lg font-bold">{calendarEvents.filter(e => e.type === 'warranty').length}</p><p className="text-[10px] text-slate-500">Warranties</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-purple-500"><p className="text-lg font-bold">{calendarEvents.filter(e => e.type === 'license').length}</p><p className="text-[10px] text-slate-500">Licenses</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-blue-500"><p className="text-lg font-bold">{stats.upcomingEvents}</p><p className="text-[10px] text-slate-500">This Week</p></Card>
              </div>

              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Upcoming Events</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {calendarEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => {
                    const days = Math.ceil((new Date(e.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    const isPast = days < 0
                    return (
                      <div key={e.id} className={`flex items-center gap-3 p-2.5 rounded border text-sm ${isPast ? 'opacity-50' : ''}`}>
                        <div className={`p-2 rounded ${e.type === 'maintenance' ? 'bg-amber-100' : e.type === 'warranty' ? 'bg-red-100' : e.type === 'license' ? 'bg-purple-100' : e.type === 'meeting' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {e.type === 'maintenance' ? <Settings className="w-4 h-4 text-amber-600" /> : e.type === 'warranty' ? <AlertTriangle className="w-4 h-4 text-red-600" /> : e.type === 'license' ? <Clipboard className="w-4 h-4 text-purple-600" /> : e.type === 'meeting' ? <Users className="w-4 h-4 text-green-600" /> : <Calendar className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{e.title}</p>
                          <p className="text-[10px] text-slate-500">{e.date} • {e.description}</p>
                        </div>
                        <Badge className={`text-[10px] ${isPast ? 'bg-slate-100 text-slate-500' : days <= 7 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{isPast ? 'Past' : days === 0 ? 'Today' : `${days}d`}</Badge>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setDeleteItem({ type: 'calendar', id: e.id, name: e.title }); setDeleteDialogOpen(true); }}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== LICENSES ===== */}
          {activeTab === 'licenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold">Software Licenses</h2><p className="text-xs text-slate-500">Track software licenses and renewals</p></div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => exportReport('licenses')}><Download className="w-3 h-3 mr-1" />Export</Button>
                  <Dialog open={licenseDialogOpen} onOpenChange={setLicenseDialogOpen}>
                    <DialogTrigger asChild><Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => setLicenseForm({ seats: 1, usedSeats: 0 })}><Plus className="w-3 h-3 mr-1" />Add</Button></DialogTrigger>
                    <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Add License</DialogTitle></DialogHeader><div className="grid gap-3 py-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Software *</Label><Input value={licenseForm.software || ''} onChange={(e) => setLicenseForm({...licenseForm, software: e.target.value})} /></div>
                          <div className="space-y-1"><Label>Vendor</Label><Input value={licenseForm.vendor || ''} onChange={(e) => setLicenseForm({...licenseForm, vendor: e.target.value})} /></div>
                        </div>
                        <div className="space-y-1"><Label>License Key</Label><Input value={licenseForm.licenseKey || ''} onChange={(e) => setLicenseForm({...licenseForm, licenseKey: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Purchase Date</Label><Input type="date" value={licenseForm.purchaseDate || ''} onChange={(e) => setLicenseForm({...licenseForm, purchaseDate: e.target.value})} /></div>
                          <div className="space-y-1"><Label>Expiry Date *</Label><Input type="date" value={licenseForm.expiryDate || ''} onChange={(e) => setLicenseForm({...licenseForm, expiryDate: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1"><Label>Seats</Label><Input type="number" value={licenseForm.seats || 1} onChange={(e) => setLicenseForm({...licenseForm, seats: parseInt(e.target.value) || 1})} /></div>
                          <div className="space-y-1"><Label>Used</Label><Input type="number" value={licenseForm.usedSeats || 0} onChange={(e) => setLicenseForm({...licenseForm, usedSeats: parseInt(e.target.value) || 0})} /></div>
                          <div className="space-y-1"><Label>Cost</Label><Input value={licenseForm.cost || ''} onChange={(e) => setLicenseForm({...licenseForm, cost: e.target.value})} /></div>
                        </div>
                      </div><DialogFooter><Button variant="outline" size="sm" onClick={() => setLicenseDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveLicense}>Save</Button></DialogFooter></DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-blue-600">{licenses.length}</p><p className="text-[10px] text-slate-500">Total Licenses</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-green-600">{licenses.reduce((sum, l) => sum + l.seats, 0)}</p><p className="text-[10px] text-slate-500">Total Seats</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-amber-600">{licenses.reduce((sum, l) => sum + l.usedSeats, 0)}</p><p className="text-[10px] text-slate-500">Used Seats</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-red-600">{stats.expiringLicenses}</p><p className="text-[10px] text-slate-500">Expiring Soon</p></Card>
              </div>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow className="bg-slate-50 text-xs"><TableHead>Software</TableHead><TableHead>Vendor</TableHead><TableHead>Seats</TableHead><TableHead>Usage</TableHead><TableHead>Expiry</TableHead><TableHead>Cost</TableHead><TableHead className="w-12">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {licenses.map(l => {
                        const days = Math.ceil((new Date(l.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                        return (
                          <TableRow key={l.id} className="hover:bg-blue-50/50 text-xs">
                            <TableCell><p className="font-medium">{l.software}</p><p className="text-[10px] text-slate-500">{l.category}</p></TableCell>
                            <TableCell>{l.vendor}</TableCell>
                            <TableCell>{l.seats}</TableCell>
                            <TableCell><div className="flex items-center gap-1"><Progress value={(l.usedSeats / l.seats) * 100} className="h-1.5 w-12" /><span className="text-[10px]">{l.usedSeats}/{l.seats}</span></div></TableCell>
                            <TableCell className={days <= 30 ? 'text-red-600 font-medium' : ''}>{l.expiryDate} ({days}d)</TableCell>
                            <TableCell>{l.cost}</TableCell>
                            <TableCell><Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setDeleteItem({ type: 'license', id: l.id, name: l.software }); setDeleteDialogOpen(true); }}><Trash2 className="w-3 h-3 text-red-500" /></Button></TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== KNOWLEDGE BASE ===== */}
          {activeTab === 'knowledge' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold">Knowledge Base</h2><p className="text-xs text-slate-500">IT documentation and guides</p></div>
                <Dialog open={knowledgeDialogOpen} onOpenChange={setKnowledgeDialogOpen}>
                  <DialogTrigger asChild><Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => setKnowledgeForm({})}><Plus className="w-3 h-3 mr-1" />Add Article</Button></DialogTrigger>
                  <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Add Article</DialogTitle></DialogHeader><div className="grid gap-3 py-3 text-sm">
                      <div className="space-y-1"><Label>Title *</Label><Input value={knowledgeForm.title || ''} onChange={(e) => setKnowledgeForm({...knowledgeForm, title: e.target.value})} /></div>
                      <div className="space-y-1"><Label>Category</Label><Select value={knowledgeForm.category} onValueChange={(v) => setKnowledgeForm({...knowledgeForm, category: v})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="User Management">User Management</SelectItem><SelectItem value="Onboarding">Onboarding</SelectItem><SelectItem value="Software">Software</SelectItem><SelectItem value="Network">Network</SelectItem><SelectItem value="Hardware">Hardware</SelectItem></SelectContent></Select></div>
                      <div className="space-y-1"><Label>Content *</Label><Textarea value={knowledgeForm.content || ''} onChange={(e) => setKnowledgeForm({...knowledgeForm, content: e.target.value})} rows={6} placeholder="Write instructions here..." /></div>
                      <div className="space-y-1"><Label>Tags (comma separated)</Label><Input value={knowledgeForm.tags?.join(', ') || ''} onChange={(e) => setKnowledgeForm({...knowledgeForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} placeholder="AD, Password, User" /></div>
                    </div><DialogFooter><Button variant="outline" size="sm" onClick={() => setKnowledgeDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveKnowledge}>Save</Button></DialogFooter></DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search articles..." value={knowledgeSearch} onChange={(e) => setKnowledgeSearch(e.target.value)} className="pl-9 h-9" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredKnowledge.map(k => (
                  <Card key={k.id} className="cursor-pointer hover:shadow transition-shadow" onClick={() => { setKnowledgeForm(k); setKnowledgeDialogOpen(true); }}>
                    <CardHeader className="pb-2 pt-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">{k.title}</CardTitle>
                        <Button size="icon" variant="ghost" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); setDeleteItem({ type: 'knowledge', id: k.id, name: k.title }); setDeleteDialogOpen(true); }}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                      </div>
                      <Badge variant="outline" className="w-fit text-[10px]">{k.category}</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-slate-600 line-clamp-3 whitespace-pre-line">{k.content}</p>
                      <div className="flex flex-wrap gap-1 mt-2">{k.tags.slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                      <p className="text-[10px] text-slate-400 mt-2">{k.views} views • Updated {k.updatedAt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ===== NETWORK ===== */}
          {activeTab === 'network' && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold">Network Overview</h2><p className="text-xs text-slate-500">Network infrastructure and connectivity</p></div>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-blue-500" />Network Segments</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: 'Factory Network', ip: '192.168.2.x/24', devices: '~120' },
                      { name: 'Management Network', ip: '192.168.100.x/24', devices: '~45' },
                      { name: 'Guest Network', ip: '192.168.200.x/24', devices: '~20' },
                    ].map(n => (
                      <div key={n.name} className="flex items-center justify-between p-2.5 rounded border bg-slate-50 text-xs">
                        <div><p className="font-medium">{n.name}</p><p className="text-[10px] text-slate-500">{n.ip} • {n.devices} devices</p></div>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-purple-500" />Network Equipment</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {assets.filter(a => a.type === 'network' || a.type === 'server').map(a => (
                      <div key={a.id} className="flex items-center gap-2 p-2.5 rounded border bg-slate-50 text-xs">
                        <div className={`p-1.5 rounded ${a.type === 'network' ? 'bg-blue-100' : 'bg-purple-100'}`}>{a.type === 'network' ? <Wifi className="w-3 h-3 text-blue-600" /> : <Server className="w-3 h-3 text-purple-600" />}</div>
                        <div className="flex-1"><p className="font-medium">{a.name}</p><p className="text-[10px] text-slate-500">{a.model} • {a.ipAddress}</p></div>
                        <Badge className="bg-green-100 text-green-700 text-[10px]">{a.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Network Topology</CardTitle></CardHeader>
                <CardContent>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-4">
                        {[
                          { name: 'Internet', icon: Network, color: 'blue' },
                          { name: 'Firewall', icon: Shield, color: 'amber' },
                          { name: 'Core Switch', icon: Server, color: 'green' },
                        ].map(item => (
                          <div key={item.name} className="text-center">
                            <div className={`p-2 bg-${item.color}-100 rounded-full`}><item.icon className={`w-5 h-5 text-${item.color}-600`} /></div>
                            <p className="mt-1 text-[10px] font-medium">{item.name}</p>
                          </div>
                        ))}
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                      <div className="grid grid-cols-3 gap-8">
                        {[
                          { name: 'Factory', devices: '120' },
                          { name: 'Management', devices: '45' },
                          { name: 'Guest', devices: '20' },
                        ].map(n => (
                          <div key={n.name} className="text-center">
                            <div className="p-1.5 bg-purple-100 rounded-full inline-block"><Building className="w-4 h-4 text-purple-600" /></div>
                            <p className="mt-1 text-[10px] font-medium">{n.name}</p>
                            <p className="text-[10px] text-slate-500">{n.devices}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== PASSWORDS (Admin Only) ===== */}
          {activeTab === 'passwords' && isAdmin && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold">Password Manager</h2><p className="text-xs text-slate-500">Secure credential storage (Admin only)</p></div>
              
              <Alert className="border-blue-200 bg-blue-50 py-2"><Lock className="h-3 w-3 text-blue-600" /><AlertDescription className="text-xs text-blue-700">Admin access only. Credentials stored locally in browser.</AlertDescription></Alert>

              <div className="flex justify-end">
                <Dialog open={credentialDialogOpen} onOpenChange={setCredentialDialogOpen}>
                  <DialogTrigger asChild><Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => setCredentialForm({})}><Plus className="w-3 h-3 mr-1" />Add</Button></DialogTrigger>
                  <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Add Credential</DialogTitle></DialogHeader><div className="grid gap-3 py-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>System *</Label><Input value={credentialForm.system || ''} onChange={(e) => setCredentialForm({...credentialForm, system: e.target.value})} /></div>
                        <div className="space-y-1"><Label>Category</Label><Select value={credentialForm.category} onValueChange={(v) => setCredentialForm({...credentialForm, category: v})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Enterprise">Enterprise</SelectItem><SelectItem value="Cloud">Cloud</SelectItem><SelectItem value="Network">Network</SelectItem><SelectItem value="Security">Security</SelectItem></SelectContent></Select></div>
                      </div>
                      <div className="space-y-1"><Label>Username *</Label><Input value={credentialForm.username || ''} onChange={(e) => setCredentialForm({...credentialForm, username: e.target.value})} /></div>
                      <div className="space-y-1"><Label>Password *</Label><div className="flex gap-2"><Input type="password" value={credentialForm.password || ''} onChange={(e) => setCredentialForm({...credentialForm, password: e.target.value})} /><Button variant="outline" size="sm" onClick={() => setCredentialForm({...credentialForm, password: Math.random().toString(36).slice(-12) + '!@'})}>Gen</Button></div></div>
                      <div className="space-y-1"><Label>URL</Label><Input value={credentialForm.url || ''} onChange={(e) => setCredentialForm({...credentialForm, url: e.target.value})} /></div>
                    </div><DialogFooter><Button variant="outline" size="sm" onClick={() => setCredentialDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveCredential}>Save</Button></DialogFooter></DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-2">
                {credentials.map(c => (
                  <Card key={c.id}>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5"><Key className="w-3 h-3 text-blue-600" /><span className="font-medium">{c.system}</span><Badge variant="outline" className="text-[10px]">{c.category}</Badge></div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">User:</span><span className="font-mono">{c.username}</span><Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => copyToClipboard(c.username)}><Copy className="w-2.5 h-2.5" /></Button>
                            <span className="text-slate-500">Pass:</span><span className="font-mono">{showPassword === c.id ? c.password : '••••••••'}</span><Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => setShowPassword(showPassword === c.id ? null : c.id)}>{showPassword === c.id ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}</Button><Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => copyToClipboard(c.password)}><Copy className="w-2.5 h-2.5" /></Button>
                          </div>
                          {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px]">{c.url}</a>}
                        </div>
                        <Button size="sm" variant="ghost" className="text-red-500 h-7" onClick={() => { setDeleteItem({ type: 'credential', id: c.id, name: c.system }); setDeleteDialogOpen(true); }}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ===== BACKUPS ===== */}
          {activeTab === 'backups' && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold">Backup Status</h2><p className="text-xs text-slate-500">Monitor backup jobs and schedules</p></div>

              <div className="grid sm:grid-cols-3 gap-2">
                <Card className="border-l-4 border-l-green-500"><CardContent className="pt-3 pb-2"><div className="flex items-center justify-between"><div><p className="text-[10px] text-slate-500">Successful</p><p className="text-xl font-bold text-green-600">{stats.successfulBackups}</p></div><CheckCircle className="w-6 h-6 text-green-500 opacity-50" /></div></CardContent></Card>
                <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-3 pb-2"><div className="flex items-center justify-between"><div><p className="text-[10px] text-slate-500">Warnings</p><p className="text-xl font-bold text-amber-600">{stats.warningBackups}</p></div><AlertTriangle className="w-6 h-6 text-amber-500 opacity-50" /></div></CardContent></Card>
                <Card className="border-l-4 border-l-red-500"><CardContent className="pt-3 pb-2"><div className="flex items-center justify-between"><div><p className="text-[10px] text-slate-500">Failed</p><p className="text-xl font-bold text-red-600">{stats.failedBackups}</p></div><XCircle className="w-6 h-6 text-red-500 opacity-50" /></div></CardContent></Card>
              </div>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow className="bg-slate-50 text-xs"><TableHead>Job Name</TableHead><TableHead>Type</TableHead><TableHead>Schedule</TableHead><TableHead>Last Run</TableHead><TableHead>Size</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {backups.map(b => (
                        <TableRow key={b.id} className="hover:bg-blue-50/50 text-xs">
                          <TableCell className="font-medium">{b.name}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize text-[10px]">{b.type}</Badge></TableCell>
                          <TableCell>{b.schedule}</TableCell>
                          <TableCell>{b.lastRun}</TableCell>
                          <TableCell>{b.size}</TableCell>
                          <TableCell><Badge className={`text-[10px] ${b.status === 'success' ? 'bg-green-100 text-green-700' : b.status === 'warning' ? 'bg-amber-100 text-amber-700' : b.status === 'running' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{b.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== NOTES ===== */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold">Quick Notes</h2><p className="text-xs text-slate-500">Store important information</p></div>
                <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                  <DialogTrigger asChild><Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingNote(null); setNoteForm({}); }}><Plus className="w-3 h-3 mr-1" />New</Button></DialogTrigger>
                  <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{editingNote ? 'Edit' : 'New'} Note</DialogTitle></DialogHeader><div className="grid gap-3 py-3 text-sm">
                      <div className="space-y-1"><Label>Title *</Label><Input value={noteForm.title || ''} onChange={(e) => setNoteForm({...noteForm, title: e.target.value})} /></div>
                      <div className="space-y-1"><Label>Category</Label><Select value={noteForm.category} onValueChange={(v) => setNoteForm({...noteForm, category: v})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="General">General</SelectItem><SelectItem value="Vendors">Vendors</SelectItem><SelectItem value="Licenses">Licenses</SelectItem><SelectItem value="Procedures">Procedures</SelectItem></SelectContent></Select></div>
                      <div className="space-y-1"><Label>Content *</Label><Textarea value={noteForm.content || ''} onChange={(e) => setNoteForm({...noteForm, content: e.target.value})} rows={4} /></div>
                    </div><DialogFooter><Button variant="outline" size="sm" onClick={() => setNoteDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveNote}>Save</Button></DialogFooter></DialogContent>
                </Dialog>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(n => (
                  <Card key={n.id} className={`cursor-pointer hover:shadow transition-shadow ${n.pinned ? 'border-blue-300 bg-blue-50/50' : ''}`} onClick={() => { setEditingNote(n); setNoteForm(n); setNoteDialogOpen(true); }}>
                    <CardHeader className="pb-1 pt-2.5">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">{n.title}</CardTitle>
                        <div className="flex gap-0.5">
                          <Button size="icon" variant="ghost" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); toggleNotePin(n.id); }}><Star className={`w-3 h-3 ${n.pinned ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} /></Button>
                          <Button size="icon" variant="ghost" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); setDeleteItem({ type: 'note', id: n.id, name: n.title }); setDeleteDialogOpen(true); }}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit text-[10px]">{n.category}</Badge>
                    </CardHeader>
                    <CardContent className="pt-0"><p className="text-xs text-slate-600 line-clamp-3">{n.content}</p><p className="text-[10px] text-slate-400 mt-2">{n.updatedAt}</p></CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ===== TEAM ===== */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold">Team Workload</h2><p className="text-xs text-slate-500">IT team assignments and performance</p></div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {['MD Irfan', 'Hamza', 'Abraham', 'Arman'].map(name => {
                  const assigned = tickets.filter(t => t.assignedTo === name).length
                  const open = tickets.filter(t => t.assignedTo === name && (t.status === 'open' || t.status === 'in-progress')).length
                  const resolved = tickets.filter(t => t.assignedTo === name && (t.status === 'resolved' || t.status === 'closed')).length
                  return (
                    <Card key={name}>
                      <CardContent className="pt-3 pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">{name.charAt(0)}</div>
                          <div><p className="font-medium text-sm">{name}</p><p className="text-[10px] text-slate-500">IT Admin</p></div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-center text-xs">
                          <div className="p-1.5 rounded bg-slate-100"><p className="font-bold">{assigned}</p><p className="text-[10px] text-slate-500">Total</p></div>
                          <div className="p-1.5 rounded bg-amber-100"><p className="font-bold text-amber-700">{open}</p><p className="text-[10px] text-slate-500">Open</p></div>
                          <div className="p-1.5 rounded bg-green-100"><p className="font-bold text-green-700">{resolved}</p><p className="text-[10px] text-slate-500">Done</p></div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Performance Summary</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-4 gap-4 text-center">
                  <div><p className="text-2xl font-bold text-blue-600">{tickets.length}</p><p className="text-xs text-slate-500">Total Tickets</p></div>
                  <div><p className="text-2xl font-bold text-amber-600">{stats.openTickets}</p><p className="text-xs text-slate-500">Open</p></div>
                  <div><p className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</p><p className="text-xs text-slate-500">Resolved</p></div>
                  <div><p className="text-2xl font-bold text-purple-600">{Math.round((stats.resolvedTickets / Math.max(tickets.length, 1)) * 100)}%</p><p className="text-xs text-slate-500">Resolution Rate</p></div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== LOGS ===== */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold">Activity Logs</h2><p className="text-xs text-slate-500">Recent changes and actions</p></div>
                <Badge variant="outline" className="text-xs">Last 100 entries</Badge>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow className="bg-slate-50 text-xs"><TableHead>Time</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Category</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {logs.slice(0, 20).map(l => (
                        <TableRow key={l.id} className="hover:bg-blue-50/50 text-xs">
                          <TableCell className="font-mono text-[10px]">{l.timestamp}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{l.user}</Badge></TableCell>
                          <TableCell className="font-medium">{l.action}</TableCell>
                          <TableCell><Badge variant="secondary" className="text-[10px]">{l.category}</Badge></TableCell>
                          <TableCell className="text-slate-500">{l.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== EMERGENCY ===== */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold">Emergency Contacts</h2><p className="text-xs text-slate-500">Quick access for critical situations</p></div>

              <div className="grid lg:grid-cols-2 gap-4">
                <Card className="border-red-200">
                  <CardHeader className="bg-red-50 py-2"><CardTitle className="text-sm flex items-center gap-1.5 text-red-700"><PhoneCall className="w-3.5 h-3.5" />IT Team</CardTitle></CardHeader>
                  <CardContent className="pt-3 space-y-1.5">
                    {[
                      { name: 'Simon Peter', role: 'IT HOD', phone: '+974 XXXX XXXX' },
                      { name: 'MD Irfan', role: 'IT Admin', phone: '+974 XXXX XXXX' },
                      { name: 'Hamza', role: 'IT Admin', phone: '+974 XXXX XXXX' },
                      { name: 'Abraham', role: 'IT Admin', phone: '+974 XXXX XXXX' },
                      { name: 'Arman', role: 'IT Admin', phone: '+974 XXXX XXXX' },
                    ].map(c => (
                      <div key={c.name} className="flex items-center justify-between p-2 rounded border bg-slate-50 text-xs">
                        <div><p className="font-medium">{c.name}</p><p className="text-[10px] text-slate-500">{c.role}</p></div>
                        <p className="font-mono text-blue-600">{c.phone}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-amber-200">
                  <CardHeader className="bg-amber-50 py-2"><CardTitle className="text-sm flex items-center gap-1.5 text-amber-700"><Building className="w-3.5 h-3.5" />Vendors</CardTitle></CardHeader>
                  <CardContent className="pt-3 space-y-1.5">
                    {[
                      { name: 'Crystol Technologies', system: 'LMS', phone: '+974 XXXX XXXX' },
                      { name: 'SAP Support', system: 'SAP B1', phone: '+974 XXXX XXXX' },
                      { name: 'Ooredoo Business', system: 'Internet', phone: '111' },
                      { name: 'Microsoft Support', system: 'Office 365', phone: 'Online' },
                      { name: 'HID France', system: 'RFID', phone: 'Email' },
                    ].map(v => (
                      <div key={v.name} className="flex items-center justify-between p-2 rounded border bg-slate-50 text-xs">
                        <div><p className="font-medium">{v.name}</p><p className="text-[10px] text-slate-500">{v.system}</p></div>
                        <p className="font-mono text-blue-600">{v.phone}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50 py-2"><CardTitle className="text-sm flex items-center gap-1.5 text-blue-700"><Zap className="w-3.5 h-3.5" />Quick Troubleshooting</CardTitle></CardHeader>
                <CardContent className="pt-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { title: 'Server Down', steps: ['Check power & network', 'Verify services', 'Restart', 'Escalate'] },
                      { title: 'Internet Down', steps: ['Check firewall', 'Verify ISP', 'Contact Ooredoo', 'Enable backup'] },
                      { title: 'SAP B1 Issue', steps: ['Check SQL', 'Verify license', 'Restart app', 'Call support'] },
                      { title: 'Network Slow', steps: ['Check bandwidth', 'Find heavy users', 'Restart switch', 'Scan malware'] },
                    ].map(p => (
                      <div key={p.title} className="p-3 rounded border bg-slate-50 text-xs">
                        <h4 className="font-semibold mb-1.5">{p.title}</h4>
                        <ol className="space-y-0.5 text-slate-600">{p.steps.map((s, i) => <li key={i} className="flex items-start gap-1"><span className="font-medium text-blue-600">{i + 1}.</span>{s}</li>)}</ol>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== MEETINGS ===== */}
          {activeTab === 'meetings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><Video className="w-5 h-5 text-purple-500" />Meeting Scheduler</h2><p className="text-xs text-slate-500">Schedule and manage meetings with video conferencing</p></div>
                <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700" onClick={() => { setEditingMeeting(null); setMeetingForm({ meetingType: 'video', platform: 'jitsi', duration: 60, status: 'scheduled' }); }}>
                      <Plus className="w-3 h-3 mr-1" />Schedule Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editingMeeting ? 'Edit' : 'Schedule'} Meeting</DialogTitle></DialogHeader>
                    <div className="grid gap-3 py-3 text-sm">
                      <div className="space-y-1"><Label>Title *</Label><Input value={meetingForm.title || ''} onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})} placeholder="Meeting title" /></div>
                      <div className="space-y-1"><Label>Description</Label><Textarea value={meetingForm.description || ''} onChange={(e) => setMeetingForm({...meetingForm, description: e.target.value})} rows={2} /></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1"><Label>Date *</Label><Input type="date" value={meetingForm.date || ''} onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})} /></div>
                        <div className="space-y-1"><Label>Time *</Label><Input type="time" value={meetingForm.time || ''} onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})} /></div>
                        <div className="space-y-1"><Label>Duration (min)</Label><Select value={String(meetingForm.duration || 60)} onValueChange={(v) => setMeetingForm({...meetingForm, duration: parseInt(v)})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 min</SelectItem>
                            <SelectItem value="30">30 min</SelectItem>
                            <SelectItem value="45">45 min</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Type</Label><Select value={meetingForm.meetingType} onValueChange={(v) => setMeetingForm({...meetingForm, meetingType: v as Meeting['meetingType']})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video Call</SelectItem>
                            <SelectItem value="in-person">In Person</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select></div>
                        <div className="space-y-1"><Label>Platform</Label><Select value={meetingForm.platform} onValueChange={(v) => setMeetingForm({...meetingForm, platform: v as Meeting['platform']})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jitsi">Jitsi Meet (Free)</SelectItem>
                            <SelectItem value="google-meet">Google Meet</SelectItem>
                            <SelectItem value="zoom">Zoom</SelectItem>
                            <SelectItem value="teams">Microsoft Teams</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select></div>
                      </div>
                      <div className="space-y-1"><Label>Meeting Link / Location</Label><Input value={meetingForm.meetingLink || meetingForm.location || ''} onChange={(e) => setMeetingForm({...meetingForm, meetingLink: e.target.value, location: e.target.value})} placeholder="Video link or physical location" /></div>
                      <div className="space-y-1"><Label>Agenda</Label><Textarea value={meetingForm.agenda || ''} onChange={(e) => setMeetingForm({...meetingForm, agenda: e.target.value})} rows={3} placeholder="Meeting agenda items..." /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" size="sm" onClick={() => setMeetingDialogOpen(false)}>Cancel</Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => {
                        if (!meetingForm.title || !meetingForm.date || !meetingForm.time) {
                          toast.error('Please fill required fields')
                          return
                        }
                        // Generate Jitsi link if not provided
                        let link = meetingForm.meetingLink || ''
                        if (meetingForm.platform === 'jitsi' && !link) {
                          const roomName = `AlRayes${Date.now().toString(36)}`
                          link = `https://meet.jit.si/${roomName}`
                        }
                        
                        if (editingMeeting) {
                          setMeetings(meetings.map(m => m.id === editingMeeting.id ? {...m, ...meetingForm, meetingLink: link} : m))
                          toast.success('Meeting updated')
                        } else {
                          const newMeeting: Meeting = {
                            id: Date.now().toString(),
                            title: meetingForm.title || '',
                            description: meetingForm.description || '',
                            date: meetingForm.date || '',
                            time: meetingForm.time || '',
                            duration: meetingForm.duration || 60,
                            organizer: user?.name || '',
                            participants: [],
                            meetingType: meetingForm.meetingType || 'video',
                            platform: meetingForm.platform || 'jitsi',
                            meetingLink: link,
                            location: meetingForm.location || '',
                            agenda: meetingForm.agenda || '',
                            status: 'scheduled',
                            notes: '',
                            createdAt: new Date().toISOString().slice(0, 10)
                          }
                          setMeetings([...meetings, newMeeting])
                          toast.success('Meeting scheduled')
                        }
                        setMeetingDialogOpen(false)
                        setMeetingForm({})
                      }}>Save Meeting</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Meeting Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-purple-600">{meetings.filter(m => m.status === 'scheduled').length}</p><p className="text-[10px] text-slate-500">Scheduled</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-green-600">{meetings.filter(m => m.status === 'completed').length}</p><p className="text-[10px] text-slate-500">Completed</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-blue-600">{meetings.filter(m => m.date === new Date().toISOString().slice(0, 10)).length}</p><p className="text-[10px] text-slate-500">Today</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-amber-600">{meetings.filter(m => new Date(m.date) > new Date()).length}</p><p className="text-[10px] text-slate-500">Upcoming</p></Card>
              </div>

              {/* Meetings List */}
              <div className="grid gap-3">
                {meetings.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()).map(m => (
                  <Card key={m.id} className={`overflow-hidden ${m.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <div className={`h-1 ${m.status === 'completed' ? 'bg-green-500' : m.status === 'cancelled' ? 'bg-red-500' : m.status === 'in-progress' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${m.meetingType === 'video' ? 'bg-purple-100 text-purple-700' : m.meetingType === 'in-person' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} text-[10px]`}>
                              {m.meetingType === 'video' ? <Video className="w-2.5 h-2.5 mr-0.5" /> : <Users className="w-2.5 h-2.5 mr-0.5" />}
                              {m.meetingType}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{m.platform}</Badge>
                            {m.status === 'in-progress' && <Badge className="bg-blue-500 text-white text-[10px] animate-pulse">Live</Badge>}
                          </div>
                          <p className="font-medium text-sm">{m.title}</p>
                          <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                            <span><Calendar className="w-2.5 h-2.5 inline mr-0.5" />{m.date}</span>
                            <span><Clock className="w-2.5 h-2.5 inline mr-0.5" />{m.time} ({m.duration}min)</span>
                            <span><User className="w-2.5 h-2.5 inline mr-0.5" />{m.organizer}</span>
                          </div>
                          {m.agenda && <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{m.agenda}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                          {m.meetingLink && (
                            <Button size="sm" variant="default" className="h-7 text-[10px] bg-green-600 hover:bg-green-700" onClick={() => window.open(m.meetingLink, '_blank')}>
                              <Play className="w-2.5 h-2.5 mr-1" />Join
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => { setEditingMeeting(m); setMeetingForm(m); setMeetingDialogOpen(true); }}>
                            <Edit className="w-2.5 h-2.5 mr-1" />Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ===== PROGRAMME CHARTERS ===== */}
          {activeTab === 'charters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><FileCheck className="w-5 h-5 text-green-500" />Programme Charters</h2><p className="text-xs text-slate-500">Project documentation and tracking</p></div>
                <Dialog open={charterDialogOpen} onOpenChange={setCharterDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => { setEditingCharter(null); setCharterForm({ status: 'draft', objectives: [], stakeholders: [], deliverables: [], milestones: [], risks: [], successCriteria: [], assumptions: [], constraints: [], outOfScope: [] }); }}>
                      <Plus className="w-3 h-3 mr-1" />New Charter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingCharter ? 'Edit' : 'New'} Programme Charter</DialogTitle></DialogHeader>
                    <div className="grid gap-3 py-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Programme Name *</Label><Input value={charterForm.name || ''} onChange={(e) => setCharterForm({...charterForm, name: e.target.value})} /></div>
                        <div className="space-y-1"><Label>Status</Label><Select value={charterForm.status} onValueChange={(v) => setCharterForm({...charterForm, status: v as ProgrammeCharter['status']})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select></div>
                      </div>
                      <div className="space-y-1"><Label>Description</Label><Textarea value={charterForm.description || ''} onChange={(e) => setCharterForm({...charterForm, description: e.target.value})} rows={2} /></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1"><Label>Start Date</Label><Input type="date" value={charterForm.startDate || ''} onChange={(e) => setCharterForm({...charterForm, startDate: e.target.value})} /></div>
                        <div className="space-y-1"><Label>End Date</Label><Input type="date" value={charterForm.endDate || ''} onChange={(e) => setCharterForm({...charterForm, endDate: e.target.value})} /></div>
                        <div className="space-y-1"><Label>Budget</Label><Input value={charterForm.budget || ''} onChange={(e) => setCharterForm({...charterForm, budget: e.target.value})} placeholder="QAR 100,000" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Sponsor</Label><Input value={charterForm.sponsor || ''} onChange={(e) => setCharterForm({...charterForm, sponsor: e.target.value})} /></div>
                        <div className="space-y-1"><Label>Project Manager</Label><Input value={charterForm.projectManager || ''} onChange={(e) => setCharterForm({...charterForm, projectManager: e.target.value})} /></div>
                      </div>
                      <div className="space-y-1"><Label>Scope</Label><Textarea value={charterForm.scope || ''} onChange={(e) => setCharterForm({...charterForm, scope: e.target.value})} rows={2} /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" size="sm" onClick={() => setCharterDialogOpen(false)}>Cancel</Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => {
                        if (!charterForm.name) {
                          toast.error('Please enter programme name')
                          return
                        }
                        if (editingCharter) {
                          setCharters(charters.map(c => c.id === editingCharter.id ? {...c, ...charterForm, updatedAt: new Date().toISOString().slice(0, 10)} : c))
                          toast.success('Charter updated')
                        } else {
                          const newCharter: ProgrammeCharter = {
                            id: Date.now().toString(),
                            name: charterForm.name || '',
                            description: charterForm.description || '',
                            objectives: charterForm.objectives || [],
                            scope: charterForm.scope || '',
                            outOfScope: charterForm.outOfScope || [],
                            startDate: charterForm.startDate || '',
                            endDate: charterForm.endDate || '',
                            budget: charterForm.budget || '',
                            sponsor: charterForm.sponsor || '',
                            projectManager: charterForm.projectManager || '',
                            stakeholders: charterForm.stakeholders || [],
                            deliverables: charterForm.deliverables || [],
                            milestones: charterForm.milestones || [],
                            risks: charterForm.risks || [],
                            successCriteria: charterForm.successCriteria || [],
                            assumptions: charterForm.assumptions || [],
                            constraints: charterForm.constraints || [],
                            status: charterForm.status || 'draft',
                            createdAt: new Date().toISOString().slice(0, 10),
                            updatedAt: new Date().toISOString().slice(0, 10)
                          }
                          setCharters([...charters, newCharter])
                          toast.success('Charter created')
                        }
                        setCharterDialogOpen(false)
                        setCharterForm({})
                      }}>Save Charter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Charter Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-blue-600">{charters.length}</p><p className="text-[10px] text-slate-500">Total</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-green-600">{charters.filter(c => c.status === 'active').length}</p><p className="text-[10px] text-slate-500">Active</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-amber-600">{charters.filter(c => c.status === 'on-hold').length}</p><p className="text-[10px] text-slate-500">On Hold</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-purple-600">{charters.filter(c => c.status === 'completed').length}</p><p className="text-[10px] text-slate-500">Completed</p></Card>
                <Card className="p-2.5 text-center"><p className="text-lg font-bold text-slate-600">{charters.filter(c => c.status === 'draft').length}</p><p className="text-[10px] text-slate-500">Draft</p></Card>
              </div>

              {/* Charter Cards */}
              <div className="grid gap-3">
                {charters.map(c => {
                  const progress = c.deliverables.length > 0 
                    ? Math.round((c.deliverables.filter(d => d.status === 'completed').length / c.deliverables.length) * 100)
                    : 0
                  return (
                    <Card key={c.id} className="overflow-hidden">
                      <div className={`h-1 ${c.status === 'active' ? 'bg-green-500' : c.status === 'completed' ? 'bg-purple-500' : c.status === 'on-hold' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'completed' ? 'bg-purple-100 text-purple-700' : c.status === 'on-hold' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'} text-[10px]`}>{c.status}</Badge>
                              <span className="text-[10px] text-slate-500">{c.budget}</span>
                            </div>
                            <p className="font-medium text-sm">{c.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{c.description}</p>
                            <div className="flex gap-3 text-[10px] text-slate-500 mt-2">
                              <span><Calendar className="w-2.5 h-2.5 inline mr-0.5" />{c.startDate} → {c.endDate}</span>
                              <span><User className="w-2.5 h-2.5 inline mr-0.5" />{c.projectManager}</span>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-[10px] mb-1">
                                <span>Progress</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => { setEditingCharter(c); setCharterForm(c); setCharterDialogOpen(true); }}>
                              <Edit className="w-2.5 h-2.5 mr-1" />Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-[10px] text-red-500" onClick={() => { setDeleteItem({ type: 'charter', id: c.id, name: c.name }); setDeleteDialogOpen(true); }}>
                              <Trash2 className="w-2.5 h-2.5 mr-1" />Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* ===== NOTEBOOK ===== */}
          {activeTab === 'notebook' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><Folder className="w-5 h-5 text-blue-500" />Notebook</h2><p className="text-xs text-slate-500">Organized notes and documentation</p></div>
                <Dialog open={notebookDialogOpen} onOpenChange={setNotebookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingPage(null); setNotebookForm({ folder: 'General', tags: [], pinned: false, favorite: false, color: '#3B82F6' }); }}>
                      <Plus className="w-3 h-3 mr-1" />New Page
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>{editingPage ? 'Edit' : 'New'} Page</DialogTitle></DialogHeader>
                    <div className="grid gap-3 py-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Title *</Label><Input value={notebookForm.title || ''} onChange={(e) => setNotebookForm({...notebookForm, title: e.target.value})} placeholder="Page title" /></div>
                        <div className="space-y-1"><Label>Folder</Label><Select value={notebookForm.folder || 'General'} onValueChange={(v) => setNotebookForm({...notebookForm, folder: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Servers">Servers</SelectItem>
                            <SelectItem value="Network">Network</SelectItem>
                            <SelectItem value="Scripts">Scripts</SelectItem>
                            <SelectItem value="Contacts">Contacts</SelectItem>
                            <SelectItem value="Procedures">Procedures</SelectItem>
                          </SelectContent>
                        </Select></div>
                      </div>
                      <div className="space-y-1"><Label>Content (Markdown supported)</Label><Textarea value={notebookForm.content || ''} onChange={(e) => setNotebookForm({...notebookForm, content: e.target.value})} rows={12} className="font-mono text-xs" placeholder="# Title&#10;&#10;Content here..." /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Tags (comma separated)</Label><Input value={notebookForm.tags?.join(', ') || ''} onChange={(e) => setNotebookForm({...notebookForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} placeholder="tag1, tag2" /></div>
                        <div className="space-y-1"><Label>Color</Label><div className="flex gap-1">
                          {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map(color => (
                            <button key={color} type="button" className={`w-6 h-6 rounded border-2 ${notebookForm.color === color ? 'border-slate-800' : 'border-transparent'}`} style={{ backgroundColor: color }} onClick={() => setNotebookForm({...notebookForm, color})} />
                          ))}
                        </div></div>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs">
                          <Checkbox checked={notebookForm.pinned} onCheckedChange={(checked) => setNotebookForm({...notebookForm, pinned: !!checked})} />
                          <Pin className="w-3 h-3" /> Pinned
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <Checkbox checked={notebookForm.favorite} onCheckedChange={(checked) => setNotebookForm({...notebookForm, favorite: !!checked})} />
                          <Star className="w-3 h-3" /> Favorite
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" size="sm" onClick={() => setNotebookDialogOpen(false)}>Cancel</Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                        if (!notebookForm.title) {
                          toast.error('Please enter a title')
                          return
                        }
                        if (editingPage) {
                          setNotebookPages(notebookPages.map(p => p.id === editingPage.id ? {...p, ...notebookForm, updatedAt: new Date().toISOString().slice(0, 10)} : p))
                          toast.success('Page updated')
                        } else {
                          const newPage: NotebookPage = {
                            id: Date.now().toString(),
                            title: notebookForm.title || '',
                            content: notebookForm.content || '',
                            folder: notebookForm.folder || 'General',
                            tags: notebookForm.tags || [],
                            createdAt: new Date().toISOString().slice(0, 10),
                            updatedAt: new Date().toISOString().slice(0, 10),
                            pinned: notebookForm.pinned || false,
                            favorite: notebookForm.favorite || false,
                            color: notebookForm.color || '#3B82F6'
                          }
                          setNotebookPages([...notebookPages, newPage])
                          toast.success('Page created')
                        }
                        setNotebookDialogOpen(false)
                        setNotebookForm({})
                      }}>Save Page</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Folder Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button variant={selectedFolder === 'all' ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setSelectedFolder('all')}>All</Button>
                {['General', 'Servers', 'Network', 'Scripts', 'Contacts', 'Procedures'].map(folder => (
                  <Button key={folder} variant={selectedFolder === folder ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setSelectedFolder(folder)}>
                    <Folder className="w-3 h-3 mr-1" />{folder}
                  </Button>
                ))}
              </div>

              {/* Notebook Pages */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {notebookPages
                  .filter(p => selectedFolder === 'all' || p.folder === selectedFolder)
                  .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
                  .map(page => (
                    <Card key={page.id} className={`cursor-pointer hover:shadow transition-shadow ${page.pinned ? 'border-blue-300' : ''}`} onClick={() => { setEditingPage(page); setNotebookForm(page); setNotebookDialogOpen(true); }}>
                      <div className="h-1 rounded-t-lg" style={{ backgroundColor: page.color }} />
                      <CardHeader className="pb-1 pt-2.5">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm flex items-center gap-1.5">
                            {page.pinned && <Pin className="w-3 h-3 text-blue-500" />}
                            {page.favorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                            {page.title}
                          </CardTitle>
                          <div className="flex gap-0.5">
                            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); setNotebookPages(notebookPages.map(p => p.id === page.id ? {...p, pinned: !p.pinned} : p)); }}>
                              <Pin className={`w-3 h-3 ${page.pinned ? 'text-blue-500' : 'text-slate-300'}`} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); setDeleteItem({ type: 'notebook', id: page.id, name: page.title }); setDeleteDialogOpen(true); }}>
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-[10px]"><Folder className="w-2.5 h-2.5 mr-0.5" />{page.folder}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-slate-600 line-clamp-3 whitespace-pre-line">{page.content}</p>
                        {page.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">{page.tags.slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-2">{page.updatedAt}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* ===== VISITORS ===== */}
          {activeTab === 'visitors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-green-500" />Visitor Management</h2><p className="text-xs text-slate-500">Check-in/out visitors and generate badges</p></div>
                <Dialog open={visitorDialogOpen} onOpenChange={setVisitorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => { setEditingVisitor(null); setVisitorForm({ status: 'expected', visitorType: 'visitor' }); }}>
                      <Plus className="w-3 h-3 mr-1" />Register Visitor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingVisitor ? 'Edit' : 'Register'} Visitor</DialogTitle></DialogHeader>
                    <div className="grid gap-3 py-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Full Name *</Label><Input value={visitorForm.name || ''} onChange={(e) => setVisitorForm({...visitorForm, name: e.target.value})} placeholder="Visitor name" /></div>
                        <div className="space-y-1"><Label>Company *</Label><Input value={visitorForm.company || ''} onChange={(e) => setVisitorForm({...visitorForm, company: e.target.value})} placeholder="Company name" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Email</Label><Input type="email" value={visitorForm.email || ''} onChange={(e) => setVisitorForm({...visitorForm, email: e.target.value})} placeholder="email@example.com" /></div>
                        <div className="space-y-1"><Label>Phone *</Label><Input value={visitorForm.phone || ''} onChange={(e) => setVisitorForm({...visitorForm, phone: e.target.value})} placeholder="+974 XXXX XXXX" /></div>
                      </div>
                      <div className="space-y-1"><Label>Purpose of Visit *</Label><Input value={visitorForm.purpose || ''} onChange={(e) => setVisitorForm({...visitorForm, purpose: e.target.value})} placeholder="Reason for visit" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Host Name *</Label><Select value={visitorForm.hostName} onValueChange={(v) => setVisitorForm({...visitorForm, hostName: v})}>
                          <SelectTrigger><SelectValue placeholder="Select host" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Simon Peter">Simon Peter</SelectItem>
                            <SelectItem value="MD Irfan">MD Irfan</SelectItem>
                            <SelectItem value="Hamza">Hamza</SelectItem>
                            <SelectItem value="Abraham">Abraham</SelectItem>
                            <SelectItem value="Arman">Arman</SelectItem>
                          </SelectContent>
                        </Select></div>
                        <div className="space-y-1"><Label>Department</Label><Select value={visitorForm.hostDepartment} onValueChange={(v) => setVisitorForm({...visitorForm, hostDepartment: v})}>
                          <SelectTrigger><SelectValue placeholder="Select dept" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Management">Management</SelectItem>
                          </SelectContent>
                        </Select></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Visitor Type</Label><Select value={visitorForm.visitorType} onValueChange={(v) => setVisitorForm({...visitorForm, visitorType: v as Visitor['visitorType']})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitor">Visitor</SelectItem>
                            <SelectItem value="contractor">Contractor</SelectItem>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="delivery">Delivery</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select></div>
                        <div className="space-y-1"><Label>Status</Label><Select value={visitorForm.status} onValueChange={(v) => setVisitorForm({...visitorForm, status: v as Visitor['status']})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="expected">Expected</SelectItem>
                            <SelectItem value="checked-in">Checked In</SelectItem>
                            <SelectItem value="checked-out">Checked Out</SelectItem>
                          </SelectContent>
                        </Select></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>ID Type</Label><Select value={visitorForm.idType} onValueChange={(v) => setVisitorForm({...visitorForm, idType: v})}>
                          <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Qatar ID">Qatar ID</SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="Staff ID">Staff ID</SelectItem>
                            <SelectItem value="Driving License">Driving License</SelectItem>
                          </SelectContent>
                        </Select></div>
                        <div className="space-y-1"><Label>ID Number</Label><Input value={visitorForm.idNumber || ''} onChange={(e) => setVisitorForm({...visitorForm, idNumber: e.target.value})} placeholder="ID number" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Vehicle Number</Label><Input value={visitorForm.vehicleNumber || ''} onChange={(e) => setVisitorForm({...visitorForm, vehicleNumber: e.target.value})} placeholder="Q-XXXX" /></div>
                        <div className="space-y-1"><Label>Badge Number</Label><Input value={visitorForm.badgeNumber || ''} onChange={(e) => setVisitorForm({...visitorForm, badgeNumber: e.target.value})} placeholder="Auto-generated" /></div>
                      </div>
                      <div className="space-y-1"><Label>Notes</Label><Textarea value={visitorForm.notes || ''} onChange={(e) => setVisitorForm({...visitorForm, notes: e.target.value})} rows={2} placeholder="Additional notes..." /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" size="sm" onClick={() => setVisitorDialogOpen(false)}>Cancel</Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => {
                        if (!visitorForm.name || !visitorForm.company || !visitorForm.purpose || !visitorForm.hostName) {
                          toast.error('Please fill required fields')
                          return
                        }
                        const badgeNum = visitorForm.badgeNumber || `V-${new Date().getFullYear()}-${String(visitors.length + 1).padStart(3, '0')}`
                        
                        if (editingVisitor) {
                          setVisitors(visitors.map(v => v.id === editingVisitor.id ? {...v, ...visitorForm, badgeNumber: badgeNum} : v))
                          toast.success('Visitor updated')
                        } else {
                          const newVisitor: Visitor = {
                            id: Date.now().toString(),
                            name: visitorForm.name || '',
                            company: visitorForm.company || '',
                            email: visitorForm.email || '',
                            phone: visitorForm.phone || '',
                            purpose: visitorForm.purpose || '',
                            hostName: visitorForm.hostName || '',
                            hostDepartment: visitorForm.hostDepartment || '',
                            checkInTime: visitorForm.status === 'checked-in' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : '',
                            checkOutTime: '',
                            status: visitorForm.status || 'expected',
                            visitorType: visitorForm.visitorType || 'visitor',
                            idType: visitorForm.idType || '',
                            idNumber: visitorForm.idNumber || '',
                            photoUrl: '',
                            badgeNumber: badgeNum,
                            vehicleNumber: visitorForm.vehicleNumber || '',
                            notes: visitorForm.notes || '',
                            createdAt: new Date().toISOString().slice(0, 10)
                          }
                          setVisitors([...visitors, newVisitor])
                          addLog('Registered Visitor', 'Visitors', `Registered ${visitorForm.name}`)
                          toast.success('Visitor registered')
                        }
                        setVisitorDialogOpen(false)
                        setVisitorForm({})
                      }}>Save Visitor</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Visitor Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <Card className="p-2.5 text-center border-l-4 border-l-green-500"><p className="text-lg font-bold text-green-600">{stats.checkedInVisitors}</p><p className="text-[10px] text-slate-500">Checked In</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-blue-500"><p className="text-lg font-bold text-blue-600">{stats.expectedVisitors}</p><p className="text-[10px] text-slate-500">Expected</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-purple-500"><p className="text-lg font-bold text-purple-600">{stats.todayVisitors}</p><p className="text-[10px] text-slate-500">Today</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-amber-500"><p className="text-lg font-bold text-amber-600">{stats.weekVisitors}</p><p className="text-[10px] text-slate-500">This Week</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-slate-500"><p className="text-lg font-bold text-slate-600">{stats.monthVisitors}</p><p className="text-[10px] text-slate-500">This Month</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-red-500"><p className="text-lg font-bold text-red-600">{visitors.filter(v => v.status === 'checked-in').length}</p><p className="text-[10px] text-slate-500">On Premises</p></Card>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                <Button variant={visitorFilter === 'all' ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setVisitorFilter('all')}>All</Button>
                <Button variant={visitorFilter === 'checked-in' ? 'default' : 'outline'} size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => setVisitorFilter('checked-in')}>Checked In</Button>
                <Button variant={visitorFilter === 'expected' ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setVisitorFilter('expected')}>Expected</Button>
                <Button variant={visitorFilter === 'checked-out' ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setVisitorFilter('checked-out')}>Checked Out</Button>
              </div>

              {/* Visitors List */}
              <div className="grid gap-2">
                {visitors
                  .filter(v => visitorFilter === 'all' || v.status === visitorFilter)
                  .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
                  .map(v => (
                    <Card key={v.id} className={`overflow-hidden ${v.status === 'checked-in' ? 'border-green-300 bg-green-50/30' : v.status === 'expected' ? 'border-blue-300 bg-blue-50/30' : ''}`}>
                      <div className={`h-1 ${v.status === 'checked-in' ? 'bg-green-500' : v.status === 'expected' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${v.visitorType === 'vendor' ? 'bg-purple-100 text-purple-700' : v.visitorType === 'contractor' ? 'bg-amber-100 text-amber-700' : v.visitorType === 'interview' ? 'bg-blue-100 text-blue-700' : v.visitorType === 'delivery' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'} text-[10px]`}>
                                {v.visitorType}
                              </Badge>
                              <Badge className={`${v.status === 'checked-in' ? 'bg-green-100 text-green-700' : v.status === 'expected' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'} text-[10px]`}>
                                {v.status === 'checked-in' ? '✓ On Premises' : v.status === 'expected' ? '⏳ Expected' : '✓ Left'}
                              </Badge>
                              {v.badgeNumber && <Badge variant="outline" className="text-[10px] font-mono">{v.badgeNumber}</Badge>}
                            </div>
                            <p className="font-medium text-sm">{v.name}</p>
                            <p className="text-[10px] text-slate-500">{v.company}</p>
                            <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                              <span><User className="w-2.5 h-2.5 inline mr-0.5" />Host: {v.hostName}</span>
                              <span><Clock className="w-2.5 h-2.5 inline mr-0.5" />{v.checkInTime || 'Not checked in'}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">Purpose: {v.purpose}</p>
                            {v.vehicleNumber && <p className="text-[10px] text-slate-400 mt-0.5">🚗 {v.vehicleNumber}</p>}
                          </div>
                          <div className="flex flex-col gap-1">
                            {v.status === 'expected' && (
                              <Button size="sm" variant="default" className="h-7 text-[10px] bg-green-600 hover:bg-green-700" onClick={() => {
                                setVisitors(visitors.map(vis => vis.id === v.id ? {...vis, status: 'checked-in', checkInTime: new Date().toISOString().slice(0, 16).replace('T', ' ')} : vis))
                                toast.success('Visitor checked in')
                                addLog('Checked In', 'Visitors', `Checked in ${v.name}`)
                              }}>
                                <CheckCircle className="w-2.5 h-2.5 mr-1" />Check In
                              </Button>
                            )}
                            {v.status === 'checked-in' && (
                              <Button size="sm" variant="default" className="h-7 text-[10px] bg-amber-600 hover:bg-amber-700" onClick={() => {
                                setVisitors(visitors.map(vis => vis.id === v.id ? {...vis, status: 'checked-out', checkOutTime: new Date().toISOString().slice(0, 16).replace('T', ' ')} : vis))
                                toast.success('Visitor checked out')
                                addLog('Checked Out', 'Visitors', `Checked out ${v.name}`)
                              }}>
                                <XCircle className="w-2.5 h-2.5 mr-1" />Check Out
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => { setEditingVisitor(v); setVisitorForm(v); setVisitorDialogOpen(true); }}>
                              <Edit className="w-2.5 h-2.5 mr-1" />Edit
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => { setSelectedVisitor(v); setBadgeDialogOpen(true); }}>
                              <FileText className="w-2.5 h-2.5 mr-1" />Badge
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-[10px] text-red-500" onClick={() => { setDeleteItem({ type: 'visitor', id: v.id, name: v.name }); setDeleteDialogOpen(true); }}>
                              <Trash2 className="w-2.5 h-2.5 mr-1" />Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* ===== ACCESS CONTROL (Admin Only) ===== */}
          {activeTab === 'accesscontrol' && isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500" />Access Control</h2><p className="text-xs text-slate-500">Manage user permissions and module access</p></div>
                <Badge className="bg-amber-100 text-amber-700 text-xs"><Lock className="w-3 h-3 mr-1" />Admin Only</Badge>
              </div>

              {/* Users Overview */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">User Accounts</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow className="bg-slate-50 text-xs"><TableHead>Username</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Access Level</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {Object.entries(VALID_USERS).map(([username, info]) => (
                        <TableRow key={username} className="hover:bg-blue-50/50 text-xs">
                          <TableCell className="font-mono">{username}</TableCell>
                          <TableCell className="font-medium">{info.name}</TableCell>
                          <TableCell>
                            <Badge className={info.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>{info.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {info.role === 'admin' ? (
                                <>
                                  <Badge className="bg-green-100 text-green-700 text-[10px]">All Modules</Badge>
                                  <Badge className="bg-amber-100 text-amber-700 text-[10px]">Critical Access</Badge>
                                </>
                              ) : (
                                <>
                                  <Badge className="bg-green-100 text-green-700 text-[10px]">General</Badge>
                                  <Badge className="bg-green-100 text-green-700 text-[10px]">Sensitive</Badge>
                                  <Badge className="bg-red-100 text-red-700 text-[10px]">No Critical</Badge>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell><Badge className="bg-green-100 text-green-700 text-[10px]"><CheckCircle className="w-2.5 h-2.5 mr-0.5" />Active</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Module Permissions */}
              <Card>
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-sm">Module Permissions Matrix</CardTitle>
                  <p className="text-xs text-slate-500">Defines which modules are accessible by each role</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {/* Category Headers */}
                    {['critical', 'sensitive', 'general'].map(category => (
                      <div key={category} className="space-y-2">
                        <div className={`text-xs font-medium uppercase tracking-wide flex items-center gap-1.5 px-2 py-1 rounded ${category === 'critical' ? 'bg-red-50 text-red-700' : category === 'sensitive' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                          {category === 'critical' && <Lock className="w-3 h-3" />}
                          {category === 'sensitive' && <Shield className="w-3 h-3" />}
                          {category === 'general' && <CheckCircle className="w-3 h-3" />}
                          {category} Modules
                        </div>
                        <div className="grid gap-1.5 pl-2">
                          {Object.entries(MODULE_PERMISSIONS)
                            .filter(([_, perm]) => perm.category === category)
                            .map(([id, perm]) => (
                              <div key={id} className="flex items-center justify-between p-2 rounded border bg-white text-xs">
                                <div className="flex items-center gap-2">
                                  <perm.icon className="w-4 h-4 text-slate-600" />
                                  <div>
                                    <p className="font-medium">{perm.label}</p>
                                    <p className="text-[10px] text-slate-500">{perm.description}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1.5">
                                  {perm.adminOnly ? (
                                    <>
                                      <Badge className="bg-purple-100 text-purple-700 text-[10px]"><CheckCircle className="w-2.5 h-2.5 mr-0.5" />Admin</Badge>
                                      <Badge className="bg-red-100 text-red-700 text-[10px]"><XCircle className="w-2.5 h-2.5 mr-0.5" />User</Badge>
                                    </>
                                  ) : (
                                    <>
                                      <Badge className="bg-green-100 text-green-700 text-[10px]"><CheckCircle className="w-2.5 h-2.5 mr-0.5" />Admin</Badge>
                                      <Badge className="bg-green-100 text-green-700 text-[10px]"><CheckCircle className="w-2.5 h-2.5 mr-0.5" />User</Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-sm text-amber-700">Security Notice</AlertTitle>
                <AlertDescription className="text-xs text-amber-600">
                  Critical modules (Passwords, Logs, Access Control) are restricted to administrators only. 
                  Regular users cannot access sensitive credential data or system audit trails. 
                  All access attempts are logged for security compliance.
                </AlertDescription>
              </Alert>

              {/* Login Credentials Reference */}
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50 py-2"><CardTitle className="text-sm flex items-center gap-1.5 text-blue-700"><Key className="w-3.5 h-3.5" />Login Credentials Reference</CardTitle></CardHeader>
                <CardContent className="pt-3">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    {Object.entries(VALID_USERS).map(([username, info]) => (
                      <div key={username} className="p-2 rounded border bg-slate-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{info.name}</span>
                          <Badge className={info.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>{info.role}</Badge>
                        </div>
                        <p className="text-slate-500">Username: <code className="bg-slate-200 px-1 rounded">{username}</code></p>
                        <p className="text-slate-500">Password: <code className="bg-slate-200 px-1 rounded">{info.password}</code></p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== REPORTS ===== */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-500" />Reports & Analytics</h2><p className="text-xs text-slate-500">Generate reports and analyze IT metrics</p></div>
                <div className="flex gap-2">
                  <Input type="date" value={reportDateRange.start} onChange={(e) => setReportDateRange({...reportDateRange, start: e.target.value})} className="h-7 w-32 text-xs" placeholder="From" />
                  <Input type="date" value={reportDateRange.end} onChange={(e) => setReportDateRange({...reportDateRange, end: e.target.value})} className="h-7 w-32 text-xs" placeholder="To" />
                </div>
              </div>

              {/* Report Templates */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'assets', title: 'Asset Report', icon: Monitor, color: 'blue', count: assets.length },
                  { id: 'tickets', title: 'Ticket Analytics', icon: Ticket, color: 'amber', count: tickets.length },
                  { id: 'licenses', title: 'License Utilization', icon: Clipboard, color: 'purple', count: licenses.length },
                  { id: 'sla', title: 'SLA Performance', icon: Target, color: 'green', count: tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed' && new Date(t.slaDeadline) < new Date()).length },
                ].map(report => (
                  <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    const csvContent = report.id === 'assets' 
                      ? 'Name,Type,Model,Location,IP,Status,Warranty\n' + assets.map(a => `${a.name},${a.type},${a.model},${a.location},${a.ipAddress},${a.status},${a.warrantyEnd}`).join('\n')
                      : report.id === 'tickets'
                      ? 'ID,Title,Priority,Status,Category,Requester,Created\n' + tickets.map(t => `${t.id},"${t.title}",${t.priority},${t.status},${t.category},${t.requester},${t.createdAt}`).join('\n')
                      : report.id === 'licenses'
                      ? 'Software,Vendor,Seats,Used,Expiry\n' + licenses.map(l => `${l.software},${l.vendor},${l.seats},${l.usedSeats},${l.expiryDate}`).join('\n')
                      : 'Ticket,Priority,SLA Deadline,Status,Breach\n' + tickets.map(t => `${t.id},${t.priority},${t.slaDeadline},${t.status},${new Date(t.slaDeadline) < new Date() && t.status !== 'resolved' ? 'Yes' : 'No'}`).join('\n')
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${report.id}_report.csv`
                    a.click()
                    URL.revokeObjectURL(url)
                    toast.success('Report exported!')
                    addLog('Generated Report', 'Reports', `Generated ${report.title}`)
                  }}>
                    <CardContent className="pt-4 pb-3 text-center">
                      <report.icon className={`w-8 h-8 mx-auto mb-2 text-${report.color}-500`} />
                      <p className="font-medium text-sm">{report.title}</p>
                      <p className="text-2xl font-bold text-slate-700 mt-1">{report.count}</p>
                      <p className="text-[10px] text-slate-400">records</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Ticket Analytics</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div><p className="text-xl font-bold text-red-600">{tickets.filter(t => t.status === 'open').length}</p><p className="text-[10px] text-slate-500">Open</p></div>
                      <div><p className="text-xl font-bold text-blue-600">{tickets.filter(t => t.status === 'in-progress').length}</p><p className="text-[10px] text-slate-500">In Progress</p></div>
                      <div><p className="text-xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</p><p className="text-[10px] text-slate-500">Resolved</p></div>
                      <div><p className="text-xl font-bold text-amber-600">{stats.slaBreaches}</p><p className="text-[10px] text-slate-500">SLA Breach</p></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Portal Analytics</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div><p className="text-xl font-bold text-teal-600">{stats.todayVisits}</p><p className="text-[10px] text-slate-500">Today</p></div>
                      <div><p className="text-xl font-bold text-purple-600">{stats.weekVisits}</p><p className="text-[10px] text-slate-500">This Week</p></div>
                      <div><p className="text-xl font-bold text-blue-600">{stats.monthVisits}</p><p className="text-[10px] text-slate-500">This Month</p></div>
                      <div><p className="text-xl font-bold text-green-600">{portalVisits.length}</p><p className="text-[10px] text-slate-500">Total</p></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ===== ANNOUNCEMENTS ===== */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" />Announcements</h2><p className="text-xs text-slate-500">Company announcements and notifications</p></div>
                <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700" onClick={() => { setAnnouncementForm({}); setEditingAnnouncement(null); setAnnouncementDialogOpen(true) }}><Plus className="w-3 h-3 mr-1" />New</Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Card className="p-2.5 text-center border-l-4 border-l-amber-500"><p className="text-lg font-bold text-amber-600">{stats.unreadAnnouncements}</p><p className="text-[10px] text-slate-500">Unread</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-green-500"><p className="text-lg font-bold text-green-600">{stats.activeAnnouncements}</p><p className="text-[10px] text-slate-500">Active</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-purple-500"><p className="text-lg font-bold text-purple-600">{stats.pinnedAnnouncements}</p><p className="text-[10px] text-slate-500">Pinned</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-red-500"><p className="text-lg font-bold text-red-600">{stats.urgentAnnouncements}</p><p className="text-[10px] text-slate-500">Urgent</p></Card>
              </div>

              {/* Announcements List */}
              <div className="grid gap-2">
                {announcements
                  .filter(a => new Date(a.expiresAt) > new Date())
                  .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(a => (
                    <Card key={a.id} className={`overflow-hidden cursor-pointer hover:shadow-sm transition-shadow ${!a.read ? 'border-l-4 border-l-blue-500' : ''}`} onClick={() => markAnnouncementRead(a.id)}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${a.priority === 'urgent' ? 'bg-red-100' : a.priority === 'important' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                            {a.type === 'maintenance' ? <Settings className={`w-4 h-4 ${a.priority === 'urgent' ? 'text-red-600' : 'text-amber-600'}`} /> : 
                             a.type === 'security' ? <Shield className="w-4 h-4 text-red-600" /> : 
                             a.type === 'hr' ? <Users className="w-4 h-4 text-blue-600" /> : 
                             <Bell className={`w-4 h-4 ${a.priority === 'urgent' ? 'text-red-600' : 'text-slate-600'}`} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{a.title}</p>
                              {a.pinned && <Pin className="w-3 h-3 text-amber-500" />}
                              <Badge className={`${a.priority === 'urgent' ? 'bg-red-100 text-red-700' : a.priority === 'important' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'} text-[10px]`}>{a.priority}</Badge>
                              <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{a.content}</p>
                            <p className="text-[10px] text-slate-400 mt-1">By {a.author} • {a.createdAt} • Expires: {a.expiresAt}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); toggleAnnouncementPin(a.id) }}><Pin className={`w-3 h-3 ${a.pinned ? 'text-amber-500' : 'text-slate-400'}`} /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setEditingAnnouncement(a); setAnnouncementForm(a); setAnnouncementDialogOpen(true) }}><Edit className="w-3 h-3 text-slate-400" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setDeleteItem({ type: 'announcement', id: a.id, name: a.title }); setDeleteDialogOpen(true) }}><Trash2 className="w-3 h-3 text-slate-400" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* ===== VENDORS ===== */}
          {activeTab === 'vendors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><Building className="w-5 h-5 text-teal-500" />Vendor Management</h2><p className="text-xs text-slate-500">Manage vendors and contracts</p></div>
                <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700" onClick={() => { setVendorForm({}); setEditingVendor(null); setVendorDialogOpen(true) }}><Plus className="w-3 h-3 mr-1" />New Vendor</Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Card className="p-2.5 text-center border-l-4 border-l-teal-500"><p className="text-lg font-bold text-teal-600">{vendors.length}</p><p className="text-[10px] text-slate-500">Total Vendors</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-amber-500"><p className="text-lg font-bold text-amber-600">{stats.expiringContracts}</p><p className="text-[10px] text-slate-500">Expiring Contracts</p></Card>
                <Card className="p-2.5 text-center border-l-4 border-l-green-500"><p className="text-lg font-bold text-green-600">{stats.avgVendorRating} ★</p><p className="text-[10px] text-slate-500">Avg Rating</p></Card>
              </div>

              {/* Vendors List */}
              <div className="grid gap-2">
                {vendors.map(v => {
                  const daysToExpiry = Math.ceil((new Date(v.contractEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  return (
                    <Card key={v.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-teal-50 rounded-lg">
                            <Building className="w-5 h-5 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{v.name}</p>
                              <Badge variant="outline" className="text-[10px]">{v.category}</Badge>
                              {daysToExpiry <= 60 && daysToExpiry > 0 && <Badge className="bg-amber-100 text-amber-700 text-[10px]">Expires in {daysToExpiry} days</Badge>}
                              {daysToExpiry <= 0 && <Badge className="bg-red-100 text-red-700 text-[10px]">Expired</Badge>}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500">
                              <span><User className="w-2.5 h-2.5 inline mr-1" />{v.contactPerson}</span>
                              <span><Mail className="w-2.5 h-2.5 inline mr-1" />{v.email}</span>
                              <span><Phone className="w-2.5 h-2.5 inline mr-1" />{v.phone}</span>
                              <span><Calendar className="w-2.5 h-2.5 inline mr-1" />{v.contractEnd}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-400">Rating:</span>
                              <span className="text-amber-500 text-xs">{'★'.repeat(v.rating)}{'☆'.repeat(5 - v.rating)}</span>
                              <span className="text-[10px] text-slate-500">| {v.contractValue}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingVendor(v); setVendorForm(v); setVendorDialogOpen(true) }}><Edit className="w-3 h-3 text-slate-400" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDeleteItem({ type: 'vendor', id: v.id, name: v.name })}><Trash2 className="w-3 h-3 text-slate-400" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* ===== BUDGET ===== */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><PieChart className="w-5 h-5 text-green-500" />IT Budget Tracker</h2><p className="text-xs text-slate-500">Track IT expenses and budget allocations</p></div>
                <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700" onClick={() => { setBudgetForm({ type: 'expense' }); setEditingBudgetItem(null); setBudgetDialogOpen(true) }}><Plus className="w-3 h-3 mr-1" />New Entry</Button>
              </div>

              {/* Budget Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <Card className="p-2.5 border-l-4 border-l-green-500">
                  <p className="text-[10px] text-slate-500">Total Budget</p>
                  <p className="text-lg font-bold text-green-600">QAR {stats.totalBudget.toLocaleString()}</p>
                </Card>
                <Card className="p-2.5 border-l-4 border-l-red-500">
                  <p className="text-[10px] text-slate-500">Total Spent</p>
                  <p className="text-lg font-bold text-red-600">QAR {stats.totalExpenses.toLocaleString()}</p>
                </Card>
                <Card className="p-2.5 border-l-4 border-l-amber-500">
                  <p className="text-[10px] text-slate-500">Pending</p>
                  <p className="text-lg font-bold text-amber-600">QAR {stats.pendingExpenses.toLocaleString()}</p>
                </Card>
                <Card className={`p-2.5 border-l-4 ${stats.remainingBudget >= 0 ? 'border-l-blue-500' : 'border-l-red-500'}`}>
                  <p className="text-[10px] text-slate-500">Remaining</p>
                  <p className={`text-lg font-bold ${stats.remainingBudget >= 0 ? 'text-blue-600' : 'text-red-600'}`}>QAR {stats.remainingBudget.toLocaleString()}</p>
                </Card>
              </div>

              {/* Budget by Category */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Budget by Category</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {['hardware', 'software', 'services', 'training', 'other'].map(cat => {
                    const allocated = budgetItems.filter(b => b.type === 'budget' && b.category === cat).reduce((sum, b) => sum + b.amount, 0)
                    const spent = budgetItems.filter(b => b.type === 'expense' && b.category === cat && b.status === 'approved').reduce((sum, b) => sum + b.amount, 0)
                    const percentage = allocated > 0 ? (spent / allocated) * 100 : 0
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize font-medium">{cat}</span>
                          <span className="text-slate-500">QAR {spent.toLocaleString()} / QAR {allocated.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm">Recent Transactions</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-[10px]">
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {budgetItems.slice(0, 10).map(item => (
                        <TableRow key={item.id} className="text-xs">
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="max-w-32 truncate">{item.description}</TableCell>
                          <TableCell className="capitalize">{item.category}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{item.type}</Badge></TableCell>
                          <TableCell className={`text-right font-medium ${item.type === 'budget' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.type === 'budget' ? '+' : '-'}QAR {item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'} text-[10px]`}>{item.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { setEditingBudgetItem(item); setBudgetForm(item); setBudgetDialogOpen(true) }}><Edit className="w-2.5 h-2.5" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== SETTINGS (Admin Only) ===== */}
          {activeTab === 'settings' && isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold flex items-center gap-2"><Settings className="w-5 h-5 text-blue-500" />Site Settings</h2><p className="text-xs text-slate-500">Configure all portal parameters and customize dashboard items</p></div>
                <Badge className="bg-amber-100 text-amber-700 text-xs"><Lock className="w-3 h-3 mr-1" />Admin Only</Badge>
              </div>

              {/* Company Information */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-blue-500" />Company Information</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Company Name</Label>
                    <Input value={settings.companyName} onChange={(e) => setSettings({...settings, companyName: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Location</Label>
                    <Input value={settings.companyLocation} onChange={(e) => setSettings({...settings, companyLocation: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Portal Name</Label>
                    <Input value={settings.portalName} onChange={(e) => setSettings({...settings, portalName: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Version</Label>
                    <Input value={settings.version} disabled className="h-8 text-sm bg-slate-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Map Coordinates */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500" />Map Coordinates</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Latitude</Label>
                    <Input type="number" step="0.0001" value={settings.mapLatitude} onChange={(e) => setSettings({...settings, mapLatitude: parseFloat(e.target.value) || 25.2854})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Longitude</Label>
                    <Input type="number" step="0.0001" value={settings.mapLongitude} onChange={(e) => setSettings({...settings, mapLongitude: parseFloat(e.target.value) || 51.5310})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Zoom Level</Label>
                    <Input type="number" min="1" max="20" value={settings.mapZoom} onChange={(e) => setSettings({...settings, mapZoom: parseInt(e.target.value) || 12})} className="h-8 text-sm" />
                  </div>
                </CardContent>
              </Card>

              {/* Network Zones */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-blue-500" />Network Zones</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Factory Network</Label>
                    <Input value={settings.factoryNetwork} onChange={(e) => setSettings({...settings, factoryNetwork: e.target.value})} className="h-8 text-sm font-mono" placeholder="192.168.2.0/24" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Management Network</Label>
                    <Input value={settings.managementNetwork} onChange={(e) => setSettings({...settings, managementNetwork: e.target.value})} className="h-8 text-sm font-mono" placeholder="192.168.100.0/24" />
                  </div>
                </CardContent>
              </Card>

              {/* SLA Configuration */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-amber-500" />SLA Configuration (Hours)</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Low Priority</Label>
                    <Input type="number" value={settings.defaultSlaHours.low} onChange={(e) => setSettings({...settings, defaultSlaHours: {...settings.defaultSlaHours, low: parseInt(e.target.value) || 48}})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Medium Priority</Label>
                    <Input type="number" value={settings.defaultSlaHours.medium} onChange={(e) => setSettings({...settings, defaultSlaHours: {...settings.defaultSlaHours, medium: parseInt(e.target.value) || 24}})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">High Priority</Label>
                    <Input type="number" value={settings.defaultSlaHours.high} onChange={(e) => setSettings({...settings, defaultSlaHours: {...settings.defaultSlaHours, high: parseInt(e.target.value) || 8}})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Critical Priority</Label>
                    <Input type="number" value={settings.defaultSlaHours.critical} onChange={(e) => setSettings({...settings, defaultSlaHours: {...settings.defaultSlaHours, critical: parseInt(e.target.value) || 4}})} className="h-8 text-sm" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Management */}
              <Card>
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" />Quick Actions (Dashboard)</CardTitle>
                    <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => {
                      const newAction: QuickActionItem = {
                        id: `qa${Date.now()}`,
                        label: 'New Action',
                        icon: 'Star',
                        targetTab: 'dashboard',
                        enabled: true
                      }
                      setSettings({...settings, quickActions: [...settings.quickActions, newAction]})
                      toast.success('Quick action added')
                    }}><Plus className="w-2.5 h-2.5 mr-0.5" />Add</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {settings.quickActions.map((action, idx) => (
                      <div key={action.id} className="flex items-center gap-2 p-2 rounded border bg-slate-50 text-xs">
                        <Badge variant="outline" className="text-[10px]">{idx + 1}</Badge>
                        <Input value={action.label} onChange={(e) => {
                          const updated = [...settings.quickActions]
                          updated[idx] = {...action, label: e.target.value}
                          setSettings({...settings, quickActions: updated})
                        }} className="h-7 w-32 text-xs" />
                        <Select value={action.targetTab} onValueChange={(v) => {
                          const updated = [...settings.quickActions]
                          updated[idx] = {...action, targetTab: v}
                          setSettings({...settings, quickActions: updated})
                        }}>
                          <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tickets">Tickets</SelectItem>
                            <SelectItem value="checklist">Daily Tasks</SelectItem>
                            <SelectItem value="calendar">Calendar</SelectItem>
                            <SelectItem value="knowledge">Knowledge</SelectItem>
                            <SelectItem value="assets">Assets</SelectItem>
                            <SelectItem value="network">Network</SelectItem>
                            <SelectItem value="monitoring">Monitoring</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <Checkbox checked={action.enabled} onCheckedChange={(checked) => {
                            const updated = [...settings.quickActions]
                            updated[idx] = {...action, enabled: !!checked}
                            setSettings({...settings, quickActions: updated})
                          }} />
                          <Label className="text-[10px]">Show</Label>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                          setSettings({...settings, quickActions: settings.quickActions.filter(a => a.id !== action.id)})
                          toast.success('Action removed')
                        }}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                      </div>
                    ))}
                    {settings.quickActions.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">No quick actions configured. Click "Add" to create one.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* System Status Management */}
              <Card>
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-green-500" />System Status Items (Dashboard)</CardTitle>
                    <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => {
                      const newItem: SystemStatusItem = {
                        id: `ss${Date.now()}`,
                        name: 'New System',
                        icon: 'Server',
                        status: 'ok',
                        targetTab: 'monitoring',
                        enabled: true
                      }
                      setSettings({...settings, systemStatus: [...settings.systemStatus, newItem]})
                      toast.success('System status item added')
                    }}><Plus className="w-2.5 h-2.5 mr-0.5" />Add</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {settings.systemStatus.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 rounded border bg-slate-50 text-xs">
                        <Badge variant="outline" className="text-[10px]">{idx + 1}</Badge>
                        <Input value={item.name} onChange={(e) => {
                          const updated = [...settings.systemStatus]
                          updated[idx] = {...item, name: e.target.value}
                          setSettings({...settings, systemStatus: updated})
                        }} className="h-7 w-28 text-xs" />
                        <Select value={item.status} onValueChange={(v) => {
                          const updated = [...settings.systemStatus]
                          updated[idx] = {...item, status: v as SystemStatusItem['status']}
                          setSettings({...settings, systemStatus: updated})
                        }}>
                          <SelectTrigger className="w-20 h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ok">OK</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={item.targetTab} onValueChange={(v) => {
                          const updated = [...settings.systemStatus]
                          updated[idx] = {...item, targetTab: v}
                          setSettings({...settings, systemStatus: updated})
                        }}>
                          <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monitoring">Monitoring</SelectItem>
                            <SelectItem value="network">Network</SelectItem>
                            <SelectItem value="backups">Backups</SelectItem>
                            <SelectItem value="tickets">Tickets</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <Checkbox checked={item.enabled} onCheckedChange={(checked) => {
                            const updated = [...settings.systemStatus]
                            updated[idx] = {...item, enabled: !!checked}
                            setSettings({...settings, systemStatus: updated})
                          }} />
                          <Label className="text-[10px]">Show</Label>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                          setSettings({...settings, systemStatus: settings.systemStatus.filter(s => s.id !== item.id)})
                          toast.success('Item removed')
                        }}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                      </div>
                    ))}
                    {settings.systemStatus.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">No system status items configured. Click "Add" to create one.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* System Configuration */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-green-500" />System Configuration</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Maintenance Window</Label>
                    <Input value={settings.maintenanceWindow} onChange={(e) => setSettings({...settings, maintenanceWindow: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Backup Retention (Days)</Label>
                    <Input type="number" value={settings.backupRetentionDays} onChange={(e) => setSettings({...settings, backupRetentionDays: parseInt(e.target.value) || 30})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Login Attempts</Label>
                    <Input type="number" value={settings.maxLoginAttempts} onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value) || 3})} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Session Timeout (Minutes)</Label>
                    <Input type="number" value={settings.sessionTimeoutMinutes} onChange={(e) => setSettings({...settings, sessionTimeoutMinutes: parseInt(e.target.value) || 60})} className="h-8 text-sm" />
                  </div>
                </CardContent>
              </Card>

              {/* Alert Settings */}
              <Card>
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-purple-500" />Alert Settings</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Alert Email Recipients</Label>
                    <Input value={settings.alertEmails.join(', ')} onChange={(e) => setSettings({...settings, alertEmails: e.target.value.split(',').map(e => e.trim())})} className="h-8 text-sm" placeholder="email1@example.com, email2@example.com" />
                    <p className="text-[10px] text-slate-400">Separate multiple emails with commas</p>
                  </div>
                </CardContent>
              </Card>

              {/* Reset/Save Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSettings(DEFAULT_SETTINGS); toast.success('Settings reset to defaults'); }}>
                  <RefreshCcw className="w-3 h-3 mr-1" />Reset to Defaults
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => { addLog('Updated Settings', 'System', 'Modified site settings'); toast.success('Settings saved successfully!'); }}>
                  <Save className="w-3 h-3 mr-1" />Save Settings
                </Button>
              </div>

              {/* System Info */}
              <Card className="border-slate-200 bg-slate-50">
                <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm text-slate-600">System Information</CardTitle></CardHeader>
                <CardContent className="text-xs text-slate-500 grid sm:grid-cols-2 gap-2">
                  <div><span className="font-medium">Storage:</span> Browser LocalStorage</div>
                  <div><span className="font-medium">Data Persistence:</span> Session-based</div>
                  <div><span className="font-medium">Portal Version:</span> v{settings.version}</div>
                  <div><span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t px-4 py-2 text-center text-[10px] text-slate-500">
          Al Rayes Laundry IT Portal v4.0 • {user.name} ({user.role})
        </footer>
      </main>

      {/* Alerts Dialog */}
      <Dialog open={alertsDialogOpen} onOpenChange={setAlertsDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Notifications</DialogTitle></DialogHeader>
          <ScrollArea className="h-64">
            <div className="space-y-1.5">
              {alerts.map(a => (
                <div key={a.id} className={`p-2.5 rounded border text-xs cursor-pointer ${!a.read ? 'bg-blue-50' : ''}`} onClick={() => markAlertRead(a.id)}>
                  <div className="flex items-start gap-1.5">
                    {a.type === 'error' && <AlertCircle className="w-3 h-3 text-red-500 mt-0.5" />}
                    {a.type === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5" />}
                    {a.type === 'info' && <Activity className="w-3 h-3 text-blue-500 mt-0.5" />}
                    {a.type === 'success' && <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />}
                    <div className="flex-1"><p className="font-medium">{a.title}</p><p className="text-[10px] text-slate-500">{a.message}</p><p className="text-[10px] text-slate-400 mt-0.5">{a.timestamp}</p></div>
                    {!a.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter><Button variant="outline" size="sm" onClick={clearAllAlerts}>Mark All Read</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Confirm Delete</DialogTitle><DialogDescription>Delete "{deleteItem?.name}"? This cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" size="sm" onClick={confirmDelete}>Delete</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* Visitor Badge Dialog */}
      <Dialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Visitor Badge</DialogTitle></DialogHeader>
          {selectedVisitor && (
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-700">{selectedVisitor.name}</h3>
                <p className="text-sm text-slate-600">{selectedVisitor.company}</p>
                <div className="mt-3 py-2 px-4 bg-blue-100 rounded inline-block">
                  <p className="text-xs font-mono font-bold text-blue-700">{selectedVisitor.badgeNumber}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="font-medium">{selectedVisitor.purpose}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Host:</span>
                  <span className="font-medium">{selectedVisitor.hostName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Type:</span>
                  <span className="font-medium capitalize">{selectedVisitor.visitorType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Check In:</span>
                  <span className="font-medium">{selectedVisitor.checkInTime || 'Pending'}</span>
                </div>
                {selectedVisitor.vehicleNumber && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Vehicle:</span>
                    <span className="font-medium">{selectedVisitor.vehicleNumber}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <p className="text-[10px] text-slate-400">Al Rayes Laundry • IT Department</p>
                <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setBadgeDialogOpen(false)}>Close</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (selectedVisitor) {
                const badgeContent = `
VISITOR BADGE
==============
Name: ${selectedVisitor.name}
Company: ${selectedVisitor.company}
Badge: ${selectedVisitor.badgeNumber}
Purpose: ${selectedVisitor.purpose}
Host: ${selectedVisitor.hostName}
Check In: ${selectedVisitor.checkInTime}
                `.trim()
                navigator.clipboard.writeText(badgeContent)
                toast.success('Badge info copied!')
              }
            }}>
              <Copy className="w-3 h-3 mr-1" />Copy Info
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => {
              // Print badge
              const printWindow = window.open('', '_blank')
              if (printWindow && selectedVisitor) {
                printWindow.document.write(`
                  <html>
                  <head><title>Visitor Badge</title>
                  <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .badge { border: 2px solid #2563eb; padding: 20px; max-width: 400px; margin: auto; text-align: center; }
                    .badge h2 { color: #2563eb; margin-bottom: 5px; }
                    .badge-number { background: #dbeafe; padding: 10px; display: inline-block; font-family: monospace; font-weight: bold; color: #1d4ed8; margin: 10px 0; }
                    .info { text-align: left; font-size: 12px; margin-top: 15px; }
                    .info div { padding: 5px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
                    .footer { margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; }
                  </style>
                  </head>
                  <body>
                  <div class="badge">
                    <h2>${selectedVisitor.name}</h2>
                    <p>${selectedVisitor.company}</p>
                    <div class="badge-number">${selectedVisitor.badgeNumber}</div>
                    <div class="info">
                      <div><span>Purpose:</span><span>${selectedVisitor.purpose}</span></div>
                      <div><span>Host:</span><span>${selectedVisitor.hostName}</span></div>
                      <div><span>Type:</span><span>${selectedVisitor.visitorType}</span></div>
                      <div><span>Check In:</span><span>${selectedVisitor.checkInTime || 'Pending'}</span></div>
                    </div>
                    <div class="footer">
                      Al Rayes Laundry • IT Department<br>
                      ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <script>window.print(); window.close();</script>
                  </body>
                  </html>
                `)
                printWindow.document.close()
              }
            }}>
              <Printer className="w-3 h-3 mr-1" />Print Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingTicket ? 'Edit' : 'New'} Ticket</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-3 text-sm">
            <div className="space-y-1"><Label>Title *</Label><Input value={ticketForm.title || ''} onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})} placeholder="Enter ticket title" /></div>
            <div className="space-y-1"><Label>Description</Label><Textarea value={ticketForm.description || ''} onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})} rows={2} placeholder="Describe the issue" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Priority</Label><Select value={ticketForm.priority} onValueChange={(v) => setTicketForm({...ticketForm, priority: v as ITTicket['priority']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label>Category</Label><Select value={ticketForm.category} onValueChange={(v) => setTicketForm({...ticketForm, category: v})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Hardware">Hardware</SelectItem><SelectItem value="Software">Software</SelectItem><SelectItem value="Network">Network</SelectItem><SelectItem value="Access">Access</SelectItem><SelectItem value="Onboarding">Onboarding</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Requester</Label><Input value={ticketForm.requester || ''} onChange={(e) => setTicketForm({...ticketForm, requester: e.target.value})} placeholder="Who reported this?" /></div>
              <div className="space-y-1"><Label>Assign To</Label><Select value={ticketForm.assignedTo} onValueChange={(v) => setTicketForm({...ticketForm, assignedTo: v})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="MD Irfan">MD Irfan</SelectItem><SelectItem value="Hamza">Hamza</SelectItem><SelectItem value="Abraham">Abraham</SelectItem><SelectItem value="Arman">Arman</SelectItem></SelectContent></Select></div>
            </div>
            {editingTicket && (
              <>
                <div className="space-y-1"><Label>Status</Label><Select value={ticketForm.status} onValueChange={(v) => setTicketForm({...ticketForm, status: v as ITTicket['status']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select></div>
                <div className="space-y-1"><Label>Resolution</Label><Textarea value={ticketForm.resolution || ''} onChange={(e) => setTicketForm({...ticketForm, resolution: e.target.value})} rows={2} placeholder="How was this resolved?" /></div>
              </>
            )}
          </div>
          <DialogFooter><Button variant="outline" size="sm" onClick={() => setTicketDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveTicket}>Save Ticket</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Command Palette Dialog */}
      <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
        <DialogContent className="max-w-lg p-0 gap-0">
          <div className="flex items-center border-b px-3">
            <Command className="w-4 h-4 text-slate-400 mr-2" />
            <Input 
              placeholder="Search assets, tickets, vendors... (type to search)" 
              value={commandSearch} 
              onChange={(e) => { setCommandSearch(e.target.value); setSelectedCommandIndex(0); }}
              className="border-0 focus-visible:ring-0 h-10"
              autoFocus
            />
            <kbd className="px-2 py-1 rounded bg-slate-100 text-[10px] text-slate-500">ESC</kbd>
          </div>
          <ScrollArea className="max-h-80">
            {commandSearch.trim() === '' ? (
              <div className="p-3">
                {recentSearches.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-2">Recent Searches</p>
                    {recentSearches.map((search, i) => (
                      <button 
                        key={i} 
                        className="w-full text-left px-2 py-1.5 text-xs hover:bg-slate-100 rounded"
                        onClick={() => setCommandSearch(search)}
                      >
                        <Clock3 className="w-3 h-3 inline mr-2 text-slate-400" />
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-500 mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={() => { setTicketForm({}); setEditingTicket(null); setTicketDialogOpen(true); setCommandPaletteOpen(false); }} className="flex items-center gap-2 px-2 py-2 text-xs hover:bg-slate-100 rounded text-left">
                    <Plus className="w-3.5 h-3.5 text-blue-500" />
                    New Ticket
                  </button>
                  <button onClick={() => { setActiveTab('dashboard'); setCommandPaletteOpen(false); }} className="flex items-center gap-2 px-2 py-2 text-xs hover:bg-slate-100 rounded text-left">
                    <Activity className="w-3.5 h-3.5 text-green-500" />
                    Dashboard
                  </button>
                  <button onClick={() => { setActiveTab('reports'); setCommandPaletteOpen(false); }} className="flex items-center gap-2 px-2 py-2 text-xs hover:bg-slate-100 rounded text-left">
                    <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                    Reports
                  </button>
                  <button onClick={() => { toggleTheme(); setCommandPaletteOpen(false); }} className="flex items-center gap-2 px-2 py-2 text-xs hover:bg-slate-100 rounded text-left">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    Toggle Theme
                  </button>
                  <button onClick={() => { exportData(); setCommandPaletteOpen(false); }} className="flex items-center gap-2 px-2 py-2 text-xs hover:bg-slate-100 rounded text-left">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    Export Data
                  </button>
                  <button onClick={() => { exportCalendarToICS(); setCommandPaletteOpen(false); }} className="flex items-center gap-2 px-2 py-2 text-xs hover:bg-slate-100 rounded text-left">
                    <CalendarDays className="w-3.5 h-3.5 text-teal-500" />
                    Export Calendar
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-1">
                {getCommandPaletteResults().length > 0 ? (
                  getCommandPaletteResults().map((result, i) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded ${i === selectedCommandIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                      onClick={() => { result.action(); saveSearch(commandSearch); }}
                    >
                      <Badge variant="outline" className="text-[10px]">{result.type}</Badge>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{result.title}</p>
                        <p className="text-slate-400 text-[10px]">{result.description}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No results found for "{commandSearch}"
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Session Timeout Warning Dialog */}
      <Dialog open={sessionTimeoutDialogOpen} onOpenChange={setSessionTimeoutDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              Session Timeout Warning
            </DialogTitle>
            <DialogDescription>
              Your session will expire in 5 minutes due to inactivity. Would you like to extend your session?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout Now</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={extendSession}>Extend Session</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingAnnouncement ? 'Edit' : 'New'} Announcement</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-3 text-sm">
            <div className="space-y-1"><Label>Title *</Label><Input value={announcementForm.title || ''} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} placeholder="Announcement title" /></div>
            <div className="space-y-1"><Label>Content *</Label><Textarea value={announcementForm.content || ''} onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})} rows={3} placeholder="Announcement details" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Type</Label><Select value={announcementForm.type} onValueChange={(v) => setAnnouncementForm({...announcementForm, type: v as Announcement['type']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem><SelectItem value="security">Security</SelectItem><SelectItem value="hr">HR</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label>Priority</Label><Select value={announcementForm.priority} onValueChange={(v) => setAnnouncementForm({...announcementForm, priority: v as Announcement['priority']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="important">Important</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1"><Label>Expiry Date</Label><Input type="date" value={announcementForm.expiresAt || ''} onChange={(e) => setAnnouncementForm({...announcementForm, expiresAt: e.target.value})} /></div>
            <div className="flex items-center gap-2"><Checkbox checked={announcementForm.pinned} onCheckedChange={(checked) => setAnnouncementForm({...announcementForm, pinned: !!checked})} /><Label className="text-xs">Pin this announcement</Label></div>
          </div>
          <DialogFooter><Button variant="outline" size="sm" onClick={() => setAnnouncementDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveAnnouncement}>Save Announcement</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vendor Dialog */}
      <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingVendor ? 'Edit' : 'New'} Vendor</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Vendor Name *</Label><Input value={vendorForm.name || ''} onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})} placeholder="Company name" /></div>
              <div className="space-y-1"><Label>Category</Label><Select value={vendorForm.category} onValueChange={(v) => setVendorForm({...vendorForm, category: v as Vendor['category']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hardware">Hardware</SelectItem><SelectItem value="software">Software</SelectItem><SelectItem value="services">Services</SelectItem><SelectItem value="telecom">Telecom</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Contact Person *</Label><Input value={vendorForm.contactPerson || ''} onChange={(e) => setVendorForm({...vendorForm, contactPerson: e.target.value})} placeholder="Contact name" /></div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={vendorForm.email || ''} onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})} placeholder="email@example.com" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Phone</Label><Input value={vendorForm.phone || ''} onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})} placeholder="+974 XXXX XXXX" /></div>
              <div className="space-y-1"><Label>Website</Label><Input value={vendorForm.website || ''} onChange={(e) => setVendorForm({...vendorForm, website: e.target.value})} placeholder="https://..." /></div>
            </div>
            <div className="space-y-1"><Label>Address</Label><Textarea value={vendorForm.address || ''} onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})} rows={2} placeholder="Full address" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Contract Start</Label><Input type="date" value={vendorForm.contractStart || ''} onChange={(e) => setVendorForm({...vendorForm, contractStart: e.target.value})} /></div>
              <div className="space-y-1"><Label>Contract End</Label><Input type="date" value={vendorForm.contractEnd || ''} onChange={(e) => setVendorForm({...vendorForm, contractEnd: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Contract Value</Label><Input value={vendorForm.contractValue || ''} onChange={(e) => setVendorForm({...vendorForm, contractValue: e.target.value})} placeholder="QAR XXX,XXX/year" /></div>
              <div className="space-y-1"><Label>Rating</Label><Select value={String(vendorForm.rating || 3)} onValueChange={(v) => setVendorForm({...vendorForm, rating: parseInt(v)})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-1"><Label>SLA Details</Label><Textarea value={vendorForm.slaDetails || ''} onChange={(e) => setVendorForm({...vendorForm, slaDetails: e.target.value})} rows={2} placeholder="Service level agreement details" /></div>
            <div className="space-y-1"><Label>Notes</Label><Textarea value={vendorForm.notes || ''} onChange={(e) => setVendorForm({...vendorForm, notes: e.target.value})} rows={2} placeholder="Additional notes" /></div>
          </div>
          <DialogFooter><Button variant="outline" size="sm" onClick={() => setVendorDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveVendor}>Save Vendor</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Budget Dialog */}
      <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingBudgetItem ? 'Edit' : 'New'} Budget Item</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Type</Label><Select value={budgetForm.type} onValueChange={(v) => setBudgetForm({...budgetForm, type: v as BudgetItem['type']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="budget">Budget Allocation</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label>Category</Label><Select value={budgetForm.category} onValueChange={(v) => setBudgetForm({...budgetForm, category: v as BudgetItem['category']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hardware">Hardware</SelectItem><SelectItem value="software">Software</SelectItem><SelectItem value="services">Services</SelectItem><SelectItem value="training">Training</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1"><Label>Description *</Label><Input value={budgetForm.description || ''} onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})} placeholder="Description" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Amount (QAR) *</Label><Input type="number" value={budgetForm.amount || ''} onChange={(e) => setBudgetForm({...budgetForm, amount: parseFloat(e.target.value) || 0})} placeholder="0.00" /></div>
              <div className="space-y-1"><Label>Date</Label><Input type="date" value={budgetForm.date || ''} onChange={(e) => setBudgetForm({...budgetForm, date: e.target.value})} /></div>
            </div>
            {budgetForm.type === 'expense' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Status</Label><Select value={budgetForm.status} onValueChange={(v) => setBudgetForm({...budgetForm, status: v as BudgetItem['status']})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div>
                <div className="space-y-1"><Label>Approved By</Label><Input value={budgetForm.approvedBy || ''} onChange={(e) => setBudgetForm({...budgetForm, approvedBy: e.target.value})} placeholder="Approver name" /></div>
              </div>
            )}
            <div className="space-y-1"><Label>Notes</Label><Textarea value={budgetForm.notes || ''} onChange={(e) => setBudgetForm({...budgetForm, notes: e.target.value})} rows={2} placeholder="Additional notes" /></div>
          </div>
          <DialogFooter><Button variant="outline" size="sm" onClick={() => setBudgetDialogOpen(false)}>Cancel</Button><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveBudgetItem}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
