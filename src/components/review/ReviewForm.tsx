"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useToast } from '@/context/toast-context';
import { useDropzone } from 'react-dropzone';
import ImageRegular from '../icons/image';
import ErrorCircleRegular from '../icons/error-circle';

interface ReviewFormProps {
  initialRating?: number;
  initialDescription?: string;
  initialTitle?: string;
  onSubmit: (reviewData: { rating: number, description: string, files: File[] }) => void;
  productId?: string;
}

interface FileWithPreview extends File {
  preview: string;
}

const RatingString = [
  "Rất tệ",
  "Tệ",
  "Tạm ổn",
  "Tốt",
  "Rất tốt"
];

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  initialRating = 0, 
  initialDescription = '', 
  initialTitle = '', 
  onSubmit 
}) => {
  const { showToast } = useToast();
  const MAX_IMAGES = 4;
  
  const [title, setTitle] = useState(initialTitle);
  const [rating, setRating] = useState(initialRating);
  const [description, setDescription] = useState(initialDescription);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const totalStars = 5;

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > MAX_IMAGES) {
      showToast(`Giới hạn tối đa là ${MAX_IMAGES} ảnh.`, 'warning');
      return;
    }

    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );

    setFiles(prev => [...prev, ...newFiles]);
  }, [files, showToast]);

  const isGalleryFull = files.length >= MAX_IMAGES;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    disabled: isGalleryFull
  });

  const handleRemoveImage = (e: React.MouseEvent, previewToRemove: string) => {
    e.stopPropagation();
    setFiles(prev => {
      const newFiles = prev.filter(file => file.preview !== previewToRemove);
      URL.revokeObjectURL(previewToRemove);
      return newFiles;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || rating === 0) {
      showToast("Vui lòng nhập đánh giá và chọn số sao.", "warning");
      return;
    }

    const cleanFiles = files.map(file => {
        const { preview, ...rest } = file; 
        return file; 
    });

    onSubmit({ rating, description, files: cleanFiles });
    
    setTitle('');
    setRating(0);
    setDescription('');
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center gap-2 mb-4">
        {[...Array(totalStars)].map((_, index) => {
          const ratingValue = index + 1;
          const ratingLabel = RatingString[ratingValue - 1];
          const isActive = ratingValue <= rating;
          
          return (
            <div className="flex flex-col items-center w-16" key={index}>
              <FaStar
                size={40}
                className={`cursor-pointer transition-colors duration-200 mb-1
                  ${isActive ? 'text-yellow' : 'text-gray'}`}
                onClick={() => handleRatingClick(ratingValue)}
              />
              <span className={`text-xs font-medium text-center ${isActive ? 'text-yellow-600' : 'text-gray-400'}`}>
                {ratingLabel}
              </span>
            </div>
          );
        })}
      </div>

      <textarea
        placeholder="Mời bạn chia sẻ thêm cảm nhận..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full p-3 mb-4 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-graymain resize-none"
      />

      <div className="flex flex-col mb-6">
        <span className="font-semibold mb-2">Hình ảnh thực tế (Tối đa {MAX_IMAGES} ảnh)</span>
        
        <div 
          {...getRootProps()}
          className={`flex flex-col items-center justify-center mb-4 border-2 border-dashed rounded-lg p-4 text-center transition-colors h-32
            ${isDragActive ? 'border-blue bg-blue' : 'border-graymain hover:border-darkgrey'}
            ${isGalleryFull ? 'cursor-not-allowed opacity-50 bg-gray' : 'cursor-pointer'}
          `}
        >
          <input {...getInputProps()} />
          <div className="mb-2">
             <ImageRegular width={48} height={48} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            {isGalleryFull 
              ? `Đã đạt giới hạn (${MAX_IMAGES} ảnh)` 
              : isDragActive 
                ? 'Thả ảnh vào đây' 
                : 'Kéo thả hoặc chọn ảnh'}
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto py-2">
            {files.map((file, index) => (
              <div key={file.preview} className="w-20 h-20 rounded-lg flex-shrink-0 relative group">
                <img 
                  src={file.preview} 
                  alt={`Review ${index + 1}`} 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => handleRemoveImage(e, file.preview)}
                  className="absolute -top-2 -right-2 bg-white rounded-full hover:bg-gray transition-transform hover:scale-110"
                >
                  <ErrorCircleRegular width={20} height={20} className='text-[#FF0000]'/>
                </button>
              </div>
            ))}

            {[...Array(Math.max(0, MAX_IMAGES - files.length))].map((_, index) => (
              <div key={`placeholder-${index}`} className="w-20 h-20 rounded-lg flex-shrink-0" />
            ))}
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-3 bg-darkgrey text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
      >
        GỬI ĐÁNH GIÁ
      </button>
    </form>
  );
};

export default ReviewForm;