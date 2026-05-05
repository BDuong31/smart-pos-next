"use client"
import React, { useEffect, useState, useMemo, use } from 'react'
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { space } from 'postcss/lib/list'
import ProductDetails from '@/components/product/productDetail';
import ProductImage from '@/components/product/ProductImage';
import ProductList, { ProductListLaster } from '@/components/product/productList';
import { FaS, FaStar } from 'react-icons/fa6';
import RatingBar from '@/components/rating/ratingBar';
// import ReviewSection from '@/components/review/reviewList';
import Link from 'next/dist/client/link';
import ReviewModal from '@/components/review/ReviewModal';
import SplashScreen from '@/components/loading/splash-sceen';
import { IUserProfile } from '@/interfaces/user';
// import { checkRatingByUserAndProduct, getRatingsById, getRatingsByProductId, updateRating} from '@/apis/rating';
import { check, set } from 'zod';
import { useToast } from '@/context/toast-context';
import { randomInt } from 'node:crypto';
import { IProductDetails } from '@/interfaces/product';
import { getProductById } from '@/apis/product';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ParamsProps {
    id: string
}

type RatingDistribution = {
    star: number;
    percentage: number;
}[];

const RatingDefault: RatingDistribution = [
    { star: 5, percentage: 0 },
    { star: 4, percentage: 0 },
    { star: 3, percentage: 0 },
    { star: 2, percentage: 0 },
    { star: 1, percentage: 0 },
];
export default function Product({id} : ParamsProps) {
    // const { showToast } = useToast()
    const user = useSelector((state: RootState) => state.user.user);
    const [users, setUsers] = useState<IUserProfile[] | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<IProductDetails[]>([]);
    const [checkedRating, setCheckedRating] = useState<boolean | null>(null);
    const [totalPages, setTotalPages] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [ProductInfos, setProductInfos] = useState<IProductDetails | null>(null);
    const [imagesDefault, setImagesDefault] = useState<any>(null);

    const getProduct = async () => {
        try {
            setLoading(true);
            const response = await getProductById(id);
            setProductInfos(response.data);
            const mainImage = response.data.images.find((img: any) => img.isMain);
            setImagesDefault(mainImage);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProduct();
    }, [id]);
    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth >= 1280) {
                    setItemsPerPage(4);
                } else if (window.innerWidth >= 1024) {
                    setItemsPerPage(2);
                } else {
                    setItemsPerPage(1);
                }
            }
        };

        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);

        return () => window.removeEventListener('resize', calculateItemsPerPage);
    }, []);

    const handleOpenModal = () => {
        if (checkedRating){
            setIsModalOpen(true);
        } else {
            // showToast('You can only rate products you’ve purchased, and it looks like you may have already rated this one.', 'warning');
        }
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    // const handleReviewSubmit = async (reviewData: { rating: number, description: string, files: File[] }) => {
    //     handleCloseModal();
    //     setLoading(true);
    //     let ratingId: string | undefined = undefined;

    //     try {
    //         const { rating: newRatingValue, description: newComment, files } = reviewData;

    //         const response = await getRatingsByProductId(id);
    //         const existingRatings = response.data;
            // const existingRating = existingRatings.find(rating => rating.userId === userProfile?.id);

            // if (existingRating) {
            //     ratingId = existingRating.id;
            // } else {
            //     showToast('No existing rating found to update', 'error');
            //     throw new Error('No existing rating found to update');
            // }
            // const ratingUpdate: IRatingUpdate = {
            //     rating: newRatingValue,
            //     comment: newComment,
            // }

    //         const ratingUpdateResponse = await updateRating(ratingId!, ratingUpdate); 
    //         if (!ratingUpdateResponse) { 
    //             showToast('Failed to update rating', 'error');
    //             throw new Error('Failed to update rating');
    //         }

    //         const imagePromises = files.map((file) => {
    //             const isCover = file === files[0];
    //             const imageDto: IImageCreate = {
    //                 isMain: isCover,
    //                 refId: ratingId || '',
    //                 type: 'rating'
    //             };
    //             return uploadImage(imageDto, file)
    //         });

    //         await Promise.all(imagePromises);

    //         if (ProductInfos) {
    //             await fetcherRating(ProductInfos.id);
    //         }

    //         showToast('Rating submitted successfully', 'success');
    //     } catch (error) {
    //         console.error(error);
    //         showToast('Failed to submit review', 'error');
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    const track = async (action: 'view' | 'click' | 'add_to_cart') => {
        // Chỉ chạy nếu đã đăng nhập
        if (!user?.id) return;
        if (!ProductInfos) return;

        fetch('/api/behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: user.id,
            productId: ProductInfos.id,
            action
        }),
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            track('view');
        }, 3000); 

        return () => clearTimeout(timer); 
    }, [user, ProductInfos])

    if (loading) {
        return <SplashScreen className='h-[80vh]' />;
    }
    return (
        <div className={'m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%]'}>
            <div className='grid md:grid-cols-2 grid-cols-1 py-10 gap-9'>
                {ProductInfos && (
                    <>
                        <ProductImage images={ProductInfos ? ProductInfos.images : []} />
                        <ProductDetails product={ProductInfos ? ProductInfos : null} />
                    </>
                )}
            </div>
            <div>
                <div className={`pb-5 flex m-auto`}>
                    <h1 className='2xl:text-[40px] xl:text-[30px] lg:text-[30px] md:text-[30px] sm:text-[30px] text-[24px] font-semibold flex-1 text-darkgrey'>Có thể bạn muốn thưởng thức</h1>
                    <div className='flex-1 self-end'>
                        <div className='flex justify-end gap-5'>
                            <button className='p-2 bg-darkgrey rounded-lg disabled:opacity-30 disabled:cursor-auto' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                <GrFormPrevious color='white' size={20}/>
                            </button>
                            <button className='p-2 bg-darkgrey rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-auto' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                <GrFormNext color='white' size={20}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <ProductListLaster products={paginatedProducts} variants={relatedProductVariants} length={4}  />  */}

            <div className='flex gap-2 py-4 justify-center'>
                {
                    Array.from({ length: totalPages }).map((_, i) => {
                        return <span key={i} className={`w-10 h-1 rounded-3xl ${currentPage === i + 1 ? 'bg-blue' : 'bg-darkgrey opacity-25'}`}></span>
                    })
                }
            </div>
            {/* <ReviewModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productImage={imagesDefault?.url || '/logo.png'}
                productName={ProductInfos?.productName || ''}
                onReviewSubmit={handleReviewSubmit}
            /> */}
        </div>
    )
}