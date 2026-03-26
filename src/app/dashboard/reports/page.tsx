'use client';
import { useState, useEffect } from 'react';
export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { fetch('/api/dashboard').then(res => res.json()).then(data => setStats(data.stats)); }, []);
  return (<div><div className="page-header"><h1 className="page-title">Reports</h1></div><div className="content-area">
    <div className="grid grid-cols-4"><div className="stat-card"><div className="stat-icon blue">💻</div><div className="stat-content"><div className="stat-label">Assets</div><div className="stat-value">{stats?.assets?.total || 0}</div></div></div>
    <div className="stat-card"><div className="stat-icon yellow">🎫</div><div className="stat-content"><div className="stat-label">Tickets</div><div className="stat-value">{stats?.tickets?.total || 0}</div></div></div>
    <div className="stat-card"><div className="stat-icon green">👥</div><div className="stat-content"><div className="stat-label">Visitors</div><div className="stat-value">{stats?.visitors?.thisMonth || 0}</div></div></div>
    <div className="stat-card"><div className="stat-icon purple">👤</div><div className="stat-content"><div className="stat-label">Users</div><div className="stat-value">{stats?.users?.total || 0}</div></div></div></div>
  </div></div>);
}