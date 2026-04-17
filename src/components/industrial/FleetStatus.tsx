'use client';

import React, { useEffect, useState } from 'react';
import { Truck, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export const FleetStatus = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/transport/vehicles');
        const data = await res.json();
        if (Array.isArray(data)) setVehicles(data);
      } catch (err) {
        console.error('Failed to fetch vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {vehicles.map((v) => (
        <div key={v.id} className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Truck size={20} />
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              v.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {v.status}
            </span>
          </div>
          <h4 className="font-bold text-gray-900">{v.plateNumber}</h4>
          <p className="text-xs text-gray-500 mb-4">{v.model} - {v.make}</p>
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
              <MapPin size={12} /> Live Track
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:underline">Details</button>
          </div>
        </div>
      ))}
      {vehicles.length === 0 && (
         <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed rounded-xl">
            No vehicles in fleet database.
         </div>
      )}
    </div>
  );
};
