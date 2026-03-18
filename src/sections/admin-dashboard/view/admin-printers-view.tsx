"use client"; 

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { ICategoryCreate, ICategoryUpdate, ICategory } from '@/interfaces/category';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/apis/category';
import { useToast } from '@/context/toast-context';
import { SplashScreen } from '@/components/loading';
import { IPrinter, IPrinterCreate, IPrinterUpdate } from '@/interfaces/printer';
import { createPrinter, deletePrinter, getPrinters, updatePrinter } from '@/apis/printer';

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
  for (let i = 0; i < range.length; i++) { 
    if (
      range[i] === '...' && 
      i > 0 && 
      i < range.length - 1 && 
      typeof range[i-1] === 'number' && 
      typeof range[i+1] === 'number' && 
      (range[i-1] as number) + 1 === (range[i+1] as number)
    ) { 
      continue; 
    } 
    finalRange.push(range[i]); 
  }
  return finalRange;
};

export default function CategoriesView() {
  const [printerList, setPrinterList] = useState<IPrinter[]>([]);
  const [currentPrinters, setCurrentPrinters] = useState<IPrinter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [newPrinterName, setNewPrinterName] = useState("");

  const [newPrinterIpAddress, setNewPrinterIpAddress] = useState<string | null>(null);

  const [newPrinterType, setNewPrinterType] = useState<string | null>(null);

  const [editingPrinter, setEditingPrinter] = useState<IPrinter>();

  const [printerToDelete, setPrinterToDelete] = useState<IPrinter>();

  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // Loại máy in có thể là in hóa đơn, in bếp, in pha chế bằng tiếng anh
  const printerTypes = [
    { label: "In hóa đơn", value: "RECEIPT" }, // máy in hóa đơn
    { label: "In bếp", value: "KITCHEN" }, // máy in bếp
    { label: "In pha chế", value: "BAR" }, // máy in pha chế
    { label: "In tem nhãn", value: "LABEL" }, // máy in tem nhãn
    { label: "In khác", value: "OTHER" }, // máy in khác
  ]

  const fechterPrinters = async () => {
    try {
      const name = searchTerm || undefined;
      const ipAddress = undefined;
        const type = undefined;
      const page = currentPage;
      const limit = ITEMS_PER_PAGE;
      const data = await getPrinters(name, ipAddress, type, page, limit);
      if (data) {
        console.log(data);
        setPrinterList(data.data);
        setTotalPages(data.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1);
      }
    } catch (error) {
      console.error("Error fetching printers:", error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    setLoading(true);
    fechterPrinters();
  }, []);

  React.useEffect(() => {
    setLoading(true);
    fechterPrinters();
  }, [currentPage]);

  React.useEffect(() => {
    setCurrentPrinters(printerList);
  }, [printerList]);

  const handleCreate = async () => {
    if (!newPrinterName.trim()) {
       showToast("Tên printer không được để trống.", "error");
       return;
    }

    const data: IPrinterCreate = {
        name: newPrinterName,
        ipAddress: newPrinterIpAddress || '',
        type: newPrinterType || '',
    };

    try {
      setLoading(true);
      const response = await createPrinter(data);
      if (response && response.data) {
        setPrinterList(prevList => [...prevList, response.data]);
        showToast(`Đã tạo printer "${data.name}"!`, "success");
        fechterPrinters().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Error creating category:", error);
      showToast("Tạo category thất bại, vui lòng thử lại.", "error");
    }
    
    (document.getElementById('add_modal') as HTMLDialogElement)?.close();
    setNewPrinterName("");
    setNewPrinterIpAddress(null);
    setNewPrinterType(null);
  };
  
  const handleOpenEditModal = (printer: IPrinter) => {
    setEditingPrinter(printer);
    (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingPrinter) return;
    setEditingPrinter(prev => ({ ...prev!, name: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!editingPrinter || !editingPrinter.name.trim()) {
        showToast("Tên printer không được để trống.", "error");
       return;
    }

    const data: IPrinterUpdate = {
      name: editingPrinter.name,
      ipAddress: editingPrinter.ipAddress,
      type: editingPrinter.type,
    };

    try {
      setLoading(true);
      const response = await updatePrinter(editingPrinter.id, data);
      if (response && response.data) {
        showToast(`Đã cập nhật printer "${data.name}"!`, "success");
        setPrinterList(prevList => prevList.map(p => p.id === editingPrinter.id ? response.data! : p));
        fechterPrinters().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Error updating printer:", error);
      showToast("Cập nhật printer thất bại, vui lòng thử lại.", "error");
    }

    (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
    setEditingPrinter(undefined);
  };

  const handleOpenDeleteModal = (printer: IPrinter) => {
    setPrinterToDelete(printer);
    (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!printerToDelete) return;

    try {
      const response = await deletePrinter(printerToDelete.id);
      console.log("Deleted printer:", response);
      showToast(`Đã xóa printer "${printerToDelete.name}"!`, "success");
      fechterPrinters();
    } catch (error) {
      console.error("Error deleting printer:", error);
      showToast("Xóa printer thất bại, vui lòng thử lại.", "error");
    }
    
    (document.getElementById('delete_modal') as HTMLDialogElement)?.close();
    setPrinterToDelete(undefined);
  };

  const filteredPrinters = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm?.toLowerCase() ?? '';
    return printerList
      ?.filter(printer => {
        const printerName = printer.name ?? ''; 
        
        return printerName.toLowerCase().includes(lowerCaseSearchTerm);
      });
  }, [searchTerm, printerList]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <SplashScreen className='h-[100vh]'/>
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý máy in</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Máy in</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <label className="input bg-transparent border border-graymain flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              className="grow border-none" 
              placeholder="Tìm kiếm máy in bằng tên" 
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
            THÊM MÁY IN MỚI
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
                  <th>Tên máy in</th>
                  <th>Địa chỉ IP</th>
                  <th>Loại</th>
                  <th>Ngày tạo</th>
                  <th>Ngày cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentPrinters?.map((printer) => (
                  <tr key={printer.id} className="hover">
                    <td>
                      <div className="font-bold">{printer.name}</div>
                    </td>
                    <td>
                      <div className="font-bold">{printer.ipAddress}</div>
                    </td>
                    <td>
                      <div className="font-bold">{printerTypes.find((t) => t.value === printer.type)?.label || 'Unknown'}</div>
                    </td>
                    <td>{formatDate(printer?.createdAt)}</td>
                    <td>{formatDate(printer?.updatedAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button 
                          className="btn btn-ghost btn-circle btn-sm"
                          onClick={() => handleOpenEditModal(printer)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-circle btn-sm text-error"
                          onClick={() => handleOpenDeleteModal(printer)}
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

      {/* === 4. MODAL "ADD NEW" === */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Thêm máy in mới</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên máy in</span></label>
              <input 
                type="text" 
                name="name" 
                value={newPrinterName} 
                onChange={(e) => setNewPrinterName(e.target.value)} 
                className="input input-bordered w-full" 
                placeholder="e.g., Máy in bếp 1" 
              />
            </div>
            <div className="form-control">
              <label className="label mb-1"><span className="label-text font-semibold">Địa chỉ IP</span></label>
              <input 
                type="text" 
                name="ipAddress" 
                value={newPrinterIpAddress || ''} 
                onChange={(e) => setNewPrinterIpAddress(e.target.value)} 
                className="input input-bordered w-full" 
                placeholder="e.g., 192.168.1.100" 
              />
            </div>
            <div className="form-control">
              <label className="label mb-1"><span className="label-text font-semibold">Loại máy in</span></label>
              <select
                  name="type"
                  value={newPrinterType || ''}
                  onChange={(e) => setNewPrinterType(e.target.value)}
                  className="select select-bordered w-full"
              >
                  <option value="">Chọn loại máy in</option>
                  {printerTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleCreate}>Lưu</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setNewPrinterName('')}>close</button></form>
      </dialog>

      {/* === 5. MODAL "EDIT" === */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Sửa máy in: {editingPrinter?.name}</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên máy in</span></label>
              <input 
                type="text" 
                name="name"
                value={editingPrinter?.name || ''} 
                onChange={handleEditFormChange}
                className="input input-bordered w-full" 
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Địa chỉ IP</span></label>
            <input
                type="text"
                name="ipAddress"
                value={editingPrinter?.ipAddress || ''}
                onChange={handleEditFormChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Loại máy in</span></label>
                <select
                    name="type"
                    value={editingPrinter?.type || ''}
                    onChange={(e) => setEditingPrinter(prev => prev ? { ...prev, type: e.target.value } : prev)}
                    className="select select-bordered w-full"
                >
                    <option value="">Chọn loại máy in</option>
                    {printerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                </select>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setEditingPrinter(undefined)}>Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdate}>Lưu thay đổi</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingPrinter(undefined)}>Thoát</button></form>
      </dialog>

      {/* === 6. MODAL "DELETE CONFIRM" === */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa máy in <strong className="text-error">{printerToDelete?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setPrinterToDelete(undefined)}>Huỷ</button></form>
            <button className="btn btn-error bg-darkgrey text-white px-2" onClick={handleConfirmDelete}>Xóa</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setPrinterToDelete(undefined)}>Thoát</button></form>
      </dialog>

    </div>
  );
}