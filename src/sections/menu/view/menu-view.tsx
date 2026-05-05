'use client';
import Image from "next/image";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import ProductList from "@/components/product/productList"; // Component con
import Filters from "@/components/filter"; // Component con
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { SplashScreen } from "@/components/loading";
import { getProducts } from "@/apis/product";
import { IProductDetails } from "@/interfaces/product";
import { IVariant } from "@/interfaces/variant";
import { ICategory } from "@/interfaces/category";
import { getCategories } from "@/apis/category";

const ITEMS_PER_PAGE = 9;

const getPaginationRange = (currentPage: number, totalPages: number) => {
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

    if (startPage > 2) {
        range.push('...');
    } else if (startPage === 2 && totalPages > 3) {
        range.push(2);
    }

    for (let i = startPage; i <= endPage; i++) {
        if (!range.includes(i)) {
            range.push(i);
        }
    }

    if (endPage < totalPages - 1) {
        range.push('...');
    } else if (endPage === totalPages - 1 && totalPages > 3) {
        range.push(totalPages - 1);
    }
    
    if (!range.includes(totalPages)) {
        range.push(totalPages);
    }

   let finalRange = [];
    for (let i = 0; i < range.length; i++) {
        if (
            range[i] === '...' &&
            i > 0 &&
            i < range.length - 1 &&
            typeof range[i - 1] === 'number' &&
            typeof range[i + 1] === 'number' &&
            Number(range[i - 1]) + 1 === Number(range[i + 1])
        ) {
            continue;
        }
        finalRange.push(range[i]);
    }

    return finalRange;
};


