"use client"; 

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/toast-context';
import { IVoucher, IVoucherCreate, IVoucherUpdate } from '@/interfaces/voucher';
import { createVoucher, deleteVoucher, getVouchers, updateVoucher } from '@/apis/voucher';
import { SplashScreen } from '@/components/loading';

type DiscountType = 'fixed' | 'percentage';

interface Voucher {
  id: string; 
  code: string;
  type: DiscountType;
  discountValue: number;
  expiryDate: string; 
  createdAt: string;
}

type NewVoucher = {
  code: string;
  type: DiscountType;
  discountValue: number;
  expiryDate: string; 
};

// --- Dữ liệu mẫu ---
const mockVouchers: Voucher[] = [
  { id: 'cuid1', code: 'SALE10', type: 'percentage', discountValue: 10, expiryDate: '2026-01-10T07:00:00Z', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cuid2', code: 'FIXED50K', type: 'fixed', discountValue: 50000, expiryDate: '2026-12-31T07:00:00Z', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cuid3', code: 'EXPIRED', type: 'fixed', discountValue: 10000, expiryDate: '2024-01-01T07:00:00Z', createdAt: '2023-01-01T00:00:00Z' },
];

// --- Components Nhỏ (Giữ nguyên) ---
type BadgeType = 'success' | 'error' | 'warning' | 'neutral';
function Badge({ text, type }: { text: string; type: BadgeType }) {
  const colorMap: Record<BadgeType, string> = { success: 'badge-success', error: 'badge-error', warning: 'badge-warning', neutral: 'badge-neutral' };
  return <span className={`badge badge-sm ${colorMap[type]} text-white`}>{text}</span>;
}

function StatusBadge({ expiryDate, isCheck }: { expiryDate: string | Date, isCheck: boolean }) {
  const date = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
  const isExpired = date < new Date();
  const isActive = isCheck && !isExpired;
  return isActive ? <Badge text="Hoạt động" type="success" /> : <Badge text="Không hoạt động" type="error" />;
}

// --- LOGIC PHÂN TRANG (Giữ nguyên) ---
const ITEMS_PER_PAGE = 8;
const getPaginationRange = (currentPage: number, totalPages: number) => {
  const range: (number | '...')[] = [];
  const maxVisiblePages = 7;
  if (totalPages <= maxVisiblePages) { for (let i = 1; i <= totalPages; i++) { range.push(i); } return range; }
  range.push(1);
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);
  if (startPage > 2) range.push('...');
  else if (startPage === 2 && totalPages > 3) range.push(2);
  for (let i = startPage; i <= endPage; i++) { if (!range.includes(i)) range.push(i); }
  if (endPage < totalPages - 1) range.push('...');
  else if (endPage === totalPages - 1 && totalPages > 3) range.push(totalPages - 1);
  if (!range.includes(totalPages)) range.push(totalPages);
  const finalRange: (number | '...')[] = [];
  for (let i = 0; i < range.length; i++) {
    if (range[i] === '...' && i > 0 && i < range.length - 1) {
      const prev = range[i - 1];
      const next = range[i + 1];
      if (typeof prev === 'number' && typeof next === 'number' && (prev + 1 === next)) {
        continue;
      }
    }
    finalRange.push(range[i]);
  }
  return finalRange;
};

const formatDateTimeForInput = (iso: string | Date | undefined) => {
  if (!iso) return '';
  const date = iso instanceof Date ? iso : new Date(iso);
  return date.toISOString().slice(0, 16);
};

