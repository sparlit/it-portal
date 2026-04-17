'use client';

import React from 'react';
import { Layers, ChevronRight, Server, Laptop, Printer } from 'lucide-react';

export const AssetHierarchy = () => {
  // Mock data for hierarchy
  const hierarchy = [
    {
      id: '1',
      name: 'Primary Data Center',
      type: 'location',
      children: [
        {
          id: '2',
          name: 'Rack 01',
          type: 'rack',
          children: [
            { id: '3', name: 'App Server 01', type: 'server' },
            { id: '4', name: 'DB Cluster 01', type: 'server' },
          ]
        },
        {
          id: '5',
          name: 'Network Core',
          type: 'network',
          children: [
            { id: '6', name: 'Cisco Catalyst 9k', type: 'switch' }
          ]
        }
      ]
    }
  ];

  const renderNode = (node: any) => (
    <div key={node.id} className="ml-6 mt-4 border-l-2 border-slate-800 pl-6">
      <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group">
        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
          {node.type === 'server' ? <Server size={18} /> :
           node.type === 'laptop' ? <Laptop size={18} /> :
           <Layers size={18} />}
        </div>
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-slate-200">{node.name}</p>
          <p className="text-[10px] text-slate-500 font-bold">{node.type.toUpperCase()}</p>
        </div>
        {node.children && <ChevronRight size={14} className="text-slate-600" />}
      </div>
      {node.children && node.children.map(renderNode)}
    </div>
  );

  return (
    <div className="p-8 bg-slate-950 rounded-3xl border border-slate-900 shadow-2xl">
      <h3 className="text-xl font-black italic uppercase text-blue-500 mb-8 flex items-center gap-3">
        <Layers size={24} />
        Structural Infrastructure Map
      </h3>
      {hierarchy.map(renderNode)}
    </div>
  );
};
