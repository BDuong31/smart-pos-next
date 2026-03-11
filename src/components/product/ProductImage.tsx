import React from 'react';
import Image from 'next/image';
import { IImage } from '@/interfaces/image';
import ChevronBack from '../icons/chevron-back';
import { ChevronRight, X } from 'lucide-react';
import { IoExit } from 'react-icons/io5';


type ProductImageProps = {
    images: IImage[];
}

const ProductImage = ({ images }: ProductImageProps) => {
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [activeIndex, setActiveIndex] = React.useState<number>(0);

    const cornerClasses = [
        'rounded-tl-[3rem]',
        'rounded-tr-[3rem]',
        'rounded-bl-[3rem]',
        'rounded-br-[3rem]',
    ];

    const handleImageClick = (index: number) => {
        setActiveIndex(index);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleNavigation = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setActiveIndex((prev) => (prev + 1) % images.length);
        } else {
            setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const handleThumbnailClick = (index: number) => {
        setActiveIndex(index);
    }

    const currentImage = images[activeIndex];

    return (
        <div className='w-[100%]'>
            <div className="grid grid-cols-2 gap-4">
                {images.slice(0, 4).map((img, idx) => (
                    <div
                        key={idx}
                        className={`relative w-full aspect-square overflow-hidden ${cornerClasses[idx]} bg-gray-100`}
                        onClick={() => handleImageClick(idx)}
                    >
                        <Image
                            src={img?.url}
                            alt={`Product image ${idx + 1}`}
                            fill
                            priority={idx === 0}
                            className="object-cover width-[429px] height-[510px]"
                        />
                    </div>
                ))}
            </div>
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-darkgrey bg-opacity-80"
                    onClick={handleCloseModal}
                >
                    <div
                        className="relative flex flex-col items-center justify-center h-full w-full max-h-screen p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 z-[60] text-white text-5xl font-light"
                            onClick={handleCloseModal}
                        >
                            <X />
                        </button>

                        <button
                            className="absolute left-0 z-[60] p-2 text-white bg-white bg-opacity-20 rounded-full top-1/2 -translate-y-1/2 ml-5 hover:bg-opacity-40"
                            onClick={() => handleNavigation('prev')}
                        >
                            <ChevronBack />
                        </button>

                        <button
                            className="absolute right-0 z-[60] p-2 text-white bg-white bg-opacity-20 rounded-full top-1/2 -translate-y-1/2 mr-5 hover:bg-opacity-40"
                            onClick={() => handleNavigation('next')}
                        >
                            <ChevronRight />
                        </button>

                        <div className="relative flex-1 w-full max-h-[80vh] flex items-center justify-center mb-4">
                            {currentImage && (
                                <Image
                                    src={currentImage.url}
                                    alt="Enlarged product image"
                                    width={1200}
                                    height={1200}
                                    style={{ 
                                        width: 'auto', 
                                        height: 'auto', 
                                        maxWidth: '100%', 
                                        maxHeight: '80vh' 
                                    }}
                                    className="object-contain rounded-xl"
                                />
                            )}
                        </div>

                        <div className="flex space-x-2 justify-center p-4 overflow-x-auto max-w-full">
                            {images.map((img, idx) => (
                                <div
                                    key={img.id || idx}
                                    className={`relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-md overflow-hidden bg-gray-700
                                                ${idx === activeIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
                                    onClick={() => handleThumbnailClick(idx)}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                    </div> 
                </div> 
            )}
        </div>
    )
}

export default ProductImage