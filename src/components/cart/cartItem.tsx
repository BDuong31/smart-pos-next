import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import SelectMenu from './SelectMenu'
import QtyMenu from './QtyMenu'
import { IoTrashBinOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { ICartItem } from '@/interfaces/cart';
import { IProductVariant } from '@/interfaces/variant';
import { IConditionalImage, IImage } from '@/interfaces/image';
import { getImages } from '@/apis/image';
import { useUserProfile } from '@/context/user-context';
import { createWishlist, deleteWishlist, getWishlistByCond } from '@/apis/wishlist';
import { useToast } from '@/context/toast-context';
import HeartRegular, { HeartBold } from '../icons/heart';
import { deleteCartItem, updateCartItem } from '@/apis/cart';
import { useCart } from '@/context/cart-context';
import { SplashScreen } from '../loading';

type CartItemProps = {
    type: 'cart' | 'checkout';
    item: ICartItem;
    variant: IProductVariant ;
    variantList?: IProductVariant[] | undefined;
}

const CartItem = ({type , item, variant, variantList} : CartItemProps) => {
    const router = useRouter()
    const { userProfile } = useUserProfile();
    const { refeshCartItem, refeshCart } = useCart();
    const [images, setImages] = useState<IImage[]>([])
    const [imageDefault, setImageDefault] = useState<IImage>()
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [favoriteId, setFavoriteId] = useState<string>('');
    
    const [selectedSize, setSelectedSize] = useState<number | undefined>(variant?.size ?? undefined);
    const [selectedQty, setSelectedQty] = useState<number>(item?.quantity ?? 0);
    
    const [sizes, setSizes] = useState<number[]>([]);
    const [qtyOptions, setQtyOptions] = useState<number[]>([]); 
    const [sizeQtyMap, setSizeQtyMap] = useState<Map<number, number>>(new Map());
    
    const [isUpdating, setIsUpdating] = useState(false);

    const { showToast } = useToast();

    const fetcherImages = async (productId: string) => {
        try {
            const dto: IConditionalImage = {
                refId: productId,
                type: 'product',
            }
            const response = await getImages(dto);
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    const fetcherFavorite = async  () => {
        try {
            const response = await getWishlistByCond(userProfile?.id || '', variant?.productId || '');
            if (response.data.length > 0) {
                setIsFavorite(true);
                setFavoriteId(response.data[0].id);
            } else {
                setIsFavorite(false);
            }
        } catch (error) {
            console.error('Error fetching favorite status:', error);
        }
    }

    const fetcherDeleteCartItem = async () => {
        try {
            await deleteCartItem(item?.id || '');
            await refeshCartItem();
            await refeshCart();
            showToast('Item removed from cart', 'success');
        } catch (error) {
            showToast('Failed to remove item from cart', 'error');
            console.error('Error deleting cart item:', error);
        }
    }

    const handleFavoriteToggle = async () => {
        if (isFavorite) {
            try {
                await deleteWishlist(favoriteId || '');
                setIsFavorite(false);
                setFavoriteId('');
                showToast('Removed from favorites', 'success');
            } catch (error) {
                console.error('Error removing from favorites:', error);
                showToast('Failed to remove from favorites', 'error');
            }
        } else {
            try {
                const dto = {
                    userId: userProfile?.id || '',
                    productId: variant?.productId || '',
                };
                const response = await createWishlist(dto);
                setIsFavorite(true);
                setFavoriteId(response);
                showToast('Added to favorites', 'success');
            } catch (error) {
                console.error('Error adding to favorites:', error);
                showToast('Failed to add to favorites', 'error');
            }
        }
    }

    React.useEffect(() => {
        if (variant) {
            setSelectedSize(variant.size);
        }
        if (item) {
            setSelectedQty(item.quantity);
        }
    }, [variant, item]);

    React.useEffect(() => {
        fetcherFavorite();
        if (variant?.productId) {
            fetcherImages(variant.productId);
        }

        if (!variantList || !variant) return;

        const currentProductId = variant.productId;
        const fixedColor = variant.color;
        const variantsOfThisProductAndColor = variantList.filter(
            v => v.productId === currentProductId && v.color === fixedColor
        );

        const sizeSet = new Set<number>();
        const newSizeQtyMap = new Map<number, number>();

        variantsOfThisProductAndColor.forEach((v) => {
            sizeSet.add(v.size);
            newSizeQtyMap.set(v.size, v.quantity);
        });

        setSizes(Array.from(sizeSet).sort((a, b) => a - b));
        setSizeQtyMap(newSizeQtyMap);

    }, [item, variantList, variant]);

    React.useEffect(() => {
        if (sizeQtyMap.size === 0) {
            return;
        }
        const maxStock = sizeQtyMap.get(selectedSize!) || 0;
        const options = Array.from({ length: maxStock }, (_, i) => i + 1);
        setQtyOptions(options);

        if (selectedQty > maxStock) {
            const newQty = maxStock > 0 ? 1 : 0;
            if (selectedQty !== newQty) {
                setSelectedQty(newQty);
                if (newQty > 0) {
                    handleUpdateCart(selectedSize!, newQty);
                }
            }
        }
    }, [sizeQtyMap, selectedSize, selectedQty]);

    const handleUpdateCart = async (newSize: number, newQty: number) => {
        if (isUpdating || !variantList || !variant) return;
        if (newSize === variant.size && newQty === item.quantity) return;

        setIsUpdating(true);

        const newVariant = variantList.find(
            v => v.color === variant.color && v.size === newSize && v.productId === variant.productId
        );

        if (!newVariant) {
            showToast('This combination is not available', 'error');
            setIsUpdating(false);
            return;
        }

        try {
            const dto = {
                variantId: newVariant.id,
                quantity: newQty,
            };

            await updateCartItem(item.id, dto);
            showToast('Cart updated', 'success');
            await refeshCartItem(); 
            await refeshCart();
        } catch (error) {
            showToast('Failed to update cart', 'error');
            console.error('Error updating cart item:', error);
            setSelectedSize(variant.size);
            setSelectedQty(item.quantity);
        } finally {
            setIsUpdating(false);
        }
    };

    const onSizeChange = (newSize: number) => {
        const newMaxStock = sizeQtyMap.get(newSize) || 0;
        let newQty: number;

        if (newSize === variant.size) {
            newQty = Math.min(item.quantity, newMaxStock);
        } 
        else {
            newQty = (newMaxStock > 0) ? 1 : 0;
        }
        
        setSelectedSize(newSize);
        setSelectedQty(newQty);
        handleUpdateCart(newSize, newQty);
    };

    const onQtyChange = (newQty: number) => {
        setSelectedQty(newQty);
        handleUpdateCart(selectedSize!, newQty);
    };

    React.useEffect(() => {
        if (images.length > 0) {
            const mainImage = images.find(img => img.isMain);
            setImageDefault(mainImage || images[0]);
        }
    }, [images]);

    const currentMaxStock = sizeQtyMap.get(selectedSize!) || 0;
    return (
        <div className='grid grid-cols-3 gap-4 bg-none'>
            {!imageDefault ? (
                <div className='w-full max-h-[200px] object-cover rounded-2xl'>
                <SplashScreen className='h-[200px]' />
                </div>
            ) : (
                <Image src={imageDefault?.url ?? '/logo.png'} width={500} height={500} alt={variant?.id || ''} className='w-full max-h-[200px] object-cover rounded-2xl' />
            )}
            <div className='col-span-2'>
                <div className='flex flex-col justify-between h-full'>
                    {(type === 'cart' && variant && variantList && currentMaxStock) || (type==='checkout' && variant) ? (
                        <>
                            <div>
                                {type === 'cart' ? 
                                    (
                                        <div className='flex justify-between'>
                                            <h1 className='text-lg font-semibold text-darkgrey max-w-[75%]'>{variant?.product?.productName}</h1>
                                            <h1 className='text-lg font-semibold text-blue'>${variant?.product?.price}</h1>
                                        </div>
                                    ) : (
                                        <div className='flex justify-between'>
                                            <h1 className='text-lg font-semibold text-darkgrey max-w-[75%]'>{variant?.product?.productName}</h1>
                                            <h1 className='text-lg font-semibold text-blue'>${variant?.product?.price}</h1>
                                        </div>
                                    )
                                }

                                <h1 className='text-sm text-darkgrey'>{variant?.product?.description}</h1>
                                
                                <div className='flex items-center gap-4 my-3'>
                                    <p className='font-semibold'>Color</p>
                                    <div 
                                        className='w-[30px] h-[30px] rounded-lg' 
                                        style={{ 
                                            backgroundColor: `${variant?.color}`,
                                            boxShadow: `rgb(255, 255, 255) 0px 0px 0px 2px, #000000 0px 0px 0px 5px`
                                        }}
                                    ></div>
                                </div>

                                {type === 'cart' ?
                                    (
                                        <div className={`flex gap-5 self-end my-5 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <div className='flex items-center gap-2'>
                                                <p>Size</p>
                                                <SelectMenu 
                                                    options={sizes} 
                                                    value={selectedSize!} 
                                                    onChange={onSizeChange}
                                                    disabled={isUpdating}
                                                />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <p>Quantity</p>
                                                <QtyMenu 
                                                    maxStock={currentMaxStock} 
                                                    value={selectedQty} 
                                                    onChange={onQtyChange}
                                                    disabled={isUpdating || qtyOptions.length === 0}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='flex items-center gap-5 my-5'>
                                                <p>Size: {variant?.size}</p>
                                                <p>Quantity: {item?.quantity}</p>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                            
                            <div className='flex flex-row justify-between'>
                                {type === 'cart' ? 
                                    (
                                        <div className='flex flex-row gap-4 mb-1'>
                                            <button 
                                                className='hover:bg-darkgrey/20 rounded-3xl h-full p-2'
                                                onClick={fetcherDeleteCartItem}
                                            >
                                                <IoTrashBinOutline size={25} color='#232321' role='button' />
                                            </button>
                                            <button 
                                                className='hover:bg-darkgrey/20 rounded-3xl h-full p-2'
                                                onClick={handleFavoriteToggle}
                                            >
                                            { isFavorite ? (
                                                    <HeartBold width={24} height={24} className='fill-darkgrey' />
                                            ) : (
                                                    <HeartRegular width={24} height={24} className='stroke-darkgrey' />
                                            )}
                                            </button>
                                            
                                        </div>
                                    ) : (
                                        null
                                    )
                                }
                            </div>
                        </>
                    ) : (
                        <div className='flex justify-center items-center h-full'>
                            <SplashScreen className='h-[200px]' />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartItem