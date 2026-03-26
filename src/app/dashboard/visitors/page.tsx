'use client';

import { useState, useEffect } from 'react';

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', purpose: '', personToVisit: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/visitors').then(res => res.json()).then(data => { setVisitors(data.visitors || []); setLoading(false); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/visitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { setShowModal(false); setFormData({ name: '', company: '', purpose: '', personToVisit: '', phone: '' }); fetch('/api/visitors').then(res => res.json()).then(data => setVisitors(data.visitors || [])); }
    setSaving(false);
  };

  const handleCheckout = async (id: number) => {
    if (!confirm('Check out this visitor?')) return;
    await fetch('/api/visitors', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'checkout' }) });
    fetch('/api/visitors').then(res => res.json()).then(data => setVisitors(data.visitors || []));
  };

  const todayVisitors = visitors.filter(v => new Date(v.checkIn).toDateString() === new Date().toDateString()).length;
  const activeVisitors = visitors.filter(v => v.status === 'checked_in').length;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1 className="page-title">Visitors</h1><p className="page-description">Manage visitor check-in</p></div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Check In Visitor</button>
        </div>
      </div>
      <div className="content-area">
        <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card"><div className="stat-icon blue">👥</div><div className="stat-content"><div className="stat-label">Today's Visitors</div><div className="stat-value">{todayVisitors}</div></div></div>
          <div className="stat-card"><div className="stat-icon green">✓</div><div className="stat-content"><div className="stat-label">Currently Inside</div><div className="stat-value">{activeVisitors}</div></div></div>
          <div className="stat-card"><div className="stat-icon yellow">📋</div><div className="stat-content"><div className="stat-label">Total Records</div><div className="stat-value">{visitors.length}</div></div></div>
        </div>
        <div className="card">
          {loading ? <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div> :
          visitors.length > 0 ? (
            <div className="table-container"><table className="table"><thead><tr><th>Pass #</th><th>Visitor</th><th>Purpose</th><th>Check In</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{visitors.map((v) => (<tr key={v.id}>
                <td><span style={{ fontWeight: 600, color: '#2563eb' }}>{v.visitorPass}</span></td>
                <td><div style={{ fontWeight: 500 }}>{v.name}</div>{v.company && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.company}</div>}</td>
                <td>{v.purpose}</td>
                <td>{new Date(v.checkIn).toLocaleString()}</td>
                <td><span className={`badge ${v.status === 'checked_in' ? 'badge-success' : 'badge-gray'}`}>{v.status === 'checked_in' ? 'Inside' : 'Left'}</span></td>
                <td>{v.status === 'checked_in' && <button className="btn btn-danger btn-sm" onClick={() => handleCheckout(v.id)}>Check Out</button>}</td>
              </tr>))}</tbody></table></div>
          ) : <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-title">No visitors</div></div>}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay"><div className="modal"><div className="modal-header"><h3 className="modal-title">Check In Visitor</h3><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
          <form onSubmit={handleSubmit}><div className="modal-body">
            <div className="form-group"><label className="form-label">Visitor Name *</label><input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Company</label><input type="text" className="form-input" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Purpose *</label><input type="text" className="form-input" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Person to Visit *</label><input type="text" className="form-input" value={formData.personToVisit} onChange={(e) => setFormData({...formData, personToVisit: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
          </div><div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Checking In...' : 'Check In'}</button>
          </div></form></div></div>
      )}
    </div>
  );
}