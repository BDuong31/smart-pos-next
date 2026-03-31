"use client";

import { Plus, Search, Edit, Trash2, Badge } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, useCallback } from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { IIngredientDetail, IIngredient, IIngredientCreate, IIngredientUpdate } from '@/interfaces/ingredient';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/loading';
import { createIngredient, deleteIngredient, getIngredients, updateIngredient } from '@/apis/ingredient';
import { useToast } from '@/context/toast-context';
import { IImage, IImageCreate } from '@/interfaces/image';
import { useDropzone } from 'react-dropzone';
import BinRegular from '@/components/icons/bin';
import ImageRegular from '@/components/icons/image';
import { deleteImage, uploadImage } from '@/apis/image';

const ITEMS_PER_PAGE = 6;

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

export default function IngredientView() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [ingredientList, setIngredientList] = useState<IIngredientDetail[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const [existingImages, setExistingImages] = useState<IImage>();
    const [imageToDelete, setImageToDelete] = useState<string>();   
    const [newImageFiles, setNewImageFiles] = useState<File>();
    const [editingIngredient, setEditingIngredient] = useState<IIngredientDetail | null>(null);
    const [deletingIngredient, setDeletingIngredient] = useState<IIngredientDetail | null>(null);
    const [formIngredient, setFormIngredient] = useState({
        name: '',
        baseUnit: '',
        minStock: 0,    
        forecastDataId: null,
    })

    const fecherIngredient = async () => {
        try {
            setLoading(true);
            const name = undefined;
            const baseUnit = undefined;
            const minStock = undefined;
            const forecastDataId = undefined;
            const page = currentPage;
            const limit = ITEMS_PER_PAGE;
            const response = await getIngredients(name, baseUnit, minStock, forecastDataId, page, limit);
            
            if (response && response.data) {
                setIngredientList(response.data);
                setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
            }
        } catch (error) {
            console.error('Error fetching ingredient data:', error);
            showToast('Lỗi lấy dữ liệu nguyên liệu', 'error');
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        console.log('Fetching ingredient data for page:', currentPage);
        fecherIngredient();
    }, [currentPage]);

    const filteredIngredients = useMemo(() => {
        console.log('Filtering ingredients with search term:', searchTerm);
        return ingredientList.filter(ingredient =>
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ingredient.baseUnit.toLowerCase().includes(searchTerm.toLowerCase())
        );  
    }, [ingredientList, searchTerm]);

    const currentIngredients = useMemo(() => {
        return filteredIngredients;
    }, [filteredIngredients, currentPage]);

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

    const openCreateIngredient = () => {
        setFormIngredient({
            name: '',
            baseUnit: '',
            minStock: 0,    
            forecastDataId: null,
        });
        setExistingImages(undefined);
        setNewImageFiles(undefined);
        setEditingIngredient(null);
    }

    const openEditIngredient = (ingredient: IIngredientDetail) => {
        setFormIngredient({
            name: ingredient.name,  
            baseUnit: ingredient.baseUnit,
            minStock: ingredient.minStock,
            forecastDataId: null,
        });
        setExistingImages(ingredient.images?.[0]);
        setNewImageFiles(undefined);
        setEditingIngredient(ingredient);
    };

    const handleDeleteIngredient = async (ingredientId: string) => {
        await deleteIngredient(ingredientId);
        showToast('Xóa nguyên liệu thành công', 'success');
        fecherIngredient();
        setDeletingIngredient(null);
        (document.getElementById('delete_modal') as HTMLDialogElement)?.close();
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log('Accepted files:', acceptedFiles);
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        setNewImageFiles(file);
        setCoverImage(URL.createObjectURL(file));
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const handleSetCoverImage = (imageUrl: string) => {
        setCoverImage(imageUrl);
    }
    const handleRemoveImage = (e: React.MouseEvent, ref: string, type: 'existing' | 'new') => {
        e.stopPropagation();

        if (type === 'existing') {
            setImageToDelete(ref);
            setExistingImages(undefined);
            setCoverImage(null);
        } else {
            setNewImageFiles(undefined);
            setCoverImage(null);
        }
    }

    const handleCreateIngredient = async () => {
        setLoading(true);

        if (!formIngredient.name || !formIngredient.baseUnit || !formIngredient.minStock) {
            showToast('Vui lòng điền đầy đủ thông tin nguyên liệu', 'error');
            setLoading(false);
            return;
        }  
        
        if (!coverImage) {
            showToast('Vui lòng thêm ảnh cho nguyên liệu', 'error');
            setLoading(false);
            return;
        }

        let newId: string | undefined = undefined;
        try {
            const ingredientPayload: IIngredientCreate = {
                name: formIngredient.name,
                baseUnit: formIngredient.baseUnit,
                minStock: formIngredient.minStock,
                forecastDataId: undefined,
            }

            const response = await createIngredient(ingredientPayload);
            newId = response.data.id;
            showToast('Tạo nguyên liệu thành công', 'success');

            const imagePayload: IImageCreate = {
                isMain: true,
                refId: newId,
                type: 'ingredient',
            }

            await uploadImage(imagePayload, newImageFiles as File);
            
            showToast("Tạo nguyên liệu thành công", 'success');
        } catch (error) {
            console.error('Error creating ingredient:', error);
            showToast('Lỗi tạo nguyên liệu', 'error');
        } finally {
            setLoading(false);
            fecherIngredient();
            (document.getElementById('add_modal') as HTMLDialogElement)?.close();
        }

        fecherIngredient();
    }

    const handleUpdateIngredient = async () => {
        setLoading(true);

        if (!editingIngredient) {
            showToast('Không tìm thấy nguyên liệu để cập nhật', 'error');
            setLoading(false);
            return;
        }

        try {
            const ingredientPayload: IIngredientUpdate = {
                name: formIngredient.name,
                baseUnit: formIngredient.baseUnit,
                minStock: formIngredient.minStock,
                forecastDataId: undefined,
            }

            await updateIngredient(editingIngredient.id, ingredientPayload);
            showToast('Cập nhật nguyên liệu thành công', 'success');

            if (newImageFiles) {
                const imagePayload: IImageCreate = {
                    isMain: true,
                    refId: editingIngredient.id,
                    type: 'ingredient',
                }

                await uploadImage(imagePayload, newImageFiles as File);
                if (imageToDelete) {
                    await deleteImage(imageToDelete);
                    setImageToDelete(undefined);
                }
            } else if (existingImages && !coverImage) {}
        } catch (error) {
            console.error('Error updating ingredient:', error);
            showToast('Lỗi cập nhật nguyên liệu', 'error');
        } finally {
            setLoading(false);
            fecherIngredient();
        }

        fecherIngredient();
    }

    if (loading) {
        return <SplashScreen className='h-[100vh]'/>
    }

    return (
        <div className="flex flex-col gap-6 p-6 h-[90vh]">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý nguyên liệu</h1>
              <p className="text-base-content/70 text-sm">Trang chủ &gt; Nguyên liệu</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <label className="input input-bordered bg-transparent flex items-center gap-2 w-full sm:w-auto">
                <input 
                  type="text" 
                  className="grow border-none" 
                  placeholder="Tìm kiếm nguyên liệu bằng tên" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search size={16} className="opacity-50" />
              </label>
              
              {/* Nút Add New User */}
              <button 
                onClick={() => {
                    openCreateIngredient();
                    (document.getElementById('add_modal') as HTMLDialogElement)?.showModal();
                }}
                className="btn btn-neutral bg-darkgrey text-white px-2">
                <Plus size={18} />
                THÊM NGUYÊN LIỆU
              </button>
            </div>
          </div>
    
          {/* 2. Bảng Users */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body h-[65vh]">
              <div className="overflow-x-auto">
                <table className="table">
                  {/* Head */}
                  <thead className="text-base-content/70">
                    <tr>
                      <th>Tên</th>
                      <th>Đơn vị</th>
                      <th>tồn kho nhỏ nhất</th>
                      <th>Ngày tạo</th>
                      <th>Ngày cập nhật</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentIngredients.map((ingredient) => (
                      <tr key={ingredient.id} className="hover">
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="">
                                <div className="mask mask-squircle w-10 h-10 rounded-sm">
                                  <Image
                                    src={ingredient?.images?.[0]?.url || "/default-avatar.jpg"}
                                    alt={ingredient?.name || "ingredient"}
                                    width={40}
                                    height={40}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{ingredient.name}</div>
                              </div>
                            </div>
                          </td>
                          <td>{ingredient.baseUnit}</td>
                          <td>
                            {ingredient.minStock}
                          </td>
                          <td>{formatDate(ingredient.createdAt)}</td>
                          <td>{formatDate(ingredient.updatedAt)}</td>
                          <td>
                            <div className="flex gap-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditIngredient(ingredient);
                                  (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
                                }}
                                className="btn btn-ghost btn-circle btn-sm">
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={(e) => {
                                    setDeletingIngredient(ingredient);
                                  (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
                                }}
                                className="btn btn-ghost btn-circle btn-sm text-error">
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
    
    
          {/* 3. Pagination (Code JSX từ file của bạn) */}
          {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-0">
                  
                  {/* Nút PREVIOUS */}
                  <button 
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"
                  >
                      <GrFormPrevious size={18} /> TRƯỚC
                  </button>
                  
                  {/* Các Nút Trang và Dấu Ba Chấm */}
                  {pageNumbers.map((item, index) => (
                      <React.Fragment key={index}>
                          {item === '...' ? (
                              <span className="px-3 py-2 text-gray-700">...</span>
                          ) : (
                              <button
                                  onClick={() => goToPage(item as number)}
                                  className={`px-4 py-2 rounded-xl font-semibold transition border ${
                                      currentPage === item 
                                          ? 'bg-black text-white border-black bg-neutral-950' 
                                          : 'text-black border-gray-300 hover:bg-gray-100'
                                  }`}
                              >
                                  {item}
                              </button>
                          )}
                      </React.Fragment>
                  ))}
    
                  {/* Nút NEXT */}
                  <button 
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"
                  >
                      TIẾP <GrFormNext size={18} />
                  </button>
              </div>
          )}

            <dialog id="add_modal" className="modal">
                <div className="modal-box w-11/12 max-w-lg">
                <h3 className="font-bold text-lg">Thêm nguyên liệu</h3>
                <div className="py-4 space-y-4">
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Tên nguyên liệu</span></label>
                    <input
                        name="name"
                        value={formIngredient.name}
                        onChange={(e) => setFormIngredient({ ...formIngredient, name: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="e.g., Phô mai"
                    />
                    </div>
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Đơn vị </span></label>
                    <input
                        type="number"
                        name="baseUnit"
                        value={formIngredient.baseUnit}
                        onChange={(e) => setFormIngredient({ ...formIngredient, baseUnit: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 5000"
                    />
                    </div>
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Tồn kho nhỏ nhất</span></label>
                    <input
                        type="number"
                        name="minStock"
                        value={formIngredient.minStock}
                        onChange={(e) => setFormIngredient({ ...formIngredient, minStock: parseInt(e.target.value) })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 10"
                    />
                    </div>
                    <div className="form-control relative">
                    { coverImage && (
                        <button type="button" className="btn btn-sm absolute bg-error px-2 py-4 w-8 rounded-full right-0 top-0" onClick={() => {
                        if (existingImages || newImageFiles) {
                            setExistingImages(undefined);
                            setNewImageFiles(undefined);
                            setCoverImage(null);
                        } else {
                            (document.getElementById('image_upload_modal') as HTMLDialogElement)?.showModal();
                        } 
                        }}>
                        <BinRegular />
                        </button>
                    )}
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Ảnh minh họa</span></label>
                    {coverImage ? (
                        <div className='p-2 bg-gray rounded-2xl mb-4'>
                        <Image 
                            src={coverImage || "https://placehold.co/600x400?text=Cover+Image"}
                            alt="Ingredient Cover Image"
                            width={500}
                            height={500}
                            className="w-full h-auto aspect-square object-cover rounded-lg bg-base-200"
                        />  
                        </div>
                    ) : (
                        <div 
                        {...getRootProps()} 
                        className={`
                            border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center 
                            text-center h-48
                            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
                        `}
                        >
                        <input {...getInputProps()} />
                        <ImageRegular width={48} height={48} className="text-base-content/50" />
                        <p className="mt-2 text-sm text-base-content/70">
                            {isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả hoặc chọn ảnh'}
                        </p>
                        </div>
                    )}
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog"><button className="btn">Huỷ</button></form>
                    <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleCreateIngredient}>Lưu</button>
                </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
            </dialog>

            {/* =================EDIT ITEM MODAL ================= */}
            <dialog id="edit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-lg">
                <h3 className="font-bold text-lg">Sửa nguyên liệu</h3>
                <div className="py-4 space-y-4">
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Tên nguyên liệu</span></label>
                    <input
                        name="name"
                        value={formIngredient.name}
                        onChange={(e) => setFormIngredient({ ...formIngredient, name: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="e.g., Phô mai"
                    />
                    </div>
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Đơn vị</span></label>
                    <input
                        type="number"
                        name="baseUnit"
                        value={formIngredient.baseUnit}
                        onChange={(e) => setFormIngredient({ ...formIngredient, baseUnit: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 5000"
                    />
                    </div>
                    <div className="form-control">
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Tồn kho nhỏ nhất</span></label>
                    <input
                        type="number"
                        name="minStock"
                        value={formIngredient.minStock}
                        onChange={(e) => setFormIngredient({ ...formIngredient, minStock: parseInt(e.target.value) })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 10"
                    />
                    </div>
                    <div className="form-control relative">
                    { coverImage && (
                        <button type="button" className="btn btn-sm absolute bg-error px-2 py-4 w-8 rounded-full right-0 top-0" onClick={() => {
                        if (existingImages || newImageFiles) {
                            setExistingImages(undefined);
                            setNewImageFiles(undefined);
                            setCoverImage(null);
                        } else {
                            (document.getElementById('image_upload_modal') as HTMLDialogElement)?.showModal();
                        } 
                        }}>
                        <BinRegular />
                        </button>
                    )}
                    <label className="label w-full mb-1"><span className="label-text font-semibold">Ảnh minh họa</span></label>
                    {coverImage ? (
                        <div className='bg-gray rounded-2xl'>
                        <Image 
                            src={coverImage || "https://placehold.co/600x400?text=Cover+Image"} 
                            alt="Ingredient Cover Image"
                            width={500}
                            height={500}
                            className="w-full h-auto aspect-square object-cover rounded-lg bg-base-200"
                        />
                        </div>
                    ) : (
                        <div 
                        {...getRootProps()} 
                        className={`
                            border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
                            text-center h-48
                            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
                        `}
                        >
                        <input {...getInputProps()} />
                        <ImageRegular width={48} height={48} className="text-base-content/50" />
                        <p className="mt-2 text-sm text-base-content/70">
                            {isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả hoặc chọn ảnh'}
                        </p>
                        </div>
                    )}
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog"><button className="btn">Huỷ</button></form>
                    <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleUpdateIngredient}>Lưu</button>
                </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
            </dialog>

            {/* ================= DELETE CONFIRMATION OPTION MODAL ================= */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
                <p className="py-4">
                    Bạn có chắc muốn xóa nguyên liệu <strong className="text-error">{deletingIngredient?.name}</strong>?
                    <br/>
                    Hành động này không thể hoàn tác.
                </p>
                <div className="modal-action">
                    <form method="dialog"><button className="btn">Huỷ</button></form>
                    <button className="btn btn-error bg-error text-white px-2" onClick={() => { 
                    handleDeleteIngredient(deletingIngredient!.id)
                    }}>Xóa</button>
                </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
            </dialog>          
        </div>
    )
}