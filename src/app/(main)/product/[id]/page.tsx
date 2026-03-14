import Product from "@/sections/products/view/products-view";
import React from 'react';


export const metadata = {
    title: 'Sản phẩm | Baso Spark',
}

export default function ProductsPage(
  { params }: { params: { id: string } }
){
  const { id } = params;
  return <Product id={id} />;
}