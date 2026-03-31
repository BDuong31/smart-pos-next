"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  PackageSearch, Calendar, AlertTriangle, Coffee, PlusCircle, ChevronRight, 
  TrendingUp, Activity, CheckCircle2, ShoppingCart, Box
} from "lucide-react";
import { SplashScreen } from "@/components/loading";
import { getForecasts } from "@/apis/ai";

// ==========================================
// MOCK DATA GENERATOR (Dữ liệu phong phú & thực tế hơn)
// ==========================================
const generateMockData = (mode: "day" | "week" | "month") => {
  const days = mode === "day" ? 1 : mode === "week" ? 7 : 30;
  const productChartData = [];
  const optionChartData = [];
  const today = new Date('2026-03-31T00:00:00');
  
  // 1. Sinh dữ liệu 7 ngày lịch sử
  for (let i = 7; i > 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    productChartData.push({ date: dateStr, actual: Math.floor(Math.random() * 80) + 120, forecast: null });
    optionChartData.push({ date: dateStr, actual: Math.floor(Math.random() * 40) + 50, forecast: null });
  }

  // 2. Sinh dữ liệu tương lai
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    productChartData.push({ date: dateStr, actual: null, forecast: Math.floor(Math.random() * 70) + 140 + (i * 2) });
    optionChartData.push({ date: dateStr, actual: null, forecast: Math.floor(Math.random() * 35) + 60 + (i * 1.5) });
  }

  // 3. Mapping nguyên liệu tổng hợp (Data đa dạng)
  const m = mode === "day" ? 1 : mode === "week" ? 7 : 30;
  const rawIngredients = [
    { id: "ing-1", name: "Cà phê hạt Robusta", category: "Pha chế", unit: "kg", demand: 2.5 * m, stock: 12, safety: 5, mappedFrom: "Product" },
    { id: "ing-2", name: "Sữa tươi thanh trùng", category: "Pha chế", unit: "lít", demand: 15 * m, stock: 20, safety: 15, mappedFrom: "Product & Option" },
    { id: "ing-3", name: "Trân châu đen", category: "Topping", unit: "kg", demand: 4.5 * m, stock: 3, safety: 5, mappedFrom: "Option" },
    { id: "ing-4", name: "Trân châu trắng", category: "Topping", unit: "kg", demand: 3.0 * m, stock: 8, safety: 4, mappedFrom: "Option" },
    { id: "ing-5", name: "Đào ngâm", category: "Topping", unit: "hộp", demand: 2.5 * m, stock: 5, safety: 4, mappedFrom: "Option" },
    { id: "ing-6", name: "Đường nước", category: "Pha chế", unit: "can", demand: 1.2 * m, stock: 1, safety: 2, mappedFrom: "Product" },
    { id: "ing-7", name: "Trà Ô long", category: "Pha chế", unit: "kg", demand: 1.8 * m, stock: 6, safety: 3, mappedFrom: "Product" },
    { id: "ing-8", name: "Trà Lài", category: "Pha chế", unit: "kg", demand: 2.0 * m, stock: 4, safety: 3, mappedFrom: "Product" },
    { id: "ing-9", name: "Syrup Vanilla", category: "Pha chế", unit: "chai", demand: 0.5 * m, stock: 3, safety: 2, mappedFrom: "Option" },
    { id: "ing-10", name: "Bột Matcha", category: "Pha chế", unit: "kg", demand: 1.0 * m, stock: 0.5, safety: 1, mappedFrom: "Product" },
    { id: "ing-11", name: "Ly nhựa 500ml", category: "Vật dụng", unit: "cái", demand: 150 * m, stock: 400, safety: 500, mappedFrom: "Product" },
    { id: "ing-12", name: "Ống hút trân châu", category: "Vật dụng", unit: "cái", demand: 120 * m, stock: 1000, safety: 300, mappedFrom: "Option" },
  ];

  const ingredients = rawIngredients.map(ing => {
    let toOrder = (ing.demand + ing.safety) - ing.stock;
    return { ...ing, toOrder: Math.max(0, Number(toOrder.toFixed(1))) };
  });

  return { productChartData, optionChartData, ingredients };
};

