import React from 'react';
import Image from 'next/image';
import { IVariant } from '@/interfaces/variant';
import { IImage } from '@/interfaces/image';
import { getImages } from '@/apis/image';
import { IOrderItem, IOrderItemOption, IOrderItemOptionDetail } from '@/interfaces/order';
import { useRouter } from 'next/navigation';
import { IProductDetails } from '@/interfaces/product';
import { getProductById } from '@/apis/product';
import { IOptionItem } from '@/interfaces/option';
import { getOptionItems } from '@/apis/option';
import { getOrderItemOptions } from '@/apis/order';
type OrderItemProps = {
  item: IOrderItem; 
  variant: IVariant; 
};

export default function OrderItem({ item, variant }: OrderItemProps) {
  const router = useRouter();
  const [images, setImages] = React.useState<IImage[]>([]);
  const [product, setProduct] = React.useState<IProductDetails | null>(null);
  const [orderItemOptions, setOrderItemOptions] = React.useState<IOrderItemOptionDetail[]>([]);
  const [imageDefault, setImageDefault] = React.useState<IImage | null>(null);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await getProductById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchOptionItem = async (orderItemId: string) => {
    try {
      const response = await getOrderItemOptions({orderItemId}, 1, 100);
      setOrderItemOptions(response.data);
    } catch (error) {
      console.error('Error fetching option items:', error);
    }
  };

  const fetchImage = async (productId: string) => {
    try {
      const response = await getImages({refId: productId, type: 'product'}, 1, 4);
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
      fetchProduct(variant.productId);
      fetchOptionItem(item.id);
    }
  }, [item, variant]);
  return (
    <div onClick={() => router.push(`/product/${variant?.productId}`)} className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0 sm:space-x-4 py-4">
      <div className="flex space-x-4">
        <div className="avatar">
          <div className="w-24 h-24 rounded bg-gray-200">
            <Image src={imageDefault ? imageDefault.url : '/logo.png'} alt={product?.name || 'defaultImage'} width={96} height={96} className='object-conver' />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg text-darkgrey">{product?.name}</h3>
          <div className='flex items-center gap-4 my-3'>
            <p className='text-sm text-graymain'>{variant?.name}</p>
          </div>
          <div className="flex space-x-4 text-sm mt-2">
            <span>Số lượng: {item?.quantity}</span>
          </div>
          {orderItemOptions.map(option => (
            <p key={option.id} className='text-sm text-graymain'>{option.optionName}</p>
          ))}
        </div>
      </div>
      <div className="text-lg text-blue font-semibold text-right sm:text-left">
        ${item.price}
      </div>
    </div>
  );
}