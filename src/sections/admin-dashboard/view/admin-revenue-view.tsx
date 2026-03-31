"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { 
  DollarSign, TrendingUp, ShoppingBag, CreditCard, Calendar, 
  ArrowUpRight, ArrowDownRight, Download, Filter, Coffee
} from "lucide-react";

// ==========================================
// 1. MOCK DATA TÀI CHÍNH (Dữ liệu giả lập)
// ==========================================
const generateRevenueData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    data.push({
      date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      revenue: Math.floor(Math.random() * 5000000) + 2000000, // Doanh thu 2tr - 7tr/ngày
      orders: Math.floor(Math.random() * 100) + 50, // 50 - 150 đơn/ngày
    });
  }
  return data;
};

const categoryData = [
  { name: 'Cà phê', value: 45000000, color: '#3B82F6' }, // Blue
  { name: 'Trà sữa', value: 35000000, color: '#8B5CF6' }, // Purple
  { name: 'Trà trái cây', value: 25000000, color: '#F59E0B' }, // Amber
  { name: 'Bánh ngọt', value: 15000000, color: '#10B981' }, // Emerald
];

const topProducts = [
  { id: 1, name: "Cà phê sữa đá", category: "Cà phê", sold: 1245, revenue: 36105000, growth: 12.5 },
  { id: 2, name: "Trà đào cam sả", category: "Trà trái cây", sold: 980, revenue: 34300000, growth: 8.2 },
  { id: 3, name: "Trà sữa Ô long nướng", category: "Trà sữa", sold: 850, revenue: 38250000, growth: -2.4 },
  { id: 4, name: "Bạc xỉu", category: "Cà phê", sold: 720, revenue: 20880000, growth: 15.0 },
  { id: 5, name: "Bánh Croissant", category: "Bánh ngọt", sold: 450, revenue: 18000000, growth: 5.5 },
];

// Định dạng tiền tệ VNĐ
const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

// ==========================================
// 2. COMPONENT KPI CARD
// ==========================================
const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}%
      </div>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
    </div>
  </div>
);

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function RevenueDashboard() {
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setChartData(generateRevenueData(Number(timeRange)));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  // Tính toán tổng số (Mock)
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 font-sans">
      {/* 1. HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <DollarSign className="text-emerald-600" /> Báo cáo Doanh thu
            </h1>
            <p className="text-slate-500 text-sm mt-1">
                Tổng quan tình hình kinh doanh, doanh số và hiệu suất bán hàng.
            </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
                {(["7", "30", "90"] as const).map((days) => (
                <button 
                    key={days}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    timeRange === days ? "bg-darkgrey text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    onClick={() => setTimeRange(days)}
                >
                    {days} Ngày
                </button>
                ))}
            </div>
            {/* Nút Xuất báo cáo */}
            <button className="btn bg-darkgrey text-white px-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl shadow-sm">
                <Download size={18} /> Xuất Excel
            </button>
            </div>
        </div>

      {/* 2. KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <KPICard 
            title="Tổng Doanh Thu" 
            value={formatVND(totalRevenue)} 
            icon={TrendingUp} trend="up" trendValue="12.5" 
            colorClass="bg-emerald-100 text-emerald-600" 
            />
            <KPICard 
            title="Tổng Số Đơn Hàng" 
            value={totalOrders.toLocaleString('vi-VN')} 
            icon={ShoppingBag} trend="up" trendValue="8.2" 
            colorClass="bg-blue-100 text-blue-600" 
            />
            <KPICard 
            title="Giá Trị Đơn Trung Bình (AOV)" 
            value={formatVND(avgOrderValue)} 
            icon={CreditCard} trend="down" trendValue="1.4" 
            colorClass="bg-purple-100 text-purple-600" 
            />
            <KPICard 
            title="Lợi Nhuận Gộp (Ước tính 40%)" 
            value={formatVND(totalRevenue * 0.4)} 
            icon={DollarSign} trend="up" trendValue="15.3" 
            colorClass="bg-amber-100 text-amber-600" 
            />
        </div>

      {/* 3. CHARTS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative">
            {loading && (
            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                <span className="loading loading-spinner text-slate-800"></span>
            </div>
            )}
            
            {/* CHART 1: BIỂU ĐỒ DOANH THU THEO THỜI GIAN (Chiếm 2 phần) */}
            <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-6 flex justify-between items-center">
                <div>
                <h2 className="text-lg font-bold text-slate-800">Biểu đồ Doanh thu & Đơn hàng</h2>
                <p className="text-xs text-slate-400">Xu hướng trong {timeRange} ngày qua</p>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                    <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    {/* YAxis bên trái cho Doanh thu */}
                    <YAxis yAxisId="left" tickFormatter={(val) => `${val / 1000000}M`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    {/* YAxis bên phải cho Đơn hàng */}
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                    formatter={(value: number, name: string) => [name === 'revenue' ? formatVND(value) : value, name === 'revenue' ? 'Doanh thu' : 'Số đơn']}
                    labelStyle={{ color: '#334155', fontWeight: 'bold' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                    <Area yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10B981" strokeWidth={3} fill="url(#colorRev)" />
                    <Area yAxisId="right" type="monotone" dataKey="orders" name="Số đơn hàng" stroke="#3B82F6" strokeWidth={2} fillOpacity={0} strokeDasharray="5 5" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* CHART 2: CƠ CẤU DOANH THU THEO DANH MỤC (Chiếm 1 phần) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="mb-2">
                <h2 className="text-lg font-bold text-slate-800">Cơ cấu Doanh thu</h2>
                <p className="text-xs text-slate-400">Theo nhóm ngành hàng chính</p>
            </div>
            <div className="flex-1 w-full flex items-center justify-center min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100}
                    paddingAngle={5} dataKey="value"
                    >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <RechartsTooltip 
                    formatter={(value: number) => formatVND(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <div className="text-xs text-slate-600 font-medium">{cat.name}</div>
                </div>
                ))}
            </div>
            </div>
        </div>

        <div className="bg-white max-h-[500px] rounded-2xl shadow-sm border border-slate-100 overflow-y-auto mt-2">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Coffee className="text-slate-400" size={20} />
                Top Sản Phẩm Mang Lại Doanh Thu Cao Nhất
                </h2>
            </div>
            <button className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50 font-semibold">
                Xem tất cả
            </button>
            </div>

            <div className="overflow-x-auto">
            <table className="table w-full">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                    <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                    <th className="px-6 py-4 font-semibold text-center">Danh mục</th>
                    <th className="px-6 py-4 font-semibold text-center">Đã bán (Ly/Phần)</th>
                    <th className="px-6 py-4 font-semibold text-right">Tổng doanh thu</th>
                    <th className="px-6 py-4 font-semibold text-right">Tăng trưởng</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-base">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-medium rounded-lg">
                        {product.category}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700">
                        {product.sold.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <span className="font-bold text-emerald-600">
                        {formatVND(product.revenue)}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className={`inline-flex items-center gap-1 font-medium px-2 py-1 rounded-md text-xs ${
                        product.growth > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                        }`}>
                        {product.growth > 0 ? <TrendingUp size={14}/> : <ArrowDownRight size={14}/>}
                        {Math.abs(product.growth)}%
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

    </div>
    );
}