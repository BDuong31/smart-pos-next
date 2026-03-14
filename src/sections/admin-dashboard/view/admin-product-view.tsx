// src/app/(admin)/admin/products/page.tsx

"use client"; 

import { Plus } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/product/productCard';

import React, { useState, useMemo, useEffect } from 'react'; // Import hooks
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; // Import icons
// import { IProduct, IProductDetails } from '@/interfaces/product';
// import { IConditionalImage, IImage, IImageCreate } from '@/interfaces/image';
// import { IProductVariant } from '@/interfaces/variant';
// import { getProducts } from '@/apis/product';
// import { getImages } from '@/apis/image';
// import { getVariants } from '@/apis/variant';
import SplashScreen from '@/components/loading/splash-sceen';

type products = {
  id: string;
  name: string;
  category: string;
  price: number;
  sales: number;
  remaining: number;
  img: string;
}


const ITEMS_PER_PAGE = 9;

const getPaginationRange = (currentPage, totalPages) => {
    const range = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            range.push(i);
        }
        return range;
    }

    range.push(1);
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) range.push('...');
    else if (startPage === 2 && totalPages > 3) range.push(2);

    for (let i = startPage; i <= endPage; i++) {
        if (!range.includes(i)) range.push(i);
    }

    if (endPage < totalPages - 1) range.push('...');
    else if (endPage === totalPages - 1 && totalPages > 3) range.push(totalPages - 1);
    
    if (!range.includes(totalPages)) range.push(totalPages);

    let finalRange = [];
    for (let i = 0; i < range.length; i++) {
        if (range[i] === '...' && i > 0 && i < range.length - 1 && range[i-1] + 1 === range[i+1]) {
            continue;
        }
        finalRange.push(range[i]);
    }
    return finalRange;
};

// --- KẾT THÚC LOGIC PHÂN TRANG ---


export default function ProductsPage() {
  // const [productList, setProductList] = useState<IProductDetails[]>([]);
  // const [variantList, setVariantList] = useState<IProductVariant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // const fetcherProducts = async () => {
  //   try {
  //     const response = await getProducts();
  //     if (response) {
  //       setProductList(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch products:', error);
  //   }
  // }


  // const fetcherVariants = async () => {
  //   try {
  //     const allVariants: IProductVariant[] = [];
  //     for (const product of productList) {
  //       const response = await getVariants(product.id);
  //       if (response) {
  //         allVariants.push(...response.data);
  //       }
  //     }
  //     setVariantList(allVariants);
  //   } catch (error) {
  //     console.error('Failed to fetch variants:', error);
  //   }
  // }

  // React.useEffect(() => {
  //   setLoading(true);
  //   fetcherProducts();
  // }, []);
  // React.useEffect(() => {
  //   fetcherVariants()
  // }, [productList]);
  // const mergedProducts = useMemo(() => {
  //   return productList.map(product => {
  //     const variants = variantList.filter(variant => variant.productId === product.id);
  //     const data: products = {
  //       id: product.id,
  //       name: product.productName,
  //       category: product.category.name,
  //       price: product.price,
  //       sales: 1000,
  //       remaining: variants.reduce((sum, v) => sum + v.quantity, 0),
  //       img: product?.image === null ? "https://res.cloudinary.com/dzyrtxn7j/image/upload/v1763306606/ecommerce/products/019a730c-527e-7438-8287-1da8096d0386/kvheitugc7suhxdzzbao.avif" : product.images.find(img => img.isMain)?.url || '',
  //     };
  //     return data;
  //   });
  // }, [productList, variantList]);

  // useEffect(() => {
  //   if (mergedProducts.length > 0) {
  //     setLoading(false);
  //   }
  // }, [mergedProducts]);
  // const totalPages = useMemo(() => {
  //   return Math.ceil(mergedProducts.length / ITEMS_PER_PAGE);
  // }, [mergedProducts]);
  const totalPages = 10; // Giả sử có 10 trang, bạn sẽ tính toán dựa trên dữ liệu thực tế

  // const currentProducts = useMemo(() => {
  //   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  //   const endIndex = startIndex + ITEMS_PER_PAGE;
  //   return mergedProducts.slice(startIndex, endIndex);
  // }, [currentPage, mergedProducts]);

  const goToPrevPage = () => {
      setCurrentPage(prev => Math.max(1, prev - 1));
  };
  const goToNextPage = () => {
      setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };
  const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
      }
  };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);

  // if (loading) {
  //     return <SplashScreen className='h-[100vh]'/>
  // }
  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      
      {/* 1. Header (Title & Nút Add New) - Giữ nguyên */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-base-content/70 text-sm">Home &gt; All Products</p>
        </div>
        
        <Link href="/products/new" className="btn btn-neutral">
          <Plus size={18} />
          ADD NEW PRODUCT
        </Link>
      </div>

      {/* 2. Products Grid - Dùng 'currentProducts' */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* {currentProducts.map((product) => (
          console.log('Rendering product in grid:', product),
          <Link href={`/products/${product.id}`} key={product.id}>
            <ProductCard key={product.id} product={product} />
          </Link>
        ))} */}
      </div>

      {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
              
              {/* Nút PREVIOUS */}
              <button 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"
              >
                  <GrFormPrevious size={18} /> PREVIOUS
              </button>
              
              {pageNumbers.map((item, index) => (
                  <React.Fragment key={index}>
                      {item === '...' ? (
                          <span className="px-3 py-2 text-gray-700">...</span>
                      ) : (
                          <button
                              onClick={() => goToPage(item as number)} // Chuyển item thành number
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
                  NEXT <GrFormNext size={18} />
              </button>
          </div>
      )}
    </div>
  );
}