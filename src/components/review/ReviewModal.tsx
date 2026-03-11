// src/components/ReviewModal.tsx

"use client";
import React from 'react';
import Image from 'next/image';
import ReviewForm from './ReviewForm'; // Import ReviewForm đã cập nhật

interface ReviewModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  productImage: string;
  productName: string; 
  onReviewSubmit: (reviewData: { rating: number, description: string, files: File[] }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productImage,
  productName,
  onReviewSubmit,
}) => {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white rounded-[20px] p-6 w-full max-w-2xl max-h-[95vh] mx-4 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-[18px] font-bold text-center mb-2">Product reviews</h2>

        <div className="flex flex-col items-center mb-2">
          <div className="w-24 h-24 relative rounded-lg overflow-hidden mb-2">
            <Image
              src={productImage}
              alt={productName}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p className="text-lg font-semibold text-gray-800">{productName}</p>
        </div>

        <ReviewForm onSubmit={onReviewSubmit} />
      </div>
    </div>
  );
};

export default ReviewModal;