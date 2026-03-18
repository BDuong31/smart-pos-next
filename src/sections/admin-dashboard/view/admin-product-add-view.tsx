"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { IProductCreate } from '@/interfaces/product';
import { IVariant, IVariantCreate } from '@/interfaces/variant';
import { useToast } from '@/context/toast-context';
import { IImageCreate } from '@/interfaces/image';
import { createProduct } from '@/apis/product';
import { createVariant } from '@/apis/variant';
import { getPrinters } from '@/apis/printer';
import { uploadImage } from '@/apis/image';
import { getCategories } from '@/apis/category';
import { ICategory } from '@/interfaces/category';
import { IPrinter } from '@/interfaces/printer';
import ImageRegular from '@/components/icons/image';

const MAX_IMAGES = 4;

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function ProductCreateView() { 
  const router = useRouter();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  
  const [product, setProduct] = useState<IProductCreate>({
    name: '',
    categoryId: '',
    printerId: '',
    basePrice: 0,
    isActive: true,
    isCombo: false,
  });
  
  const [variants, setVariants] = useState<IVariantCreate[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [printers, setPrinters] = useState<IPrinter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const page = 1;
        const limit = 100;
        const [ categoryResponse, printerResponse] = await Promise.all([
          getCategories( page, limit ),
          getPrinters(page, limit )
        ]);

        if (categoryResponse.data) setCategories(categoryResponse.data);
        if (printerResponse.data) setPrinters(printerResponse.data);

      } catch (error) {
        showToast('Error loading page data.', 'error');
      }
    };

    fetchData();
  }, [showToast]);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    
    if (name === 'priceDiff') {
      updatedVariants[index] = { ...updatedVariants[index], [name]: parseFloat(value) || 0 };
    } else {
      updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    }
    
    setVariants(updatedVariants);
  };

  const addVariant = () => { 
    setVariants([...variants, { productId: '', name: '', priceDiff: 0 }]); 
  };

  const removeVariant = (index: number) => { 
    setVariants(variants.filter((_, i) => i !== index)); 
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > MAX_IMAGES) {
      showToast(`Maximum limit is ${MAX_IMAGES} images.`, 'warning'); 
      return;
    }

    const newFilesMapped: FileWithPreview[] = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
    }));

    setFiles(prev => {
        const updated = [...prev, ...newFilesMapped];
        if (!coverImage && newFilesMapped.length > 0) {
            setCoverImage(newFilesMapped[0].preview);
        }
        return updated;
    });
  }, [files, coverImage, showToast]);

  const isGalleryFull = files.length >= MAX_IMAGES;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    disabled: isGalleryFull
  });

  const handleRemoveImage = (e: React.MouseEvent, previewToRemove: string) => {
    e.stopPropagation();
    
    const newFilesList = files.filter(item => item.preview !== previewToRemove);
    setFiles(newFilesList);
    
    if (coverImage === previewToRemove) {
      setCoverImage(newFilesList.length > 0 ? newFilesList[0].preview : null);
    }
    
    URL.revokeObjectURL(previewToRemove);
  };
  
  const handleSetCoverImage = (imageToSet: string) => {
    setCoverImage(imageToSet);
  };

  const handleCreate = async () => {
    setIsLoading(true);

    if (!product.name || !product.basePrice || !product.categoryId || !product.printerId) {
      showToast('Vui lòng điền đầy đủ thông tin sản phẩm.', 'error');
      setIsLoading(false); return;
    }
    if (files.length === 0) {
      showToast('Vui lòng tải lên ít nhất 1 ảnh.', 'error');
      setIsLoading(false); return;
    }
    if (!coverImage) {
      showToast('Vui lòng chọn 1 ảnh làm bìa chính.', 'error');
      setIsLoading(false); return;
    }

    let newProductId: string | undefined = undefined;

    try {
      const productPayload: IProductCreate = {
        name: product.name,
        categoryId: product.categoryId,
        printerId: product.printerId,
        basePrice: product.basePrice,
        isActive: product.isActive,
        isCombo: product.isCombo,
      };

      const productResponse = await createProduct(productPayload)
      if (!productResponse) throw new Error('Không thể tạo sản phẩm.');
      newProductId = productResponse;

      if (variants.length > 0) {
        const variantPromises = variants.map(variant => {
          const variantPayload: IVariantCreate = {
            productId: newProductId!,
            name: variant.name,
            priceDiff: variant.priceDiff,
          };
          return createVariant(variantPayload);
        });
        await Promise.all(variantPromises);
      }

      const imagePromises = files.map(item => {
        const isCover = (coverImage === item.preview);
        const imageDto: IImageCreate = {
          isMain: isCover,
          refId: newProductId!,
          type: 'product',
        };
        return uploadImage(imageDto, item.file);
      });

      await Promise.all(imagePromises);

      showToast('Tạo sản phẩm mới thành công!', 'success');
      router.push('/products');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.';
      showToast(`Lỗi: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-base-content/70 text-sm">Home &gt; All Products &gt; Add New Product</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 bg-white gap-6 rounded-2xl p-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="gap-6">
              <div className="form-control gap-4">
                <label className="font-semibold"><span className="label-text">Tên món</span></label>
                <input type="text" name="name" value={product.name || ''} onChange={handleProductChange} className="input input-bordered" placeholder="e.g., Adidas Ultra boost" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Base Price</span></label>
                  <input type="number" name="basePrice" value={product.basePrice || 0} onChange={handleProductChange} className="input input-bordered" placeholder="0.00" />
                </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text">Category</span></label>
                  <select 
                    name="categoryId" 
                    value={product.categoryId || ''} 
                    onChange={handleProductChange} 
                    className="select select-bordered"
                  >
                    <option value="" disabled>Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Chọn máy in</span></label>
                  <select 
                    name="printerId" 
                    value={product.printerId || ''} 
                    onChange={handleProductChange} 
                    className="select select-bordered"
                  >
                    <option value="" disabled>Chọn máy in</option>
                    {printers.map(printer => (
                      <option key={printer.id} value={printer.id}>{printer.name}</option>
                    ))}
                  </select>
                </div>
              </div>
          </div>

          <div>
              <div className="flex justify-between items-center my-4">
                <h2 className="card-title">Biến thể món</h2>
                <button className="btn btn-neutral btn-sm" onClick={addVariant} disabled={isLoading}><Plus size={16} /> Thêm biến thể</button>
              </div>
              
              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    <button className="btn btn-error btn-xs btn-circle absolute -top-3 -right-3" onClick={() => removeVariant(index)} disabled={isLoading}><X size={14} /></button>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="form-control">
                        <label className="label"><span className="label-text">Size</span></label>
                        <input type="number" name="size" placeholder="e.g., 40" value={variant.size || ''} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">Color</span></label>
                        <input type="text" name="color" placeholder="e.g., Black" value={variant.color || ''} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">SKU</span></label>
                        <input type="text" name="sku" placeholder="SKU-001" value={variant.sku || ''} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">Stock Qty</span></label>
                        <input type="number" name="quantity" placeholder="0" value={variant.quantity || 0} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div>
              <h2 className="card-title mb-4">Product Gallery</h2>
              
              <div className='p-2 bg-gray rounded-2xl mb-4'>
                <Image 
                    src={coverImage || "https://placehold.co/600x400?text=Cover+Image"}
                    alt="Product Cover Image"
                    width={500}
                    height={500}
                    className="w-full h-auto aspect-square object-cover rounded-lg bg-base-200"
                />  
              </div>
              
              <div 
                {...getRootProps()} 
                className={`
                  border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center 
                  text-center h-48
                  ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
                  ${isGalleryFull || isLoading ? 'cursor-not-allowed bg-base-200 opacity-60' : 'cursor-pointer'}
                `}
              >
                <input {...getInputProps()} />
                <ImageRegular width={48} height={48} className="text-base-content/50" />
                <p className="mt-2 text-sm text-base-content/70">
                  {isGalleryFull ? `Đã đạt giới hạn (${MAX_IMAGES} ảnh)` : isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả hoặc chọn ảnh'}
                </p>
                <p className="text-xs text-base-content/50">Max {MAX_IMAGES} images.</p>
              </div>
              
              <div className="space-y-2 mt-4">
                {files.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Image 
                        src={item.preview} 
                        alt="Thumbnail"
                        width={40} height={40}
                        className="w-10 h-10 rounded object-cover bg-base-200 flex-shrink-0"
                      />
                      <span className="text-sm truncate max-w-[150px]">
                        {item.file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input 
                        type="radio" 
                        name="coverImage"
                        checked={coverImage === item.preview}
                        onChange={() => handleSetCoverImage(item.preview)}
                        className="radio radio-primary radio-sm"
                        disabled={isLoading}
                      />
                      <button 
                        className="btn btn-ghost btn-xs btn-circle text-error"
                        onClick={(e) => handleRemoveImage(e, item.preview)}
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
        
        <div className="lg:col-span-3 card-body flex-row justify-end gap-4">
            <button className="btn" onClick={() => router.back()} disabled={isLoading}>CANCEL</button>
            <button className="btn btn-neutral" onClick={handleCreate} disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner"></span> : 'SAVE PRODUCT'}
            </button>
        </div>
      </div>
    </div>
  );
}