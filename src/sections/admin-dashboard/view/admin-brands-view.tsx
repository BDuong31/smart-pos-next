
"use client"; 

import { createBrand, deleteBrand, getBrands, updateBrand } from '@/apis/brand';
import { SplashScreen } from '@/components/loading';
import { useToast } from '@/context/toast-context';
import { IBrand } from '@/interfaces/brand';
import { create } from 'domain';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react'; 
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; 
import { set } from 'zod';


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

// --- COMPONENT TRANG CHÍNH ---
export default function BrandsView() {
  const [brandsList, setBrandsList] = useState<IBrand[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [newBrandName, setNewBrandName] = useState("");

  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);

  const [brandToDelete, setBrandToDelete] = useState<IBrand | null>(null);

  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const fetcherBrands = async () => {
    try {
      const response = await getBrands();
      if (response && response.data) {
        setBrandsList(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }

  React.useEffect(() => {
    setLoading(true);
    fetcherBrands().finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newBrandName.trim()) {
      showToast("Tên brand không được để trống.", "error");
      return;
    }
    const dataToSave = {
      name: newBrandName,
    };
    try {
      setLoading(true);
      const response = await createBrand(dataToSave);
      if (response && response.data) {
        showToast("Đã tạo brand mới!", "success");
        fetcherBrands().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Error creating brand:", error);
      showToast("Tạo brand thất bại, vui lòng thử lại.", "error");
    }
    (document.getElementById('add_modal') as HTMLDialogElement)?.close();
    setNewBrandName(""); 
  };
  
  const handleOpenEditModal = (brand: IBrand) => {
    setEditingBrand(brand);
    (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingBrand) return;
    setEditingBrand(prev => ({ ...prev!, name: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!editingBrand || !editingBrand.name.trim()) {
      showToast("Tên brand không được để trống.", "error");
       return;
    }

    const dataToUpdate = {
      ...editingBrand,
    };
    try {
      setLoading(true);
      const response = await updateBrand(editingBrand.id, dataToUpdate);
      if (response && response.data) {
        showToast("Đã cập nhật brand!", "success");
        fetcherBrands().finally(() => setLoading(false));
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      showToast("Cập nhật brand thất bại, vui lòng thử lại.", "error");
    }
    (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
    setEditingBrand(null);
  };

  const handleOpenDeleteModal = (brand: IBrand) => {
    setBrandToDelete(brand);
    (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return;

    try {
      await deleteBrand(brandToDelete.id);
      showToast(`Đã xóa brand "${brandToDelete.name}"!`, "success");
      fetcherBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      showToast("Xóa brand thất bại, vui lòng thử lại.", "error");
    }
    
    (document.getElementById('delete_modal') as HTMLDialogElement)?.close();
    setBrandToDelete(null);
  };

  const filteredBrands = useMemo(() => {
    return brandsList.filter(brand => 
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, brandsList]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBrands.length / ITEMS_PER_PAGE); 
  }, [filteredBrands]);

  const currentBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredBrands.slice(startIndex, endIndex); 
  }, [currentPage, filteredBrands]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);

  // Hàm format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };


  if (loading) {
    return <SplashScreen className='h-[100vh]'/>;
  }
  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brand Management</h1>
          <p className="text-base-content/70 text-sm">Home &gt; Brands</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <label className="input bg-transparent border border-graymain flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              className="grow border-none" 
              placeholder="Search by brand name" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search size={16} className="opacity-50" />
          </label>
          
          <button 
            className="btn btn-neutral"
            onClick={() => (document.getElementById('add_modal') as HTMLDialogElement)?.showModal()}
          >
            <Plus size={18} />
            ADD NEW BRAND
          </button>
        </div>
      </div>

      {/* 2. Bảng Brands */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-base-content/70">
                <tr>
                  <th>Brand Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBrands.map((brand) => (
                  <tr key={brand.id} className="hover">
                    <td>
                      <div className="font-bold">{brand.name}</div>
                    </td>
                    <td>{formatDate(brand.createdAt)}</td>
                    <td>{formatDate(brand.updatedAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        {/* NÚT EDIT */}
                        <button 
                          className="btn btn-ghost btn-circle btn-sm"
                          onClick={() => handleOpenEditModal(brand)}
                        >
                          <Edit size={16} />
                        </button>
                        {/* NÚT DELETE */}
                        <button 
                          className="btn btn-ghost btn-circle btn-sm text-error"
                          onClick={() => handleOpenDeleteModal(brand)}
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
          <h3 className="font-bold text-lg">Add New Category</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Category Name</span></label>
              <input 
                type="text" 
                name="name" 
                value={newBrandName} 
                onChange={(e) => setNewBrandName(e.target.value)} 
                className="input input-bordered" 
                placeholder="e.g., Sneaker" 
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Cancel</button></form>
            <button className="btn btn-neutral" onClick={handleCreate}>Save Category</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* === 5. MODAL "EDIT" === */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Edit Brand: {editingBrand?.name}</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Brand Name</span></label>
              <input 
                type="text" 
                name="name"
                value={editingBrand?.name || ''} 
                onChange={handleEditFormChange}
                className="input input-bordered" 
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setEditingBrand(null)}>Cancel</button></form>
            <button className="btn btn-neutral" onClick={handleUpdate}>Save Changes</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setEditingBrand(null)}>close</button></form>
      </dialog>

      {/* === 6. MODAL "DELETE CONFIRM" === */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa brand <strong className="text-error">{brandToDelete?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog"><button className="btn" onClick={() => setBrandToDelete(null)}>Cancel</button></form>
            <button className="btn btn-error" onClick={handleConfirmDelete}>Delete</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setBrandToDelete(null)}>close</button></form>
      </dialog>

    </div>
  );
}