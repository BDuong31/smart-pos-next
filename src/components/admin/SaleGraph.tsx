
"use client"; 

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MoreHorizontal } from 'lucide-react';

// Dữ liệu mẫu (Giữ nguyên)
const data = [
  { name: 'JUL', sales: 0 },
  { name: 'AUG', sales: 100 },
  { name: 'SEP', sales: 80 },
  { name: 'OCT', sales: 150 },
  { name: 'NOV', sales: 250 },
  { name: 'DEC', sales: 380 },
];

export default function SaleGraph() {
  return (
    <div className="card bg-base-100 shadow-sm h-full">

      <div className="card-body flex flex-col h-full">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Sale Graph</h2>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-outline">WEEKLY</button>
            <button className="btn btn-sm btn-neutral">MONTHLY</button>
            <button className="btn btn-sm btn-outline">YEARLY</button>
          </div>
        </div>

        <div className="flex-1" style={{ width: '100%' }}> 
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <XAxis dataKey="name" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}