"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { notFound } from 'next/navigation';
import ImageRegular from '@/components/icons/image';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/context/toast-context'; // +++ Import
import { IApiResponse } from '@/interfaces/api-response'; // +++ Import

// +++ Import Product APIs +++
import { IProductDetails, IProductUpdate } from '@/interfaces/product';
import { getProductById, updateProduct, deleteProduct } from '@/apis/product';

// +++ Import Variant APIs +++
import { IProductVariant, IVariantCreate, IVariantUpdate } from '@/interfaces/variant';
import { createVariant, updateVariant, deleteVariant, getVariants } from '@/apis/variant'; // Giả định getVariantsByProductId tồn tại

// +++ Import Image APIs +++
import { IImage, IImageCreate, IImageUpdate } from '@/interfaces/image';
import { getImages, uploadImage, deleteImage, updateImage } from '@/apis/image';

// +++ Import Brand/Category APIs +++
import { IBrand } from '@/interfaces/brand';
import { ICategory } from '@/interfaces/category';
import { getBrands } from '@/apis/brand';
import { getCategories } from '@/apis/category';

type ProductEditPageProps = {
    id: string;
}

const MAX_IMAGES = 4;

export default function ProductEditPage({ id }: ProductEditPageProps) { 
  const router = useRouter();
  const { showToast } = useToast(); // +++

  // --- States ---
  const [product, setProduct] = useState<IProductUpdate | null>(null);
  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  
  // --- Loading States ---
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Image States ---
  // (Đây là phần phức tạp nhất, cần tách biệt)
  const [existingImages, setExistingImages] = useState<IImage[]>([]); // Ảnh từ API
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // Ảnh mới (File)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // ID của ảnh cũ cần xóa
  const [coverImageRef, setCoverImageRef] = useState<string | null>(null); // Dùng URL (hoặc ID) làm key duy nhất

  // --- Variant States ---
  const [variantsToDelete, setVariantsToDelete] = useState<string[]>([]);
  
  // Lưu state ban đầu để so sánh
  const [initialData, setInitialData] = useState<{ variants: IProductVariant[], images: IImage[] } | null>(null);


  // --- 1. Data Fetching ---
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, variantsRes, imagesRes, brandsRes, categoriesRes] = await Promise.all([
          getProductById(id),          
          getVariants(id),  
          getImages({
            refId: id,
            type: 'product'
          }),              
          getBrands(),                 
          getCategories()              
        ]);

        if (!productRes || !productRes.data) {
          notFound();
          return;
        }
        
        // Set data cho form
        setProduct(productRes.data);
        setVariants(variantsRes ? variantsRes.data : []);
        setExistingImages(imagesRes ? imagesRes.data : []);
        setBrands(brandsRes ? brandsRes.data : []);
        setCategories(categoriesRes ? categoriesRes.data : []);

        // Lưu state ban đầu
        setInitialData({
          variants: variantsRes ? variantsRes.data : [],
          images: imagesRes ? imagesRes.data : []
        });

        // Tìm và set cover image
        const mainImage = imagesRes.data?.find(img => img.isMain);
        setCoverImageRef(mainImage?.url || imagesRes.data?.[0]?.url || null);

      } catch (error) {
        console.error('Error fetching product data:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]);


  // --- 2. Form Handlers ---

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    const variant = updatedVariants[index];

    if (name === 'quantity' || name === 'price' || name === 'size') {
      updatedVariants[index] = { ...variant, [name]: parseFloat(value) || 0 };
    } else {
      updatedVariants[index] = { ...variant, [name]: value };
    }
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { id: `new_${Date.now()}`, size: '', color: '', sku: '', quantity: 0, price: 0, productId: id, _isNew: true } as any]);
  };

  const removeVariant = (index: number) => {
    const variantToRemove = variants[index];
    
    // Nếu là variant đã có (có ID thật, không phải _isNew), thêm vào danh sách chờ xóa
    if (variantToRemove.id && !(variantToRemove as any)._isNew) {
      setVariantsToDelete(prev => [...prev, variantToRemove.id]);
    }
    
    // Xóa khỏi UI
    setVariants(variants.filter((_, i) => i !== index));
  };


  // --- 3. Gallery Handlers (Đã viết lại) ---

  const totalImages = existingImages.length + newImageFiles.length;
  const isGalleryFull = totalImages >= MAX_IMAGES;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newTotal = totalImages + acceptedFiles.length;

    if (newTotal > MAX_IMAGES) {
      showToast(`Giới hạn tối đa là ${MAX_IMAGES} ảnh.`, 'warning');
      return;
    }
    
    setNewImageFiles(prev => [...prev, ...acceptedFiles]);
    
    // Tự động set cover nếu chưa có
    if (!coverImageRef) {
      setCoverImageRef(URL.createObjectURL(acceptedFiles[0]));
    }
  }, [totalImages, coverImageRef, showToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    disabled: isGalleryFull || isUpdating
  });

  const handleSetCoverImage = (ref: string) => {
    setCoverImageRef(ref);
  };

  const handleRemoveImage = (e: React.MouseEvent, ref: string, type: 'existing' | 'new') => {
    e.stopPropagation();

    if (type === 'existing') {
      // Nếu là ảnh cũ, thêm ID vào danh sách chờ xóa
      const image = existingImages.find(img => img.url === ref);
      if (image) {
        setImagesToDelete(prev => [...prev, image.id]);
        setExistingImages(prev => prev.filter(img => img.id !== image.id));
      }
    } else {
      // Nếu là ảnh mới, tìm File object và xóa
      const file = newImageFiles.find(f => URL.createObjectURL(f) === ref);
      if (file) {
        setNewImageFiles(prev => prev.filter(f => f !== file));
      }
    }

    // Nếu ảnh bị xóa là ảnh bìa, reset ảnh bìa
    if (coverImageRef === ref) {
      setCoverImageRef(null); // Sẽ được tự động set lại ở useEffect
    }
  };

  // Tự động set cover mới nếu cover cũ bị xóa
  useEffect(() => {
    if (!coverImageRef) {
      if (existingImages.length > 0) {
        setCoverImageRef(existingImages[0].url);
      } else if (newImageFiles.length > 0) {
        setCoverImageRef(URL.createObjectURL(newImageFiles[0]));
      }
    }
  }, [coverImageRef, existingImages, newImageFiles]);

  // Lấy URL cho ảnh bìa (ảnh to)
  const getCoverImageUrl = () => {
    if (coverImageRef) {
      // Nếu ref là blob URL, nó là ảnh mới.
      if (coverImageRef.startsWith('blob:')) {
        return coverImageRef;
      }
      // Nếu là URL từ API
      const existing = existingImages.find(img => img.url === coverImageRef);
      if (existing) return existing.url;
    }
    // Fallback
    return existingImages[0]?.url || (newImageFiles[0] ? URL.createObjectURL(newImageFiles[0]) : "/images/placeholder.png");
  };


  // --- 4. API Actions (Update / Delete) ---

  const handleUpdate = async () => {
    if (!product) return;
    setIsUpdating(true);

    try {
      // --- BƯỚC 1: Cập nhật thông tin Product chính ---
      await updateProduct(id, {
        productName: product.productName,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        brandId: product.brandId,
      });

      // --- BƯỚC 2: Xử lý Variants (Xóa, Cập nhật, Thêm) ---
      const variantPromises: Promise<string>[] = [];
      
      // Xóa variants
      if (variantsToDelete.length > 0) {
        variantsToDelete.forEach(variantId => {
          variantPromises.push(deleteVariant(variantId));
        });
      }

      // Cập nhật hoặc Thêm mới
      variants.forEach(variant => {
        if ((variant as any)._isNew) {
          // Thêm mới
          const newVariant: IVariantCreate = {
            productId: id,
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            quantity: variant.quantity,
          };
          variantPromises.push(createVariant(newVariant));
        } else {
          // Cập nhật
          const originalVariant = initialData?.variants.find(v => v.id === variant.id);
          if (JSON.stringify(originalVariant) !== JSON.stringify(variant)) { // Chỉ update nếu có thay đổi
            variantPromises.push(updateVariant(variant.id, variant));
          }
        }
      });
      
      await Promise.all(variantPromises);

      // --- BƯỚC 3: Xử lý Images (Xóa, Tải lên) ---
      const imagePromises: Promise<string>[] = [];

      // Xóa ảnh
      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach(imageId => {
          imagePromises.push(deleteImage(imageId));
        });
      }

      // Tải lên ảnh mới
      if (newImageFiles.length > 0) {
        newImageFiles.forEach(file => {
          const fileRef = URL.createObjectURL(file);
          const dto: IImageCreate = {
            refId: id,
            type: 'product',
            isMain: coverImageRef === fileRef
          };
          imagePromises.push(uploadImage(dto, file));
        });
      }

      await Promise.all(imagePromises);

      // --- BƯỚC 4: Cập nhật Cover Image (nếu là ảnh cũ) ---
      const originalMainImage = initialData?.images.find(img => img.isMain);
      const isExistingCover = existingImages.find(img => img.url === coverImageRef);

      if (isExistingCover && isExistingCover.id !== originalMainImage?.id) {
        // Chỉ gọi update nếu ảnh bìa mới là ảnh CŨ và nó KHÁC với ảnh bìa gốc
        const data: IImageUpdate = {
          isMain: true
        }; 
        await updateImage(isExistingCover.id, data);
      }

      showToast('Product updated successfully!', 'success');
      router.push('/products'); // Hoặc router.refresh()

    } catch (error) {
      console.error('Failed to update product:', error);
      showToast('Failed to update product.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setIsUpdating(true);
      try {
        await deleteProduct(id);
        showToast('Product deleted successfully.', 'success');
        router.push('/products');
      } catch (error) {
        console.error('Failed to delete product:', error);
        showToast('Failed to delete product.', 'error');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // --- 5. Render ---
  if (loading) {
    return <div className="flex justify-center items-center h-96"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (!product) {
    return <div className="text-center p-10">Product not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      <div>
        <h1 className="text-3xl font-bold">Product Details</h1>
        <p className="text-base-content/70 text-sm">Home &gt; All Products &gt; Product Details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 bg-white gap-6 rounded-2xl p-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thông tin chung */}
          <div className="gap-6">
              <div className="form-control gap-4">
                <label className="font-semibold"><span className="label-text">Product Name</span></label>
                <input type="text" name="productName" value={product.productName || ''} onChange={handleProductChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea name="description" value={product.description || ''} onChange={handleProductChange} className="textarea textarea-bordered h-24"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Base Price</span></label>
                  <input type="number" name="price" value={product.price || ''} onChange={handleProductChange} className="input input-bordered" />
                </div>
                {/* +++ SELECT CATEGORY +++ */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Category</span></label>
                  <select name="categoryId" value={product.categoryId || ''} onChange={handleProductChange} className="select select-bordered">
                    <option value="" disabled>Choose a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                {/* +++ SELECT BRAND +++ */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Brand Name</span></label>
                  <select name="brandId" value={product.brandId || ''} onChange={handleProductChange} className="select select-bordered">
                    <option value="" disabled>Choose a brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>
          </div>

          {/* Quản lý Variants */}
          <div>
              <div className="flex justify-between items-center my-4">
                <h2 className="card-title">Product Variants</h2>
                <button className="btn btn-neutral btn-sm" onClick={addVariant} disabled={isUpdating}><Plus size={16} /> Add Variant</button>
              </div>
              
              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="p-4 border rounded-lg relative">
                    <button className="btn btn-error btn-xs btn-circle absolute -top-3 -right-3" onClick={() => removeVariant(index)} disabled={isUpdating}><X size={14} /></button>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="form-control"><label className="label"><span className="label-text">Size</span></label><input type="text" name="size" placeholder="e.g., 40" value={variant.size || ''} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" /></div>
                      <div className="form-control"><label className="label"><span className="label-text">Color</span></label><input type="text" name="color" placeholder="e.g., Black" value={variant.color || ''} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" /></div>
                      <div className="form-control"><label className="label"><span className="label-text">SKU</span></label><input type="text" name="sku" placeholder="SKU-001" value={variant.sku || ''} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" /></div>
                      <div className="form-control"><label className="label"><span className="label-text">Stock Qty</span></label><input type="number" name="quantity" placeholder="0" value={variant.quantity || 0} onChange={(e) => handleVariantChange(index, e)} className="input input-bordered input-sm" /></div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* === CỘT BÊN PHẢI (GALLERY) --- Đã viết lại */}
        <div className="lg:col-span-1 space-y-6">
          <div>
              <h2 className="card-title mb-4">Product Gallery</h2>
              
              <div className='p-2 bg-gray-100 rounded-2xl mb-4'>
                <Image 
                    src={getCoverImageUrl()}
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
                  ${isGalleryFull || isUpdating
                    ? 'cursor-not-allowed bg-base-200 opacity-60'
                    : 'cursor-pointer'
                  }
                `}
              >
                <input {...getInputProps()} />
                <UploadCloud size={48} className="text-base-content/50" />
                <p className="mt-2 text-sm text-base-content/70">
                  {isGalleryFull
                    ? `Đã đạt giới hạn (${MAX_IMAGES} ảnh)`
                    : isDragActive 
                      ? 'Thả ảnh vào đây' 
                      : 'Kéo thả, hoặc click để chọn ảnh'
                  }
                </p>
                <p className="text-xs text-base-content/50">Tối đa {MAX_IMAGES} ảnh. (jpeg, png)</p>
              </div>
              
              {/* Danh sách ảnh (thumbnails) */}
              <div className="space-y-2 mt-4">
                
                {/* 1. Ảnh cũ (từ API) */}
                {existingImages.map((image) => (
                  <div key={image.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Image 
                        src={image.url} 
                        alt="Thumbnail"
                        width={40} height={40}
                        className="w-10 h-10 rounded object-cover bg-base-200 flex-shrink-0"
                      />
                      <span className="text-sm truncate" title={image.url.split('/').pop()}>
                        {image.url.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input 
                        type="radio" 
                        name="coverImage"
                        checked={coverImageRef === image.url}
                        onChange={() => handleSetCoverImage(image.url)}
                        className="radio radio-primary radio-sm"
                        title="Set as cover image"
                        disabled={isUpdating}
                      />
                      <button 
                        className="btn btn-ghost btn-xs btn-circle text-error"
                        onClick={(e) => handleRemoveImage(e, image.url, 'existing')}
                        title="Delete image"
                        disabled={isUpdating}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* 2. Ảnh mới (chưa upload) */}
                {newImageFiles.map((file, index) => {
                  const fileRef = URL.createObjectURL(file); // Tạo URL duy nhất
                  return (
                    <div key={fileRef} className="flex items-center justify-between p-2 border rounded-lg border-primary/50">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Image 
                          src={fileRef} 
                          alt={file.name}
                          width={40} height={40}
                          className="w-10 h-10 rounded object-cover bg-base-200 flex-shrink-0"
                        />
                        <span className="text-sm truncate text-primary" title={file.name}>
                          {file.name} (new)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input 
                          type="radio" 
                          name="coverImage"
                          checked={coverImageRef === fileRef}
                          onChange={() => handleSetCoverImage(fileRef)}
                          className="radio radio-primary radio-sm"
                          title="Set as cover image"
                          disabled={isUpdating}
                        />
                        <button 
                          className="btn btn-ghost btn-xs btn-circle text-error"
                          onClick={(e) => handleRemoveImage(e, fileRef, 'new')}
                          title="Delete image"
                          disabled={isUpdating}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
          </div>
        </div>
        
        {/* Nút Actions */}
        <div className="lg:col-span-3 card-body flex-row justify-end gap-4">
            <button className="btn" onClick={() => router.push('/products')} disabled={isUpdating}>CANCEL</button>
            <button className="btn btn-error" onClick={handleDelete} disabled={isUpdating}>
              {isUpdating ? <span className="loading loading-spinner"></span> : 'DELETE'}
            </button>
            <button className="btn btn-neutral" onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? <span className="loading loading-spinner"></span> : 'UPDATE'}
            </button>
        </div>
      </div>
    </div>
  );
}