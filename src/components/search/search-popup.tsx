"use client"
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import SearchRegular, { SearchBold } from '../icons/search';
import mockProduct from '@/sections/home/data/product';
import { useRouter } from 'next/dist/client/components/navigation';
import { IProductDetails } from '@/interfaces/product';
import { IConditionalImage, IImage } from '@/interfaces/image';
import { getProducts } from '@/apis/product';
import { getImages } from '@/apis/image';
import { set } from 'zod';
import { SplashScreen } from '../loading';

const SearchResultItem = ({ item, image, closePopup, setSearchQuery }: { item: IProductDetails, image: IImage[], closePopup: () => void, setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) => {
    const router = useRouter();
    return (
        <div 
            onClick={() => {
                closePopup();
                router.push(`/product/${item.id}`);
                setSearchQuery('');
            }}
            className="flex items-center gap-4 p-2"
        >
            <img 
                src={image[0]?.url} 
                alt={item.productName} 
                className="h-24 w-24 rounded-lg object-cover" 
            />
            <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                <p className="text-blue-600 font-medium">${item.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default function SearchPopup() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = React.useState<IProductDetails[]>([]);
    const [images, setImages] = React.useState<Record<string, IImage[]>>({});

    const openPopup = () => setIsOpen(true);
    const closePopup = () => {setIsOpen(false); setSearchQuery('');};

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetcheImagesForProducts = async (productIds: string[]) => {
        setLoading(true);
        try {
            const imageMap: Record<string, IImage[]> = {};
            for (const productId of productIds) {
                try {
                    const dto: IConditionalImage = {
                        refId: productId,
                        type: 'product',
                        isMain: true,   
                    }
                    const response = await getImages(dto); 
                    setImages(prevImages => ({ ...prevImages, [productId]: response.data }));
                } catch (error) {
                    console.error(`Error fetching images for product ${productId}:`, error);
                    imageMap[productId] = [];
                }
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    }
    
    React.useEffect(() => {
        fetchProducts();
    }, []);

    React.useEffect(() => {
        const productIds = products.map(product => product.id);
        fetcheImagesForProducts(productIds);
    }, [products]);

    const filteredResults = searchQuery ? products.filter(item => 
        item?.productName.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const normalizeSearchQuery = (query: string) => {
        return query.trim().toLowerCase().replace(/\s+/g, '-');
    }

    const handleSearchSubmit = () => {
        if (searchQuery.trim() === '') return;

        closePopup();

        router.push(`/search/${normalizeSearchQuery(searchQuery)}`);
        setSearchQuery('');
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
        <div>
            <button
                onClick={openPopup}
            >
                <SearchRegular/>
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-start justify-center bg-gray/90"
                    onClick={closePopup}
                >
                    <button
                        onClick={closePopup}
                        className="absolute -top-4 -right-4 md:top-4 md:right-4 rounded-full bg-white p-2 shadow-lg hover:bg-gray-200"
                    >
                        <X className="h-5 w-5 text-gray-700" />
                    </button>

                    <div 
                        className="w-full max-w-2xl rounded-lg p-4"
                        onClick={(e) => e.stopPropagation()}
                    >   
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Placeholder"
                                className="w-full rounded-lg bg-transparent border border-graymain py-3 pl-4 pr-10 text-lg"
                            />
                            <button
                                type="button"
                                onClick={handleSearchSubmit}
                            >
                                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            </button>
                        </div>

                        <div className="max-h-[88vh] overflow-y-auto rounded-xl bg-white p-4">
                            <div className="flex flex-col gap-4">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map(item => (
                                        <SearchResultItem key={item.id} item={item} image={images[item.id]} closePopup={closePopup} setSearchQuery={setSearchQuery} />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No results found.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}