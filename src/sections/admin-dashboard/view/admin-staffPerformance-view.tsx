"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from "recharts";
import { 
  Users, Star, Clock, TrendingUp, Award, Search, Filter, 
  ArrowUpRight, ArrowDownRight, Download, Coffee, Receipt, CheckCircle2
} from "lucide-react";

// ==========================================
// 1. MOCK DATA (Hiệu suất Nhân viên)
// ==========================================

// Dữ liệu chi tiết từng nhân viên
const mockEmployees = [
  { id: "EMP001", name: "Nguyễn Văn A", role: "Thu ngân", avatar: "A", orders: 1245, revenue: 45200000, avgTime: "1m 12s", rating: 4.8, status: "Đang làm việc" },
  { id: "EMP002", name: "Trần Thị B", role: "Pha chế", avatar: "B", orders: 980, revenue: 0, avgTime: "2m 45s", rating: 4.9, status: "Đang làm việc" },
  { id: "EMP003", name: "Lê Văn C", role: "Phục vụ", avatar: "C", orders: 850, revenue: 12500000, avgTime: "4m 10s", rating: 4.5, status: "Ca chiều" },
  { id: "EMP004", name: "Phạm Thị D", role: "Thu ngân", avatar: "D", orders: 1120, revenue: 38900000, avgTime: "1m 30s", rating: 4.6, status: "Đang làm việc" },
  { id: "EMP005", name: "Hoàng Văn E", role: "Pha chế", avatar: "E", orders: 1050, revenue: 0, avgTime: "3m 15s", rating: 4.2, status: "Nghỉ phép" },
  { id: "EMP006", name: "Vũ Thái", role: "Quản lý", avatar: "T", orders: 320, revenue: 15000000, avgTime: "1m 05s", rating: 5.0, status: "Đang làm việc" },
  { id: "EMP007", name: "Bình Dương", role: "Pha chế", avatar: "D", orders: 1100, revenue: 0, avgTime: "2m 30s", rating: 4.7, status: "Đang làm việc" },
];

// Xu hướng hiệu suất chung (Theo ngày)
const generateTrendData = () => {
  const data = [];
  const today = new Date();
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    data.push({
      date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      avgTime: Math.floor(Math.random() * 60) + 120, // Thời gian ra món (giây)
      rating: (Math.random() * 0.5 + 4.3).toFixed(1), // Rating 4.3 - 4.8
    });
  }
  return data;
};

// Định dạng tiền tệ VNĐ
const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

// Chuyển đổi giây sang phút:giây để hiện lên biểu đồ
const formatTimeFromSeconds = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

