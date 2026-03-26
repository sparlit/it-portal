'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session').then(res => res.json()).then(data => { if (data.authenticated) router.push('/dashboard'); });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return; }
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">AR</div>
          <h1 className="login-title">Al Rayes Laundry</h1>
          <p className="login-subtitle">IT Management Portal</p>
        </div>
        <form className="login-body" onSubmit={handleSubmit}>
          {error && <div className="login-error">⚠️ {error}</div>}
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input type="text" className="form-input" placeholder="Enter your username or email" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Demo Credentials</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setUsername('admin'); setPassword('Admin@123'); }} disabled={loading}>Admin</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setUsername('simon'); setPassword('Simon@123'); }} disabled={loading}>Simon</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setUsername('demo'); setPassword('Demo@123'); }} disabled={loading}>Demo</button>
            </div>
          </div>
        </form>
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>© 2024 Al Rayes Laundry. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}