import React from 'react'
import Image from 'next/image'
import {Rating} from '@mui/material'
import { IRating, IRatingWithUser } from '@/interfaces/rating';
import { IUserProfile } from '@/interfaces/user';
import { IImage } from '@/interfaces/image';

type ReviewItemProps = {
    review: IRatingWithUser;
    className?: string;
}

const ReviewTotal: Record<number, string> = {
    1: 'Product is terrible',
    2: 'Product is bad',
    3: 'Product is average',
    4: 'Product is good',
    5: 'Product is excellent',
}
const ReviewItem = ({review, className} : ReviewItemProps) => {
    const [user, setUser] = React.useState<IUserProfile | null>(null);
    const imageDefault = review?.images?.find(img => img.isMain);
    const title = ReviewTotal[review.rating];
    return (
        <div className={`${className}`}>
            <div className='flex justify-between gap-9 py-5 bg-white px-5 rounded-t-3xl'>
                <div>
                    <h2 className='text-[20px] font-semibold'>{title}</h2>
                    <p className='text-[14px] line-clamp-1'>{review.comment}</p>
                    <div className='flex items-center gap-2'>
                        <Rating value={review.rating}/>
                        <p className=''>{review.rating}.0</p>
                    </div>
                </div>
                <Image src={review.user?.avatar ?? '/avatar-default.jpg'} width={50} height={50} alt='User Photo' objectFit='cover' className='object-cover aspect-square rounded-full max-h-[50px]'/>
            </div>
            <Image src={imageDefault?.url ?? '/default-review.jpg'} width={500} height={500} alt='Review Photo' objectFit='cover' className='object-cover w-full h-auto aspect-square rounded-b-3xl'/>
        </div>
    )
}

export default ReviewItem