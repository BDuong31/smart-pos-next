import React from 'react';
import Image from 'next/image';
import { product } from '@/sections/purchase/data/purchase';
import { IProductVariant } from '@/interfaces/variant';
import { IConditionalImage, IImage } from '@/interfaces/image';
import { getImages } from '@/apis/image';
import { IOrderItem } from '@/interfaces/order';
import { useRouter } from 'next/navigation';
type OrderItemProps = {
  item: IOrderItem; 
  variant: IProductVariant; 
};
export default function OrderItem({ item, variant }: OrderItemProps) {
  const router = useRouter();
  const [images, setImages] = React.useState<IImage[]>([]);
  const [imageDefault, setImageDefault] = React.useState<IImage | null>(null);

  const fetchImage = async (productId: string) => {
    try {
      const dto: IConditionalImage = {
        refId: productId,
        type: 'product',
      }
      const response = await getImages(dto);
      setImages(response.data);
      const defaultImage = response.data.find((img) => img.isMain === true);
      if (defaultImage) {
        setImageDefault(defaultImage);
      } else if (response.data.length > 0) {
        setImageDefault(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  React.useEffect(() => {
    if (item && variant) {
      fetchImage(variant.productId);
    }
  }, [item, variant]);
  return (
    <div onClick={() => router.push(`/product/${variant?.productId}`)} className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0 sm:space-x-4 py-4">
      <div className="flex space-x-4">
        <div className="avatar">
          <div className="w-24 h-24 rounded bg-gray-200">
            <Image src={imageDefault ? imageDefault.url : '/logo.png'} alt={variant?.product?.productName || 'defaultImage'} width={96} height={96} />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg text-darkgrey">{variant?.product?.productName}</h3>
          <p className="text-sm text-graymain">{variant?.product?.description}</p>
          <div className='flex items-center gap-4 my-3'>
            <p className='text-sm text-graymain'>Color</p>
              <div 
                className='w-[10px] h-[10px] rounded-sm' 
                style={{ 
                  backgroundColor: `${variant?.color}`,
                  boxShadow: `rgb(255, 255, 255) 0px 0px 0px 2px, #000000 0px 0px 0px 5px`
                }}
              ></div>
          </div>
          <div className="flex space-x-4 text-sm mt-2">
            <span>Size: {variant?.size}</span>
            <span>Quantity: {item?.quantity}</span>
          </div>
        </div>
      </div>
      
      <div className="text-lg text-blue font-semibold text-right sm:text-left">
        ${variant?.product?.price.toFixed(2)}
      </div>
    </div>
  );
}