'use client';

import { useState, useEffect } from 'react';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'computer', brand: '', model: '', serialNumber: '', location: '', status: 'active', condition: 'good', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    fetch(`/api/assets?${params.toString()}`).then(res => res.json()).then(data => { setAssets(data.assets || []); setLoading(false); });
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { setShowModal(false); setFormData({ name: '', category: 'computer', brand: '', model: '', serialNumber: '', location: '', status: 'active', condition: 'good', notes: '' }); fetch('/api/assets').then(res => res.json()).then(data => setAssets(data.assets || [])); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this asset?')) return;
    await fetch(`/api/assets/${id}`, { method: 'DELETE' });
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1 className="page-title">Assets</h1><p className="page-description">Manage IT assets and equipment</p></div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Asset</button>
        </div>
      </div>
      <div className="content-area">
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body" style={{ padding: '1rem' }}>
            <input type="text" className="form-input" placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
          </div>
        </div>
        <div className="card">
          {loading ? <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div> :
          assets.length > 0 ? (
            <div className="table-container"><table className="table"><thead><tr><th>Asset Tag</th><th>Name</th><th>Category</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{assets.map((a) => (<tr key={a.id}>
                <td><span style={{ fontWeight: 600, color: '#2563eb' }}>{a.assetTag}</span></td>
                <td><div style={{ fontWeight: 500 }}>{a.name}</div>{a.brand && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.brand} {a.model}</div>}</td>
                <td style={{ textTransform: 'capitalize' }}>{a.category}</td>
                <td>{a.location || '-'}</td>
                <td><span className={`badge ${a.status === 'active' ? 'badge-success' : a.status === 'maintenance' ? 'badge-warning' : 'badge-gray'}`}>{a.status}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Delete</button></td>
              </tr>))}</tbody></table></div>
          ) : <div className="empty-state"><div className="empty-state-icon">💻</div><div className="empty-state-title">No assets found</div></div>}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay"><div className="modal"><div className="modal-header"><h3 className="modal-title">Add New Asset</h3><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
          <form onSubmit={handleSubmit}><div className="modal-body">
            <div className="form-group"><label className="form-label">Asset Name *</label><input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}><option value="computer">Computer</option><option value="printer">Printer</option><option value="network">Network</option><option value="other">Other</option></select></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group"><label className="form-label">Brand</label><input type="text" className="form-input" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Model</label><input type="text" className="form-input" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Location</label><input type="text" className="form-input" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
          </div><div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
          </div></form></div></div>
      )}
    </div>
  );
}