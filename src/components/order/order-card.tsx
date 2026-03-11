import React from 'react';
import OrderItem from './order-item';
import { orders } from '@/sections/purchase/data/purchase';
import { IOrder, IOrderItem } from '@/interfaces/order';
import { IPayment } from '@/interfaces/payment';
import { IProductVariant } from '@/interfaces/variant';
import { useRouter } from 'next/navigation';

type Props = {
  order: IOrder | undefined;
  orderItems: IOrderItem[] | undefined;
  variantMap: Map<string, IProductVariant> | undefined;
  payment: IPayment | undefined;
};
export default function OrderCard({ order, orderItems, variantMap, payment }: Props) {
  const router = useRouter()

  const goToOrderDetail = () => {
    if (order?.status !== 'Canceled') {
      if (order?.id) router.push(`/user/purchase/order/${order.id}`);
    } else {
      if (order?.id) router.push(`/user/purchase/cancellation/${order.id}`);
    }
  };
  return (
    <div onClick={goToOrderDetail} className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition">
      <div className="pb-3 mb-3">
        <h2 className="font-bold uppercase">{order?.status}</h2>
        <p className="text-sm text-gray-500">Order id: {order?.id}</p>
      </div>

      <div>
        {orderItems && 
          orderItems.map(item => {
            const variantData = variantMap?.get(item.variantId);
            return (
              <div key={item.id} className="relative">
                <div onClick={(e) => e.stopPropagation()}>
                  <OrderItem item={item} variant={variantData} />
                </div>
                <div className="divider my-1"></div>
              </div>
            )
          })
        }
      </div>

      <div className="flex justify-end text-graymain items-center mt-4 pt-4">
        <span className="text-lg font-semibold">Total:</span>
        <span className="text-xl font-bold ml-2">
          ${payment?.amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}