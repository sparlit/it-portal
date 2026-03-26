// API utility functions for IT Management Portal

const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    fetchAPI<{ user: { username: string; name: string; role: string }; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () =>
    fetchAPI<{ message: string }>('/auth/logout', { method: 'POST' }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () =>
    fetchAPI<{
      stats: {
        assets: number;
        tickets: number;
        openTickets: number;
        visitors: number;
        activeVisitors: number;
        licenses: number;
        backups: number;
        announcements: number;
        meetings: number;
        checkCompletion: number;
      };
      assetStatus: { active: number; inactive: number; maintenance: number };
      ticketPriority: { critical: number; high: number; medium: number; low: number };
      assetTypes: { servers: number; computers: number; printers: number; network: number };
      recentTickets: any[];
      dailyChecks: any[];
    }>('/dashboard'),
};

// Assets API
export const assetsAPI = {
  getAll: () => fetchAPI<any[]>('/assets'),
  getById: (id: string) => fetchAPI<any>(`/assets?id=${id}`),
  create: (data: any) => fetchAPI<any>('/assets', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/assets', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/assets?id=${id}`, { method: 'DELETE' }),
};

// Tickets API
export const ticketsAPI = {
  getAll: () => fetchAPI<any[]>('/tickets'),
  getById: (id: string) => fetchAPI<any>(`/tickets?id=${id}`),
  create: (data: any) => fetchAPI<any>('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/tickets', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/tickets?id=${id}`, { method: 'DELETE' }),
};

// Visitors API
export const visitorsAPI = {
  getAll: () => fetchAPI<any[]>('/visitors'),
  getById: (id: string) => fetchAPI<any>(`/visitors?id=${id}`),
  create: (data: any) => fetchAPI<any>('/visitors', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/visitors', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/visitors?id=${id}`, { method: 'DELETE' }),
};

// Meetings API
export const meetingsAPI = {
  getAll: () => fetchAPI<any[]>('/meetings'),
  getById: (id: string) => fetchAPI<any>(`/meetings?id=${id}`),
  create: (data: any) => fetchAPI<any>('/meetings', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/meetings', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/meetings?id=${id}`, { method: 'DELETE' }),
};

// Backups API
export const backupsAPI = {
  getAll: () => fetchAPI<any[]>('/backups'),
  getById: (id: string) => fetchAPI<any>(`/backups?id=${id}`),
  create: (data: any) => fetchAPI<any>('/backups', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/backups', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/backups?id=${id}`, { method: 'DELETE' }),
};

// Licenses API
export const licensesAPI = {
  getAll: () => fetchAPI<any[]>('/licenses'),
  getById: (id: string) => fetchAPI<any>(`/licenses?id=${id}`),
  create: (data: any) => fetchAPI<any>('/licenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/licenses', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/licenses?id=${id}`, { method: 'DELETE' }),
};

// Credentials API
export const credentialsAPI = {
  getAll: () => fetchAPI<any[]>('/credentials'),
  getById: (id: string) => fetchAPI<any>(`/credentials?id=${id}`),
  create: (data: any) => fetchAPI<any>('/credentials', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/credentials', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/credentials?id=${id}`, { method: 'DELETE' }),
};

// Daily Checks API
export const checksAPI = {
  getAll: () => fetchAPI<any[]>('/checks'),
  getById: (id: string) => fetchAPI<any>(`/checks?id=${id}`),
  create: (data: any) => fetchAPI<any>('/checks', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/checks', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/checks?id=${id}`, { method: 'DELETE' }),
};

// Calendar Events API
export const calendarAPI = {
  getAll: () => fetchAPI<any[]>('/calendar'),
  getById: (id: string) => fetchAPI<any>(`/calendar?id=${id}`),
  create: (data: any) => fetchAPI<any>('/calendar', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/calendar', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/calendar?id=${id}`, { method: 'DELETE' }),
};

// Announcements API
export const announcementsAPI = {
  getAll: () => fetchAPI<any[]>('/announcements'),
  getById: (id: string) => fetchAPI<any>(`/announcements?id=${id}`),
  create: (data: any) => fetchAPI<any>('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/announcements', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/announcements?id=${id}`, { method: 'DELETE' }),
};

// Knowledge API
export const knowledgeAPI = {
  getAll: () => fetchAPI<any[]>('/knowledge'),
  getById: (id: string) => fetchAPI<any>(`/knowledge?id=${id}`),
  create: (data: any) => fetchAPI<any>('/knowledge', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/knowledge', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/knowledge?id=${id}`, { method: 'DELETE' }),
};

// Notebook API
export const notebookAPI = {
  getAll: () => fetchAPI<any[]>('/notebook'),
  getById: (id: string) => fetchAPI<any>(`/notebook?id=${id}`),
  create: (data: any) => fetchAPI<any>('/notebook', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/notebook', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/notebook?id=${id}`, { method: 'DELETE' }),
};

// Vendors API
export const vendorsAPI = {
  getAll: () => fetchAPI<any[]>('/vendors'),
  getById: (id: string) => fetchAPI<any>(`/vendors?id=${id}`),
  create: (data: any) => fetchAPI<any>('/vendors', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/vendors', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/vendors?id=${id}`, { method: 'DELETE' }),
};

// Monitors API
export const monitorsAPI = {
  getAll: () => fetchAPI<any[]>('/monitors'),
  getById: (id: string) => fetchAPI<any>(`/monitors?id=${id}`),
  create: (data: any) => fetchAPI<any>('/monitors', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/monitors', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/monitors?id=${id}`, { method: 'DELETE' }),
};

// Alerts API
export const alertsAPI = {
  getAll: () => fetchAPI<any[]>('/alerts'),
  getById: (id: string) => fetchAPI<any>(`/alerts?id=${id}`),
  create: (data: any) => fetchAPI<any>('/alerts', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/alerts', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/alerts?id=${id}`, { method: 'DELETE' }),
};

// Settings API
export const settingsAPI = {
  getAll: () => fetchAPI<Record<string, string | null>>('/settings'),
  update: (key: string, value: string) =>
    fetchAPI<any>('/settings', { method: 'PUT', body: JSON.stringify({ key, value }) }),
};

// Logs API
export const logsAPI = {
  getAll: (limit?: number) => fetchAPI<any[]>(`/logs${limit ? `?limit=${limit}` : ''}`),
  create: (data: any) => fetchAPI<any>('/logs', { method: 'POST', body: JSON.stringify(data) }),
};

// Charters API
export const chartersAPI = {
  getAll: () => fetchAPI<any[]>('/charters'),
  getById: (id: string) => fetchAPI<any>(`/charters?id=${id}`),
  create: (data: any) => fetchAPI<any>('/charters', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/charters', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/charters?id=${id}`, { method: 'DELETE' }),
};

// Budget API
export const budgetAPI = {
  getAll: () => fetchAPI<any[]>('/budget'),
  getById: (id: string) => fetchAPI<any>(`/budget?id=${id}`),
  create: (data: any) => fetchAPI<any>('/budget', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/budget', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/budget?id=${id}`, { method: 'DELETE' }),
};

// Notes API
export const notesAPI = {
  getAll: () => fetchAPI<any[]>('/notes'),
  getById: (id: string) => fetchAPI<any>(`/notes?id=${id}`),
  create: (data: any) => fetchAPI<any>('/notes', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchAPI<any>('/notes', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/notes?id=${id}`, { method: 'DELETE' }),
};
