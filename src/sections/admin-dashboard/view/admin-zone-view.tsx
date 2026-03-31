"use client";

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { useToast } from '@/context/toast-context';
import { SplashScreen } from '@/components/loading';
import { CreateZone, IZone, UpdateZone } from '@/interfaces/zone';
import { createZone, deleteZone, getZones, updateZone } from '@/apis/zone';

const ITEMS_PER_PAGE = 7;

const getPaginationRange = (currentPage: number, totalPages: number) => {
  const range = [];
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
  let finalRange = [];
  for (let i = 0; i < range.length; i++) { if (range[i] === '...' && i > 0 && i < range.length - 1 && Number(range[i-1]) + 1 === range[i+1]) { continue; } finalRange.push(range[i]); }
  return finalRange;
};

export default function ZoneView() {
  const [zoneList, setZoneList] = useState<IZone[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [newZoneName, setNewZoneName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsActive, setNewIsActive] = useState(true);

  const [editingZone, setEditingZone] = useState<IZone>();

  const [zoneToDelete, setZoneToDelete] = useState<IZone>();

  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const fechterZones = async () => {
    try {
      const data = await getZones({}, currentPage, ITEMS_PER_PAGE);
      if (data) {
        console.log(data);
        setZoneList(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  React.useEffect(() => {
    setLoading(true);
    fechterZones().finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newZoneName.trim()) {
       showToast("Tên category không được để trống.", "error");
       return;
    }

    if (!newDescription.trim()) {
      showToast("Mô tả không được để trống.", "error");
      return;
    }

    if (!newIsActive) {
        showToast("Trạng thái không được để trống.", "error");
        return;
    }

    const data: CreateZone = {
        name: newZoneName,
        description: newDescription,
        isActive: newIsActive,
    };

    try {
      setLoading(true);
      const response = await createZone(data);
      if (response) {
        showToast(`Đã tạo khu vực "${data.name}"!`, "success");
        fechterZones().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Lỗi tạo khu vực mới:", error);
      showToast("Tạo khu vực thất bại, vui lòng thử lại.", "error");
    }
    
    (document.getElementById('add_modal') as HTMLDialogElement)?.close();
    setNewZoneName("");
    setNewDescription("");
    setNewIsActive(true);
  };
  
  const handleOpenEditModal = (zone: IZone) => {
    setEditingZone(zone);
    (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingZone) return;
    setEditingZone(prev => ({ ...prev!, name: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!editingZone || !editingZone.name.trim()) {
        showToast("Tên khu vực không được để trống.", "error");
       return;
    }

    const data: UpdateZone = {
      name: editingZone.name,
      description: editingZone.description,
      isActive: editingZone.isActive,
    };

    try {
      setLoading(true);
      const response = await updateZone(editingZone.id, data);
      console.log(response.status)
    } catch (error) {
      console.error("Lỗi cập nhật khu vực:", error);
      showToast("Cập nhật khu vực thất bại, vui lòng thử lại.", "error");
    } finally {
        showToast(`Đã cập nhật khu vực "${data.name}"!`, "success");
        fechterZones().finally(() => setLoading(false));
      
    }

    (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
    setEditingZone(undefined);
  };

  const handleOpenDeleteModal = (zone: IZone) => {
    setZoneToDelete(zone);
    (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!zoneToDelete) return;

    try {
      setLoading(true)
      const response = await deleteZone(zoneToDelete.id);
    } catch (error) {
      console.error("Lỗi xoá khu vực:", error);
      showToast("Xóa khu vực thất bại, vui lòng thử lại.", "error");
    } finally {
      setLoading(false)
      showToast(`Đã xóa khu vực "${zoneToDelete.name}"!`, "success");
      fechterZones();
    }
    
    (document.getElementById('delete_modal') as HTMLDialogElement)?.close();
    setZoneToDelete(undefined);
  };

  const filteredZone = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm?.toLowerCase() ?? '';
    return zoneList
      ?.filter(zone => {
        const zoneName = zone?.name ?? ''; 
        
        return zoneName.toLowerCase().includes(lowerCaseSearchTerm);
      });
  }, [searchTerm, zoneList]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredZone.length / ITEMS_PER_PAGE); 
  }, [filteredZone]);

  const currentZone = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredZone?.slice(startIndex, endIndex); 
  }, [currentPage, filteredZone]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <SplashScreen className='h-[100vh]'/>
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Danh mục</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <label className="input bg-transparent border border-graymain flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              className="grow border-none" 
              placeholder="Tìm kiếm danh mục bằng tên" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search size={16} className="opacity-50" />
          </label>
          
          <button 
            className="btn btn-neutral bg-darkgrey text-white flex justify-center items-center gap-2 px-2"
            onClick={() => (document.getElementById('add_modal') as HTMLDialogElement)?.showModal()}
          >
            <Plus size={18} />
            THÊM DANH MỤC MỚI
          </button>
        </div>
      </div>

      {/* 2. Bảng Categories */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-base-content/70">
                <tr>
                  <th>Tên khu vực</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Ngày cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentZone?.map((zone) => (
                  <tr key={zone.id} className="hover">
                    <td>
                        <div className="font-bold">{zone.name}</div>
                    </td>
                    <td>
                        <div className="font-bold">{zone.description}</div>
                    </td>
                    <td>
                        <div className={`${zone.isActive ? 'text-success' : 'text-error'} font-bold`} >{zone.isActive ? 'Sẵn sàng' : 'Bảo trì'}</div>
                    </td>
                    <td>{formatDate(zone?.createdAt)}</td>
                    <td>{formatDate(zone?.updatedAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-circle btn-sm"
                          onClick={() => handleOpenEditModal(zone)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-circle btn-sm text-error"
                          onClick={() => handleOpenDeleteModal(zone)}
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

      {/* 3. Pagination (Giữ nguyên) */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-0">
              <button onClick={goToPrevPage} disabled={currentPage === 1} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"><GrFormPrevious size={18} /> TRƯỚC</button>
              {pageNumbers.map((item, index) => (
                  <React.Fragment key={index}>
                      {item === '...' ? (<span className="px-3 py-2 text-gray-700">...</span>) : (
                          <button onClick={() => goToPage(item as number)} className={`px-4 py-2 rounded-xl font-semibold transition border ${currentPage === item ? 'bg-black text-white border-black bg-neutral-950' : 'text-black border-gray-300 hover:bg-gray-100'}`}>{item}</button>
                      )}
                  </React.Fragment>
              ))}
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4">TIẾP <GrFormNext size={18} className="rotate-180" /></button>
          </div>
      )}

      {/* === 4. MODAL "ADD NEW" === */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Thêm khu vực mới</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên khu vực</span></label>
              <input 
                type="text" 
                name="name" 
                value={newZoneName} 
                onChange={(e) => setNewZoneName(e.target.value)} 
                className="input input-bordered w-full" 
                placeholder="e.g., Khu vực 1" 
              />
            </div>
            <div className="form-control">
              <label className="label mb-1"><span className="label-text font-semibold">Mô tả</span></label>
              <input
                type='text'
                name="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="input input-bordered w-full"
                placeholder="e.g., Khu vực ..."
              />
            </div>
            <div className="form-control">
                <label className='label mb-1'><span className='label-text font-semibold'>Trạng thái</span></label>
            </div>
            <input
                type='checkbox'
                name='isActive'
                checked={newIsActive}
                onChange={(e) => setNewIsActive(e.target.checked)}
                className='checkbox'
            />
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleCreate}>Lưu</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => {}}>close</button></form>
      </dialog>

      {/* === 5. MODAL "EDIT" === */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Sửa khu vực: {editingZone?.name}</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên khu vực</span></label>
              <input 
                type="text" 
                name="name"
                value={editingZone?.name || ''} 
                onChange={(e) => setEditingZone(prev => prev ? {...prev, name: e.target.value} : prev)}
                className="input input-bordered w-full" 
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Mô tả</span></label>
              <input
                type="text"
                name="description"
                value={editingZone?.description || ''}
                onChange={(e) =>  setEditingZone(prev => prev ? {...prev, description: e.target.value} : prev)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Trạng thái</span></label>
              <input
                type="checkbox"
                name="isActive"
                checked={editingZone?.isActive}
                onChange={(e) => setEditingZone(prev => prev ? {...prev, isActive: e.target.checked} : prev)}
                className="checkbox"
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setEditingZone(undefined)}>Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdate}>Lưu thay đổi</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingZone(undefined)}>Thoát</button></form>
      </dialog>

      {/* === 6. MODAL "DELETE CONFIRM" === */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa khu vực <strong className="text-error">{zoneToDelete?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setZoneToDelete(undefined)}>Huỷ</button></form>
            <button className="btn btn-error bg-darkgrey text-white px-2" onClick={handleConfirmDelete}>Xóa</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setZoneToDelete(undefined)}>Thoát</button></form>
      </dialog>

    </div>
  );
}