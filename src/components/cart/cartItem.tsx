'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { IoTrashBinOutline } from "react-icons/io5";
import HeartRegular, { HeartBold } from '../icons/heart';
import { ICartItemDetail, ICartItemOptionDetail } from '@/interfaces/cart';
import { IVariant } from '@/interfaces/variant';
import { IImage } from '@/interfaces/image';
import { getImages } from '@/apis/image';
import { useToast } from '@/context/toast-context';
import { deleteCartItem, updateCartItem } from '@/apis/cart';
import { SplashScreen } from '../loading';

type CartItemProps = {
    type: 'cart' | 'checkout';
    item: ICartItemDetail;
    variant: IVariant;
    options: ICartItemOptionDetail[]; // Nhận dữ liệu options từ cha
    onRefreshCart?: () => void; 
}

const CartItem = ({ type, item, variant, options, onRefreshCart }: CartItemProps) => {
    const [images, setImages] = useState<IImage[]>([]);
    const [imageDefault, setImageDefault] = useState<IImage>();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    
    const [selectedQty, setSelectedQty] = useState<number>(item?.quantity ?? 1);
    const [isUpdating, setIsUpdating] = useState(false);
    const { showToast } = useToast();

    // Lấy ảnh sản phẩm
    const fetcherImages = async (productId: string) => {
        try {
            const response = await getImages({ refId: productId, type: 'product' }, 1, 10);
            setImages(response.data);
            const mainImage = response.data.find((img: IImage) => img.isMain);
            setImageDefault(mainImage || response.data[0]);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    useEffect(() => {
        if (variant?.productId) {
            fetcherImages(variant.productId);
        }
    }, [variant]);

    const fetcherDeleteCartItem = async () => {
        try {
            await deleteCartItem(item?.id || '');
            showToast('Đã xóa món ăn khỏi giỏ hàng', 'success');
            if (onRefreshCart) onRefreshCart();
        } catch (error) {
            showToast('Lỗi khi xóa món ăn', 'error');
        }
    }

    const handleUpdateQty = async (newQty: number) => {
        if (isUpdating || newQty < 1) return;
        setIsUpdating(true);
        setSelectedQty(newQty);

        try {
            await updateCartItem(item.id, { quantity: newQty });
            if (onRefreshCart) onRefreshCart();
        } catch (error) {
            showToast('Lỗi khi cập nhật số lượng', 'error');
            setSelectedQty(item.quantity); 
        } finally {
            setIsUpdating(false);
        }
    };

    // Tính tổng tiền dựa trên prop options
    const optionsTotal = options?.reduce((acc: number, opt: ICartItemOptionDetail) => {
        return acc + (opt.optionItem?.priceExtra || 0);
    }, 0) || 0;

    const basePrice = item?.product?.basePrice || 0;
    const priceDiff = variant?.priceDiff || 0;
    const quantity = item?.quantity || 1;

    const itemTotalPrice = (basePrice + priceDiff + optionsTotal) * quantity;

    return (
        <div className={`grid grid-cols-3 gap-4 bg-none ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
            <Image 
                src={imageDefault?.url ?? '/logo.png'} 
                width={500} height={500} 
                alt={item?.product?.name || 'Product Image'} 
                className='w-full max-h-[200px] object-contain rounded-2xl border border-slate-100' 
            />
            <div className='col-span-2'>
                <div className='flex flex-col justify-between h-full'>
                    {variant ? (
                        <>
                            <div>
                                <div className='flex justify-between'>
                                    <h1 className='text-lg font-semibold text-darkgrey max-w-[75%]'>
                                        {item?.product?.name}
                                    </h1>
                                    <h1 className='text-lg font-semibold text-blue'>
                                        {itemTotalPrice.toLocaleString('vi-VN')} VNĐ
                                    </h1>
                                </div>

                                <p className='text-sm text-darkgrey mt-1'>
                                    Kích cỡ: <span className="font-medium">{variant?.name || "Tiêu chuẩn"}</span>
                                </p>

                                {/* Render Options từ prop options */}
                                {options.length > 0 && (
                                    <ul className="mt-2 mb-4 space-y-1">
                                        {options.map((opt: ICartItemOptionDetail) => (
                                            <li key={opt.id} className="text-xs text-slate-500 flex justify-between">
                                                <span>+ {opt.optionItem.name}</span>
                                                {opt.optionItem?.priceExtra > 0 && (
                                                    <span>{opt.optionItem.priceExtra.toLocaleString('vi-VN')}đ</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {type === 'cart' ? (
                                    <div className="flex items-center gap-4 mt-3">
                                        <p className='text-sm font-medium'>Số lượng:</p>
                                        <div className="flex items-center border border-slate-200 rounded-lg">
                                            <button 
                                                className="px-3 py-1 hover:bg-slate-100 rounded-l-lg transition-colors"
                                                onClick={() => handleUpdateQty(selectedQty - 1)}
                                                disabled={selectedQty <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 text-sm font-semibold">{selectedQty}</span>
                                            <button 
                                                className="px-3 py-1 hover:bg-slate-100 rounded-r-lg transition-colors"
                                                onClick={() => handleUpdateQty(selectedQty + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-5 my-5'>
                                        <p className="text-sm">Số lượng: {item?.quantity}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className='flex flex-row justify-end mt-4'>
                                {type === 'cart' && (
                                    <div className='flex flex-row gap-2'>
                                        <button 
                                            className='hover:bg-red-50 hover:text-red-500 rounded-xl h-full p-2 transition-colors'
                                            onClick={fetcherDeleteCartItem}
                                        >
                                            <IoTrashBinOutline size={22} role='button' />
                                        </button>
                                        <button 
                                            className='hover:bg-slate-100 rounded-xl h-full p-2 transition-colors'
                                            onClick={() => setIsFavorite(!isFavorite)}
                                        >
                                            {isFavorite ? (
                                                <HeartBold width={22} height={22} className='fill-red-500' />
                                            ) : (
                                                <HeartRegular width={22} height={22} className='stroke-darkgrey' />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className='flex justify-center items-center h-full'>
                            <SplashScreen className='h-[40px]' />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartItem