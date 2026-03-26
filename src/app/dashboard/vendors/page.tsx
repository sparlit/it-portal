'use client';
import { useState, useEffect } from 'react';
export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  useEffect(() => { fetch('/api/vendors').then(res => res.json()).then(data => setVendors(data.vendors || [])); }, []);
  return (<div><div className="page-header"><h1 className="page-title">Vendors</h1></div><div className="content-area"><div className="card"><div className="table-container"><table className="table"><thead><tr><th>Name</th><th>Category</th><th>Contact</th><th>Phone</th></tr></thead>
    <tbody>{vendors.map((v) => (<tr key={v.id}><td>{v.name}</td><td>{v.category || '-'}</td><td>{v.contactPerson || '-'}</td><td>{v.phone || '-'}</td></tr>))}</tbody></table></div></div></div></div>);
}