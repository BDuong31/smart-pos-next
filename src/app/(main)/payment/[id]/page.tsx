import PaymentView from '@/sections/payment/view/payment-view';
import React from 'react';


export const metadata = {
    title: 'Thanh toán | Baso Spark',
}

type Props = {
  params: Promise<{ id: string }>;
}
export default async function PaymentPage(
    { params }: { params: Promise<{ id: string }> }
){
  const { id } = await params;
  return <PaymentView id={id} />;
}