// ==========================================
// THÀNH PHẦN UI NHỎ (Tiện ích)
// ==========================================
const KPICard = ({ title, value, icon: Icon, subtext, colorClass }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
export default function InventoryForecastDashboard() {
  const [mode, setMode] = useState<"day" | "week" | "month">("week");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ productChartData: [] as any[], optionChartData: [] as any[], ingredients: [] as any[] });
  const [forecasts, Setforecasts] = useState<any[]>([]);

  const fetcherForecasts = async (id: string) => {
    try {
        const response = await getForecasts(mode);
        Setforecasts(response?.data || []);
        console.log(response);
    } catch (error) {
        console.error("Error fetching forecasts:", error);
    }
  }

  useEffect(() => {
    fetcherForecasts(mode);
  }, [mode])

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(generateMockData(mode));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [mode]);

  // Derived states cho KPIs
  const alertCount = useMemo(() => data.ingredients.filter(i => i.toOrder > 0).length, [data.ingredients]);
  const safeCount = data.ingredients.length - alertCount;
  const totalDemandUnits = useMemo(() => data.ingredients.reduce((acc, curr) => acc + curr.demand, 0), [data.ingredients]);
  
  if (loading) {
    return <SplashScreen className="h-[100vh]"/>
  }
  
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 font-sans">
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Kế hoạch Nhập hàng AI
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dự báo bán ra và quy đổi nhu cầu nguyên liệu tự động.
          </p>
        </div>
        
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
          {(["day", "week", "month"] as const).map((m) => (
            <button 
              key={m}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === m ? "bg-darkgrey text-white shadow-md" : "text-slate-500 hover:text-white hover:bg-graymain"
              }`}
              onClick={() => setMode(m)}
            >
              {m === "day" ? "1 Ngày" : m === "week" ? "7 Ngày" : "30 Ngày"} tới
            </button>
          ))}
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Nguyên liệu cần nhập" 
          value={`${alertCount} loại`} 
          subtext="Dưới mức an toàn"
          icon={AlertTriangle} 
          colorClass={alertCount > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} 
        />
        <KPICard 
          title="Đủ điều kiện xuất kho" 
          value={`${safeCount} loại`} 
          subtext="Tồn kho đảm bảo"
          icon={CheckCircle2} 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <KPICard 
          title="Tổng lượng tiêu thụ dự kiến" 
          value={Math.round(totalDemandUnits).toLocaleString('vi-VN')} 
          subtext="Đơn vị tính quy đổi"
          icon={Activity} 
          colorClass="bg-blue-100 text-blue-600" 
        />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Coffee size={20} /></div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Xu hướng Món Chính</h2>
              <p className="text-xs text-slate-400">Products & Variants</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.productChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                <Area type="monotone" dataKey="actual" name="Đã bán" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="forecast" name="AI Dự báo" stroke="#f59e0b" strokeWidth={3} fill="url(#colorProd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART: OPTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><PlusCircle size={20} /></div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Xu hướng Topping</h2>
              <p className="text-xs text-slate-400">Options gọi thêm</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.optionChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                <Area type="monotone" dataKey="actual" name="Đã bán" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="forecast" name="AI Dự báo" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorOpt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. TABLE SECTION WITH PROGRESS BARS */}
      <div className="bg-white rounded-2xl shadow-sm mt-2 h-[500px]">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Box className="text-slate-400" size={20} />
              Chi tiết Đề xuất Nhập kho
            </h2>
          </div>
          <button className="btn bg-darkgrey text-white rounded-xl px-6 border-none flex items-center gap-2">
            <ShoppingCart size={18} />
            Tạo Phiếu Nhập ({alertCount})
          </button>
        </div>

        <div className="relative overflow-y-auto h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center"></div>
          )}
          <table className="table w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Nguyên liệu</th>
                <th className="px-6 py-4 font-semibold text-center">Nhu cầu & Mức an toàn</th>
                <th className="px-6 py-4 font-semibold text-left">Trạng thái Tồn kho</th>
                <th className="px-6 py-4 font-semibold text-right rounded-tr-2xl">Đề xuất AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.ingredients.map((row) => {
                const totalNeeded = row.demand + row.safety;
                const stockPercent = Math.min((row.stock / totalNeeded) * 100, 100);
                const isCritical = row.toOrder > 0;

                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-base">{row.name}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                          {row.category}
                        </span>
                        <span className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded-md">
                          Từ: {row.mappedFrom}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-slate-800 font-bold">{row.demand.toFixed(1)} <span className="text-xs font-normal text-slate-500">{row.unit}</span></span>
                        <span className="text-xs text-slate-400">An toàn: {row.safety} {row.unit}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 w-64">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Có sẵn: {row.stock}</span>
                        <span className="text-slate-500">Cần: {totalNeeded.toFixed(1)}</span>
                      </div>
                      {/* Custom Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${stockPercent}%` }}
                        ></div>
                      </div>
                      {isCritical && (
                        <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                          <AlertTriangle size={10} /> Thiếu {(totalNeeded - row.stock).toFixed(1)} {row.unit}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {isCritical ? (
                        <div className="inline-flex flex-col items-end">
                          <span className="font-extrabold text-xl text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                            +{row.toOrder} <span className="text-sm font-medium">{row.unit}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 size={16} /> Đủ dùng
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

