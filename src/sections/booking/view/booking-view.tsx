"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CalendarDays, Clock, Users, User, Phone, CheckCircle2, Map } from "lucide-react";

// Interfaces
import { IZone } from "@/interfaces/zone";
import { ITable, ITableDetail } from "@/interfaces/table";
import { IReservationCreate } from "@/interfaces/reservation";

// APIs
import { getZones } from "@/apis/zone";
// Nhớ import thêm hàm getTableAvailible của bạn vào đây:
import { getTableAvailible } from "@/apis/table"; 
import { createReservation } from "@/apis/reservation";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

export default function CustomerBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [isFetchingTables, setIsFetchingTables] = useState(false); // Thêm state loading riêng cho Bàn

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "",
    guests: 2,
    customerName: "",
    phone: "",
    note: "",
  });

  const [zones, setZones] = useState<IZone[]>([]);
  // Dùng ITable hoặc ITableDetail tùy theo dữ liệu API trả về
  const [tables, setTables] = useState<ITable[]>([]); 
  const [activeZoneId, setActiveZoneId] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<ITable | null>(null);

  // 1. CHỈ TẢI ZONE KHI MỚI VÀO TRANG
  useEffect(() => {
    const fetchZones = async () => {
      setIsLoadingZones(true);
      try {
        const zonesRes = await getZones({ isActive: true }, 1, 100);
        if (zonesRes?.data) {
          setZones(zonesRes.data);
          if (zonesRes.data.length > 0) setActiveZoneId(zonesRes.data[0].id);
        }
      } catch (error) {
        console.error("Lỗi khi tải khu vực:", error);
      } finally {
        setIsLoadingZones(false);
      }
    };
    fetchZones();
  }, []);

  // 2. TẢI DANH SÁCH BÀN TRỐNG MỖI KHI NGÀY/GIỜ THAY ĐỔI
  useEffect(() => {
    const fetchAvailableTables = async () => {
      // Chỉ gọi API khi khách đã chọn cả ngày và giờ
      if (!formData.date || !formData.time) {
        setTables([]); // Clear bàn nếu chưa chọn giờ
        return; 
      }

      setIsFetchingTables(true);
      setSelectedTable(null); // Reset bàn đã chọn khi đổi giờ

      try {
        // Ghép chuỗi ngày và giờ thành format chuẩn ISO (VD: 2026-04-10T18:00:00)
        const dateTimeString = `${formData.date}T${formData.time}:00`;
        const bookingDateObj = new Date(dateTimeString);

        // Gọi API getTableAvailible
        const availableTables = await getTableAvailible(bookingDateObj);
        
        if (availableTables) {
          setTables(availableTables);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bàn trống:", error);
        alert("Không thể kiểm tra bàn trống lúc này. Vui lòng thử lại!");
      } finally {
        setIsFetchingTables(false);
      }
    };

    fetchAvailableTables();
  }, [formData.date, formData.time]); // Hàm này sẽ chạy lại mỗi khi Date hoặc Time thay đổi

  const tablesInActiveZone = useMemo(() => {
    return tables.filter((t) => t.zoneId === activeZoneId);
  }, [tables, activeZoneId]);

  // ================= HANDLERS =================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (type: "increase" | "decrease") => {
    setFormData((prev) => {
      const newGuests = type === "increase" ? prev.guests + 1 : Math.max(1, prev.guests - 1);
      if (selectedTable && selectedTable.capacity < newGuests) setSelectedTable(null); 
      return { ...prev, guests: newGuests };
    });
  };

  const handleTableSelect = (table: ITable) => {
    // Nếu API chỉ trả về bàn 'available' thì không cần check status nữa, nhưng cứ check sức chứa
    if (table.capacity < formData.guests) return alert(`Bàn này chỉ chứa được tối đa ${table.capacity} người!`);
    setSelectedTable(table);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) return alert("Vui lòng chọn giờ đến!");
    if (!selectedTable) return alert("Vui lòng chọn bàn trên sơ đồ!");
    if (!formData.customerName || !formData.phone) return alert("Vui lòng điền thông tin liên lạc!");

    setIsSubmitting(true);
    try {
      const payload: any = {
        customerName: formData.customerName,
        phone: formData.phone,
        bookingDate: formData.date,
        time: formData.time,
        guests: formData.guests,
        note: formData.note,
        tableId: selectedTable.id,
      };

      await createReservation(payload as IReservationCreate);
      setIsSuccess(true);
    } catch (error) {
      console.error("Lỗi đặt bàn:", error);
      alert("Lỗi hệ thống khi đặt bàn! Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trạng thái style của Bàn
  const getTableStyle = (table: ITable) => {
    const isCapacityValid = table.capacity >= formData.guests;
    if (!isCapacityValid) return "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"; 
    
    return selectedTable?.id === table.id
      ? "bg-orange-500 border-orange-600 text-white shadow-lg ring-2 ring-orange-200 ring-offset-2 transform scale-105"
      : "bg-white border-orange-200 text-gray-700 hover:border-orange-500 hover:shadow-md cursor-pointer";
  };

  // ================= RENDER =================
  if (isLoadingZones) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt bàn thành công!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Cảm ơn <b>{formData.customerName}</b>. Bàn <b className="text-orange-600">{selectedTable?.name}</b> đã được giữ cho bạn vào lúc <b>{formData.time}</b> ngày <b>{formData.date}</b>.
          </p>
          <button onClick={() => window.location.reload()} className="w-full bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đặt Bàn</h1>
          <p className="text-gray-500 mt-1">Vui lòng chọn thời gian, sau đó chọn vị trí bàn yêu thích của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI (Form chọn Ngày/Giờ và Thông tin khách) - Giữ nguyên như cũ */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-orange-500"/> Chi tiết đặt chỗ
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Ngày đến</label>
                  <input type="date" name="date" value={formData.date} min={new Date().toISOString().split("T")[0]} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" required />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Số người</label>
                  <div className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl p-1.5">
                    <button type="button" onClick={() => handleGuestChange('decrease')} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-orange-600 font-medium transition-colors">-</button>
                    <span className="font-bold text-lg text-gray-900 w-12 text-center">{formData.guests}</span>
                    <button type="button" onClick={() => handleGuestChange('increase')} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-orange-600 font-medium transition-colors">+</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Giờ đến</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button key={time} type="button" onClick={() => setFormData(prev => ({ ...prev, time }))} className={`py-2.5 rounded-xl font-semibold text-sm transition-all border ${formData.time === time ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin liên lạc */}
            <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-opacity duration-300 ${!selectedTable ? 'opacity-40 pointer-events-none' : ''}`}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500"/> Thông tin của bạn
              </h2>
              <div className="space-y-4">
                <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="Họ và tên *" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" required />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Số điện thoại *" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" required />
                <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Ghi chú (VD: Ghế trẻ em...)" rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"></textarea>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !selectedTable || !formData.time} className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting || !selectedTable || !formData.time ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/20'}`}>
              {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "XÁC NHẬN ĐẶT BÀN"}
            </button>
          </div>

          {/* CỘT PHẢI: SƠ ĐỒ BÀN */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
              
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-white z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 sm:pb-0">
                  {zones.map((zone) => (
                    <button key={zone.id} type="button" onClick={() => setActiveZoneId(zone.id)} className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${activeZoneId === zone.id ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-50'}`}>
                      {zone.name}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500 shrink-0">
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-orange-200 bg-white"></div> Phù hợp</span>
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Không đủ chỗ</span>
                </div>
              </div>

              <div className="flex-1 bg-gray-50/50 p-6 relative">
                {!formData.time ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/80 backdrop-blur-sm z-20">
                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa chọn thời gian</h3>
                    <p className="text-gray-500 max-w-sm">Vui lòng chọn ngày và giờ đến ở cột bên trái để xem danh sách bàn trống.</p>
                  </div>
                ) : isFetchingTables ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/50">
                     <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                     <p className="mt-3 text-gray-500 font-medium">Đang tìm bàn trống...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tablesInActiveZone.map((table) => {
                      const style = getTableStyle(table);
                      return (
                        <div key={table.id} onClick={() => handleTableSelect(table)} className={`relative flex flex-col items-center justify-center aspect-square rounded-2xl border-2 transition-all duration-300 p-4 ${style}`}>
                          <div className="mb-2">
                            <Map className={`w-8 h-8 ${selectedTable?.id === table.id ? 'text-white' : 'text-current opacity-40'}`} />
                          </div>
                          <span className="font-bold text-sm text-center mb-1">{table.name}</span>
                          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${selectedTable?.id === table.id ? 'bg-white/20 text-white' : 'bg-gray-900/5 text-current'}`}>
                            <Users size={12}/> {table.capacity}
                          </div>
                        </div>
                      );
                    })}
                    {tablesInActiveZone.length === 0 && (
                      <div className="col-span-full flex justify-center py-10">
                        <p className="text-gray-500">Khung giờ này đã hết bàn tại khu vực bạn chọn. Vui lòng thử giờ khác!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}