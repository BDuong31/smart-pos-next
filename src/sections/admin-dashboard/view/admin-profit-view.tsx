"use client";

import React, { useState, useEffect } from "react";
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon, 
  ArrowUpRight, ArrowDownRight, Download, Activity, Receipt
} from "lucide-react";

// ==========================================
// 1. MOCK DATA TÀI CHÍNH (Doanh thu & Chi phí)
// ==========================================
const generateProfitData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    const revenue = Math.floor(Math.random() * 5000000) + 3000000; // 3tr - 8tr
    // Giả lập F&B: Giá vốn (COGS) chiếm ~30%, Chi phí vận hành chiếm ~40%
    const cogs = revenue * (Math.random() * 0.1 + 0.25); 
    const opex = revenue * (Math.random() * 0.1 + 0.35);
    const totalCost = cogs + opex;
    const netProfit = revenue - totalCost;

    data.push({
      date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      revenue: Math.round(revenue),
      cost: Math.round(totalCost),
      profit: Math.round(netProfit),
    });
  }
  return data;
};

// Cơ cấu chi phí (Cost Breakdown)
const costBreakdownData = [
  { name: 'Giá vốn nguyên liệu (COGS)', value: 45000000, color: '#F43F5E' }, // Rose
  { name: 'Lương nhân viên', value: 30000000, color: '#F59E0B' }, // Amber
  { name: 'Mặt bằng & Điện nước', value: 20000000, color: '#8B5CF6' }, // Purple
  { name: 'Marketing & Khuyến mãi', value: 10000000, color: '#06B6D4' }, // Cyan
  { name: 'Khấu hao & Khác', value: 5000000, color: '#94A3B8' }, // Slate
];

// Bảng phân tích Tỷ suất lợi nhuận theo danh mục/món (Profit Margin)
const profitabilityData = [
  { id: 1, name: "Cà phê đen đá", category: "Cà phê", price: 25000, cogs: 5000, sold: 1200 },
  { id: 2, name: "Trà sữa Ô long nướng", category: "Trà sữa", price: 45000, cogs: 18000, sold: 850 },
  { id: 3, name: "Trà đào cam sả", category: "Trà trái cây", price: 40000, cogs: 12000, sold: 950 },
  { id: 4, name: "Bánh Croissant", category: "Bánh ngọt", price: 35000, cogs: 20000, sold: 400 },
  { id: 5, name: "Nước suối Dasani", category: "Đồ uống đóng chai", price: 15000, cogs: 10000, sold: 300 },
].map(item => {
  const profitPerItem = item.price - item.cogs;
  const margin = (profitPerItem / item.price) * 100;
  const totalProfit = profitPerItem * item.sold;
  return { ...item, profitPerItem, margin, totalProfit };
}).sort((a, b) => b.totalProfit - a.totalProfit);

// Định dạng tiền tệ VNĐ
const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

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
export default function ProfitView() {
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setChartData(generateProfitData(Number(timeRange)));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  // Tính toán chỉ số tổng
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = chartData.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = chartData.reduce((sum, item) => sum + item.profit, 0);
  const netMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 font-sans">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Wallet className="text-indigo-600" /> Phân tích Lợi nhuận
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Theo dõi sức khỏe tài chính: Doanh thu, Chi phí và Biên lợi nhuận ròng.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            {(["7", "30", "90"] as const).map((days) => (
              <button 
                key={days}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  timeRange === days ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
                onClick={() => setTimeRange(days)}
              >
                {days} Ngày
              </button>
            ))}
          </div>
          <button className="btn bg-white border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl shadow-sm">
            <Download size={18} /> Xuất P&L
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Tổng Doanh Thu" value={formatVND(totalRevenue)} 
          icon={TrendingUp} trend="up" trendValue="15.2" 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <KPICard 
          title="Tổng Chi Phí" value={formatVND(totalCost)} 
          subtext="Bao gồm COGS & Chi phí vận hành"
          icon={Receipt} trend="up" trendValue="5.4" // Chi phí tăng là xấu (nhưng tuỳ góc nhìn, ở đây cứ để up màu đỏ)
          colorClass="bg-rose-100 text-rose-600" 
        />
        <KPICard 
          title="Lợi Nhuận Ròng (Net Profit)" value={formatVND(totalProfit)} 
          icon={DollarSign} trend="up" trendValue="22.5" 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <KPICard 
          title="Biên Lợi Nhuận (Net Margin)" value={`${netMargin.toFixed(1)}%`} 
          subtext="Tiêu chuẩn F&B: 15% - 25%"
          icon={Activity} trend="up" trendValue="2.1" 
          colorClass="bg-indigo-100 text-indigo-600" 
        />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
            <span className="loading loading-spinner text-indigo-600"></span>
          </div>
        )}
        
        {/* CHART 1: BIỂU ĐỒ KẾT HỢP DOANH THU - CHI PHÍ - LỢI NHUẬN */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Tương quan Doanh thu & Chi phí</h2>
              <p className="text-xs text-slate-400">Xu hướng dòng tiền trong {timeRange} ngày qua</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Sử dụng ComposedChart để kết hợp Cột (Bar) và Đường (Line) */}
              <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `${val / 1000000}M`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  formatter={(value: number) => formatVND(value)}
                  labelStyle={{ color: '#334155', fontWeight: 'bold' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                
                {/* Cột Doanh Thu & Chi Phí */}
                <Bar dataKey="revenue" name="Doanh thu" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="cost" name="Chi phí" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                
                {/* Đường Lợi Nhuận */}
                <Line type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: CƠ CẤU CHI PHÍ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PieChartIcon className="text-rose-500" size={20}/> Cơ cấu Chi phí
            </h2>
            <p className="text-xs text-slate-400">Tỷ trọng các dòng chi phí chính</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={5} dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
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
          <div className="grid grid-cols-1 gap-2 mt-2">
            {costBreakdownData.map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-slate-600 font-medium">{cat.name}</span>
                </div>
                <span className="text-slate-800 font-semibold">{((cat.value / 110000000) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DATA TABLE: PHÂN TÍCH TỶ SUẤT LỢI NHUẬN SẢN PHẨM */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-h-[500px] overflow-auto mt-2">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-slate-400" size={20} />
              Phân tích Biên lợi nhuận (Margin) theo Sản phẩm
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Đánh giá xem món nào bán chạy nhưng lãi ít, món nào lãi cao để đẩy mạnh Marketing.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                <th className="px-6 py-4 font-semibold text-right">Giá bán</th>
                <th className="px-6 py-4 font-semibold text-right text-rose-600">Giá vốn (COGS)</th>
                <th className="px-6 py-4 font-semibold text-right text-emerald-600">Lãi gộp / Món</th>
                <th className="px-6 py-4 font-semibold text-center">Tỷ suất LN (Margin)</th>
                <th className="px-6 py-4 font-semibold text-right border-l border-slate-100">Tổng Lợi Nhuận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {profitabilityData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-base">{item.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.category} • Đã bán: {item.sold}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-700">
                    {formatVND(item.price)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-rose-500">
                    {formatVND(item.cogs)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    {formatVND(item.profitPerItem)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Thanh Progress Bar thể hiện Margin */}
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-bold ${item.margin >= 60 ? 'text-emerald-600' : item.margin >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {item.margin.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.margin >= 60 ? 'bg-emerald-500' : item.margin >= 40 ? 'bg-amber-400' : 'bg-rose-500'}`}
                          style={{ width: `${item.margin}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right border-l border-slate-100">
                    <span className="font-black text-slate-800 text-base">
                      {formatVND(item.totalProfit)}
                    </span>
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