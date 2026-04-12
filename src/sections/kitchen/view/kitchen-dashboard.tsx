"use client";

import React, { useState, useEffect } from "react";
import { Clock, ChefHat, CheckCircle2, Flame, AlertCircle, Timer, UtensilsCrossed, BellRing } from "lucide-react";
import Image from "next/image";

// ================= INTERFACES =================
export type KitchenOrderStatus = "pending" | "processing";

export interface IKitchenOrderItem {
  id: string; 
  productName: string; 
  quantity: number; 
  options?: string[]; 
  note?: string; 
}

export interface IKitchenOrder {
  id: string; 
  code: string; 
  tableName: string; 
  createdAt: Date; 
  status: KitchenOrderStatus; 
  items: IKitchenOrderItem[]; 
}

// ================= MOCK DATA =================
const MOCK_ORDERS: IKitchenOrder[] = [
  {
    id: "ord-1", code: "ORD001", tableName: "Bàn T1-02",
    createdAt: new Date(Date.now() - 25 * 60000), // 25 phút -> Báo đỏ
    status: "processing",
    items: [
      { id: "i1", productName: "Bò bít tết sốt tiêu đen", quantity: 2, options: ["Chín vừa (Medium)"] },
      { id: "i2", productName: "Salad cá ngừ", quantity: 1, note: "Không lấy hành tây" },
    ],
  },
  {
    id: "ord-2", code: "ORD002", tableName: "Mang đi (Takeaway)",
    createdAt: new Date(Date.now() - 10 * 60000), // 10 phút
    status: "pending",
    items: [
      { id: "i3", productName: "Pizza Hải sản", quantity: 1, options: ["Đế mỏng", "Thêm phô mai"] },
    ],
  },
  {
    id: "ord-3", code: "ORD003", tableName: "VIP 1",
    createdAt: new Date(Date.now() - 5 * 60000), // 5 phút
    status: "pending",
    items: [
      { id: "i4", productName: "Lẩu Thái Tomyum", quantity: 1, options: ["Nhiều cay"] },
      { id: "i5", productName: "Nước ép dưa hấu", quantity: 3, options: ["Ít đường", "Không đá"] },
    ],
  },
  {
    id: "ord-4", code: "ORD004", tableName: "Bàn T1-05",
    createdAt: new Date(Date.now() - 2 * 60000), // 2 phút
    status: "pending",
    items: [
      { id: "i6", productName: "Gà rán mắm tỏi", quantity: 1 },
      { id: "i7", productName: "Khoai tây chiên", quantity: 2 },
    ],
  },
];

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<IKitchenOrder[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Sắp xếp đơn cũ lên đầu (FIFO)
    const sortedOrders = [...MOCK_ORDERS].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    setOrders(sortedOrders);

    // Cập nhật currentTime mỗi 1 giây (1000ms) thay vì 1 phút
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Dọn dẹp timer khi component unmount
    return () => clearInterval(timer);
  }, []);

  const handleStartCooking = (orderId: string) => {
    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: "processing" } : order));
  };

  const handleFinishCooking = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const getElapsedMinutes = (createdAt: Date) => {
    return Math.floor((currentTime.getTime() - createdAt.getTime()) / 60000);
  };

  // ================= RENDER MỘT PHIẾU (TICKET) =================
  const renderTicket = (order: IKitchenOrder) => {
    const elapsedMins = getElapsedMinutes(order.createdAt);
    const isUrgent = elapsedMins >= 20; 
    const isProcessing = order.status === "processing";

    // Cấu hình giao diện thẻ theo trạng thái (Color-coding)
    const styleConfig = {
      pending: {
        wrapper: "border-gray-200 hover:border-blue-300 hover:shadow-blue-500/10",
        header: "bg-white border-b border-gray-100",
        title: "text-[#000000]",
        badge: "bg-gray-100 text-[#000000]", // Chỉnh lại chút bg-gray cho chuẩn class Tailwind
        timer: "bg-gray-50 text-[#000000] border border-gray-100",
        button: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30", // Fix lỗi bg-darkgrey
        btnIcon: <Flame size={20} className="animate-pulse" />,
        btnText: "BẮT ĐẦU NẤU"
      },
      processing: {
        wrapper: "border ring-4 ring-orange-500/10",
        header: "bg-gradient-to-br from-orange-400 to-orange-500 text-[#000000]",
        title: "text-[#000000]",
        badge: "bg-white/20 text-[#000000]",
        timer: "bg-black/20 text-[#000000]",
        button: "bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-emerald-500/50", // Fix lỗi bg-darkgrey
        btnIcon: <CheckCircle2 size={20} />,
        btnText: "HOÀN TẤT"
      },
      urgent: {
        wrapper: "border-red-300 ring-4 ring-red-500/20 shadow-red-500/20 transform -translate-y-1",
        header: "bg-gradient-to-br from-red-500 to-red-600 text-white relative overflow-hidden",
        title: "text-white",
        badge: "bg-white/20 text-white",
        timer: "bg-red-900/40 text-white animate-pulse border border-red-400/50",
        button: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/40 hover:shadow-red-600/60",
        btnIcon: <Flame size={20} />,
        btnText: "LÀM GẤP!"
      }
    };

    // Xác định trạng thái hiện tại
    const currentState = isUrgent && !isProcessing ? "urgent" : isProcessing ? "processing" : "pending";
    const theme = styleConfig[currentState];

    return (
      <div key={order.id} className={`bg-white rounded-[24px] shadow-sm flex flex-col h-[450px] overflow-hidden transition-all duration-300 border ${theme.wrapper}`}>
        
        {/* HEADER PHIẾU */}
        <div className={`p-5 flex flex-col gap-3 shrink-0 transition-colors ${theme.header}`}>
          {/* Hiệu ứng sọc cảnh báo nếu gấp */}
          {currentState === "urgent" && (
            <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]"></div>
          )}
          
          <div className="flex justify-between items-start relative z-10">
            <h3 className={`font-black text-xl flex items-center gap-2 leading-none tracking-tight ${theme.title}`}>
              {order.tableName}
            </h3>
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${theme.badge}`}>
              #{order.code}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1 relative z-10">
            <span className={`text-sm font-semibold flex items-center gap-1.5 opacity-90 ${theme.title}`}>
              <Clock size={15} /> {order.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className={`text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${theme.timer}`}>
              {currentState === "urgent" ? <BellRing size={15} /> : <Timer size={15} />}
              {elapsedMins} phút
            </span>
          </div>
        </div>

        {/* THÂN PHIẾU (DANH SÁCH MÓN) */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 relative">
          <div className="flex flex-col gap-4">
            {order.items.map((item, index) => (
              <div key={item.id} className="relative flex gap-4 items-start">
                {/* Đường nét đứt nối các món */}
                {index !== order.items.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-[-20px] w-[2px] border-l-2 border-dashed border-gray-200"></div>
                )}
                
                <div className={`w-9 h-9 rounded-xl font-black text-lg flex items-center justify-center shrink-0 shadow-sm z-10 ${isProcessing ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-700 border border-gray-200'}`}>
                  {item.quantity}
                </div>
                
                <div className="flex-1 pb-4">
                  <p className="font-bold text-gray-900 text-[17px] leading-tight">{item.productName}</p>
                  
                  {item.options && item.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.options.map((opt, i) => (
                        <span key={i} className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200/60">
                          + {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {item.note && (
                    <p className="text-sm text-red-600 font-bold flex items-center gap-1.5 mt-2 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 w-fit">
                      <AlertCircle size={14} /> {item.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NÚT THAO TÁC DƯỚI CÙNG */}
        <div className="p-4 bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-10 border-t border-gray-50">
          <button 
            onClick={() => isProcessing ? handleFinishCooking(order.id) : handleStartCooking(order.id)}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 ${theme.button}`}
          >
            {theme.btnIcon} {theme.btnText}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] p-4 sm:p-6 lg:p-8 flex flex-col h-screen overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      
      {/* HEADER TỔNG - GLASSMORPHISM */}
      <div className="flex justify-between items-center mb-8 shrink-0 bg-white/80 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] shadow-sm border border-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 flex items-center justify-center">
            <Image
                src="https://baso.id.vn/basoblack.png"
                alt="Logo"
                width={120}
                height={40}
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Bếp</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-extrabold text-orange-700 bg-orange-100 px-3 py-1 rounded-lg border border-orange-200">
                Đang nấu: {orders.filter(o => o.status === "processing").length}
              </span>
              <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                Chờ chế biến: {orders.filter(o => o.status === "pending").length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right hidden sm:block bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-50">
          <div className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
            {/* THÊM HIỂN THỊ GIÂY TẠI ĐÂY */}
            {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-xs font-extrabold text-gray-400 mt-0.5 uppercase tracking-widest">
            {currentTime.toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {/* DANH SÁCH ORDER (TICKET GRID) */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
        {orders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-in fade-in duration-500">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ChefHat size={64} className="opacity-40" />
            </div>
            <h2 className="text-3xl font-black text-gray-600">Bếp đang rảnh rỗi</h2>
            <p className="font-medium mt-3 text-lg">Bạn có thể tranh thủ dọn dẹp hoặc uống ly nước nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {orders.map(renderTicket)}
          </div>
        )}
      </div>
    </div>
  );
}