// --- COMPONENT TRANG CHÍNH ---
export default function VouchersPage() {
  const router = useRouter(); 

  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const { showToast } = useToast();
  const [errorUpdate, setErrorUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetcherVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await getVouchers({}, currentPage, ITEMS_PER_PAGE);
      setVouchers(response.data || []);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const createVouchers = async (dto: IVoucherCreate) => {
    setIsLoading(true);
    try {
      const response = await createVoucher(dto);
      if (response) {
      fetcherVouchers();
      showToast("Đã tạo voucher mới!", "success");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      showToast("Không thể tạo voucher!", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const updateVouchers = async (id: string, dto: IVoucherUpdate) => {
    setIsLoading(true);
    try {
      const response = await updateVoucher(id, dto);
      if (response) {
        fetcherVouchers();
        showToast("Đã cập nhật voucher!", "success");
      }
    } catch (error) {
      setErrorUpdate(true);
      console.error("Error updating coupon:", error);
      showToast("Không thể cập nhật voucher!", "error");
    } finally {
      if (!errorUpdate) {
        fetcherVouchers();
        showToast("Đã cập nhật voucher!", "success");
      }
      setErrorUpdate(false)
      setIsLoading(false);
    }
  }

  const deleteVouchers = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await deleteVoucher(id);
      fetcherVouchers();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      showToast("Không thể xóa voucher!", "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetcherVouchers();
  }, []);




  const [newVoucher, setNewVoucher] = useState<IVoucherCreate>({
    code: '',
    type: 'fixed',
    value: 0,
    minOrderVal: 0,
    usageLimit: 0,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleCreate = async () => {
    console.log("Creating voucher:", newVoucher);
    await createVouchers(newVoucher);

    (document.getElementById('add_voucher_modal') as HTMLDialogElement)?.close();
    setNewVoucher({
      code: '',
      type: 'fixed_amount',
      value: 0,
      minOrderVal: 0,
      usageLimit: 0,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(),
    });
  }

  const [editingVoucher, setEditingVoucher] = useState<IVoucher | null>(null);

  const [voucherToDelete, setVoucherToDelete] = useState<IVoucher | null>(null);

  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue: number | string | Date = value;
    if(name === 'value' || name === 'minOrderVal' || name === 'usageLimit') {
      newValue = parseFloat(value);
    } else if (name === 'endDate' || name === 'startDate') {
      newValue = new Date(value);
    }
    setNewVoucher(prev => ({ ...prev, [name]: newValue }));
  };
  
  // --- LOGIC CHO MODAL "EDIT" (Giữ nguyên) ---
  const handleOpenEditModal = (voucher: IVoucher) => {
    console.log("Editing voucher:", voucher);
    setEditingVoucher(voucher);
    (document.getElementById('edit_voucher_modal') as HTMLDialogElement)?.showModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("Editing voucher:", editingVoucher);
    if (!editingVoucher) return;
    const { name, value } = e.target;
    let newValue: number | string | Date = value;
    if(name === 'value' || name === 'minOrderVal' || name === 'usageLimit') {
      newValue = parseFloat(value);
    } else if (name === 'endDate' || name === 'startDate') {
      newValue = new Date(value);
    } else if (name === 'isActive') {
      newValue = e.target.checked;
    }
    setEditingVoucher(prev => ({ ...prev!, [name]: newValue }));
  };

  const handleUpdate = async () => {
    if (!editingVoucher) return;

    const dataUpdate: IVoucherUpdate = {
      code: editingVoucher.code,
      type: editingVoucher.type,
      value: editingVoucher.value,
      minOrderVal: editingVoucher.minOrderVal,
      usageLimit: editingVoucher.usageLimit,
      isActive: editingVoucher.isActive,
      startDate: editingVoucher.startDate,
      endDate: editingVoucher.endDate,
    };

    await updateVouchers(editingVoucher.id, dataUpdate);

    (document.getElementById('edit_voucher_modal') as HTMLDialogElement)?.close();
    setEditingVoucher(null);
  };

  
  const handleOpenDeleteModal = (voucher: IVoucher) => {
    setVoucherToDelete(voucher);
    (document.getElementById('delete_voucher_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;

    console.log("Deleting voucher:", voucherToDelete.id);

    await deleteVouchers(voucherToDelete.id);

    // Đóng modal
    (document.getElementById('delete_voucher_modal') as HTMLDialogElement)?.close();
    setVoucherToDelete(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);

  // (Các hàm formatValue, formatDate giữ nguyên)
  const formatValue = (value: number, type: string) => {
    if (type === 'percentage') return `${value}%`;
    if (type === 'fixed') return `${value.toLocaleString('vi-VN')}đ`; 
    return value;
  };
  const formatDate = (date: string | Date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return <SplashScreen className="h-[100vh]"/>
  }

  // --- JSX ---
  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý mã khuyến mãi</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; mã khuyến mãi</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            className="btn btn-neutral bg-darkgrey text-white px-2"
            onClick={() => (document.getElementById('add_voucher_modal') as HTMLDialogElement)?.showModal()}
          >
            <Plus size={18} /> THÊM MÃ KHUYẾN MÃI
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-base-content/70">
                <tr>
                  <th className='px-1 text-center'>Mã khuyến mãi</th>
                  <th className='px-1 text-center'>Loại</th>
                  <th className='px-1 text-center'>Giá trị</th>
                  <th className='px-1 text-center'>Giá trị tối thiểu</th>
                  <th className='px-1 text-center'>Tổng lượt sử dụng</th>
                  <th className='px-1 text-center'>Tình trạng</th>
                  <th className='px-1 text-center'>Ngày bắt đầu</th>
                  <th className='px-1 text-center'>Ngày hết hạn</th>
                  <th className='px-1 text-center'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {vouchers && vouchers.length > 0 ? (
                  vouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover">
                      <td className='text-center'><div className="font-bold">{voucher.code}</div></td>
                      <td className='text-center'>{voucher.type === 'fixed' ? 'Fixed Amount' : 'Percentage'}</td>
                      <td className='text-center'>{formatValue(voucher.value, voucher.type)}</td>
                      <td className='text-center'>{formatValue(voucher.minOrderVal, 'fixed')}</td>
                      <td className='text-center'>{voucher.usageLimit}</td>
                      <td className='text-center'><StatusBadge expiryDate={voucher.endDate} isCheck={voucher.isActive} /></td>
                      <td className='text-center'>{formatDate(voucher.startDate)}</td>
                      <td className='text-center'>{formatDate(voucher.endDate)}</td>
                      <td className='text-center'>
                        <div className="flex gap-1">
                          {/* NÚT EDIT */}
                          <button 
                            className="btn btn-ghost btn-circle btn-sm"
                            onClick={() => handleOpenEditModal(voucher)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-circle btn-sm text-error"
                            onClick={() => handleOpenDeleteModal(voucher)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-4 font-bold">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-0">
              <button onClick={goToPrevPage} disabled={currentPage === 1} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"><GrFormPrevious size={18} /> PREVIOUS</button>
              {pageNumbers.map((item, index) => (
                  <React.Fragment key={index}>
                      {item === '...' ? (<span className="px-3 py-2 text-gray-700">...</span>) : (
                          <button onClick={() => goToPage(item as number)} className={`px-4 py-2 rounded-xl font-semibold transition border ${currentPage === item ? 'bg-black text-white border-black bg-neutral-950' : 'text-black border-gray-300 hover:bg-gray-100'}`}>{item}</button>
                      )}
                  </React.Fragment>
              ))}
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4">NEXT <GrFormNext size={18} /></button>
          </div>
      )}

      <dialog id="add_voucher_modal" className="modal">
        <div className='modal-box w-11/12 max-w-2xl'>
          <h3 className="font-bold text-lg">Thêm mã khuyến mãi</h3>
          <div className="py-4 space-y-4">
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Mã khuyến mãi</span></label><input type="text" name="code" value={newVoucher.code} onChange={handleFormChange} className="input input-bordered rounded-lg" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Loại</span>
                </label>
                <select name="type" className="select select-bordered" value={newVoucher.type} onChange={handleFormChange}>
                  <option value="fixed_amount">Số tiền cố định</option>
                  <option value="percentage">Phần trăm</option>
                </select>
              </div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Giá trị</span></label><input type="number" name="value" value={newVoucher.value > 0 ? newVoucher.value : ''} onChange={handleFormChange} placeholder='e.g. 100.000' className="input input-bordered rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Giá trị tối thiểu</span></label><input type="number" name="minOrderVal" value={newVoucher.minOrderVal > 0 ? newVoucher.minOrderVal : ''} onChange={handleFormChange} className="input input-bordered rounded-lg" placeholder="e.g., 200000 (cho 200.000đ)" /></div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Tổng lượt sử dụng</span></label><input type="number" name="usageLimit" value={newVoucher.usageLimit > 0 ? newVoucher.usageLimit : ''} onChange={handleFormChange} className="input input-bordered rounded-lg" placeholder="e.g., 100 (cho 100 lần sử dụng)" /></div>
            </div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Ngày bắt đầu</span></label><input type="datetime-local" name="startDate" value={formatDateTimeForInput(newVoucher.startDate)} onChange={handleFormChange} className="input input-bordered rounded-lg" /></div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Ngày hết hạn</span></label><input type="datetime-local" name="endDate" value={formatDateTimeForInput(newVoucher.endDate)} onChange={handleFormChange} className="input input-bordered rounded-lg" /></div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn mr-2" onClick={() => setEditingVoucher(null)}>Huỷ</button></form>
            <button className="btn btn-primary bg-darkgrey text-white px-2" onClick={handleCreate}>Tạo</button>
          </div>
        </div>
      </dialog>
      <dialog id="edit_voucher_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg">Chỉnh sửa mã khuyến mãi: {editingVoucher?.code}</h3>
          <div className="py-4 space-y-4">
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Mã khuyến mãi</span></label><input type="text" name="code" value={editingVoucher?.code || ''} onChange={handleEditFormChange} className="input input-bordered rounded-lg" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold mr-2">Loại</span>
                </label>
                <select name="type" className="select select-bordered" value={editingVoucher?.type || 'fixed_amount'} onChange={handleEditFormChange}>
                  <option value="fixed_amount">Số tiền cố định</option>
                  <option value="percentage">Phần trăm</option>
                </select>
              </div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold">Giá trị</span></label><input type="number" name="value" value={editingVoucher?.value || 0} onChange={handleEditFormChange} className="input input-bordered rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Giá trị tối thiểu</span></label><input type="number" name="minOrderVal" value={editingVoucher?.minOrderVal} onChange={handleEditFormChange} className="input input-bordered rounded-lg" placeholder="e.g., 200000 (cho 200.000đ)" /></div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Tổng lượt sử dụng</span></label><input type="number" name="usageLimit" value={editingVoucher?.usageLimit} onChange={handleEditFormChange} className="input input-bordered rounded-lg" placeholder="e.g., 100 (cho 100 lần sử dụng)" /></div>
            </div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Ngày bắt đầu</span></label><input type="datetime-local" name="startDate" value={formatDateTimeForInput(editingVoucher?.startDate || '')} onChange={handleEditFormChange} className="input input-bordered rounded-lg" /></div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Ngày hết hạn</span></label><input type="datetime-local" name="endDate" value={formatDateTimeForInput(editingVoucher?.endDate || '')} onChange={handleEditFormChange} className="input input-bordered rounded-lg" /></div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Trạng thái</span></label><input type="checkbox" name="isActive" checked={editingVoucher?.isActive} onChange={handleEditFormChange} className="checkbox" /></div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn mr-2" onClick={() => setEditingVoucher(null)}>Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdate}>Lưu thay đổi</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingVoucher(null)}>close</button></form>
      </dialog>

      {/* === 6. MODAL "DELETE CONFIRM" (MỚI) === */}
      <dialog id="delete_voucher_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa voucher <strong className="text-error">{voucherToDelete?.code}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* Nút Cancel */}
              <button className="btn mr-2" onClick={() => setVoucherToDelete(null)}>Huỷ</button>
            </form>
            {/* Nút Delete */}
            <button 
              className="btn btn-error bg-error text-white px-2"
              onClick={handleConfirmDelete}
            >
              Xoá
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setVoucherToDelete(null)}>close</button>
        </form>
      </dialog>

    </div>
  );
}