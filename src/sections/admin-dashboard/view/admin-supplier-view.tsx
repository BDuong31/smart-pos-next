"use client";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { SplashScreen } from "@/components/loading";
import { ISupplier, ISupplierCreate, ISupplierUpdate } from "@/interfaces/supplier";
import React, { useMemo, useState } from "react";
import { useToast } from "@/context/toast-context";
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "@/apis/supplier";
import { GrFormPrevious } from "react-icons/gr";

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

export default function SupplierView() {
    const [ suppliers, setSuppliers ] = useState<ISupplier[]>([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ searchTerm, setSearchTerm ] = useState('');

    const [newSupplierName, setNewSupplierName] = useState('');
    const [newSupplierContact, setNewSupplierContact] = useState('');

    const [editingSupplier, setEditingSupplier] = useState<ISupplier>();
    const [deletingSupplier, setDeletingSupplier] = useState<ISupplier>();
    
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();

    const fechterSuppliers = async () => {
        try {
            setLoading(true);
            const name = undefined;
            const page = currentPage;
            const limit = ITEMS_PER_PAGE;
            const { data } = await getSuppliers(name, page, limit);
            if (data) {
                setSuppliers(data);
            }
        } catch (error) {
            showToast('Lỗi khi tải danh sách nhà cung cấp', 'error');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fechterSuppliers();
    }, [])

    const handleCreate = async () => {
        if (!newSupplierName || !newSupplierContact) {
            showToast('Vui lòng điền vào tất cả các trường', 'error');
            return;
        }
        
        const data: ISupplierCreate = {
            name: newSupplierName,
            contact: newSupplierContact,
        }

        try {
            setLoading(true);
            const response = await createSupplier(data);
            if (response && response.data) {
                showToast('Tạo nhà cung cấp thành công', 'success');
                fechterSuppliers();
            }
        } catch (error) {
            showToast('Lỗi khi tạo nhà cung cấp', 'error');
        } finally {
            setLoading(false);
        }

        (document.getElementById('add_modal') as HTMLDialogElement)?.close();
        setNewSupplierName('');
        setNewSupplierContact('');
    }

    const handleOpenEditModal = (supplier: ISupplier) => {
        setEditingSupplier(supplier);
        (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
    }

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingSupplier) return;
        setEditingSupplier(prev => ({ ...prev!, name: e.target.value }));
    }

    const handleUpdate = async () => {
        if (!editingSupplier || !editingSupplier.name.trim()) {
            showToast('Vui lòng điền vào tất cả các trường', 'error');  
            return;
        }

        const data: ISupplierUpdate = {
            name: editingSupplier.name,
            contact: editingSupplier.contact,
        }

        try {
            setLoading(true);
            const response = await updateSupplier(editingSupplier.id, data);
            if (response && response.data) {
                showToast('Cập nhật nhà cung cấp thành công', 'success');
                fechterSuppliers();
            }
        } catch (error) {
            showToast('Lỗi khi cập nhật nhà cung cấp', 'error');
        } finally {
            setLoading(false);
        }

        (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
        setEditingSupplier(undefined);
    }

    const handleOpenDeleteModal = (supplier: ISupplier) => {
        setDeletingSupplier(supplier);
        (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
    }

    const handleConfirmDelete = async () => {
        if (!deletingSupplier) return;

        try {
            setLoading(true);
            const response = await deleteSupplier(deletingSupplier.id);
            showToast(`Đã xoá nhà cung cấp ${deletingSupplier.name}`, 'success');
            fechterSuppliers();
        } catch (error) {
            showToast('Lỗi khi xoá nhà cung cấp', 'error');
        } finally {
            setLoading(false);
        }

        (document.getElementById('delete_modal') as HTMLDialogElement)?.close();
        setDeletingSupplier(undefined);
    }

    const filteredSuppliers = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase() ?? '';
        return  suppliers
            ?.filter(supplier => {
                const supplierName = supplier?.name ?? '';
                return supplierName.toLowerCase().includes(lowerCaseSearchTerm);
            });
    }, [searchTerm, suppliers]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
    }, [filteredSuppliers]);

    const currentSuppliers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;     
        return filteredSuppliers.slice(startIndex, endIndex);
    }, [currentPage, filteredSuppliers]);

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
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    if (loading) {
        return <SplashScreen className='h-[100vh]'/>;
    }
    return (
        <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý nhà cung cấp</h1>
                    <p className="text-base-content/70 text-sm">Trang chủ &gt; Nhà cung cấp</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <label className="input bg-transparent border border-graymain flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            className="grow border-none"
                            placeholder="Tìm kiếm nhà cung cấp bằng tên"
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
                        THÊM NHÀ CUNG CẤP
                    </button>
                </div>
            </div>

            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead className="text-base-content/70">
                                <tr>
                                    <th>Tên nhà cung cấp</th>
                                    <th>Thông tin liên hệ</th>
                                    <th>Ngày tạo</th>
                                    <th>Ngày cập nhật</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSuppliers?.map((supplier) => (
                                    <tr key={supplier.id} className="hover">
                                        <td>
                                            <div className="font-bold">{supplier.name}</div>
                                        </td>
                                        <td>
                                            <div>{supplier.contact}</div>
                                        </td>
                                        <td>{formatDate(supplier.createdAt)}</td>
                                        <td>{formatDate(supplier.updatedAt)}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline btn-primary"
                                                onClick={() => handleOpenEditModal(supplier)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline btn-error"
                                                onClick={() => handleOpenDeleteModal(supplier)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
                    <button onClick={goToPrevPage} disabled={currentPage === 1} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"><GrFormPrevious size={18} />TRƯỚC</button>
                    {pageNumbers.map((item, index) => (
                        <React.Fragment key={index}>
                            {item === '...' ? (<span className="px-3 py-2 text-gray-700">...</span>) : (
                                <button onClick={() => goToPage(item as number)} className={`px-4 py-2 rounded-xl font-semibold transition border ${currentPage === item ? 'bg-black text-white border-black bg-neutral-950' : 'text-black border-gray-300 hover:bg-gray-100'}`}>{item}</button>
                            )}
                        </React.Fragment>
                    ))}
                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4">TIẾP <GrFormPrevious size={18} className="rotate-180" /></button>
                </div>
            )}

            <dialog id="add_modal" className="modal">
                <div className="modal-box w-11/12 max-w-lg">
                <h3 className="font-bold text-lg">Thêm nhà cung cấp mới</h3>
                <div className="py-4 space-y-4">
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Tên nhà cung cấp</span></label>
                    <input 
                        name="name" 
                        value={newSupplierName} 
                        onChange={(e) => setNewSupplierName(e.target.value)} 
                        className="input input-bordered w-full" 
                        placeholder="e.g., Công ty TNHH ABC" 
                    />
                    </div>
                    <div className="form-control">
                        <label className="label mb-1"><span className="label-text font-semibold">Thông tin liên hệ</span></label>
                        <input 
                            name="contactInfo" 
                            value={newSupplierContact} 
                            onChange={(e) => setNewSupplierContact(e.target.value)} 
                            className="input input-bordered w-full" 
                            placeholder="e.g., 0123456789" 
                        />
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog"><button className="btn">Huỷ</button></form>
                    <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleCreate}>Lưu</button>
                </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={() => setNewSupplierName('')}>close</button></form>
            </dialog>

            {/* === 5. MODAL "EDIT" === */}
            <dialog id="edit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-lg">
                <h3 className="font-bold text-lg">Sửa nhà cung cấp: {editingSupplier?.name}</h3>
                <div className="py-4 space-y-4">
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Tên nhà cung cấp</span></label>
                    <input 
                        type="text" 
                        name="name"
                        value={editingSupplier?.name || ''} 
                        onChange={handleEditFormChange}
                        className="input input-bordered w-full" 
                    />
                    </div>
                    <div className="form-control">
                        <label className="label w-full mb-1"><span className="label-text font-semibold">Thông tin liên hệ</span></label>
                        <input 
                            type="text" 
                            name="contactInfo"
                            value={editingSupplier?.contact || ''} 
                            onChange={(e) => setEditingSupplier(prev => ({ ...prev!, contact: e.target.value }))} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog"><button className="btn" onClick={() => setEditingSupplier(undefined)}>Huỷ</button></form>
                    <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdate}>Lưu thay đổi</button>
                </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingSupplier(undefined)}>Thoát</button></form>
            </dialog>

            {/* === 6. MODAL "DELETE CONFIRM" === */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
                <p className="py-4">
                    Bạn có chắc muốn xóa nhà cung cấp <strong className="text-error">{deletingSupplier?.name}</strong>?
                    <br/>
                    Hành động này không thể hoàn tác.
                </p>
                <div className="modal-action">
                    <form method="dialog"><button className="btn" onClick={() => setDeletingSupplier(undefined)}>Huỷ</button></form>
                    <button className="btn btn-error bg-darkgrey text-white px-2" onClick={handleConfirmDelete}>Xóa</button>
                </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={() => setDeletingSupplier(undefined)}>Thoát</button></form>
            </dialog>
        </div>
    );
}