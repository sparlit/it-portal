'use client';

import React from 'react';
import { Package, Truck, FileText, Bell, CheckCircle, Clock } from 'lucide-react';

export default function SupplierDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <Truck className="text-indigo-400" />
          <span className="text-xl font-bold tracking-tight">Artemis Partner</span>
        </div>

        <nav className="space-y-1">
          <NavItem icon={<Package size={18}/>} label="Open Tenders" active />
          <NavItem icon={<FileText size={18}/>} label="Purchase Orders" />
          <NavItem icon={<CheckCircle size={18}/>} label="Deliveries" />
          <NavItem icon={<Clock size={18}/>} label="Payment History" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Supplier Overview</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-indigo-600 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">V</div>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Pending Orders" value="12" color="blue" />
            <StatCard label="Overdue Delivery" value="2" color="red" />
            <StatCard label="Unpaid Invoices" value="₹ 45,200" color="green" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Recent Purchase Orders</h2>
              <button className="text-sm text-indigo-600 font-medium">Download All</button>
            </div>
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-gray-400 bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">PO Number</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <TableRow id="PO-2024-001" date="Oct 24, 2024" items="Chemicals (4)" status="Pending" />
                <TableRow id="PO-2024-005" date="Oct 22, 2024" items="Machinery Parts (2)" status="Shipped" />
                <TableRow id="PO-2023-998" date="Oct 20, 2024" items="Stationery" status="Cancelled" />
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    green: 'bg-green-50 text-green-700 border-green-100'
  };
  return (
    <div className={`p-6 rounded-xl border shadow-sm ${colors[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function TableRow({ id, date, items, status }: any) {
  const statusColors: any = {
    Pending: 'bg-amber-100 text-amber-700',
    Shipped: 'bg-green-100 text-green-700',
    Cancelled: 'bg-gray-100 text-gray-700'
  };
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-bold text-gray-700">{id}</td>
      <td className="px-6 py-4 text-gray-500">{date}</td>
      <td className="px-6 py-4 font-medium text-gray-600">{items}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[status]}`}>{status}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">VIEW</button>
      </td>
    </tr>
  );
}
