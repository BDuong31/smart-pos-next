import Product from "@/sections/products/view/products-view";
import React from 'react';


export const metadata = {
    title: 'Sản phẩm | Baso Spark',
}

type Props = {
  params: Promise<{ id: string }>;
}
export default async function ProductsPage(
    { params }: { params: Promise<{ id: string }> }
){
  const { id } = await params;
  return <Product id={id} />;
}