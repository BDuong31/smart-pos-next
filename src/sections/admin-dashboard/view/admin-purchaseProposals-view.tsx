"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, Plus, Filter, FileText, Eye, Trash2, CheckCircle, 
  Clock, XCircle, Bot, X, PackagePlus, ClipboardCheck, PlusCircle
} from "lucide-react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import UserRegula from "@/components/icons/user";

// ==========================================
// 1. MOCK DATA
// ==========================================
const mockIngredients = [
  { id: "ing-1", name: "Cà phê hạt Robusta", unit: "kg" },
  { id: "ing-2", name: "Sữa tươi thanh trùng", unit: "lít" },
  { id: "ing-3", name: "Trân châu đen", unit: "kg" },
  { id: "ing-4", name: "Đường nước", unit: "can" },
  { id: "ing-5", name: "Ly nhựa 500ml", unit: "cái" },
];

const mockProposals = [
  { 
    id: "1", code: "PO-20260331-001", creatorId: "AI_GENERATED_019cc1cb-97b4", creatorName: "Hệ thống AI", 
    status: "PENDING", note: "AI tự động đề xuất nhập do sắp hết nguyên liệu.", createdAt: "2026-03-31T08:00:00",
    details: [
      { id: "d1", ingredientId: "ing-2", name: "Sữa tươi thanh trùng", quantity: 15, unit: "lít" },
      { id: "d2", ingredientId: "ing-3", name: "Trân châu đen", quantity: 5, unit: "kg" }
    ]
  },
  { 
    id: "2", code: "PO-20260330-002", creatorId: "user-uuid-1234", creatorName: "Vũ Thái Bình Dương", 
    status: "APPROVED", note: "Nhập nguyên liệu định kỳ tuần 1 tháng 4.", createdAt: "2026-03-30T10:30:00",
    details: [{ id: "d3", ingredientId: "ing-1", name: "Cà phê hạt Robusta", quantity: 20, unit: "kg" }]
  }
];

// ==========================================
// 2. COMPONENTS PHỤ
// ==========================================
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING": return <span className="badge badge-warning gap-1 text-white text-xs border-none bg-amber-500 py-2.5 px-3"><Clock size={12} /> Chờ duyệt</span>;
    case "APPROVED": return <span className="badge badge-success gap-1 text-white text-xs border-none bg-emerald-500 py-2.5 px-3"><CheckCircle size={12} /> Đã duyệt</span>;
    case "REJECTED": return <span className="badge badge-error gap-1 text-white text-xs border-none bg-red-500 py-2.5 px-3"><XCircle size={12} /> Từ chối</span>;
    default: return <span className="badge badge-ghost text-xs py-2.5 px-3">{status}</span>;
  }
};

