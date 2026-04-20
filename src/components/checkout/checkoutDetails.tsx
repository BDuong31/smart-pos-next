"use client"
import React, { useCallback, useEffect, useState } from 'react' 
import { useRouter } from 'next/navigation'
import CartItem from '@/components/cart/cartItem'
import { IImage } from '@/interfaces/image'
import { IVariant } from '@/interfaces/variant'
import { ICartItemDetail, ICartItemOptionDetail } from '@/interfaces/cart'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { getCartItemOptions, getCartItems } from '@/apis/cart'

type CheckoutDetailsProps = {
    cartTotal: number | undefined;
    cartCount: number | undefined;
    deliveryFee: number | undefined;
    voucherDiscount?: number | undefined;
    totalAfterDiscount?: number | undefined;
    variantMap: Record<string, IVariant>;
} 
const CheckoutDetails = ({ cartTotal, cartCount, deliveryFee, voucherDiscount, totalAfterDiscount, variantMap }: CheckoutDetailsProps) => {
    const rounter = useRouter();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const [cartItem, setCartItem] = useState<ICartItemDetail[]>([]);
    const [optionMap, setOptionMap] = useState<Record<string, ICartItemOptionDetail[]>>({});

    const fetchCartItems = async () => {
        const cartItems = await getCartItems(cart?.id, undefined, undefined, undefined, undefined, 1, 100);
        setCartItem(cartItems.data);
    }


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

    useEffect(() => {
        fetchCartItems();
    }, [cart]);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    return (
        <div className='h-full flex flex-col'>
            <div className='bg-fawhite rounded-xl p-5 mb-7'>
                <h1 className='text-2xl font-semibold pb-5'>Tổng quan đơn hàng</h1>
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-row justify-between'>
                        <p>{cartCount} món</p> 
                        <p>${cartTotal?.toFixed(2)}</p>
                </div>
                {/* <div className='flex flex-row justify-between'>
                        <p>Delivery</p>
                        <p>${deliveryFee?.toFixed(2)}</p>
                </div> */}
                <div className='flex flex-row justify-between'>
                        <p>Giảm giá</p>
                        <p>
                            {voucherDiscount ? `-$${voucherDiscount.toFixed(2)}` : '$0.00'}
                        </p>
                    </div>
                <div className='flex flex-row justify-between'>
                        <p className='font-semibold'>Tổng</p>
                        <p className='font-semibold'>${totalAfterDiscount?.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className='flex-1 min-h-0 bg-fawhite rounded-xl p-5 flex flex-col'>
                <h1 className='text-2xl font-semibold pb-5 flex-shrink-0'>Thông tin đơn hàng</h1>
                <div className='flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto scrollbar-hide'>
                {cartItem?.map((item : ICartItemDetail, idx : number) => (
                    <CartItem key={idx} item={item} variant={variantMap[item.variantId]} options={optionMap[item.id] || []} type='checkout' />
                ))}
                </div>
            </div>
        </div>
    )
}

export default CheckoutDetails