// ==========================================
// 2. COMPONENT KPI CARD
// ==========================================
const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass, subtext }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}%
      </div>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function EmployeePerformanceDashboard() {
  const [timeRange, setTimeRange] = useState<"7" | "30">("30");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setTrendData(generateTrendData());
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  // Lọc danh sách nhân viên
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      const matchRole = roleFilter === "ALL" || emp.role === roleFilter;
      const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [roleFilter, searchQuery]);

  // Dữ liệu cho biểu đồ Top Nhân viên
  const topEmployeesChart = useMemo(() => {
    return [...filteredEmployees]
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
      .map(emp => ({ name: emp.name, orders: emp.orders, rating: emp.rating }));
  }, [filteredEmployees]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 font-sans">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" /> Hiệu suất Nhân viên
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Đánh giá năng suất, tốc độ phục vụ và thái độ nhân viên.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${timeRange === "7" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`} onClick={() => setTimeRange("7")}>7 Ngày</button>
            <button className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${timeRange === "30" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`} onClick={() => setTimeRange("30")}>30 Ngày</button>
          </div>
          <button className="btn bg-white border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl shadow-sm">
            <Download size={18} /> Xuất Báo cáo
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Tốc độ ra món TB" value="2m 15s" subtext="Mục tiêu: Dưới 3 phút"
          icon={Clock} trend="up" trendValue="12.5" // Tốc độ nhanh lên (Thời gian giảm xuống) => Tốt
          colorClass="bg-blue-100 text-blue-600" 
        />
        <KPICard 
          title="Đánh giá Khách hàng" value="4.7 / 5.0" subtext="Dựa trên 450 lượt đánh giá"
          icon={Star} trend="up" trendValue="0.2" 
          colorClass="bg-amber-100 text-amber-500" 
        />
        <KPICard 
          title="Tổng Đơn Đã Xử Lý" value="6,665" subtext="Tất cả các ca làm việc"
          icon={Receipt} trend="up" trendValue="8.4" 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <KPICard 
          title="Nhân viên xuất sắc" value="Trần Thị B" subtext="Pha chế - 980 đơn - Đánh giá 4.9"
          icon={Award} trend="up" trendValue="15.0" 
          colorClass="bg-purple-100 text-purple-600" 
        />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
        {loading && <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl"><span className="loading loading-spinner text-blue-600"></span></div>}
        
        {/* CHART 1: TOP NHÂN VIÊN (BAR CHART) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Award className="text-amber-500" size={20}/> Top Năng Suất (Theo Đơn)</h2>
              <p className="text-xs text-slate-400">5 nhân viên xử lý nhiều đơn nhất</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEmployeesChart} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="orders" name="Số đơn xử lý" radius={[0, 4, 4, 0]} barSize={24}>
                  {topEmployeesChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#93C5FD'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: XU HƯỚNG THỜI GIAN PHỤC VỤ (LINE CHART) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Clock className="text-blue-500" size={20}/> Tốc độ ra món trung bình</h2>
              <p className="text-xs text-slate-400">Thời gian từ lúc lên đơn đến lúc hoàn thành</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(val) => `${Math.floor(val/60)}m`} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} 
                  domain={['dataMin - 30', 'dataMax + 30']}
                />
                <RechartsTooltip 
                  formatter={(value: number) => formatTimeFromSeconds(value)}
                  labelStyle={{ color: '#334155', fontWeight: 'bold' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line 
                  type="monotone" dataKey="avgTime" name="Thời gian ra món" 
                  stroke="#3B82F6" strokeWidth={3} 
                  dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. DATA TABLE: BẢNG CHI TIẾT NHÂN VIÊN */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-h-[500px] overflow-y-auto mt-2">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="text-slate-400" size={20} />
            Bảng Đánh Giá Chi Tiết
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Lọc Role */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <Filter size={16} className="text-slate-400" />
              <select className="bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="ALL">Tất cả vị trí</option>
                <option value="Thu ngân">Thu ngân (Cashier)</option>
                <option value="Pha chế">Pha chế (Barista)</option>
                <option value="Phục vụ">Phục vụ (Waiter)</option>
                <option value="Quản lý">Quản lý (Manager)</option>
              </select>
            </div>
            {/* Tìm kiếm */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Tìm tên nhân viên..." className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Nhân viên</th>
                <th className="px-6 py-4 font-semibold text-center">Đơn đã xử lý</th>
                <th className="px-6 py-4 font-semibold text-right">Doanh thu tạo ra</th>
                <th className="px-6 py-4 font-semibold text-center">Tốc độ TB</th>
                <th className="px-6 py-4 font-semibold text-center">Đánh giá</th>
                <th className="px-6 py-4 font-semibold text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredEmployees.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Không tìm thấy nhân viên nào.</td></tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className={`w-10 h-10 rounded-xl text-white font-bold ${emp.role === 'Pha chế' ? 'bg-amber-500' : emp.role === 'Thu ngân' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                            <span>{emp.avatar}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-base">{emp.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{emp.role} • {emp.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center font-bold text-slate-700">
                      {emp.orders.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-400">đơn</span>
                    </td>
                    
                    <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                      {emp.revenue > 0 ? formatVND(emp.revenue) : <span className="text-slate-300">-</span>}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        parseInt(emp.avgTime) < 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <Clock size={14} /> {emp.avgTime}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-bold ${emp.rating >= 4.8 ? 'text-amber-500' : emp.rating >= 4.5 ? 'text-blue-500' : 'text-slate-600'}`}>
                          {emp.rating} <span className="text-xs font-normal text-slate-400">/ 5</span>
                        </span>
                        <div className="flex text-amber-400 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < Math.floor(emp.rating) ? "currentColor" : "none"} className={i < Math.floor(emp.rating) ? "" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className={`badge border-none text-xs px-3 py-2 ${
                        emp.status === 'Đang làm việc' ? 'bg-emerald-100 text-emerald-700' : 
                        emp.status === 'Nghỉ phép' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}