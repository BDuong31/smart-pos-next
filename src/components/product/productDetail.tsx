'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HeartRegular, { HeartBold } from '../icons/heart';
import { IProductDetails } from '@/interfaces/product';
import { getVariants } from '@/apis/variant';
import { useToast } from '@/context/toast-context';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { SplashScreen } from '../loading';
import { IVariant } from '@/interfaces/variant';
import { IOption, IOptionItem, IProductOptionConfig } from '@/interfaces/option';
import { getListOptionIds, getListOptionItemIds, getOptionItems, getProductOptionConfigs } from '@/apis/option';

// Các import bạn có thể mở lại khi dùng
// import { IWishlistCreate } from '@/interfaces/wishlist';
// import { useUserProfile } from '@/context/user-context';
// import { createWishlist, deleteWishlist, getWishlistByCond } from '@/apis/wishlist';
// import { createCartItem } from '@/apis/cart';
// import { ICartItemCreate } from '@/interfaces/cart';
// import { useCart } from '@/context/cart-context';
// import { useAuth } from '@/context/auth-context';

type ProductDetailProps = {
    product: IProductDetails | null;
}

const ProductDetails = ( {product}: ProductDetailProps) => {
    // Contexts
    // const { userProfile } = useUserProfile();
    // const { isAuthenticated } = useAuth();
    // const { cart, refeshCart, refeshCartItem } = useCart();
    const { showToast } = useToast();

    // Dữ liệu API
    const [variant, setVariant] = useState<IVariant[]>([]);
    const [productOptionConfigs, setProductOptionConfigs] = useState<IProductOptionConfig[]>([]);
    const [optionGroupIds, setOptionGroupIds] = useState<string[]>([]);
    const [optionGroups, setOptionGroups] = useState<IOption[]>([]);
    const [optionItem, setOptionItem] = useState<IOptionItem[]>([]);
    
    // States cho món ăn
    const [loading, setLoading] = useState(true);
    const [isInWishlist, setIsInWishlist] = useState(false);
    
    // Lựa chọn của người dùng
    const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null); // Chọn kích cỡ
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Lưu mảng ID các topping/option đã chọn
    
    const fetcherVariant = async () => {
        try {
            const response = await getVariants({productId: product?.id || ''}, 1, 100);
            setVariant(response.data);
            if (response.data && response.data.length > 0) {
                setSelectedVariant(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    }

    const fetcherProductOptionConfigs = async () => {
        try {
            const productId = product?.id || '';
            const response = await getProductOptionConfigs(productId, undefined, 1, 100);
            setProductOptionConfigs(response.data);
            
            const groupIds = response.data.map((config) => config.optionGroupId);
            setOptionGroupIds(groupIds);
        } catch (error) {
            console.error('Error fetching product option configs:', error);
        }
    }

    const fetcherOptionGroups = async () => {
        try {
            const response = await getListOptionIds(optionGroupIds);
            setOptionGroups(response);
            
        } catch (error) {
            console.error('Error fetching option groups:', error);
        }
    }

    const fetcherOptionItems = async (groupIds: string) => {
        try {
            const response = await getOptionItems(groupIds, undefined, undefined, 1, 100);
            setOptionItem(prev => [...prev, ...response.data]);
        } catch (error) {
            console.error('Error fetching option items:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetcherVariant();
            await fetcherProductOptionConfigs();
            setLoading(false);
        }
        if (product) fetchData();
    }, [product])

    useEffect(() => {
        if (optionGroupIds.length > 0) {
            setLoading(true);
            fetcherOptionGroups();
            setOptionItem([]); 
            optionGroupIds.forEach((groupId) => {
                fetcherOptionItems(groupId);
            });
            setLoading(false);
        }
    }, [optionGroupIds])

    const handleOptionToggle = (itemId: string, groupId: string, isMultiple: boolean = false) => {
        setSelectedOptions((prev) => {
            if (isMultiple) {
                if (prev.includes(itemId)) {
                    return prev.filter((id) => id !== itemId);
                }
                return [...prev, itemId];
            } else {
                const itemsInThisGroup = optionItem
                    .filter((item) => item.groupId === groupId)
                    .map((item) => item.id);

                const otherSelected = prev.filter((id) => !itemsInThisGroup.includes(id));

                if (prev.includes(itemId)) {
                    return otherSelected; 
                }
                return [...otherSelected, itemId]; 
            }
        });
    }

    const handleAddCart = () => {
        if (!selectedVariant) {
            showToast('Vui lòng chọn kích cỡ món ăn.', 'error');
            return;
        }
        showToast('Đã thêm vào giỏ hàng!', 'success');
        console.log("Cart Payload:", { variant: selectedVariant, options: selectedOptions });
    };

    const handleBuy = async () => {
        if (selectedVariant) {
            showToast('Đang chuyển đến trang thanh toán!', 'success');
        } else {
            showToast('Vui lòng chọn kích cỡ trước khi mua.', 'error');
        }
    };

    const handleWhishlist = async () => {
        setIsInWishlist(!isInWishlist);
        showToast(isInWishlist ? 'Đã xóa khỏi yêu thích!' : 'Đã thêm vào yêu thích!', 'success');
    }

    if (loading || !product) {
        return (
            <div className='w-full h-[400px] flex items-center justify-center'> 
                <SplashScreen />
            </div>
        );
    }

    return (
        <div>
            <h1 className='text-3xl font-semibold'>{product?.category?.name} {product?.name}</h1>
            <h2 className='text-xl text-blue font-semibold pt-2'>{product?.basePrice?.toLocaleString('vi-VN')} VNĐ </h2>
            
            <div className='mt-5'>
                {/* 1. KÍCH CỠ MÓN ĂN */}
                {variant.length > 0 && (
                    <div className='mb-6'>
                        <h2 className='text-base font-bold text-gray-800 mb-3 uppercase tracking-wide'>KÍCH CỠ</h2>
                        <ul className="flex flex-wrap gap-2">
                            {variant.map((v) => (
                                <li key={v.id} className="flex-none"> 
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-4 py-2 rounded-lg font-medium border-2 text-sm transition-all duration-200 ${
                                            selectedVariant?.id === v.id 
                                                ? 'bg-darkgrey text-white border-darkgrey' 
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                        }`}
                                    >
                                        { v.name || "Tiêu chuẩn"} 
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 2. CÁC TÙY CHỌN THÊM */}
                {optionGroups?.length > 0 && (
                    <div className='border-t border-slate-100 pt-5 space-y-5'>
                        {optionGroups.map((group) => {
                            const itemsInGroup = optionItem?.filter(item => item.groupId === group.id) || [];
                            if (itemsInGroup.length === 0) return null;

                            const isMultiple = group.isMultiSelect === true; 

                            return (
                                <div key={group.id}>
                                    <div className="flex items-baseline justify-between mb-3">
                                        <h2 className='text-base font-bold text-gray-800 uppercase tracking-wide'>
                                            {group.name}
                                        </h2>
                                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {isMultiple ? "Chọn nhiều" : "Chọn 1"}
                                        </span>
                                    </div>

                                    {/* NẾU LÀ CHỌN 1 (Lượng đá, lượng đường...) -> HIỂN THỊ DẠNG NÚT GỌN GÀNG */}
                                    {!isMultiple ? (
                                        <ul className="flex flex-wrap gap-2">
                                            {itemsInGroup.map((item) => {
                                                const isChecked = selectedOptions.includes(item.id);
                                                return (
                                                    <li key={item.id} className="flex-none">
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleOptionToggle(item.id, group.id, isMultiple)}
                                                            className={`px-4 py-2 rounded-lg font-medium border-2 text-sm transition-all duration-200 ${
                                                                isChecked 
                                                                    ? 'bg-darkgrey text-white border-darkgrey' 
                                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            {item.name}
                                                            {item.priceExtra ? ` (+${item.priceExtra.toLocaleString('vi-VN')}đ)` : ''}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        /* NẾU LÀ CHỌN NHIỀU (Topping...) -> HIỂN THỊ DẠNG GRID 2 CỘT CHO ĐỠ DÀI */
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {itemsInGroup.map((item) => {
                                                const isChecked = selectedOptions.includes(item.id);
                                                return (
                                                    <li key={item.id}>
                                                        <label 
                                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                                                                isChecked 
                                                                    ? 'border-slate-800 bg-slate-50' 
                                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`flex items-center justify-center w-4 h-4 border rounded flex-shrink-0 transition-colors ${
                                                                    isChecked 
                                                                    ? 'border-darkgrey bg-darkgrey' 
                                                                    : 'border-slate-300'
                                                                }`}>
                                                                    {isChecked && (
                                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isChecked}
                                                                    onChange={() => handleOptionToggle(item.id, group.id, isMultiple)}
                                                                    className="hidden" 
                                                                />
                                                                
                                                                <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-darkgrey' : 'text-slate-700'}`}>
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                            
                                                            {item.priceExtra ? (
                                                                <span className={`text-xs font-medium ${isChecked ? 'text-slate-800' : 'text-slate-500'}`}>
                                                                    +{item.priceExtra.toLocaleString('vi-VN')} đ
                                                                </span>
                                                            ) : null}
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* BUTTONS */}
            <div className='flex gap-2 py-6 flex-col sm:flex-nowrap border-t mt-5'>
                <div className='flex gap-2 flex-1 flex-wrap sm:flex-nowrap'>
                    <button type='button' className='bg-darkgrey text-white py-3.5 rounded-xl w-full font-semibold hover:opacity-90 transition-opacity' onClick={() => handleAddCart()}>
                        Thêm vào giỏ hàng
                    </button>
                    <button type='button' className='bg-slate-50 py-3.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors' onClick={() => handleWhishlist()}>
                        {isInWishlist ? (
                            <HeartBold width={22} height={22} className='text-red-500' />
                        ) : (
                            <HeartRegular width={22} height={22} className='text-slate-500'/>
                        )}
                    </button>
                </div>
                <button type='button' className='bg-blue text-white py-3.5 rounded-xl w-full font-semibold hover:opacity-90 transition-opacity' onClick={() => handleBuy()}>
                    MUA NGAY
                </button>
            </div>
        </div>
    )
}

export default ProductDetails