'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export const StockAlertPanel = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/stores/items');
        const items = await res.json();
        const criticalItems = items.filter((item: any) => item.currentStock <= item.minStockLevel);
        setAlerts(criticalItems);
      } catch (err) {
        console.error('Failed to fetch stock alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-lg"></div>;
  if (alerts.length === 0) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-full">
            <AlertTriangle className="text-amber-600" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">Critical Stock Alerts</h3>
            <p className="text-xs text-amber-700">{alerts.length} items have fallen below their safety reorder point.</p>
          </div>
        </div>
        <Link
          href="/portal/stores"
          className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:underline"
        >
          View Inventory <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {alerts.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded border border-amber-200 text-xs">
            <span className="font-medium text-gray-700">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold">{item.currentStock} {item.unit}</span>
              <span className="text-gray-400">/ min {item.minStockLevel}</span>
              <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                <ShoppingCart size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
