'use client';

import { useState, useEffect } from 'react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'other', priority: 'medium', requesterName: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    fetch(`/api/tickets?${params.toString()}`).then(res => res.json()).then(data => { setTickets(data.tickets || []); setLoading(false); });
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { setShowModal(false); setFormData({ title: '', description: '', category: 'other', priority: 'medium', requesterName: '' }); fetch('/api/tickets').then(res => res.json()).then(data => setTickets(data.tickets || [])); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ticket?')) return;
    await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
    setTickets(tickets.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1 className="page-title">Tickets</h1><p className="page-description">Manage support tickets</p></div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Ticket</button>
        </div>
      </div>
      <div className="content-area">
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body" style={{ padding: '1rem' }}>
            <input type="text" className="form-input" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
          </div>
        </div>
        <div className="card">
          {loading ? <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div> :
          tickets.length > 0 ? (
            <div className="table-container"><table className="table"><thead><tr><th>Ticket</th><th>Requester</th><th>Priority</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>{tickets.map((t) => (<tr key={t.id}>
                <td><div style={{ fontWeight: 600, color: '#2563eb' }}>{t.ticketNumber}</div><div style={{ fontSize: '0.875rem' }}>{t.title}</div></td>
                <td>{t.requesterName}</td>
                <td><span className={`badge ${t.priority === 'high' ? 'badge-danger' : t.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>{t.priority}</span></td>
                <td><span className={`badge ${t.status === 'open' ? 'badge-info' : t.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td>
                <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Delete</button></td>
              </tr>))}</tbody></table></div>
          ) : <div className="empty-state"><div className="empty-state-icon">🎫</div><div className="empty-state-title">No tickets found</div></div>}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay"><div className="modal"><div className="modal-header"><h3 className="modal-title">New Ticket</h3><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
          <form onSubmit={handleSubmit}><div className="modal-body">
            <div className="form-group"><label className="form-label">Title *</label><input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Description *</label><textarea className="form-input" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}><option value="hardware">Hardware</option><option value="software">Software</option><option value="network">Network</option><option value="other">Other</option></select></div>
              <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Requester Name *</label><input type="text" className="form-input" value={formData.requesterName} onChange={(e) => setFormData({...formData, requesterName: e.target.value})} required /></div>
          </div><div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
          </div></form></div></div>
      )}
    </div>
  );
}