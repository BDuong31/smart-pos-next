"use client"; 

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { useRouter } from 'next/navigation';
import { ICoupon, ICouponCreate, ICouponUpdate } from '@/interfaces/coupon';
import { createCoupon, getCoupons, updateCoupon } from '@/apis/coupon';
import { useToast } from '@/context/toast-context';

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

function StatusBadge({ expiryDate }: { expiryDate: string | Date }) {
  const date = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
  const isActive = date > new Date();
  return isActive ? <Badge text="Active" type="success" /> : <Badge text="Expired" type="error" />;
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

  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const fetcherCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await getCoupons();
      setCoupons(response.data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const createCoupons = async (dto: ICouponCreate) => {
    setIsLoading(true);
    try {
      const response = await createCoupon(dto);
      if (response) {
      fetcherCoupons();
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      showToast("Không thể tạo voucher!", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const updateCoupons = async (id: string, dto: ICouponUpdate) => {
    setIsLoading(true);
    try {
      const response = await updateCoupon(id, dto);
      if (response) {
        fetcherCoupons();
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      showToast("Không thể cập nhật voucher!", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const deleteCoupons = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await deleteCoupons(id);
      fetcherCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      showToast("Không thể xóa voucher!", "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetcherCoupons();
  }, []);




  const [newVoucher, setNewVoucher] = useState<ICouponCreate>({
    code: '',
    name: '',
    description: '',
    type: 'fixed',
    discountValue: 0,
    minSpend: 0,
    maxDiscount: 0,
    totalUsageLimit: 0,
    currentUsageCount: 0,
    expiryDate: new Date(),
  });

  const handleCreate = async () => {
    console.log("Creating voucher:", newVoucher);
    await createCoupons(newVoucher);

    showToast("Đã tạo voucher mới!", "success");
    (document.getElementById('add_voucher_modal') as HTMLDialogElement)?.close();
    setNewVoucher({
      code: '',
      name: '',
      description: '',
      type: 'fixed',
      discountValue: 0,
      minSpend: 0,
      maxDiscount: 0,
      totalUsageLimit: 0,
      currentUsageCount: 0,
      expiryDate: new Date(),
    });
  }

  const [editingVoucher, setEditingVoucher] = useState<ICoupon | null>(null);

  const [voucherToDelete, setVoucherToDelete] = useState<ICoupon | null>(null);

  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue: number | string | Date = value;
    if(name === 'maxDiscount' || name === 'minSpend' || name === 'totalUsageLimit' || name === 'discountValue') {
      newValue = parseFloat(value);
    } else if (name === 'expiryDate') {
      newValue = new Date(value);
    }
    setNewVoucher(prev => ({ ...prev, [name]: newValue }));
  };
  
  // --- LOGIC CHO MODAL "EDIT" (Giữ nguyên) ---
  const handleOpenEditModal = (voucher: ICoupon) => {
    console.log("Editing voucher:", voucher);
    setEditingVoucher(voucher);
    (document.getElementById('edit_voucher_modal') as HTMLDialogElement)?.showModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("Editing voucher:", editingVoucher);
    if (!editingVoucher) return;
    const { name, value } = e.target;
    const newValue = (name === 'discountValue') ? parseFloat(value) : value;
    setEditingVoucher(prev => ({ ...prev!, [name]: newValue }));
  };

  const handleUpdate = async () => {
    if (!editingVoucher) return;

    const dataUpdate: ICouponUpdate = {
      code: editingVoucher.code,
      type: editingVoucher.type,
      discountValue: editingVoucher.discountValue,
      expiryDate: new Date(editingVoucher.expiryDate),
    };

    await updateCoupons(editingVoucher.id, dataUpdate);

    showToast("Đã cập nhật voucher!", "success");
    (document.getElementById('edit_voucher_modal') as HTMLDialogElement)?.close();
    setEditingVoucher(null);
  };

  
  const handleOpenDeleteModal = (voucher: ICoupon) => {
    setVoucherToDelete(voucher);
    (document.getElementById('delete_voucher_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;

    console.log("Deleting voucher:", voucherToDelete.id);

    await deleteCoupons(voucherToDelete.id);

    showToast("Đã xóa voucher!", "success");      
    // Đóng modal
    (document.getElementById('delete_voucher_modal') as HTMLDialogElement)?.close();
    setVoucherToDelete(null);
  };

  // --- Logic tính toán cho danh sách (Giữ nguyên) ---
  const filteredCoupons = useMemo(() => {
    return coupons.filter(e => 
      e.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, coupons]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE); 
  }, [filteredCoupons]);

  const currentVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCoupons.slice(startIndex, endIndex); 
  }, [currentPage, filteredCoupons]);

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


  // --- JSX ---
  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Voucher Management</h1>
          <p className="text-base-content/70 text-sm">Home &gt; Vouchers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <label className="input bg-transparent border border-graymain flex items-center gap-2 w-full sm:w-auto">
            <input type="text" className="grow border-none" placeholder="Search by voucher code" value={searchTerm} onChange={handleSearchChange} />
            <Search size={16} className="opacity-50" />
          </label>
          <button 
            className="btn btn-neutral"
            onClick={() => (document.getElementById('add_voucher_modal') as HTMLDialogElement)?.showModal()}
          >
            <Plus size={18} /> ADD NEW VOUCHER
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-base-content/70">
                <tr>
                  <th className='px-1 text-center'>Voucher Name</th>
                  <th className='px-1 text-center'>Voucher Code</th>
                  <th className='px-1 text-center'>Type</th>
                  <th className='px-1 text-center'>Discount Value</th>
                  <th className='px-1 text-center'>Minimum Spend</th>
                  <th className='px-1 text-center'>Maximum Discount</th>
                  <th className='px-1 text-center'>Total Usage Limit</th>
                  <th className='px-1 text-center'>Status</th>
                  <th className='px-1 text-center'>Expires At</th>
                  <th className='px-1 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((voucher) => (
                  <tr key={voucher.id} className="hover">
                    <td className='text-center'>{voucher.name}</td>
                    <td className='text-center'><div className="font-bold">{voucher.code}</div></td>
                    <td className='text-center'>{voucher.type === 'fixed' ? 'Fixed Amount' : 'Percentage'}</td>
                    <td className='text-center'>{formatValue(voucher.discountValue, voucher.type)}</td>
                    <td className='text-center'>{formatValue(voucher.minSpend, 'fixed')}</td>
                    <td className='text-center'>{formatValue(voucher.maxDiscount, 'fixed')}</td>
                    <td className='text-center'>{voucher.totalUsageLimit}</td>
                    <td className='text-center'><StatusBadge expiryDate={voucher.expiryDate} /></td>
                    <td className='text-center'>{formatDate(voucher.expiryDate)}</td>
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
                ))}
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
      <dialog id="edit_voucher_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg">Edit Voucher: {editingVoucher?.code}</h3>
          <div className="py-4 space-y-4">
            <div className="form-control"><label className="label"><span className="label-text font-semibold">Voucher Name</span></label><input type="text" name="name" value={editingVoucher?.name || ''} onChange={handleEditFormChange} className="input input-bordered" placeholder="e.g., Summer Sale" /></div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold">Voucher Description</span></label><input type="text" name="description" value={editingVoucher?.description || ''} onChange={handleEditFormChange} className="input input-bordered" placeholder="e.g., 50% off on all items" /></div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold">Voucher Code</span></label><input type="text" name="code" value={editingVoucher?.code || ''} onChange={handleEditFormChange} className="input input-bordered" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Discount Type</span>
                </label>
                <select name="type" className="select select-bordered" value={editingVoucher?.type || 'fixed'} onChange={handleEditFormChange}>
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold">Discount Value</span></label><input type="number" name="discountValue" value={editingVoucher?.discountValue || 0} onChange={handleEditFormChange} className="input input-bordered" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control"><label className="label"><span className="label-text font-semibold">Minimum Spend</span></label><input type="number" name="minSpend" value={editingVoucher?.minSpend} onChange={handleEditFormChange} className="input input-bordered" placeholder="e.g., 200000 (cho 200.000đ)" /></div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold">Maximum Discount</span></label><input type="number" name="maxDiscount" value={editingVoucher?.maxDiscount} onChange={handleEditFormChange} className="input input-bordered" placeholder="e.g., 100000 (cho 100.000đ)" /></div>
            </div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold">Total Usage Limit</span></label><input type="number" name="totalUsageLimit" value={editingVoucher?.totalUsageLimit} onChange={handleFormChange} className="input input-bordered" placeholder="e.g., 100 (cho 100 lần sử dụng)" /></div>
            <div className="form-control"><label className="label"><span className="label-text font-semibold">Expiry Date</span></label><input type="datetime-local" name="expiryDate" value={formatDateTimeForInput(editingVoucher?.expiryDate || '')} onChange={handleEditFormChange} className="input input-bordered" /></div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setEditingVoucher(null)}>Cancel</button></form>
            <button className="btn btn-neutral" onClick={handleUpdate}>Save Changes</button>
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
              <button className="btn" onClick={() => setVoucherToDelete(null)}>Cancel</button>
            </form>
            {/* Nút Delete */}
            <button 
              className="btn btn-error" 
              onClick={handleConfirmDelete}
            >
              Delete
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