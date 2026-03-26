'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User { id: number; username: string; name: string; email: string; role: string; department?: string; }
interface UserContextType { user: User | null; loading: boolean; logout: () => Promise<void>; }

const UserContext = createContext<UserContextType | undefined>(undefined);
export function useUser() { const context = useContext(UserContext); if (!context) throw new Error('useUser must be used within UserProvider'); return context; }

function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { section: 'Overview', items: [{ href: '/dashboard', icon: '📊', label: 'Dashboard' }] },
    { section: 'IT Management', items: [{ href: '/dashboard/assets', icon: '💻', label: 'Assets' }, { href: '/dashboard/tickets', icon: '🎫', label: 'Tickets' }, { href: '/dashboard/software', icon: '💿', label: 'Software' }, { href: '/dashboard/licenses', icon: '🔑', label: 'Licenses' }] },
    { section: 'Administration', items: [{ href: '/dashboard/visitors', icon: '👥', label: 'Visitors' }, { href: '/dashboard/users', icon: '👤', label: 'Users' }, { href: '/dashboard/departments', icon: '🏢', label: 'Departments' }, { href: '/dashboard/vendors', icon: '🤝', label: 'Vendors' }] },
    { section: 'Communication', items: [{ href: '/dashboard/announcements', icon: '📢', label: 'Announcements' }, { href: '/dashboard/events', icon: '📅', label: 'Events' }] },
    { section: 'Reports', items: [{ href: '/dashboard/reports', icon: '📈', label: 'Reports' }] },
    { section: 'Settings', items: [{ href: '/dashboard/settings', icon: '⚙️', label: 'Settings' }] },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">AR</div>
          <div><div className="sidebar-logo-text">IT Portal</div><div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Al Rayes Laundry</div></div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section"><div className="sidebar-section-title">{group.section}</div></div>
            {group.items.map((item) => (<a key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}><span>{item.icon}</span>{item.label}</a>))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Header() {
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const handleLogout = async () => { await logout(); router.push('/'); };
  return (
    <header className="header">
      <div><h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>IT Management Portal</h1></div>
      <div className="dropdown">
        <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowDropdown(!showDropdown)}>
          <div className="avatar avatar-sm" style={{ background: '#2563eb', color: 'white' }}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <span>{user?.name || 'User'}</span>
        </button>
        {showDropdown && (<><div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowDropdown(false)} /><div className="dropdown-menu">
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}><div style={{ fontWeight: 600 }}>{user?.name}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div></div>
          <button className="dropdown-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none' }}>🚪 Sign Out</button>
        </div></>)}
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logout = async () => { try { await fetch('/api/auth/logout', { method: 'POST' }); setUser(null); } catch (err) {} };
  useEffect(() => { fetch('/api/auth/session').then(res => res.json()).then(data => { if (data.authenticated) setUser(data.user); else router.push('/'); setLoading(false); }); }, [router]);
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>;
  if (!user) return null;
  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      <div style={{ minHeight: '100vh' }}><Sidebar /><div className="main-content"><Header />{children}</div></div>
    </UserContext.Provider>
  );
}