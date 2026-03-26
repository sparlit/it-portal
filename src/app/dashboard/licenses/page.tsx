'use client';
import { useState, useEffect } from 'react';
export default function LicensesPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  useEffect(() => { fetch('/api/licenses').then(res => res.json()).then(data => setLicenses(data.licenses || [])); }, []);
  return (<div><div className="page-header"><h1 className="page-title">Licenses</h1></div><div className="content-area"><div className="card"><div className="table-container"><table className="table"><thead><tr><th>Software</th><th>Type</th><th>Seats</th><th>Expiry</th><th>Status</th></tr></thead>
    <tbody>{licenses.map((l) => (<tr key={l.id}><td>{l.software?.name}</td><td>{l.licenseType}</td><td>{l.seatsUsed}/{l.seatsTotal}</td><td>{l.expiryDate ? new Date(l.expiryDate).toLocaleDateString() : '-'}</td><td><span className={`badge ${l.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{l.status}</span></td></tr>))}</tbody></table></div></div></div></div>);
}