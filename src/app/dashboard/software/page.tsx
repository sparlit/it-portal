'use client';
import { useState, useEffect } from 'react';
export default function SoftwarePage() {
  const [software, setSoftware] = useState<any[]>([]);
  useEffect(() => { fetch('/api/software').then(res => res.json()).then(data => setSoftware(data.software || [])); }, []);
  return (<div><div className="page-header"><h1 className="page-title">Software</h1></div><div className="content-area"><div className="card"><div className="table-container"><table className="table"><thead><tr><th>Name</th><th>Vendor</th><th>Version</th><th>Licenses</th></tr></thead>
    <tbody>{software.map((s) => (<tr key={s.id}><td>{s.name}</td><td>{s.vendor || '-'}</td><td>{s.version || '-'}</td><td><span className="badge badge-info">{s._count?.licenses || 0}</span></td></tr>))}</tbody></table></div></div></div></div>);
}