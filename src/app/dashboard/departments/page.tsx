'use client';
import { useState, useEffect } from 'react';
export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  useEffect(() => { fetch('/api/departments').then(res => res.json()).then(data => setDepartments(data.departments || [])); }, []);
  return (<div><div className="page-header"><h1 className="page-title">Departments</h1></div><div className="content-area"><div className="card"><div className="table-container"><table className="table"><thead><tr><th>Name</th><th>Manager</th><th>Location</th></tr></thead>
    <tbody>{departments.map((d) => (<tr key={d.id}><td>{d.name}</td><td>{d.managerName || '-'}</td><td>{d.location || '-'}</td></tr>))}</tbody></table></div></div></div></div>);
}