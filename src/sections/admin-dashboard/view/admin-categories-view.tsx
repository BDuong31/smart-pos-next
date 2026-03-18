"use client"; 

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { ICategoryCreate, ICategoryUpdate, ICategory } from '@/interfaces/category';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/apis/category';
import { useToast } from '@/context/toast-context';
import { SplashScreen } from '@/components/loading';

const ITEMS_PER_PAGE = 7;
const getPaginationRange = (currentPage, totalPages) => {
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
  for (let i = 0; i < range.length; i++) { if (range[i] === '...' && i > 0 && i < range.length - 1 && range[i-1] + 1 === range[i+1]) { continue; } finalRange.push(range[i]); }
  return finalRange;
};

export default function CategoriesView() {
  const [categoriesList, setCategoriesList] = useState<ICategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");

  const [newCategoryParentId, setNewCategoryParentId] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<ICategory>();

  const [categoryToDelete, setCategoryToDelete] = useState<ICategory>();

  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const fechterCategories = async () => {
    try {
      const name = undefined;
      const parentId = undefined;
      const page = currentPage;
      const limit = ITEMS_PER_PAGE;
      const data = await getCategories(name, parentId, page, limit);
      if (data) {
        console.log(data);
        setCategoriesList(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  React.useEffect(() => {
    setLoading(true);
    fechterCategories().finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
       showToast("Tên category không được để trống.", "error");
       return;
    }

    const data: ICategoryCreate = {
      name: newCategoryName,
      parentId: newCategoryParentId || null,
    };

    try {
      setLoading(true);
      const response = await createCategory(data);
      if (response && response.data) {
        setCategoriesList(prevList => [...prevList, response.data]);
        showToast(`Đã tạo category "${data.name}"!`, "success");
        fechterCategories().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Error creating category:", error);
      showToast("Tạo category thất bại, vui lòng thử lại.", "error");
    }
    
    (document.getElementById('add_modal') as HTMLDialogElement)?.close();
    setNewCategoryName("");
    setNewCategoryParentId(null);
  };
  
  const handleOpenEditModal = (category: ICategory) => {
    setEditingCategory(category);
    (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCategory) return;
    setEditingCategory(prev => ({ ...prev!, name: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
        showToast("Tên category không được để trống.", "error");
       return;
    }

    const data: ICategoryUpdate = {
      name: editingCategory.name,
      parentId: editingCategory.parentId,
    };

    try {
      setLoading(true);
      const response = await updateCategory(editingCategory.id, data);
      if (response && response.data) {
        showToast(`Đã cập nhật category "${data.name}"!`, "success");
        setCategoriesList(prevList => prevList.map(c => c.id === editingCategory.id ? response.data! : c));
        fechterCategories().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Error updating category:", error);
      showToast("Cập nhật category thất bại, vui lòng thử lại.", "error");
    }

    (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
    setEditingCategory(undefined);
  };

  const handleOpenDeleteModal = (category: ICategory) => {
    setCategoryToDelete(category);
    (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await deleteCategory(categoryToDelete.id);
      console.log("Deleted category:", response);
      showToast(`Đã xóa category "${categoryToDelete.name}"!`, "success");
      fechterCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("Xóa category thất bại, vui lòng thử lại.", "error");
    }
    
    (document.getElementById('delete_modal') as HTMLDialogElement)?.close();
    setCategoryToDelete(undefined);
  };

  const filteredCategories = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm?.toLowerCase() ?? '';
    return categoriesList
      ?.filter(category => {
        const categoryName = category?.name ?? ''; 
        
        return categoryName.toLowerCase().includes(lowerCaseSearchTerm);
      });
  }, [searchTerm, categoriesList]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCategories.length / ITEMS_PER_PAGE); 
  }, [filteredCategories]);

  const currentCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCategories?.slice(startIndex, endIndex); 
  }, [currentPage, filteredCategories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
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
                  <th>Tên danh mục</th>
                  <th>Danh mục cha</th>
                  <th>Ngày tạo</th>
                  <th>Ngày cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories?.map((category) => (
                  <tr key={category.id} className="hover">
                    <td>
                      <div className="font-bold">{category.name}</div>
                    </td>
                    <td>
                      <div className="font-bold">{category.parentId ? currentCategories.find(c => c.id === category.parentId)?.name : 'None'}</div>
                    </td>
                    <td>{formatDate(category?.createdAt)}</td>
                    <td>{formatDate(category?.updatedAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button 
                          className="btn btn-ghost btn-circle btn-sm"
                          onClick={() => handleOpenEditModal(category)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-circle btn-sm text-error"
                          onClick={() => handleOpenDeleteModal(category)}
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
          <h3 className="font-bold text-lg">Thêm danh mục mới</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên danh mục</span></label>
              <input 
                type="text" 
                name="name" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                className="input input-bordered w-full" 
                placeholder="e.g., Đồ uống" 
              />
            </div>
            <div className="form-control">
              <label className="label mb-1"><span className="label-text font-semibold">Danh mục cha (không bắt buộc)</span></label>
              <select 
                className="select select-bordered w-full"
                value={newCategoryParentId || ''}
                onChange={(e) => setNewCategoryParentId(e.target.value || null)}
              >
                <option value="">None</option>
                {currentCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleCreate}>Lưu</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setNewCategoryName('')}>close</button></form>
      </dialog>

      {/* === 5. MODAL "EDIT" === */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Sửa danh mục: {editingCategory?.name}</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên danh mục</span></label>
              <input 
                type="text" 
                name="name"
                value={editingCategory?.name || ''} 
                onChange={handleEditFormChange}
                className="input input-bordered w-full" 
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Danh mục cha (Không bắt buộc)</span></label>
              <select 
                className="select select-bordered w-full"
                value={editingCategory?.parentId || ''}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, parentId: e.target.value || null } : prev)}
              >
                <option value="">None</option>
                {currentCategories
                  .filter(category => category.id !== editingCategory?.id) 
                  .map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setEditingCategory(null)}>Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdate}>Lưu thay đổi</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingCategory(null)}>Thoát</button></form>
      </dialog>

      {/* === 6. MODAL "DELETE CONFIRM" === */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa danh mục <strong className="text-error">{categoryToDelete?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setCategoryToDelete(null)}>Huỷ</button></form>
            <button className="btn btn-error bg-darkgrey text-white px-2" onClick={handleConfirmDelete}>Xóa</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setCategoryToDelete(null)}>Thoát</button></form>
      </dialog>

    </div>
  );
}