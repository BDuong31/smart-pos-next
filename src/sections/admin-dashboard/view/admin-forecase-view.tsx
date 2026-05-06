"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  AlertTriangle, Coffee, PlusCircle, Activity, CheckCircle2, ShoppingCart, Box, TrendingUp, Layers, Droplets, Package
} from "lucide-react";
import { SplashScreen } from "@/components/loading";

// APIS
import { getForecasts } from "@/apis/ai";
import { getInventoryBatchByIds, getInventoryBatchs } from "@/apis/inventory-batch";
import { getListRecipeIds, getRecipes } from "@/apis/recipe";
import { IProductDetails } from "@/interfaces/product";
import { IVariant } from "@/interfaces/variant";
import { getListProductIds } from "@/apis/product";
import { getListVariantIds, getVariantById } from "@/apis/variant";
import { getListOptionItemIds } from "@/apis/option";
import { IOptionItem } from "@/interfaces/option";

// --- LOGIC HELPERS ---

const transformChartData = (items: any[]) => {
  const dateMap: Record<string, number> = {};

  items.forEach((item) => {
    const forecastArray = item.total_forecast || item.forecast || [];
    forecastArray.forEach((f: any) => {
      const dateStr = new Date(f.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      dateMap[dateStr] = (dateMap[dateStr] || 0) + f.quantity;
    });
  });
  return Object.entries(dateMap)
    .map(([date, forecast]) => ({ date, forecast: Number(forecast.toFixed(1)) }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const processGroupedForecast = (apiData: any, allRecipes: any[], inventoryBatches: any[]) => {
  const ingredientSummary = new Map();
  const productGroups: any[] = [];
  const optionGroups: any[] = [];

  const recipeLookup = allRecipes.reduce((acc: any, rec: any) => {
    const key = rec.variantId ? `v-${rec.variantId}` : 
                rec.productId ? `p-${rec.productId}` : 
                `o-${rec.optionItemId}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rec);
    return acc;
  }, {});

  // Tính tồn kho từ lô hàng
  const stockMap: Record<string, number> = {};
  inventoryBatches.forEach(b => {
    stockMap[b.ingredientId] = (stockMap[b.ingredientId] || 0) + (b.quantity || 0);
  });

  // 1. Xử lý nhóm Sản phẩm & Biến thể
  apiData.products?.forEach((prod: any) => {
    const variantsData: any[] = [];
    prod.variants?.forEach((v: any) => {
      const totalVQty = v.forecast.reduce((sum: number, f: any) => sum + f.quantity, 0);
      const vRecipes = recipeLookup[`v-${v.variant_id}`] || recipeLookup[`p-${prod.product_id}`] || [];
      
      const consumed = vRecipes.map((rec: any) => {
        const amountNeeded = rec.amount * totalVQty;
        // Cộng dồn vào danh sách tổng nguyên liệu
        if (!ingredientSummary.has(rec.ingredient.id)) {
            ingredientSummary.set(rec.ingredient.id, { 
                ...rec.ingredient, 
                totalDemand: 0, 
                stock: stockMap[rec.ingredient.id] || 0 
            });
        }
        ingredientSummary.get(rec.ingredient.id).totalDemand += amountNeeded;
        return { name: rec.ingredient.name, amount: amountNeeded, unit: rec.ingredient.unit };
      });

      variantsData.push({ id: v.variant_id, totalQty: totalVQty, consumed });
    });
    productGroups.push({ id: prod.product_id, variants: variantsData });
  });

  // 2. Xử lý nhóm Topping (Options)
  apiData.options?.forEach((opt: any) => {
    const totalOQty = opt.forecast.reduce((sum: number, f: any) => sum + f.quantity, 0);
    const oRecipes = recipeLookup[`o-${opt.option_item_id}`] || [];
    
    const consumed = oRecipes.map((rec: any) => {
      const amountNeeded = rec.amount * totalOQty;
      if (!ingredientSummary.has(rec.ingredient.id)) {
          ingredientSummary.set(rec.ingredient.id, { 
              ...rec.ingredient, 
              totalDemand: 0, 
              stock: stockMap[rec.ingredient.id] || 0 
          });
      }
      ingredientSummary.get(rec.ingredient.id).totalDemand += amountNeeded;
      return { name: rec.ingredient.name, amount: amountNeeded, unit: rec.ingredient.unit };
    });

    optionGroups.push({ id: opt.option_item_id, totalQty: totalOQty, consumed });
  });

  return {
    ingredients: Array.from(ingredientSummary.values()).map((ing: any) => ({
        ...ing,
        toOrder: Math.max(0, (ing.totalDemand + (ing.minStock || 0)) - ing.stock)
    })),
    productGroups,
    optionGroups
  };
};

// --- MAIN COMPONENT ---

export default function InventoryForecastDashboard() {
  const [mode, setMode] = useState<"day" | "week" | "month">("week");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [products, setProducts] = useState<IProductDetails[]>([]);
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [options, setOptions] = useState<IOptionItem[]>([])

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [forecastRes, inventoryRes, recipesRes, productsRes, variantsRes, optionsRes] = await Promise.all([
        getForecasts(mode),
        getInventoryBatchByIds([]),
        getListRecipeIds([]),
        getListProductIds([]),
        getListVariantIds([]),
        getListOptionItemIds([])
      ]);

      setProducts(productsRes?.data || []);
      setVariants(variantsRes?.data || []);
      setOptions(optionsRes || []);

      if (forecastRes?.data) {
        const processed = processGroupedForecast(forecastRes.data, recipesRes?.data || [], inventoryRes?.data || []);
        setData({
          ...processed,
          productChart: transformChartData(forecastRes.data.products || []),
          optionChart: transformChartData(forecastRes.data.options || [])
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, [mode]);

  if (loading || !data) return <SplashScreen className="h-[100vh]" />;

  const alertCount = data.ingredients.filter((i: any) => i.toOrder > 0).length;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Dự báo tiêu thụ và nhập hàng
          </h1>
          <p className="text-slate-500 text-sm">Dự báo tiêu thụ và nhập hàng theo công thức và tồn kho, dự báo sẽ tự động cập nhật theo ngày/tuần/tháng.</p>
        </div>
        
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1 font-bold">
          {["day", "week", "month"].map((m: any) => (
            <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 text-sm rounded-lg transition-all ${mode === m ? "bg-darkgrey text-white shadow-md" : "text-slate-400 hover:bg-gray-100"}`}>
              {m === "day" ? "24 Giờ" : m === "week" ? "7 Ngày" : "30 Ngày"}
            </button>
          ))}
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartBox title="Dự báo Sản phẩm & Biến thể" data={data.productChart} color="#f59e0b" icon={<Coffee size={18}/>} />
        <ChartBox title="Dự báo Topping & Options" data={data.optionChart} color="#8b5cf6" icon={<PlusCircle size={18}/>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        <div className="xl:col-span-3 flex w-full gap-4">
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 w-full lg:w-[65%] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package size={18} className="text-blue-500" /> Phân tích tiêu thụ Sản phẩm
                </h2>
                <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">
                    Dữ liệu trực tiếp
                </span>
            </div>

            {/* Container chính với Scroll tự động mượt mà */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar scroll-smooth">
                {data.productGroups.map((pg: any) => (
                    <div key={pg.id} className="group rounded-2xl border border-slate-50 p-2 last:border-none">
                        {/* Header Tên Sản Phẩm */}
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h3 className="font-black text-slate-800 text-lg">
                                {products?.find((p: any) => p.id === pg.id)?.name || pg.id}
                            </h3>
                            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">
                                {pg.variants.length} Biến thể
                            </span>
                        </div>

                        {/* Danh sách Biến thể hiển thị phẳng */}
                        <div className="grid gap-4 ml-4">
                            {pg.variants.map((v: any) => (
                                <div key={v.id} className="bg-slate-50/50 pr-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Biến thể</p>
                                            <p className="font-bold text-slate-700">
                                                {variants?.find((x: any) => x.id === v.id)?.name || v.id.slice(0, 8)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Dự báo bán</p>
                                            <p className="font-black text-blue-600">{v.totalQty.toFixed(1)} <small className="font-normal text-[10px]">món</small></p>
                                        </div>
                                    </div>

                                    {/* Nguyên liệu tiêu thụ của từng biến thể */}
                                    <div className="flex flex-wrap gap-2 pt-3">
                                        {v.consumed.map((c: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                                <span className="text-[11px] font-medium text-slate-500">{c.name}</span>
                                                <span className="text-[11px] font-black text-slate-900">{c.amount.toFixed(2)}{c.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                {/* Placeholder khi trống */}
                {data.productGroups.length === 0 && (
                    <div className="text-center py-20 opacity-30 font-bold uppercase tracking-widest text-xs">
                        Không có dữ liệu tiêu thụ
                    </div>
                )}
            </div>

            {/* CSS cho Scrollbar đẹp */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f8fafc;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </section>
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Layers size={18} /> Phân tích tiêu thụ Topping
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {data.optionGroups.map((og: any) => (
                <div key={og.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {options?.find((x: IOptionItem) => x.id === og.id)?.name}
                    </span>
                    <span className="badge badge-sm font-bold bg-purple-100 text-purple-700">x{og.totalQty.toFixed(0)}</span>
                  </div>
                  <div className="space-y-1">
                    {og.consumed.map((c: any, i: number) => (
                      <div key={i} className="text-xs flex justify-between">
                        <span className="text-slate-600">{c.name}</span>
                        <span className="font-bold text-purple-600">{c.amount.toFixed(1)} {c.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* TỔNG HỢP NGUYÊN LIỆU CUỐI CÙNG */}
        <div className="xl:col-span-3">
          <div className="bg-darkgrey text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-6">
            <div className="flex items-center gap-3 mb-8">
              <Droplets className="text-blue-400" size={28} />
              <h2 className="text-xl font-black uppercase tracking-tight">Tổng nguyên liệu</h2>
            </div>
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {data.ingredients.map((ing: any) => (
                <div key={ing.id} className="group border-b border-white/10 pb-4 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm group-hover:text-blue-400 transition-colors">{ing.name}</span>
                    <span className="text-xl font-black text-blue-400">{ing.totalDemand.toFixed(1)} <small className="text-[10px] text-white/50">{ing.unit}</small></span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-white/40 mb-2">
                    <span>Tồn: {ing.stock}</span>
                    <span>Thiếu: {ing.toOrder > 0 ? ing.toOrder : 0}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${ing.toOrder > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((ing.stock / (ing.totalDemand + ing.minStock)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-block bg-blue-600 hover:bg-blue-700 border-none text-white mt-10 rounded-2xl font-black h-14 shadow-lg shadow-blue-900/20">
              <ShoppingCart size={20} /> TẠO PHIẾU NHẬP ({alertCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: CHART ---
function ChartBox({ title, data, color, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>{icon}</div>
        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
            <YAxis hide />
            <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="forecast" stroke={color} strokeWidth={3} fill={`url(#grad-${color})`} animationDuration={1200} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}