'use client'
import React, { useEffect, useState } from 'react'
import { ColorPickerSelected } from '@/components/colorPicker';
import { useRouter } from 'next/navigation'
import HeartRegular, { HeartBold } from '../icons/heart';
import { IProductDetails } from '@/interfaces/product';
import { IProductVariant } from '@/interfaces/variant';
import { getVariants } from '@/apis/variant';
import { useToast } from '@/context/toast-context';
import { IWishlistCreate } from '@/interfaces/wishlist';
import { useUserProfile } from '@/context/user-context';
import { createWishlist, deleteWishlist, getWishlistByCond } from '@/apis/wishlist';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { createCartItem } from '@/apis/cart';
import { ICartItemCreate } from '@/interfaces/cart';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { SplashScreen } from '../loading';

type ProductDetailProps = {
    product: IProductDetails | null;
}

const ProductDetails = ( {product}: ProductDetailProps) => {
    const { userProfile } = useUserProfile();
    const { isAuthenticated } = useAuth();
    const { cart, refeshCart, refeshCartItem } = useCart();
    const [colors, setColors] = useState<string[]>([])
    const [sizes, setSizes] = useState<number[]>([])
    const [variant, setVariant] = useState<IProductVariant[]>([])
    const [isInWishlist, setIsInWishlist] = useState(false);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(
        undefined
    );
    const [selectedSize, setSelectedSize] = useState<number | undefined>(
        undefined
    );

    const [allColors, setAllColors] = useState<string[]>([]);
    const [allSizes, setAllSizes] = useState<number[]>([]);
    
    const fetcherVariant = async () => {
        try {
            const response = await getVariants(product?.id ?? '');
            setVariant(response.data);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    }

    const fetchWishlistStatus = async () => {
        try {
            const response = await getWishlistByCond(userProfile?.id || '', product?.id || '');
            if (response.data.length > 0) {
                setIsInWishlist(true);
            } else {
                setIsInWishlist(false);
            }
        } catch (error) {
            console.error('Error fetching wishlist status:', error);
            return false;
        }
    }

    const fetcheAddCart = async (dto: ICartItemCreate) => {
        try {
            const response = await createCartItem(dto)
            refeshCart();
            refeshCartItem();
            showToast('Added to cart successfully!', 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetcherVariant();
            if (isAuthenticated && userProfile) {
                await fetchWishlistStatus();
            }
            setLoading(false);
        }
        fetchData();
    }, [product])

    useEffect(() => {
        const uniqueColors = Array.from(new Set(variant.map((v) => v.color)));
        setAllColors(uniqueColors);

        const uniqueSizes = Array.from(new Set(variant.map((v) => v.size))).sort(
        (a, b) => a - b
        );
        setAllSizes(uniqueSizes);

        setSelectedColor(undefined);
        setSelectedSize(undefined);
    }, [variant]);

    const isColorAvailable = (color: string): boolean => {
        if (!selectedSize) {
            return true;
        }
        return variant.some(
        (v) => v.color === color && v.size === selectedSize);
    };

    const isSizeAvailable = (size: number): boolean => {
        if (!selectedColor) {
        return true;
        }
        return variant.some(
        (v) => v.color === selectedColor && v.size === size
        );
    };
    const handleSizeChange = (size: number) => {
        if (selectedSize === size) {
            setSelectedSize(undefined);
        } else {
            setSelectedSize(size);
        }
    };

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const isStillValid = variant.some(
                (v) => v.color === selectedColor && v.size === selectedSize
            );
            if (!isStillValid) {
                setSelectedSize(undefined);
            }
        }
    }, [selectedColor, variant]);
    useEffect(() => {
        if (selectedColor && selectedSize) {
            const isStillValid = variant.some(
                (v) => v.color === selectedColor && v.size === selectedSize
            );
            if (!isStillValid) {
                setSelectedColor(undefined);
            }
        }
    }, [selectedSize, variant]);
    const finalSelectedVariant = variant.find(
        (v) => v.color === selectedColor && v.size === selectedSize
    );

    const handleAddCart = () => {
        if (!isAuthenticated){
            showToast('Please log in to add items to your cart.', 'error');
            return;
        }
        if (finalSelectedVariant) {
            const dto: ICartItemCreate = {
                variantId: finalSelectedVariant.id,
                cartId: cart?.id || '',
                quantity: 1
            }
            fetcheAddCart(dto);
        } else {
            showToast('Please select all attributes before adding to cart.', 'error');
        }
    };

    const handleBuy = async () => {
        if (finalSelectedVariant) {
            showToast('Proceeding to buy!', 'success');
        } else {
            showToast('Please select all attributes before buying.', 'error');
        }
    };

    const handleWhishlist = async () => {
        if (isInWishlist) {
            showToast('Removed from wishlist!', 'success');
            try {
                const response = await getWishlistByCond(userProfile?.id || '', product?.id || '');
                if (response.data.length > 0) {
                    const wishlistId = response.data[0].id;
                    const deleteResponse = await deleteWishlist(wishlistId);
                    showToast('Removed from wishlist successfully!', 'success');
                    setIsInWishlist(false);
                } else {
                    showToast('Wishlist item not found.', 'error');
                }
            } catch (error) {
                console.error('Failed to remove from wishlist:', error);
                showToast('Failed to remove from wishlist.', 'error');
            }
        } else {
            showToast('Added to wishlist!', 'success');
            const dto: IWishlistCreate = {
                productId: product?.id || '',
                userId: userProfile?.id || ''
            }
            try {
                const response = await createWishlist(dto)
                showToast('Added to wishlist successfully!', 'success');
                setIsInWishlist(true);
            } catch (error) {
                console.error('Failed to add to wishlist:', error);
                showToast('Failed to add to wishlist.', 'error');
            }
        }
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
            <h1 className='text-3xl font-semibold'>{product?.brand?.name} {product?.productName}</h1>
            <h2 className='text-xl text-blue font-semibold pt-2'>${product?.price}</h2>
            <div className='mt-3'>
            <h2 className='text-lg font-semibold'>COLOR</h2>
            <ColorPickerSelected colors={allColors} selectedColor={selectedColor} setSelectedColor={setSelectedColor} isColorAvailable={isColorAvailable}/>
        <div className='mt-3'>
            <h2 className='text-lg font-semibold'>SIZE</h2>
        <ul className="flex flex-wrap gap-4 py-2">
            {allSizes &&
                allSizes.map((size) => { 
                    const isAvailable = isSizeAvailable(size);
                    return (
                        <li key={size} className="flex-none"> 
                            <label 
                                htmlFor={`size-${size}`}
                                className={`block relative w-[50px] h-[50px] ${!isAvailable ? 'opacity-40' : ''}`}
                            >
                                <input 
                                    id={`size-${size}`}
                                    type="checkbox" 
                                    checked={selectedSize === size} 
                                    name="size" 
                                    className="sr-only peer" 
                                    onChange={() => handleSizeChange(size)}
                                />
                                <span 
                                    className={`inline-flex justify-center items-center w-full h-full rounded-lg duration-150 font-semibold ${
                                        !isAvailable 
                                            ? 'bg-gray-200 text-gray-400 cursor-pointer line-through' // Luôn là cursor-pointer
                                            : selectedSize === size 
                                            ? 'bg-darkgrey text-white cursor-pointer' 
                                            : 'bg-white text-darkgrey cursor-pointer'
                                    }`} 
                                >
                                    {size}
                                </span>
                            </label>
                        </li>
                    )
                })
            }
        </ul>
        </div>
        <div className='flex gap-2 py-6 flex-col sm:flex-nowrap'>
            <div className='flex gap-2 flex-1 flex-wrap sm:flex-nowrap'>
                <button type='button' className='bg-darkgrey text-white py-4 rounded-xl w-full' onClick={() => handleAddCart()}>ADD TO CART</button>
                <button type='button' className='bg-darkgrey text-white py-4 px-4 rounded-xl' onClick={() => handleWhishlist()}>
                    {isInWishlist ? (
                        <HeartBold width={24} height={24} className='text-white' />
                    ) : (
                        <HeartRegular width={24} height={24} className='text-white'/>
                    )
                    }
                </button>
            </div>
            <button type='button' className='bg-blue text-white py-3 rounded-xl w-full' onClick={() => handleBuy()}>BUY NOW</button>
        </div>
        <div>
            <h2 className='text-lg font-semibold py-2'>ABOUT THIS PRODUCT</h2>
            <p className='text-base text-darkgrey leading-6'>
                {product?.description}
            </p>
            {/* <BlocksRenderer content={product.attributes?.description} /> */}
        </div>
        </div>
    </div>
  )
}

export default ProductDetails