"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, Power, AlertTriangle, ShieldAlert, Store, 
  Globe, Save, CheckCircle2, XCircle, Loader2, Info, 
  MapPin, Phone, Mail, FileText, UploadCloud, Clock, 
  Percent, Printer, Database, Trash2
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { getMaintenanceStatus, setMaintenance } from "@/apis/system";

// --- Mock API cho các tính năng mới ---
const mockApi = {
  updateStoreInfo: async (data: any) => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600)),
  updateRegionInfo: async (data: any) => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600)),
  clearSystemCache: async () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000))
};

export default function GeneralSettingsPage() {
  const { showToast } = useToast();

  // --- STATE ĐIỀU HƯỚNG TABS ---
  const [activeTab, setActiveTab] = useState<'system' | 'store' | 'region'>('system');

  // --- 1. STATES CHO HỆ THỐNG (BẢO TRÌ & CACHE) ---
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMaintenance, setErrorMaintenance] = useState(false);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState(false);

  const [isClearingCache, setIsClearingCache] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  // --- 2. STATES CHO THÔNG TIN CỬA HÀNG ---
  const [storeInfo, setStoreInfo] = useState({
    name: "Baso Corner",
    email: "vtbduong@baso.id.vn",
    phone: "0901234567",
    taxId: "0312345678",
    address: "Bến Cát, Bình Dương, Việt Nam",
    description: "Quán cà phê cực chill mang đến trải nghiệm tuyệt vời nhất.",
    openTime: "07:00",
    closeTime: "22:30"
  });
  const [isSavingStore, setIsSavingStore] = useState(false);

  // --- 3. STATES CHO KHU VỰC & POS ---
  const [regionInfo, setRegionInfo] = useState({
    timezone: "Asia/Ho_Chi_Minh",
    currency: "VND",
    language: "vi",
    dateFormat: "DD/MM/YYYY",
    vatRate: 8,
    receiptFooter: "Cảm ơn quý khách và hẹn gặp lại!"
  });
  const [isSavingRegion, setIsSavingRegion] = useState(false);

  // --- LOGIC GỌI API BẢO TRÌ ---
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingInitial(true);
        const res = await getMaintenanceStatus();
        setIsMaintenance(res.enabled);
      } catch (error) {
        showToast("Không thể tải trạng thái hệ thống.", "error");
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchStatus();
  }, [showToast]);

  const handleToggleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setPendingMaintenanceState(newValue);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleMaintenance = async () => {
    setIsConfirmModalOpen(false); 
    try {
      setIsSaving(true);
      await setMaintenance(pendingMaintenanceState);
      setIsMaintenance(pendingMaintenanceState);
    } catch (error) {
      setErrorMaintenance(true); 
      showToast("Cập nhật thất bại. Vui lòng thử lại.", "error");
    } finally {
      setIsSaving(false);
      if (errorMaintenance) {
        setIsMaintenance((prev) => !prev); 
        setErrorMaintenance(false);
      } else {
        showToast(`Đã ${pendingMaintenanceState ? 'BẬT' : 'TẮT'} chế độ bảo trì thành công!`, "success");
      }
    }
  };

  // --- LOGIC CLEAR CACHE ---
  const handleClearCache = async () => {
    try {
      setIsClearingCache(true);
      await mockApi.clearSystemCache();
      showToast("Đã xóa bộ nhớ đệm (Cache) thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi xóa bộ nhớ đệm.", "error");
    } finally {
      setIsClearingCache(false);
    }
  };

  // --- XỬ LÝ LƯU THÔNG TIN ---
  const handleSaveStoreInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingStore(true);
      await mockApi.updateStoreInfo(storeInfo);
      showToast("Đã lưu thông tin cửa hàng thành công!", "success");
    } catch (error) {
      showToast("Lưu thông tin thất bại.", "error");
    } finally {
      setIsSavingStore(false);
    }
  };

  const handleSaveRegionInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingRegion(true);
      await mockApi.updateRegionInfo(regionInfo);
      showToast("Đã lưu thiết lập hệ thống POS thành công!", "success");
    } catch (error) {
      showToast("Lưu thiết lập thất bại.", "error");
    } finally {
      setIsSavingRegion(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 h-full min-h-screen bg-slate-50 font-sans relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="text-slate-700" /> Cài đặt hệ thống
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý cấu hình toàn diện cho nền tảng bán hàng và máy chủ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* CỘT TRÁI: MENU ĐIỀU HƯỚNG */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            <ul className="menu w-full text-slate-600 font-medium p-3 gap-1">
              <li className="menu-title text-xs uppercase text-slate-400 font-bold pb-2">Danh mục Cài đặt</li>
              
              <li>
                <a 
                  onClick={() => setActiveTab('system')}
                  className={`${activeTab === 'system' ? 'active bg-slate-100 text-blue-600 font-bold' : 'hover:bg-slate-50'} rounded-xl py-3`}
                >
                  <ShieldAlert size={18} /> Hệ thống & Máy chủ
                </a>
              </li>
              <li>
                <a 
                  onClick={() => setActiveTab('store')}
                  className={`${activeTab === 'store' ? 'active bg-slate-100 text-blue-600 font-bold' : 'hover:bg-slate-50'} rounded-xl py-3`}
                >
                  <Store size={18} /> Hồ sơ Cửa hàng
                </a>
              </li>
              <li>
                <a 
                  onClick={() => setActiveTab('region')}
                  className={`${activeTab === 'region' ? 'active bg-slate-100 text-blue-600 font-bold' : 'hover:bg-slate-50'} rounded-xl py-3`}
                >
                  <Printer size={18} /> POS & Hóa Đơn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: NỘI DUNG */}
        <div className="lg:col-span-3 space-y-6">

          {/* ========================================================
              TAB 1: HỆ THỐNG & MÁY CHỦ
              ======================================================== */}
          {activeTab === 'system' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Box: Bảo trì */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-4 items-center">
                    <div className={`p-3.5 rounded-2xl flex-shrink-0 transition-colors ${isMaintenance ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Power size={28} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Chế độ Bảo trì (Maintenance)</h2>
                      <p className="text-sm text-slate-500 mt-1">Ngắt kết nối người dùng cuối để cập nhật tính năng.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {loadingInitial ? (
                      <div className="w-12 h-6 bg-slate-200 animate-pulse rounded-full"></div>
                    ) : (
                      <input type="checkbox" className="toggle toggle-lg toggle-error border-slate-300" checked={isMaintenance} onChange={handleToggleClick} disabled={isSaving}/>
                    )}
                  </div>
                </div>
                {isMaintenance && (
                  <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-600 font-medium leading-relaxed">
                      Lưu ý: Chế độ bảo trì đang được BẬT. Khách hàng truy cập sẽ nhận được thông báo hệ thống đang nâng cấp.
                    </p>
                  </div>
                )}
              </div>

              {/* Box: Quản lý Dữ liệu */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <Database size={20} className="text-blue-500"/> Quản lý Dữ liệu (Database & Cache)
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800">Xóa bộ nhớ đệm (Clear Cache)</h4>
                      <p className="text-sm text-slate-500 mt-1">Làm mới dữ liệu sản phẩm, gợi ý AI và các cài đặt bị lưu trữ tạm.</p>
                    </div>
                    <button onClick={handleClearCache} disabled={isClearingCache} className="btn btn-sm border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-white bg-error shadow-sm px-2">
                      {isClearingCache ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 
                      Xóa Cache
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800">Tự động sao lưu dữ liệu (Auto Backup)</h4>
                      <p className="text-sm text-slate-500 mt-1">Hệ thống sẽ tạo bản sao lưu Database vào 02:00 AM mỗi ngày.</p>
                    </div>
                    <input type="checkbox" className="toggle toggle-success" checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: THÔNG TIN CỬA HÀNG
              ======================================================== */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStoreInfo} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Store size={20} className="text-blue-500"/> Hồ sơ Cửa hàng (Store Profile)
              </h2>
              
              {/* Khối Upload Logo */}
              <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-24 h-24 bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer overflow-hidden relative group">
                  <UploadCloud size={24} className="mb-1" />
                  <span className="text-[10px] font-semibold uppercase">Tải Logo</span>
                  {/* Chỗ này thực tế bạn sẽ gắn thẻ <input type="file" /> ẩn */}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Logo Thương Hiệu</h4>
                  <p className="text-xs text-slate-500 mt-1">Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa 2MB.</p>
                  <p className="text-xs text-slate-500">Logo này sẽ hiển thị trên ứng dụng khách hàng và góc trên hóa đơn.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Store size={14}/> Tên Thương Hiệu</label>
                  <input type="text" required value={storeInfo.name} onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})} className="w-full input input-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><FileText size={14}/> Mã số thuế (Tax ID)</label>
                  <input type="text" value={storeInfo.taxId} onChange={(e) => setStoreInfo({...storeInfo, taxId: e.target.value})} className="w-full input input-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" placeholder="VD: 0312345678" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Mail size={14}/> Email Liên Hệ</label>
                  <input type="email" required value={storeInfo.email} onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})} className="w-full input input-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Phone size={14}/> Số Điện Thoại</label>
                  <input type="tel" required value={storeInfo.phone} onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})} className="w-full input input-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" />
                </div>
                
                {/* Giờ mở cửa */}
                <div className="md:col-span-2 grid grid-cols-2 gap-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Clock size={14}/> Giờ mở cửa</label>
                    <input type="time" value={storeInfo.openTime} onChange={(e) => setStoreInfo({...storeInfo, openTime: e.target.value})} className="w-full input input-bordered bg-white text-slate-800 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Clock size={14}/> Giờ đóng cửa</label>
                    <input type="time" value={storeInfo.closeTime} onChange={(e) => setStoreInfo({...storeInfo, closeTime: e.target.value})} className="w-full input input-bordered bg-white text-slate-800 font-medium" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><MapPin size={14}/> Địa Chỉ Cửa Hàng</label>
                  <input type="text" required value={storeInfo.address} onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})} className="w-full input input-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><FileText size={14}/> Mô tả ngắn gọn</label>
                  <textarea rows={3} value={storeInfo.description} onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})} className="w-full textarea textarea-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={isSavingStore} className="btn bg-slate-800 hover:bg-slate-700 text-white border-none rounded-xl px-8 shadow-md">
                  {isSavingStore ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSavingStore ? "Đang lưu..." : "Lưu hồ sơ"}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 3: KHU VỰC & POS HÓA ĐƠN
              ======================================================== */}
          {activeTab === 'region' && (
            <form onSubmit={handleSaveRegionInfo} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Printer size={20} className="text-blue-500"/> Cấu hình POS & Hóa đơn
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Khu vực */}
                <div className="space-y-4 md:col-span-1 border-r border-slate-100 md:pr-6">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2"><Globe size={16}/> Định dạng khu vực</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Múi giờ hệ thống (Timezone)</label>
                    <select value={regionInfo.timezone} onChange={(e) => setRegionInfo({...regionInfo, timezone: e.target.value})} className="w-full select select-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium">
                      <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tiền tệ mặc định</label>
                    <select value={regionInfo.currency} onChange={(e) => setRegionInfo({...regionInfo, currency: e.target.value})} className="w-full select select-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium">
                      <option value="VND">Việt Nam Đồng (VND - ₫)</option>
                      <option value="USD">Đô la Mỹ (USD - $)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Định dạng ngày tháng</label>
                    <select value={regionInfo.dateFormat} onChange={(e) => setRegionInfo({...regionInfo, dateFormat: e.target.value})} className="w-full select select-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium">
                      <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
                    </select>
                  </div>
                </div>

                {/* Hóa đơn & Thuế */}
                <div className="space-y-4 md:col-span-1">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2"><Printer size={16}/> In ấn & Thuế</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Percent size={14}/> Mức thuế VAT mặc định (%)</label>
                    <input 
                      type="number" min="0" max="100" 
                      value={regionInfo.vatRate} onChange={(e) => setRegionInfo({...regionInfo, vatRate: Number(e.target.value)})} 
                      className="w-full input input-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" 
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Phần trăm thuế sẽ tự động cộng vào cuối hóa đơn khách hàng.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Lời chào cuối hóa đơn (Footer Text)</label>
                    <textarea 
                      rows={4}
                      value={regionInfo.receiptFooter} onChange={(e) => setRegionInfo({...regionInfo, receiptFooter: e.target.value})} 
                      className="w-full textarea textarea-bordered bg-slate-50 focus:bg-white text-slate-800 font-medium" 
                      placeholder="Cảm ơn quý khách..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={isSavingRegion} className="btn bg-darkgrey hover:bg-slate-700 text-white border-none rounded-xl px-8 shadow-md">
                  {isSavingRegion ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSavingRegion ? "Đang lưu..." : "Lưu cấu hình POS"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* ==========================================
          MODAL XÁC NHẬN BẬT/TẮT BẢO TRÌ (<dialog>)
          ========================================== */}
      <dialog className={`modal ${isConfirmModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-white rounded-2xl shadow-xl max-w-md p-0 overflow-hidden text-center">
          <div className={`p-6 pb-2 flex justify-center`}>
            <div className={`p-4 rounded-full ${pendingMaintenanceState ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {pendingMaintenanceState ? <AlertTriangle size={36} /> : <CheckCircle2 size={36} />}
            </div>
          </div>
          <div className="p-6 pt-2">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {pendingMaintenanceState ? "Kích hoạt Bảo trì?" : "Tắt Bảo trì Hệ thống?"}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {pendingMaintenanceState 
                ? "Khách hàng sẽ không thể truy cập, đặt hàng hoặc sử dụng API trong thời gian này. Bạn chắc chắn chứ?" 
                : "Hệ thống sẽ mở lại bình thường, khách hàng có thể bắt đầu đặt hàng trở lại."}
            </p>
          </div>
          <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
            <button onClick={() => setIsConfirmModalOpen(false)} className="btn btn-ghost text-slate-600 hover:bg-slate-200">
              Hủy bỏ
            </button>
            <button onClick={confirmToggleMaintenance} className={`btn border-none px-2 text-white ${pendingMaintenanceState ? 'bg-error hover:bg-rose-700' : 'bg-darkgrey hover:bg-emerald-700'}`}>
              Xác nhận {pendingMaintenanceState ? 'Bật' : 'Tắt'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setIsConfirmModalOpen(false)}>close</button></form>
      </dialog>

    </div>
  );
}