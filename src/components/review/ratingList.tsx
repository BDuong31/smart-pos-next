import Rating from '@/sections/rating/view/rating-view';
import React from 'react';
import RatingItem from './ratingItem';

const RatingList = ({ ratings }:any) =>{
    return (
        <div className='flex flex-col gap-5 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%]'>
            {ratings.map((rating:any) => (
                <RatingItem rating={rating} />
            ))}
        </div>
    )
}


export default RatingList;