export default function MenuView() {
    const [categoryFilters, setCategoryFilters] = useState<string[] | undefined>([]);
    const [categorys, setCategorys] = useState<ICategory[]>([]);
    const [ProductsCount, setProductsCount] = useState(0);
    const [FilterPopup, setFilterPopup] = useState(false);
    const [FiltersApplied, setFiltersApplied] = useState('NEWEST');
    const [smFilterPopup, setSmFilterPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [currentProducts, setCurrentProducts] = useState<IProductDetails[]>([]);
    const [variantList, setVariantList] = useState<IVariant[]>([]);
    const [variant, setVariant] = useState<Record<string, IVariant[] | undefined>>({});
    const [totalPages, setTotalPages] = useState(1);

    const popupRef = useRef<HTMLDivElement | null>(null);
    const filterRef = useRef<HTMLDivElement | null>(null);

    const fetcherCategorys = async () => {
        try {
            setLoading(true);
            const response = await getCategories(undefined, undefined, 1, 100);
            setCategorys(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetcherProducts = async () => {
        setLoading(true);
        try {
            const response = await getProducts({}, currentPage, ITEMS_PER_PAGE);
            setCurrentProducts(response.data);
            setProductsCount(response.total);
            setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetcherProducts();
        fetcherCategorys();
    }, [currentPage, FiltersApplied]);

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    const pageNumbers = getPaginationRange(currentPage, totalPages);

    // Hàm chung cho sắp xếp
    const handleSortChange = (sortType: string) => {
        setFiltersApplied(sortType);
        setFilterPopup(false);
    };

    if (loading) {
        return <SplashScreen className="h-[80vh]"/>;
    };
    return (
        <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] py-10"> 
            <div>
                <Image src="/banner.png" width={1320} height={395} alt="New Drops" className='w-full rounded-3xl mb-7 lg:mb-0 max-h-[400px]' />
            </div>
            {/* Thanh điều khiển lớn (Desktop) */}
            <div className='hidden lg:flex justify-between px-2 py-7'>
                <div className=''>
                    <h2 className='text-2xl font-semibold'>Thực đơn</h2>
                    <p>{ProductsCount} món</p>
                </div>
                <div className='relative' ref={popupRef}>
                    <button className='flex justify-between items-center bg-fawhite min-w-[180px] py-3 px-4 rounded-xl' onClick={() => setFilterPopup(!FilterPopup)}>
                        <p className='text-left font-semibold uppercase'>{FiltersApplied}</p>
                        {FilterPopup ? <MdKeyboardArrowUp  size={20}/> : <MdKeyboardArrowDown size={25}/>}
                    </button>
                    {
                        FilterPopup &&
                        <ul className='py-3 px-4 text-left font-semibold uppercase bg-fawhite pt-6 -mt-4 rounded-b-xl absolute z-20 w-full'>
                            <li><button className='uppercase mb-1 hover:text-blue-600' onClick={() => handleSortChange('NEWEST')}>Mới nhất</button></li>
                            <li><button className='uppercase mb-1 hover:text-blue-600' onClick={() => handleSortChange('PRICE ASC')}>Giá tăng dần</button></li>
                            <li><button className='uppercase mb-1 hover:text-blue-600' onClick={() => handleSortChange('PRICE DESC')}>Giá giảm dần</button></li>
                        </ul>
                    }
                </div>
            </div>

            {/* Thanh điều khiển nhỏ (Mobile/Tablet) */}
            <div className='lg:hidden pb-5'>
                <div className='flex gap-5'>  
                    <div className='relative' ref={filterRef}>
                        <button className='flex justify-between items-center bg-fawhite min-w-[180px] py-3 px-4 rounded-xl' onClick={() => setSmFilterPopup(!smFilterPopup)}>
                            <p className='text-left font-semibold uppercase'>Bộ lọc</p>
                            {smFilterPopup ? <MdKeyboardArrowUp  size={20}/> : <MdKeyboardArrowDown size={25}/>}
                        </button>
                        {
                            smFilterPopup &&
                            <div className={`absolute z-20 left-0 right-0 bg-fawhite m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] py-7 px-5 rounded-b-xl`}>
                                <Filters categoryFilters={categoryFilters} setCategoryFilters={setCategoryFilters}/>
                            </div>
                        }
                    </div>
                    
                    <div className='relative' ref={popupRef}>
                        <button className='flex justify-between items-center bg-fawhite min-w-[180px] py-3 px-4 rounded-xl' onClick={() => setFilterPopup(!FilterPopup)}>
                            <p className='text-left font-semibold uppercase'>{FiltersApplied}</p>
                            {FilterPopup ? <MdKeyboardArrowUp  size={20}/> : <MdKeyboardArrowDown size={25}/>}
                        </button>
                        {
                            FilterPopup &&
                            <ul className='py-3 px-4 text-left font-semibold uppercase bg-white pt-6 -mt-4 rounded-b-xl absolute z-20 w-full'>
                                <li><button className='uppercase mb-1 hover:text-blue-600' onClick={() => handleSortChange('NEWEST')}>Mới nhất</button></li>
                                <li><button className='uppercase mb-1 hover:text-blue-600' onClick={() => handleSortChange('PRICE ASC')}>Giá tăng dần</button></li>
                                <li><button className='uppercase mb-1 hover:text-blue-600' onClick={() => handleSortChange('PRICE DESC')}>Giá giảm dần</button></li>
                            </ul>
                        }
                    </div>
                </div>
                <div className='py-5'>
                    <h2 className='text-xl font-semibold'>New Drops</h2>
                    <p>{ProductsCount} items</p>
                </div>
            </div>
            
            <div className='lg:grid grid-cols-4 gap-3'>
                <div className='hidden lg:block'>
                    <h2 className='text-xl font-semibold ml-2 mb-4'>Bộ lọc</h2>
                    <Filters Categories={categorys} categoryFilters={categoryFilters} setCategoryFilters={setCategoryFilters}/>
                </div>
                
                <div className='col-span-3 lg:mt-4'>
                    {currentProducts.length > 0 ? (
                        <ProductList products={currentProducts} variants={variant} />
                    ): (
                        <p className='text-center text-gray-500'>Không tồn tại món.</p>
                    )}  
                    {totalPages > 1 && (
                        /* - mt-8 (Mobile) -> mt-12 (PC)
                        - space-x-1 (Mobile) -> space-x-2 (PC) để các nút không dính nhau trên màn hình hẹp
                        */
                        <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-8 sm:mt-12 w-full">
                            
                            {/* Nút PREVIOUS */}
                            <button 
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-3 sm:px-4 text-xs sm:text-base"
                            >
                                <GrFormPrevious size={18} /> 
                                <span className="hidden sm:inline">TRƯỚC</span>
                            </button>
                            
                            {/* Container cho số trang: Cho phép cuộn ngang trên Mobile cực hẹp */}
                            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar px-1">
                                {pageNumbers.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item === '...' ? (
                                            <span className="px-1 sm:px-3 py-2 text-gray-700">...</span>
                                        ) : (
                                            <button
                                                onClick={() => goToPage(item as number)}
                                                /* - Kích thước nút: nhỏ hơn trên Mobile (px-3 py-1.5) 
                                                - Font size: nhỏ hơn (text-sm)
                                                */
                                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-semibold transition border text-sm sm:text-base ${
                                                    currentPage === item 
                                                        ? 'bg-neutral-950 text-white border-black' 
                                                        : 'text-black border-gray-300 hover:bg-gray-100'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Nút NEXT */}
                            <button 
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-3 sm:px-4 text-xs sm:text-base"
                            >
                                <span className="hidden sm:inline">SAU</span>
                                <GrFormNext size={18} />
                            </button>

                            <style jsx global>{`
                                .no-scrollbar::-webkit-scrollbar { display: none; }
                                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                            `}</style>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}