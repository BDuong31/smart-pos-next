"use client";

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo, useRef, useEffect } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { useToast } from '@/context/toast-context';
import { SplashScreen } from '@/components/loading';
import { CreateTable, ITableDetail, UpdateTable } from '@/interfaces/table';
import { TableStatus } from '@/interfaces/table';
import { IZone } from '@/interfaces/zone';
import { getZones } from '@/apis/zone';
import { createTable, deleteTable, getTables, updateTable } from '@/apis/table';

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

const ZoneDropdown = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (id: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState<IZone[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // ✅ Sửa lỗi: Đổi giá trị khởi tạo thành false để fetchZone lần đầu có thể chạy
    const [loading, setLoading] = useState(false); 

    const ref = useRef<HTMLDivElement>(null);

    const fetchZone = async (pageNum: number) => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            const res = await getZones({}, pageNum, 10);

            if (res?.data) {
                setList((prev) => [...prev, ...res.data]);

                if (res.data.length < 10) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZone(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            const next = page + 1;
            setPage(next);
            fetchZone(next);
        }
    }; // ✅ Đã thêm dấu đóng ngoặc cho hàm handleScroll ở đây!

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // ✅ Sửa lỗi: Đổi '=' thành '==='
    const selected = list.find((i) => i.id === value); 

    // ✅ Return đã nằm đúng ở cấp Component
    return (
        <div ref={ref} className="relative w-full">
            <div
                className="input input-bordered w-full cursor-pointer flex items-center"
                onClick={() => setOpen(!open)}
            >
                {selected?.name || "Chọn khu vực"}
            </div>

            {open && (
                <div
                    className="absolute z-50 mt-1 w-full border rounded bg-white max-h-60 overflow-y-auto shadow"
                    onScroll={handleScroll}
                >
                    {list.map((item) => (
                        <div
                            key={item.id}
                            className={`p-2 cursor-pointer hover:bg-blue-100 ${
                                value === item.id ? "bg-blue-200 font-semibold" : ""
                            }`}
                            onClick={() => {
                                onChange(item.id);
                                setOpen(false);
                            }}
                        >
                            {item.name}
                        </div>
                    ))}

                    {loading && (
                        <div className="text-center p-2 text-sm">Đang tải...</div>
                    )}

                    {!hasMore && (
                        <div className="text-center p-2 text-xs text-gray-400">
                            Hết dữ liệu
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function ZoneView() {
  const [tableList, setTableList] = useState<ITableDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [newCapacity, setNewCapacity] = useState(0);
  const [newIsActive, setNewIsActive] = useState(true);

  const [editingTable, setEditingTable] = useState<ITableDetail>();

  const [tableToDelete, setTableToDelete] = useState<ITableDetail>();

  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const fechterTable = async () => {
    try {
      const data = await getTables({}, currentPage, ITEMS_PER_PAGE);
      if (data) {
        console.log(data);
        setTableList(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  React.useEffect(() => {
    setLoading(true);
    fechterTable().finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!selectedZoneId) {
      showToast("Khu vực không được để trống.", "error");
      return;
    }

    if (!newTableName.trim()) {
       showToast("Tên bàn không được để trống.", "error");
       return;
    }

    if (!newCapacity) {
      showToast("Số lượng người không được để trống.", "error");
      return;
    }

    if (!newIsActive) {
        showToast("Trạng thái không được để trống.", "error");
        return;
    }

    const data: CreateTable = {
        zoneId: selectedZoneId,
        name: newTableName,
        qrCode: `${newTableName.trim()}-${crypto.randomUUID().split('-')[0]}`,
        capacity: newCapacity,
        isActive: newIsActive,
    };

    try {
      setLoading(true);
      const response = await createTable(data);
      if (response) {
        showToast(`Đã tạo bàn "${data.name}"!`, "success");
        fechterTable().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Lỗi tạo bàn mới:", error);
      showToast("Tạo bàn thất bại, vui lòng thử lại.", "error");
    }
    
    (document.getElementById('add_modal') as HTMLDialogElement)?.close();
    setSelectedZoneId("");
    setNewTableName("");
    setNewCapacity(0);
    setNewIsActive(true);
  };
  
  const handleOpenEditModal = (table: ITableDetail) => {
    setEditingTable(table);
    (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
  };

  const handleUpdate = async () => {
    if (!editingTable || !editingTable.name.trim()) {
        showToast("Tên bàn không được để trống.", "error");
       return;
    }

    const data: UpdateTable = {
      zoneId: editingTable.zoneId,
      name: editingTable.name,
      qrCode: `${editingTable.name.trim()}-${crypto.randomUUID().split('-')[0]}`,
      capacity: editingTable.capacity,
      isActive: editingTable.isActive,
      status: editingTable.status,
    };

    try {
      setLoading(true);
      const response = await updateTable(editingTable.id, data);
    } catch (error) {
      console.error("Lỗi cập nhật khu vực:", error);
      showToast("Cập nhật khu vực thất bại, vui lòng thử lại.", "error");
    } finally {
        showToast(`Đã cập nhật khu vực "${data.name}"!`, "success");
        fechterTable().finally(() => setLoading(false));
      
    }

    (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
    setEditingTable(undefined);
  };

  const handleOpenDeleteModal = (table: ITableDetail) => {
    setTableToDelete(table);
    (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!tableToDelete) return;

    try {
      setLoading(true)
      const response = await deleteTable(tableToDelete.id);
    } catch (error) {
      console.error("Lỗi xoá khu vực:", error);
      showToast("Xóa khu vực thất bại, vui lòng thử lại.", "error");
    } finally {
      setLoading(false)
      showToast(`Đã xóa khu vực "${tableToDelete.name}"!`, "success");
      fechterTable();
    }
    
    (document.getElementById('delete_modal') as HTMLDialogElement)?.close();
    setTableToDelete(undefined);
  };

  const filteredTable = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm?.toLowerCase() ?? '';
    return tableList
      ?.filter(table => {
        const tableName = table?.name ?? ''; 
        
        return tableName.toLowerCase().includes(lowerCaseSearchTerm);
      });
  }, [searchTerm, tableList]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTable.length / ITEMS_PER_PAGE);
  }, [filteredTable]);

  const currentTable = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTable?.slice(startIndex, endIndex);
  }, [currentPage, filteredTable]);

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
                  <th>Tên bàn</th>
                  <th>Khu vực</th>
                  <th>Số lượng ghế</th>
                  <th>Tình trạng</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Ngày cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentTable?.map((table) => (
                  <tr key={table.id} className="hover">
                    <td>
                        <div className="font-bold">{table.name}</div>
                    </td>
                    <td>
                        <div className="font-bold">{table.zone.name}</div>
                    </td>
                    <td>
                        <div className="font-bold">{table.capacity}</div>
                    </td>
                    <td>
                        <div className={`${table.isActive ? 'text-success' : 'text-error'} font-bold`} >{table.isActive ? 'Sẵn sàng' : 'Bảo trì'}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`${table.status === 'available' ? 'text-success' : table.status === 'occupied' ? 'text-error' : table.status === 'reserved' ? 'text-warning' : 'text-info'} font-bold`}>{TableStatus[table.status]}</span>
                      </div>
                    </td>
                    <td>{formatDate(table?.createdAt)}</td>
                    <td>{formatDate(table?.updatedAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-circle btn-sm"
                          onClick={() => handleOpenEditModal(table)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-circle btn-sm text-error"
                          onClick={() => handleOpenDeleteModal(table)}
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
          <h3 className="font-bold text-lg">Thêm bàn mới</h3>
          <ZoneDropdown
            value={selectedZoneId}
            onChange={setSelectedZoneId}
          />
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên bàn</span></label>
              <input 
                type="text"
                name="name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="e.g., Bàn 1"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Số chỗ ngồi</span></label>
              <input
                type="number"
                name="capacity"
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                className="input input-bordered w-full"
                placeholder="e.g., 4"
              />
            </div>
            <div className="form-control">
                <label className='label mb-1'><span className='label-text font-semibold'>Tình Trạng</span></label>
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
          <h3 className="font-bold text-lg">Sửa bàn: {editingTable?.name}</h3>
          <ZoneDropdown
            value={editingTable?.zoneId || ''}
            onChange={(id) => setEditingTable(prev => prev ? {...prev, zoneId: id} : prev)}
          />
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên bàn</span></label>
              <input 
                type="text" 
                name="name"
                value={editingTable?.name || ''}
                onChange={(e) => setEditingTable(prev => prev ? {...prev, name: e.target.value} : prev)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Số chỗ ngồi</span></label>
              <input
                type="number"
                name="capacity"
                value={editingTable?.capacity || ''}
                onChange={(e) => setEditingTable(prev => prev ? {...prev, capacity: Number(e.target.value)} : prev)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tình Trạng</span></label>
              <input
                type="checkbox"
                name="isActive"
                checked={editingTable?.isActive}
                onChange={(e) => setEditingTable(prev => prev ? {...prev, isActive: e.target.checked} : prev)}
                className="checkbox"
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setEditingTable(undefined)}>Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdate}>Lưu thay đổi</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingTable(undefined)}>Thoát</button></form>
      </dialog>

      {/* === 6. MODAL "DELETE CONFIRM" === */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa bàn <strong className="text-error">{tableToDelete?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setTableToDelete(undefined)}>Huỷ</button></form>
            <button className="btn btn-error bg-darkgrey text-white px-2" onClick={handleConfirmDelete}>Xóa</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setTableToDelete(undefined)}>Thoát</button></form>
      </dialog>

    </div>
  );
}