"use client";

import React, { useState, useEffect } from "react";
import { Clock, ChefHat, CheckCircle2, Flame, AlertCircle, Timer, BellRing, Sparkles } from "lucide-react";
import Image from "next/image";
import { getOrderItemOptions, getOrderItems, getOrders, getOrderTables, updateOrder } from "@/apis/order";
import { getTableById } from "@/apis/table";
import { IOrderDetail, IOrderItemDetail, IOrderItemOptionDetail, IOrderTableDetail } from "@/interfaces/order";
import { useSocket } from "@/context/socket-context";
import { useToast } from "@/context/toast-context";
import { SplashScreen } from "@/components/loading";
import { useSelector } from "react-redux";

// ================= TYPES =================
// Thêm trạng thái 'new' cho các đơn vừa đẩy vào
export type KitchenOrderStatus = "confirmed" | "processing" | "urgent";

export interface IKitchenOrder {
    id: string;
    code: string;
    tableName: string;
    createdAt: Date; // Đây là thời điểm đơn hàng được đẩy vào hệ thống
    status: KitchenOrderStatus;
    items: {
        id: string;
        productName: string;
        quantity: number;
        options?: string[];
        note?: string;
    }[];
}

export default function KitchenDashboard() {
    const user = useSelector((state: RootState) => state.user.user);
    const { socket, isConnected } = useSocket();
    const { showToast } = useToast();
    const [orders, setOrders] = useState<IKitchenOrder[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const fetcheOrder = async (): Promise<IOrderDetail[] | []> => {
        try {
            const response = await getOrders({status: "confirmed"}, 1, 100);
            if (response) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
        return []
    }

    const fetcheOrderItem = async (orderId: string): Promise<IOrderItemDetail[] | []> => {
        try {
            const response = await getOrderItems({orderId}, 1, 100);
            if (response) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching order items:', error);
        }
        return []
    }

    const fetcheOrderItemOptions = async (orderItemId: string): Promise<IOrderItemOptionDetail[] | []> => {
        try {
            const response = await getOrderItemOptions({orderItemId}, 1, 100);
            if (response) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching order item options:', error);
        }
        return []
    }

    const fetcheOrderTable = async (orderId: string): Promise<IOrderTableDetail[] | []> => {
        try {
            const response = await getOrderTables({orderId}, 1, 100);
            if (response) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching table:', error);
        }
        return []
    }

    const fetchFullOrderData = async () => {
        loading && setLoading(true);
        try {
            const orders = await fetcheOrder();
            
            const fullOrders = await Promise.all(orders.map(async (order) => {
                const [tables, items] = await Promise.all([
                    fetcheOrderTable(order.id),
                    fetcheOrderItem(order.id)
                ]);

                const tableName = tables.length > 0 ? tables[0].table.name : "Mang về";
                // 3. Trong mỗi món, lấy thêm Options (Topping, Size...)
                const mappedItems = await Promise.all(items.map(async (item) => {
                    const optionsData = await fetcheOrderItemOptions(item.id);
                    
                    return {
                        id: item.id,
                        productName: item.productName,
                        quantity: item.quantity,
                        options: optionsData.map(opt => opt.optionName), 
                        note: "" 
                    };
                }));

                return {
                    id: order.id,
                    code: order.code,
                    tableName: tableName,
                    createdAt: new Date(order.createdAt),
                    status: order.status as KitchenOrderStatus,
                    items: mappedItems
                };
            }));

            return fullOrders;
        } catch (error) {
            console.error("Lỗi tổng hợp dữ liệu:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchFullOrderData();
            setOrders(data);
            console.log("Dữ liệu đầy đủ của các bàn:", data);
        };

        loadData();


        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // CHỈ đăng ký khi socket đã báo isConnected = true
        if (!socket || !isConnected) return;

        const handleOrder = async (newOrder: any) => {
            // setOrders((prev) => [newOrder, ...prev]);
            console.log("Đơn hàng mới nhận từ Socket:", newOrder);
            await new Promise(resolve => setTimeout(resolve, 1500));
            const [tables, items] = await Promise.all([
                    fetcheOrderTable(newOrder.id),
                    fetcheOrderItem(newOrder.id)
            ]);

            const tableName = tables.length > 0 ? tables[0].table.name : "Mang về";
                // 3. Trong mỗi món, lấy thêm Options (Topping, Size...)
            const mappedItems = await Promise.all(items.map(async (item) => {
                const optionsData = await fetcheOrderItemOptions(item.id);
                    
                return {
                    id: item.id,
                    productName: item.productName,
                    quantity: item.quantity,
                    options: optionsData.map(opt => opt.optionName), 
                    note: "" 
                };
            }));

            const fullOrder: IKitchenOrder = {
                id: newOrder.id,
                code: newOrder.code,
                tableName: tableName,
                createdAt: new Date(newOrder.createdAt),
                status: "confirmed",
                items: mappedItems
            };
            setOrders((prev) => [fullOrder, ...prev]);
            showToast("Đơn hàng mới đã được đặt!", "success");
        };

        socket.on('order:confirmed', handleOrder);

        return () => {
            socket.off('order:confirmed', handleOrder);
        };
    }, [isConnected]); // Chạy lại mỗi khi isConnected thay đổi

    const handleAction = async (orderId: string, currentStatus: KitchenOrderStatus) => {
        if (currentStatus === "confirmed" || currentStatus === "urgent") {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "processing" } : o));
            await updateOrder(orderId, { status: "processing" })
        } else {
            await updateOrder(orderId, { status: "served" })
            setOrders(prev => prev.filter(o => o.id !== orderId));
        }
    };

    // LOGIC: Đếm từ 00:00 dựa trên createdAt
    const formatStopwatch = (createdAt: Date) => {
        const diffMs = currentTime.getTime() - createdAt.getTime();
        const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const renderTicket = (order: IKitchenOrder) => {
        const diffMs = currentTime.getTime() - order.createdAt.getTime();
        const elapsedMins = Math.floor(diffMs / 60000);
        
        // Cấu hình ngưỡng cảnh báo
        const isUrgent = elapsedMins >= 20;
        const isProcessing = order.status === "processing";
        const isNew = order.status === "confirmed";

        const styleConfig = {
            confirmed: {
                wrapper: "border-[#D1D5DB] border shadow-sm",
                header: "bg-white border-b border-[#E5E7EB]",
                title: "text-[#4B5563]",
                badge: "bg-[#F3F4F6] text-[#111827]",
                timer: "bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB]",
                button: "bg-[#4B5563] hover:bg-[#374151] text-white",
                btnIcon: <Flame size={20} />,
                btnText: "BẮT ĐẦU NẤU"
            },
            processing: {
                wrapper: "border-[#F97316] ring-4 ring-[#F97316]/10 shadow-lg",
                header: "bg-gradient-to-br from-[#FB923C] to-[#F97316] text-white",
                title: "text-white",
                badge: "bg-white/20 text-white",
                timer: "bg-black/20 text-white",
                button: "bg-[#10B981] hover:bg-[#059669] text-white",
                btnIcon: <CheckCircle2 size={20} />,
                btnText: "HOÀN TẤT"
            },
            urgent: {
                wrapper: "border-[#EF4444] ring-4 ring-[#EF4444]/20 animate-pulse-slow",
                header: "bg-[#EF4444] text-white",
                title: "text-white",
                badge: "bg-white/20 text-white",
                timer: "bg-[#7F1D1D]/40 text-white border border-[#F87171]/50",
                button: "bg-[#EF4444] hover:bg-[#DC2626] text-white",
                btnIcon: <BellRing size={20} className="animate-bounce" />,
                btnText: "LÀM GẤP!"
            }
        };

        // Ưu tiên hiển thị trạng thái
        let currentState: KitchenOrderStatus = order.status;
        if (isUrgent && !isProcessing) currentState = 'urgent';
        
        const theme = styleConfig[currentState];

        return (
            <div key={order.id} className={`bg-white rounded-[24px] flex flex-col h-full overflow-hidden transition-all duration-500 border ${theme.wrapper}`}>
                {/* HEADER PHIẾU */}
                <div className={`p-5 flex flex-col gap-3 shrink-0 relative ${theme.header}`}>
                    <div className="flex justify-between items-start relative z-10">
                        <h3 className={`font-black text-xl flex items-center gap-2 leading-none tracking-tight ${theme.title}`}>
                            {order.tableName}
                            {isNew && <span className="w-2 h-2 bg-white rounded-full animate-ping" />}
                        </h3>
                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${theme.badge}`}>
                            #{order.code}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mt-1 relative z-10">
                        <span className={`text-sm font-semibold flex items-center gap-1.5 opacity-90 ${theme.title}`}>
                            <Clock size={15} /> {order.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-sm font-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl tabular-nums ${theme.timer}`}>
                            <Timer size={15} className={isProcessing ? "animate-spin-slow" : ""} />
                            {formatStopwatch(order.createdAt)}
                        </span>
                    </div>
                </div>

                {/* THÂN PHIẾU */}
                <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30">
                    <div className="flex flex-col gap-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <div className={`w-9 h-9 rounded-xl font-black text-lg flex items-center justify-center shrink-0 shadow-sm ${isProcessing ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-700 border border-gray-200'}`}>
                                    {item.quantity}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-[17px] leading-tight uppercase truncate">{item.productName}</p>
                                    {item.options?.map((opt, i) => (
                                        <span key={i} className="text-xs font-semibold text-gray-400 block mt-0.5">+ {opt}</span>
                                    ))}
                                    {item.note && (
                                        <p className="text-[13px] text-red-600 font-bold flex items-center gap-1.5 mt-2 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                                            <AlertCircle size={14} /> {item.note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NÚT THAO TÁC */}
                <div className="p-4 bg-white shrink-0 border-t border-gray-50">
                    <button 
                        onClick={() => handleAction(order.id, order.status)}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex justify-center items-center gap-2 shadow-lg ${theme.button}`}
                    >
                        {theme.btnIcon} {theme.btnText}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen w-screen bg-[#F4F6F8] p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
            
            {/* HEADER TỔNG */}
            <header className="h-[10%] flex justify-between items-center mb-6 shrink-0 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-16 flex items-center justify-center relative bg-black rounded-2xl p-2">
                        <Image src="https://baso.id.vn/basoblack.png" alt="Logo" width={100} height={40} priority />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none"> {user?.fullName || ''}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1.5 text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200 uppercase">
                                <Sparkles size={12}/> Mới: {orders.filter(o => o.status === "confirmed").length}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200 uppercase">
                                <Flame size={12}/> Đang nấu: {orders.filter(o => o.status === "processing").length}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">
                        {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">
                        {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
                    </div>
                </div>
            </header>

            {/* VÙNG HIỂN THỊ 2 HÀNG CUỘN NGANG */}
            {loading ? (
                <SplashScreen />
            ) : (
            <main className="h-[88%] w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
                <div className="grid grid-rows-2 grid-flow-col gap-6 h-full pb-4" 
                     style={{ gridAutoColumns: 'minmax(360px, 1fr)' }}>
                    {orders.length === 0 ? (
                        <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-300">
                            <ChefHat size={100} strokeWidth={1} className="mb-4 opacity-20" />
                            <h2 className="text-xl font-bold uppercase tracking-widest opacity-50">Sẵn sàng nhận đơn</h2>
                        </div>
                    ) : (
                        orders.map(renderTicket)
                    )}
                </div>
            </main>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #E5E7EB; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #94A3B8; border-radius: 10px; }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
            `}</style>
        </div>
    );
}