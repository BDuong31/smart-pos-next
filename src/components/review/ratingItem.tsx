import Link from "next/link";
import Image from "next/image";
import React from "react";
import Rating from "@mui/material/Rating";

const RatingItem = ({ rating }: any) => {
    return (
        <div className='flex-col flex gap-2 rounded-t-3xl'>
            <div className="flex w-fit gap-14 justify-between items-start">
                <div className="flex gap-[15px] items-start">
                    <Image src={rating.user.avatar} width={50} height={50} alt='User Photo' objectFit='cover' className='object-cover aspect-square rounded-full max-h-[50px]'/>
                    <div className="flex-col flex gap-1">
                        <h2 className='text-[20px] font-semibold'>{rating.user.fullName}</h2>
                        <Rating value={rating.rating} readOnly />
                    </div>
                </div>
                <div className="flex flex-col p-2">
                    <p className="text-sm text-graymain">{new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <p className='text-[14px] line-clamp-1'>{rating.comment}</p>
            <div className="flex">
                {rating.images && rating.images.map((image: any, index: number) => (
                    <Image key={index} src={image.url} width={100} height={100} alt={`Rating Image ${index + 1}`} objectFit='cover' className='object-cover rounded-lg max-h-[100px]'/>
                ))}
            </div>
        </div>
    )
}

export default RatingItem;