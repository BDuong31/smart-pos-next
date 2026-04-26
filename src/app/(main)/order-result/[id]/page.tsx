import PaymentResultView from '@/sections/payment-result/view/payment-result-view';
import React from 'react';


export const metadata = {
    title: 'Kết quả thanh toán | Baso Corner',
}

type Props = {
  params: Promise<{ id: string }>;
}
export default async function PaymentPage(
    { params }: { params: Promise<{ id: string }> }
){
  const { id } = await params;
  return <PaymentResultView  id={id} />;
}