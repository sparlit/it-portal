'use client';
import { useState, useEffect } from 'react';
export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => { fetch('/api/events').then(res => res.json()).then(data => setEvents(data.events || [])); }, []);
  return (<div><div className="page-header"><h1 className="page-title">Events</h1></div><div className="content-area"><div className="card">
    {events.map((e) => (<div key={e.id} style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}><strong>{e.title}</strong><div style={{ fontSize: '0.875rem', color: '#64748b' }}>{new Date(e.startDate).toLocaleString()} {e.location && `• ${e.location}`}</div></div>))}
  </div></div></div>);
}