'use client'
import { Calendar, Package, ShoppingCart, Truck, AlertTriangle } from 'lucide-react';

import StatCard from '@/components/admin/StatCard';
import SaleGraph from '@/components/admin/SaleGraph';
import BestSellers from '@/components/admin/BestSellers';
import RecentOrders from '@/components/admin/RecentOrders';
import CalendarRegular from '@/components/icons/calendar';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/70 text-sm">Home &gt; Dashboard</p>
        </div>
        
        <button className="flex justify-center items-center gap-2">
          <CalendarRegular />
          Feb 16,2022 - Feb 20,2022
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng doanh thu"
          amount="$126.500"
          percentage={34.7}
          icon={<ShoppingCart size={20} />}
          iconColor="bg-indigo-500"
        />
        <StatCard
          title="Đơn hàng mới"
          amount="14"
          percentage={34.7}
          icon={<Package size={20} />}
          iconColor="bg-indigo-500"
        />
        <StatCard
          title="Tồn kho sắp hết"
          amount="5 Items"
          percentage={34.7}
          icon={<AlertTriangle size={20} />}
          iconColor="bg-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="xl:col-span-2">
          <SaleGraph />
        </div>

        <div>
          <BestSellers />
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div>
        <RecentOrders />
      </div>
    </div>
  );
}