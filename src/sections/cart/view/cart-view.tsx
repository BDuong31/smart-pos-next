"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

import CartItem from '@/components/cart/cartItem'; 
import { ProductListLaster } from '@/components/product/productList';
import { SplashScreen } from '@/components/loading';
import { useToast } from '@/context/toast-context';

import { getVariantById } from '@/apis/variant';
import { getCartItemOptions, getCartItems } from '@/apis/cart';

import { AppDispatch, RootState } from '@/store/store';
import { fetchCartByUserId } from '@/store/slices/cartSlice';
import { getMe } from '@/store/slices/userSlice';

import { IProductDetails } from '@/interfaces/product';
import { ICartItemDetail, ICartItemOptionDetail } from '@/interfaces/cart';
import { IVariant } from '@/interfaces/variant';

export default function CartView() {
    const router = useRouter();
    const { showToast } = useToast();
    const dispatch = useDispatch<AppDispatch>();
    
    const user = useSelector((state: RootState) => state.user.user);
    const cart = useSelector((state: RootState) => state.cart.cart);

    const [cartItem, setCartItem] = useState<ICartItemDetail[]>([]);
    const [variantMap, setVariantMap] = useState<Record<string, IVariant>>({});
    // SỬA LỖI 1: optionMap map item.id với MỘT MẢNG các ICartItemOptionDetail
    const [optionMap, setOptionMap] = useState<Record<string, ICartItemOptionDetail[]>>({});
    
    const [relatedProducts, setRelatedProducts] = useState<IProductDetails[]>([]);
    const [relatedVariants, setRelatedVariants] = useState<Record<string, IVariant[]>>({});

    const [cartTotal, setCartTotal] = useState(0);
    const [voucherDiscount, setVoucherDiscount] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchCartItems = useCallback(async () => {
        if (cart) {
            try {
                const response = await getCartItems(cart.id, undefined, undefined, undefined, undefined, 1, 100);
                setCartItem(response.data as ICartItemDetail[] || []);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        } else if (user?.id) {
            dispatch(fetchCartByUserId(user.id));
        }
    }, [cart, user?.id, dispatch]);

    useEffect(() => {
        if (user) {
            fetchCartItems();
        } else {
            dispatch(getMe());
        }
    }, [user, fetchCartItems, dispatch]);

    // SỬA LỖI 2: Map option theo id của CartItem để dễ dàng truy xuất
    const fetchOptions = useCallback(async () => {
        if (!cartItem || cartItem.length === 0) return;

        const newOptionMap: Record<string, ICartItemOptionDetail[]> = { ...optionMap };
        let hasChanges = false;

        for (const item of cartItem) {
            // Chỉ fetch nếu chưa có data của item này trong map để tối ưu
            if (!newOptionMap[item.id]) {
                try {
                    const option = await getCartItemOptions(item.id, undefined, 1, 100);
                    newOptionMap[item.id] = option.data || [];
                    hasChanges = true;
                } catch (error) {
                    console.error(`Error fetching options for cart item ${item.id}:`, error);
                }
            }
        }

        if (hasChanges) {
            setOptionMap(newOptionMap);
        }
    }, [cartItem, optionMap]);

    // SỬA LỖI 3: Cần có useEffect để trigger hàm fetchOptions khi cartItem thay đổi
    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    useEffect(() => {
        if (!cartItem || cartItem.length === 0) return;

        const loadMissingVariants = async () => {
            const newMap = { ...variantMap };
            let hasChanges = false;

            for (const item of cartItem) {
                if (!newMap[item.variantId]) {
                    try {
                        const res = await getVariantById(item.variantId);
                        if (res.data) {
                            newMap[item.variantId] = res.data;
                            hasChanges = true;
                        }
                    } catch (e) {
                        console.error(`Failed to fetch variant ${item.variantId}`, e);
                    }
                }
            }

            if (hasChanges) {
                setVariantMap(newMap);
            }
            setLoading(false);
        };

        loadMissingVariants();
    }, [cartItem]);

    // TÍNH TOÁN TỔNG TIỀN
    useEffect(() => {
        if (!cartItem || cartItem.length === 0 || Object.keys(variantMap).length === 0) {
            setCartTotal(0);
            return;
        }

        const total = cartItem.reduce((acc, item) => {
            const variant = variantMap[item.variantId];
            if (!variant) return acc;

            const basePrice = variant.priceDiff + item.product?.basePrice;
            
            // Tính tổng tiền các Topping/Option của item này
            const optionsPrice = optionMap[item.id]?.reduce((optAcc: number, opt: ICartItemOptionDetail) => {
                return optAcc + (opt.optionItem?.priceExtra || 0);
            }, 0) || 0;

            return acc + ((basePrice + optionsPrice) * item.quantity);
        }, 0);

        setCartTotal(total);
    }, [cartItem, variantMap, optionMap]); // Thêm optionMap vào dependencies

    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth >= 1280) setItemsPerPage(4);
                else if (window.innerWidth >= 1024) setItemsPerPage(2);
                else setItemsPerPage(1);
            }
        };
        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);
        return () => window.removeEventListener('resize', calculateItemsPerPage);
    }, []);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return relatedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [relatedProducts, currentPage, itemsPerPage]);

    if (loading) {
        return <SplashScreen className='h-[80px]' />
    }

    return (
        <>
            <div className='m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] lg:grid grid-cols-3 gap-5 py-10'>
                <div className='max-h-screen col-span-2 bg-fawhite p-4 lg:p-7 rounded-xl mb-10 lg:mb-0 flex flex-col'>                    
                    <div>
                        <h1 className='text-2xl font-semibold'>Giỏ hàng của bạn</h1>
                        <p className='text-sm text-darkgrey opacity-80 mt-1 mb-6'>Kiểm tra lại các món ăn trước khi tiến hành thanh toán.</p>
                    </div>
                    
                    <div className='flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto scrollbar-hide'>
                        {cartItem && cartItem.length > 0 ? (
                            cartItem.map((item: ICartItemDetail, idx: number) => (
                                <CartItem 
                                    key={item.id || idx} 
                                    item={item} 
                                    variant={variantMap[item.variantId]} 
                                    options={optionMap[item.id] || []} // Truyền thẳng mảng options xuống
                                    type='cart' 
                                    onRefreshCart={fetchCartItems} 
                                />
                            ))
                        ) : (
                            <p className='text-center text-darkgrey font-medium py-10'>Giỏ hàng của bạn đang trống.</p>
                        )}
                    </div>
                </div>
                
                <div className='bg-fawhite px-7 p-4 lg:pb-7 rounded-xl lg:bg-transparent'>
                    <h1 className='text-2xl font-semibold py-5'>Tóm tắt đơn hàng</h1>
                    <div className='flex flex-col gap-2 text-[15px]'>
                        <div className='flex flex-row justify-between'>
                            <p className="text-slate-600">{cartTotal > 0 ? cartItem.length : 0} món</p> 
                            <p className="font-medium">{cartTotal.toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <p className="text-slate-600">Phí giao hàng</p>
                            <p className="font-medium">0 VNĐ</p>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <p className="text-slate-600">Khuyến mãi</p>
                            <p className='text-green-600 font-medium'>
                                {voucherDiscount > 0 ? `-${voucherDiscount.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                            </p>
                        </div>
                        
                        <div className="border-t border-slate-200 my-2"></div>
                        
                        <div className='flex flex-row justify-between items-center'>
                            <p className="font-semibold text-lg">Tổng cộng</p>
                            <p className="font-semibold text-xl text-blue">
                                {Math.max(0, cartTotal - voucherDiscount).toLocaleString('vi-VN')} VNĐ
                            </p>
                        </div>
                    </div>

                    <button 
                        className='w-full bg-blue hover:opacity-90 transition-opacity text-white font-semibold rounded-xl py-3.5 mt-8 uppercase tracking-wide disabled:opacity-50' 
                        onClick={() => router.push("/checkout")}
                        disabled={cartItem.length === 0}
                    >
                        Thanh toán ngay
                    </button>
                </div>
            </div>
            
            {relatedProducts.length > 0 && (
                <div className='m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] pb-10'>
                    <div className={`pb-5 flex m-auto items-center`}>
                        <h1 className='2xl:text-[32px] text-[24px] font-semibold flex-1 text-darkgrey'>Gợi ý cho bạn</h1>
                        <div className='flex justify-end gap-3'>
                            <button className='p-2.5 bg-white border border-slate-200 shadow-sm rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                <GrFormPrevious color='black' size={20}/>
                            </button>
                            <button className='p-2.5 bg-white border border-slate-200 shadow-sm rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                <GrFormNext color='black' size={20}/>
                            </button>
                        </div>
                    </div>
                    <ProductListLaster products={paginatedProducts} variants={relatedVariants} length={itemsPerPage} /> 
                </div>
            )}
        </>
    )
}