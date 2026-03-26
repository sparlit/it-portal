'use client';

import { useState, useEffect } from 'react';
import { useUser } from './layout';

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard').then(res => res.json()).then(data => {
      setStats(data.stats);
      setTickets(data.recentTickets || []);
      setActivities(data.recentActivities || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-description">Here's what's happening with your IT management today.</p>
      </div>
      <div className="content-area">
        <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card"><div className="stat-icon blue">💻</div><div className="stat-content"><div className="stat-label">Total Assets</div><div className="stat-value">{stats?.assets?.total || 0}</div></div></div>
          <div className="stat-card"><div className="stat-icon yellow">🎫</div><div className="stat-content"><div className="stat-label">Open Tickets</div><div className="stat-value">{stats?.tickets?.open || 0}</div></div></div>
          <div className="stat-card"><div className="stat-icon green">👥</div><div className="stat-content"><div className="stat-label">Today's Visitors</div><div className="stat-value">{stats?.visitors?.today || 0}</div></div></div>
          <div className="stat-card"><div className="stat-icon red">🔑</div><div className="stat-content"><div className="stat-label">Expiring Licenses</div><div className="stat-value">{stats?.licenses?.expiring || 0}</div></div></div>
        </div>
        <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Recent Tickets</h3><a href="/dashboard/tickets" className="btn btn-outline btn-sm">View All</a></div>
            {tickets.length > 0 ? (
              <div className="table-container"><table className="table"><thead><tr><th>Ticket</th><th>Status</th><th>Priority</th></tr></thead><tbody>
                {tickets.map((t) => (<tr key={t.id}><td><div style={{ fontWeight: 500 }}>{t.ticketNumber}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.title}</div></td><td><span className={`badge ${t.status === 'open' ? 'badge-info' : t.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td><td><span className={`badge ${t.priority === 'high' ? 'badge-danger' : t.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>{t.priority}</span></td></tr>))}
              </tbody></table></div>
            ) : <div className="empty-state"><div className="empty-state-icon">🎫</div><div className="empty-state-title">No tickets yet</div></div>}
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Recent Activity</h3></div>
            {activities.length > 0 ? (
              <div style={{ padding: '0.5rem 0' }}>{activities.slice(0, 6).map((a) => (
                <div key={a.id} style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.action === 'create' ? '➕' : a.action === 'login' ? '🔐' : '📋'}</div>
                  <div><div style={{ fontSize: '0.875rem' }}><span style={{ fontWeight: 500 }}>{a.user?.name || 'System'}</span> {a.details}</div><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(a.createdAt).toLocaleString()}</div></div>
                </div>
              ))}</div>
            ) : <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No recent activity</div></div>}
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="card"><div className="card-header"><h3 className="card-title">Quick Stats</h3></div><div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Total Users</span><span style={{ fontWeight: 600 }}>{stats?.users?.total || 0}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Software Licenses</span><span style={{ fontWeight: 600 }}>{stats?.licenses?.total || 0}</span></div>
            </div>
          </div></div>
          <div className="card"><div className="card-header"><h3 className="card-title">Quick Actions</h3></div><div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="/dashboard/tickets" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>🎫 New Ticket</a>
              <a href="/dashboard/assets" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>💻 Add Asset</a>
              <a href="/dashboard/visitors" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>👥 Check In Visitor</a>
            </div>
          </div></div>
          <div className="card"><div className="card-header"><h3 className="card-title">System Info</h3></div><div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div><strong>Organization:</strong> Al Rayes Laundry</div>
              <div><strong>Location:</strong> Doha, Qatar</div>
              <div><strong>Portal Version:</strong> 1.0.0</div>
            </div>
          </div></div>
        </div>
      </div>
    </div>
  );
}