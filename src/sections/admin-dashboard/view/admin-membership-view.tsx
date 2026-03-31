"use client"; 

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/toast-context';
import { SplashScreen } from '@/components/loading';
import { CreateRank, IRank, UpdateRank } from '@/interfaces/rank';
import { createRank, deleteRank, getListRank, updateRank } from '@/apis/loyalty';
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
export default function MembershipView() {
  const router = useRouter();
  const { showToast } = useToast();

  const [ranks, setRanks] = useState<IRank[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [errorUpdate, setErrorUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetcherRanks = async () => {
    setIsLoading(true);
    try {
      const response = await getListRank({}, currentPage, ITEMS_PER_PAGE);
      setRanks(response.data || []);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching ranks:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const createRanks = async (dto: CreateRank) => {
    setIsLoading(true);
    try {
      const response = await createRank(dto);
      if (response) {
      fetcherRanks();
      showToast("Đã tạo voucher mới!", "success");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      showToast("Không thể tạo voucher!", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const updateRanks = async (id: string, dto: UpdateRank) => {
    setIsLoading(true);
    try {
      const response = await updateRank(id, dto);
      if (response) {
        fetcherRanks();
        showToast("Đã cập nhật voucher!", "success");
      }
    } catch (error) {
      setErrorUpdate(true);
      console.error("Error updating coupon:", error);
      showToast("Không thể cập nhật voucher!", "error");
    } finally {
      if (!errorUpdate) {
        fetcherRanks();
        showToast("Đã cập nhật voucher!", "success");
      }
      setErrorUpdate(false)
      setIsLoading(false);
    }
  }

  const deleteRanks = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await deleteRank(id);
      fetcherRanks();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      showToast("Không thể xóa voucher!", "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetcherRanks();
  }, []);




  const [newRank, setNewRank] = useState<CreateRank>({
    name: '',
    minPoint: 0,
    discountPercent: 0,
  });

  const handleCreate = async () => {
    console.log("Creating rank:", newRank);
    await createRanks(newRank);

    (document.getElementById('add_rank_modal') as HTMLDialogElement)?.close();
    setNewRank({
      name: '',
      minPoint: 0,
      discountPercent: 0,
    });
  }

  const [editingRank, setEditingRank] = useState<IRank | null>(null);

  const [rankToDelete, setRankToDelete] = useState<IRank | null>(null);

  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue: number | string | Date = value;
    if(name === 'minPoint' || name === 'discountPercent') {
      newValue = parseFloat(value);
    }
    setNewRank(prev => ({ ...prev, [name]: newValue }));
  };
  
  // --- LOGIC CHO MODAL "EDIT" (Giữ nguyên) ---
  const handleOpenEditModal = (rank: IRank) => {
    console.log("Editing rank:", rank);
    setEditingRank(rank);
    (document.getElementById('edit_rank_modal') as HTMLDialogElement)?.showModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("Editing rank:", editingRank);
    if (!editingRank) return;
    const { name, value } = e.target;
    let newValue: number | string | Date = value;
    if(name === 'minPoint' || name === 'discountPercent') {
      newValue = parseFloat(value);
    }
    setEditingRank(prev => ({ ...prev!, [name]: newValue }));
  };

  const handleUpdate = async () => {
    if (!editingRank) return;

    const dataUpdate: UpdateRank = {
      name: editingRank.name,
      minPoint: editingRank.minPoint,
      discountPercent: editingRank.discountPercent
    };

    await updateRanks(editingRank.id, dataUpdate);

    (document.getElementById('edit_rank_modal') as HTMLDialogElement)?.close();
    setEditingRank(null);
  };

  
  const handleOpenDeleteModal = (rank: IRank) => {
    setRankToDelete(rank);
    (document.getElementById('delete_rank_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!rankToDelete) return;

    console.log("Deleting rank:", rankToDelete.id);

    await deleteRanks(rankToDelete.id);

    // Đóng modal
    (document.getElementById('delete_rank_modal') as HTMLDialogElement)?.close();
    setRankToDelete(null);
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
          <h1 className="text-3xl font-bold">Quản lý hạng thành viên</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Hạng thành viên</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            className="btn btn-neutral bg-darkgrey text-white px-2"
            onClick={() => (document.getElementById('add_rank_modal') as HTMLDialogElement)?.showModal()}
          >
            <Plus size={18} /> THÊM HẠNG THÀNH VIÊN
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-base-content/70">
                <tr>
                  <th className='px-1 text-center'>Tên hạng</th>
                  <th className='px-1 text-center'>Điểm tối thiểu</th>
                  <th className='px-1 text-center'>Giảm giá</th>
                  <th className='px-1 text-center'>Ngày tạo</th>
                  <th className='px-1 text-center'>Ngày cập nhật</th>
                  <th className='px-1 text-center'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {ranks && ranks.length > 0 ? (
                  ranks.map((rank) => (
                    <tr key={rank.id} className="hover">
                      <td className='text-center'><div className="font-bold">{rank.name}</div></td>
                      <td className='text-center'>{rank.minPoint}</td>
                      <td className='text-center'>{formatValue(rank.discountPercent, 'percentage')}</td>
                      <td className='text-center'>{formatDate(rank.createdAt)}</td>
                      <td className='text-center'>{formatDate(rank.updatedAt)}</td>
                      <td className='text-center'>
                        <div className="flex gap-1">
                          {/* NÚT EDIT */}
                          <button 
                            className="btn btn-ghost btn-circle btn-sm"
                            onClick={() => handleOpenEditModal(rank)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-circle btn-sm text-error"
                            onClick={() => handleOpenDeleteModal(rank)}
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

      <dialog id="add_rank_modal" className="modal">
        <div className='modal-box w-11/12 max-w-2xl'>
          <h3 className="font-bold text-lg">Thêm hạng thành viên</h3>
          <div className="py-4 space-y-4">
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Tên hạng</span></label><input type="text" name="name" value={newRank.name} onChange={handleFormChange} className="input input-bordered rounded-lg" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Điểm tối thiểu</span>
                </label>
                <input type="number" name="minPoint" value={newRank.minPoint} onChange={handleFormChange} className="input input-bordered rounded-lg" />
              </div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Giảm giá</span></label><input type="number" name="discountPercent" value={newRank.discountPercent > 0 ? newRank.discountPercent : ''} onChange={handleFormChange} placeholder='e.g. 100.000' className="input input-bordered rounded-lg" /></div>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn mr-2" onClick={() => setEditingRank(null)}>Huỷ</button></form>
            <button className="btn btn-primary bg-darkgrey text-white px-2" onClick={handleCreate}>Tạo</button>
          </div>
        </div>
      </dialog>
      <dialog id="edit_rank_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg">Chỉnh sửa hạng thành viên: {editingRank?.name}</h3>
          <div className="py-4 space-y-4">
            <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Tên hạng</span></label><input type="text" name="name" value={editingRank?.name || ''} onChange={handleEditFormChange} className="input input-bordered rounded-lg" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Điểm tối thiểu</span></label><input type="number" name="minPoint" value={editingRank?.minPoint} onChange={handleEditFormChange} className="input input-bordered rounded-lg" /></div>
              <div className="form-control"><label className="label"><span className="label-text font-semibold mr-2">Giảm giá</span></label><input type="number" name="discountPercent" value={editingRank?.discountPercent} onChange={handleEditFormChange} placeholder='e.g. 100.000' className="input input-bordered rounded-lg" /></div>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn mr-2" onClick={() => setEditingRank(null)}>Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdate}>Lưu thay đổi</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingRank(null)}>close</button></form>
      </dialog>

      {/* === 6. MODAL "DELETE CONFIRM" (MỚI) === */}
      <dialog id="delete_rank_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa hạng thành viên <strong className="text-error">{rankToDelete?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* Nút Cancel */}
              <button className="btn mr-2" onClick={() => setRankToDelete(null)}>Huỷ</button>
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
          <button onClick={() => setRankToDelete(null)}>close</button>
        </form>
      </dialog>

    </div>
  );
}