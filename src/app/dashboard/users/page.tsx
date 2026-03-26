'use client';

import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', role: 'user', department: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(data => { setUsers(data.users || []); setLoading(false); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { setShowModal(false); setFormData({ username: '', name: '', email: '', password: '', role: 'user', department: '' }); fetch('/api/users').then(res => res.json()).then(data => setUsers(data.users || [])); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1 className="page-title">Users</h1><p className="page-description">Manage user accounts</p></div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
        </div>
      </div>
      <div className="content-area">
        <div className="card">
          {loading ? <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div> :
          users.length > 0 ? (
            <div className="table-container"><table className="table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{users.map((u) => (<tr key={u.id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="avatar" style={{ background: '#2563eb', color: 'white' }}>{u.name.charAt(0).toUpperCase()}</div>
                  <div><div style={{ fontWeight: 500 }}>{u.name}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>@{u.username}</div></div>
                </div></td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'manager' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span></td>
                <td>{u.department || '-'}</td>
                <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-gray'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button></td>
              </tr>))}</tbody></table></div>
          ) : <div className="empty-state"><div className="empty-state-icon">👤</div><div className="empty-state-title">No users</div></div>}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay"><div className="modal"><div className="modal-header"><h3 className="modal-title">Add User</h3><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
          <form onSubmit={handleSubmit}><div className="modal-body">
            <div className="form-group"><label className="form-label">Full Name *</label><input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group"><label className="form-label">Username *</label><input type="text" className="form-input" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})} required /></div>
              <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label className="form-label">Password *</label><input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group"><label className="form-label">Role</label><select className="form-select" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}><option value="user">User</option><option value="manager">Manager</option><option value="admin">Admin</option></select></div>
              <div className="form-group"><label className="form-label">Department</label><input type="text" className="form-input" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} /></div>
            </div>
          </div><div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
          </div></form></div></div>
      )}
    </div>
  );
}