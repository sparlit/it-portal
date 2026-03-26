'use client';
import { useState, useEffect } from 'react';
export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  useEffect(() => { fetch('/api/announcements').then(res => res.json()).then(data => setAnnouncements(data.announcements || [])); }, []);
  return (<div><div className="page-header"><h1 className="page-title">Announcements</h1></div><div className="content-area">
    {announcements.map((a) => (<div key={a.id} className="card" style={{ marginBottom: '1rem' }}><div className="card-body"><h3 style={{ marginBottom: '0.5rem' }}>{a.title}</h3><p style={{ color: '#64748b' }}>{a.content}</p></div></div>))}
  </div></div>);
}