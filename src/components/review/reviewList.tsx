"use client"
import React, { useEffect, useState } from 'react'
import ReviewItem from './reviewItem'
import { mockReviews } from '@/sections/home/data/preview'
import { getAllRatings, getRatingsByProductId } from '@/apis/rating'
import { IRating, IRatingWithUser } from '@/interfaces/rating'
import { IUserProfile } from '@/interfaces/user'
import { useUserProfile } from '@/context/user-context'
import { IImage } from '@/interfaces/image'
type reviewProps = {
    productId?: string
}
const ReviewSection = ({ productId }: reviewProps) => {
    const { userProfile } = useUserProfile();
    const [Reviews, setReviews] = useState<IRatingWithUser[]>([])
    const [users, setUsers] = useState<Record<string, IUserProfile>>({})
    const [images, setImages] = useState<Record<string, IImage[]>>({})
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [loading, setLoading] = useState(true);
    const fetchRatingsByProduct = async (productId: string) => {
        setLoading(true);
        try {
            const response = await getRatingsByProductId(productId);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchRatings = async () => {
        setLoading(true);
        try {
            const response = await getAllRatings();
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoading(false);
        }
    }
    const getReviews_ = () => {
        const calculateItemsPerPage = () => {
            if (typeof window === 'undefined') {
                return 2;
            } else if (window.innerWidth >= 1280) {
                return 3;
            } else if (window.innerWidth >= 768) {
                return 3;
            } else {
                return 2;
            }
        };
        const newItemsPerPage = calculateItemsPerPage();
        setItemsPerPage(newItemsPerPage);
        if (productId) {
            fetchRatingsByProduct(productId);
            setReviews(Reviews.slice(0, newItemsPerPage));
            return;
        }
        fetchRatings();
        setReviews(Reviews.slice(0, newItemsPerPage));
    }
    useEffect(() => {
        getReviews_()
        const handleResize = () => {
            getReviews_();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [itemsPerPage])


  return (
    <div className='px-6 md:px-0'>
    <div className={`pt-12 grid sm:grid-cols-2 grid-cols-1 xl:grid-cols-3 3xl:grid-cols-4 gap-9 `}>
        {
            Reviews.map((review : any, index) => (
                <ReviewItem review={review} key={review.id} className={index === 2 ? 'hidden lg:block' : index === 1 ? 'hidden sm:block' : undefined}/>
            ))
        }
    </div>
    </div>
  )
}

export default ReviewSection