const ITEMS_PER_PAGE = 8;
const getPaginationRange = (current: number, total: number) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function PurchaseProposalView() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchCode, setSearchCode] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Modal có 3 chế độ: "create" (Thêm mới), "review" (Duyệt), "view" (Chỉ xem)
  const [modalMode, setModalMode] = useState<"view" | "create" | "review">("create");
  const [formData, setFormData] = useState<any>({
    code: "", status: "PENDING", note: "", details: []
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => { setProposals(mockProposals); setLoading(false); }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    let result = proposals;
    if (filterStatus !== "ALL") result = result.filter(item => item.status === filterStatus);
    if (searchCode) result = result.filter(item => item.code.toLowerCase().includes(searchCode.toLowerCase()) || (item.note && item.note.toLowerCase().includes(searchCode.toLowerCase())));
    return result;
  }, [proposals, searchCode, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // --- MODAL HANDLERS ---
  const openModal = (mode: "view" | "create" | "review", item?: any) => {
    setModalMode(mode);
    if (mode === "create") {
      // Khi bấm "Tạo Đề Xuất", reset form trống
      setFormData({
        code: `PO-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`,
        status: "PENDING", note: "", details: []
      });
    } else if (item) {
      // Khi bấm "Xem" hoặc "Duyệt", đổ dữ liệu cũ vào
      setFormData(JSON.parse(JSON.stringify(item))); 
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Xử lý thay đổi trong Form Thêm mới
  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    if (field === "ingredientId") {
      const ing = mockIngredients.find(i => i.id === value);
      if (ing) {
        newDetails[index].name = ing.name;
        newDetails[index].unit = ing.unit;
      }
    }
    setFormData({ ...formData, details: newDetails });
  };

  const addDetailRow = () => {
    const currentDetails = Array.isArray(formData.details) ? formData.details : [];
    setFormData({ ...formData, details: [...currentDetails, { ingredientId: "", name: "", quantity: 1, unit: "" }] });
  };

  const removeDetailRow = (index: number) => {
    const newDetails = formData.details.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  // Nút Lưu khi Tạo mới (Thêm Đề Xuất)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "create") {
      if (formData.details.length === 0) {
        alert("Vui lòng thêm ít nhất 1 nguyên liệu!");
        return;
      }
      const newProposal = {
        ...formData,
        id: Math.random().toString(),
        creatorId: "user-uuid-admin", creatorName: "Admin Hiện Tại",
        createdAt: new Date().toISOString()
      };
      setProposals([newProposal, ...proposals]); // Đẩy lên đầu bảng
      alert(`Đã tạo thành công phiếu ${formData.code}!`);
    }
    closeModal();
  };

  // Nút Duyệt / Từ chối
  const handleReviewAction = (newStatus: "APPROVED" | "REJECTED") => {
    const updatedProposals = proposals.map(p => 
      p.id === formData.id ? { ...p, status: newStatus } : p
    );
    setProposals(updatedProposals);
    alert(`Đã ${newStatus === "APPROVED" ? "phê duyệt" : "từ chối"} phiếu ${formData.code}!`);
    closeModal();
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Đề xuất nhập hàng</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Đề xuất nhập hàng</p>
        </div>
        <div className='flex gap-4'>
          <div className="flex items-center gap-2 bg-white px-2 rounded-xl border border-slate-200">
            <Filter size={18} className="text-slate-400" />
            <select className=" border-none focus:outline-none text-sm font-medium text-slate-700" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={() => openModal("create")} className="btn btn-neutral bg-darkgrey text-white px-2">
              <Plus size={18} /> TẠO ĐỀ XUẤT MỚI
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
        {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center"><span className="loading loading-spinner text-blue-600"></span></div>}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Mã Đề Xuất (Code)</th>
                <th className="px-6 py-4 font-semibold">Người tạo</th>
                <th className="px-6 py-4 font-semibold">Ghi chú</th>
                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentData.map((item) => {
                const isAI = item.creatorId.includes('AI_GENERATED');
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.code}</div>
                      <div className="text-xs text-slate-400 mt-1">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isAI ? <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Bot size={16} /></div> : <div className="p-1.5 text-darkgrey stroke-darkgrey rounded-lg"><UserRegula width={20} height={20}/></div>}
                        <div><span className={`font-semibold ${isAI ? 'text-purple-700' : 'text-slate-700'}`}>{item.creatorName}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-1/3">
                      <p className="text-slate-600 line-clamp-2">{item.note}</p>
                      <span className="text-xs text-blue-500 font-medium mt-1 inline-block">Kèm {item.details?.length || 0} chi tiết</span>
                    </td>
                    <td className="px-6 py-4 text-center"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        
                        {/* Nút Xem Chi tiết (Luôn có) */}
                        <button onClick={() => openModal("view", item)} className="btn btn-sm btn-ghost btn-circle text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50" title="Xem">
                          <Eye size={16} />
                        </button>

                        {/* Nếu phiếu PENDING thì hiện nút Duyệt */}
                        {item.status === "PENDING" && (
                          <button onClick={() => openModal("review", item)} className="btn btn-sm btn-ghost btn-circle text-emerald-500 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100" title="Duyệt Phiếu">
                            <ClipboardCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BẰNG THẺ <dialog> */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box p-0 w-11/12 max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {modalMode === "create" ? <><PlusCircle size={20} className="text-blue-600"/> Thêm Đề Xuất Mới</> :
               modalMode === "review" ? <><ClipboardCheck size={20} className="text-emerald-600"/> Duyệt đề xuất nhập hàng</> :
               <><Eye size={20} className="text-slate-600"/> Chi tiết phiếu nhập</>}
            </h3>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-800 p-1.5 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-sm"><X size={18} /></button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <form id="proposal-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Mã Phiếu (Code)</label>
                  <input 
                    type="text" value={formData.code} 
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    disabled={modalMode !== "create"} 
                    className="w-full input input-bordered bg-slate-50 text-slate-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Trạng thái</label>
                  <div className="pt-2"><StatusBadge status={formData.status} /></div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Ghi chú (Note)</label>
                  <textarea 
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    disabled={modalMode !== "create"}
                    rows={3} placeholder="Ví dụ: Cần nhập gấp sữa cho cuối tuần..."
                    className="w-full textarea textarea-bordered bg-slate-50 text-slate-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent"
                  />
                </div>
              </div>

              {/* Nguyên Liệu */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                  <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2"><PackagePlus size={16}/> Danh sách nguyên liệu cần nhập</h4>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="table w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th>Nguyên liệu</th>
                        <th className="w-32 text-center">Số lượng</th>
                        <th className="w-24 text-center">Đơn vị</th>
                        {modalMode === "create" && <th className="w-12 text-center">Xóa</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {!formData.details || formData.details.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-8 text-slate-400">Chưa có nguyên liệu nào. Hãy thêm bên dưới.</td></tr>
                      ) : (
                        formData.details.map((detail: any, index: number) => (
                          <tr key={index}>
                            <td>
                              <select 
                                value={detail.ingredientId || ""} 
                                onChange={(e) => handleDetailChange(index, "ingredientId", e.target.value)}
                                disabled={modalMode !== "create"}
                                className="w-full select select-bordered bg-white disabled:bg-slate-50 disabled:border-transparent disabled:text-slate-800 font-medium"
                                required
                              >
                                <option value="" disabled>-- Chọn nguyên liệu --</option>
                                {mockIngredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                              </select>
                            </td>
                            <td>
                              <input 
                                type="number" min="0.1" step="0.1" value={detail.quantity || ""} 
                                onChange={(e) => handleDetailChange(index, "quantity", Number(e.target.value))}
                                disabled={modalMode !== "create"}
                                className="w-full input input-bordered text-center bg-white disabled:bg-slate-50 disabled:border-transparent disabled:text-slate-800 font-bold"
                                required
                              />
                            </td>
                            <td>
                              <input 
                                type="text" value={detail.unit || ""} readOnly 
                                className="w-full input input-bordered text-center bg-slate-100 text-slate-500 cursor-not-allowed border-transparent"
                              />
                            </td>
                            {modalMode === "create" && (
                              <td className="text-center">
                                <button type="button" onClick={() => removeDetailRow(index)} className="btn btn-square btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={18}/></button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Chỉ hiển thị nút Thêm nguyên liệu khi ở chế độ CREATE */}
                {modalMode === "create" && (
                  <div className="p-3 bg-white border-t border-slate-100">
                    <button type="button" onClick={addDetailRow} className="btn w-full border-dashed border-2 border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-blue-600">
                      <Plus size={18} /> Thêm dòng nguyên liệu
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer - Hiển thị Nút theo Mode */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="btn btn-ghost bg-white border-slate-200 text-slate-600 hover:bg-slate-100">
              {modalMode === "view" ? "Đóng" : "Hủy bỏ"}
            </button>
            {/* Nút Tạo Phiếu (Chỉ hiện khi Thêm Mới) */}
            {modalMode === "create" && (
              <button type="submit" form="proposal-form" className="btn bg-darkgrey hover:bg-slate-700 text-white border-none px-6">
                Tạo Đề Xuất
              </button>
            )}

            {/* Nút Phê Duyệt / Từ chối (Chỉ hiện khi Duyệt) */}
            {modalMode === "review" && (
              <div className="flex gap-2">
                <button type="button" onClick={() => handleReviewAction("REJECTED")} className="btn bg-error hover:bg-red-600 text-white border-none px-2">
                  Từ chối Phiếu
                </button>
                <button type="button" onClick={() => handleReviewAction("APPROVED")} className="btn bg-success hover:bg-emerald-600 text-white border-none px-2">
                  Phê Duyệt
                </button>
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button type="button" onClick={closeModal}>close</button></form>
      </dialog>
    </div>
  );
}