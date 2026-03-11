// src/components/admin/StatCard.tsx
import { MoreHorizontal, ArrowUp } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  amount: string;
  percentage: number;
  icon: React.ReactNode;
  iconColor: string; 
}

export default function StatCard({ title, amount, percentage, icon, iconColor }: StatCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold">{title}</p>
          <button className="btn btn-ghost btn-circle btn-sm">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className='flex flex-row justify-between'>
          <div className='flex gap-4 items-center'>
            <div className={`w-10 h-10 rounded-lg p-[10px] bg-blue text-white ${iconColor}`}>
              {icon}
            </div>
            <h2 className="text-2xl font-bold">{amount}</h2>
          </div>
          <span className="flex items-center gap-1 text-success">
            <ArrowUp size={16} />
            {percentage}%
          </span>
        </div>
        <div className="flex justify-end items-center gap-2 text-sm mt-2">
          <span className="text-base-content/60">Compared to Jan 2022</span>
        </div>
      </div>
    </div>
  );
}