import OrderView from '@/sections/order/view/order-view';
import React from 'react';


export const metadata = {
    title: 'Đơn hàng | Baso Corner',
}

type Props = {
  params: Promise<{ id: string }>;
}

export default async function OrderPage(
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <OrderView id={id} />;
}