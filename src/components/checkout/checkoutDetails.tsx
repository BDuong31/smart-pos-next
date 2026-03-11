"use client"
import React, { useEffect, useState } from 'react' 
import { useRouter } from 'next/navigation'
import CartItem from '@/components/cart/cartItem'
import { mockCartItems } from '@/sections/cart/data/cart'
import { IImage } from '@/interfaces/image'
import { IProductVariant } from '@/interfaces/variant'
import { useCart } from '@/context/cart-context'
import { ICartItem } from '@/interfaces/cart'

type CheckoutDetailsProps = {
    cartTotal: number | undefined;
    cartCount: number | undefined;
    deliveryFee: number | undefined;
    voucherDiscount?: number | undefined;
    totalAfterDiscount?: number | undefined;
    variantMap: Record<string, IProductVariant>;
} 
const CheckoutDetails = ({ cartTotal, cartCount, deliveryFee, voucherDiscount, totalAfterDiscount, variantMap }: CheckoutDetailsProps) => {
    const rounter = useRouter();
    const { cartItem } = useCart();
  
    return (
        <div className='h-full flex flex-col'>
            <div className='bg-fawhite rounded-xl p-5 mb-7'>
                <h1 className='text-2xl font-semibold pb-5'>Order Summary</h1>
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-row justify-between'>
                        <p>{cartCount} items</p> 
                        <p>${cartTotal?.toFixed(2)}</p>
                </div>
                <div className='flex flex-row justify-between'>
                        <p>Delivery</p>
                        <p>${deliveryFee?.toFixed(2)}</p>
                </div>
                <div className='flex flex-row justify-between'>
                        <p>Sales Tax</p>
                        <p>
                            {voucherDiscount ? `-$${voucherDiscount.toFixed(2)}` : '$0.00'}
                        </p>
                    </div>
                <div className='flex flex-row justify-between'>
                        <p className='font-semibold'>Total</p>
                        <p className='font-semibold'>${totalAfterDiscount?.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className='flex-1 min-h-0 bg-fawhite rounded-xl p-5 flex flex-col'>
                <h1 className='text-2xl font-semibold pb-5 flex-shrink-0'>Order Details</h1>
                <div className='flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto scrollbar-hide'>
                {cartItem?.map((item : ICartItem, idx : number) => (
                    <CartItem key={idx} item={item} variant={variantMap[item.variantId]} type='checkout' />
                ))}
                </div>
            </div>
        </div>
    )
}

export default CheckoutDetails