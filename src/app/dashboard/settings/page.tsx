'use client';
import { useState, useEffect } from 'react';
import { useUser } from '../layout';
export default function SettingsPage() {
  const { user } = useUser();
  return (<div><div className="page-header"><h1 className="page-title">Settings</h1></div><div className="content-area"><div className="card"><div className="card-body">
    <h4 style={{ marginBottom: '1rem' }}>Your Profile</h4>
    <div style={{ maxWidth: '400px' }}>
      <div className="form-group"><label className="form-label">Username</label><input type="text" className="form-input" value={user?.username || ''} disabled /></div>
      <div className="form-group"><label className="form-label">Name</label><input type="text" className="form-input" value={user?.name || ''} disabled /></div>
      <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={user?.email || ''} disabled /></div>
      <div className="form-group"><label className="form-label">Role</label><input type="text" className="form-input" value={user?.role || ''} disabled style={{ textTransform: 'capitalize' }} /></div>
    </div>
  </div></div></div></div>);
}