'use client'
import React from 'react';
import ProductItem from './productItem';
import { IProductDetails } from '@/interfaces/product';
import { IImage } from '@/interfaces/image';
import { IProductVariant } from '@/interfaces/variant';

type ProductListProps = {
    products: IProductDetails[];
    variants: Record<string, IProductVariant[] | undefined>;
    length?: number;
}

const ProductList = ({ products, variants, length = 3 }: ProductListProps) => {
    return (
        <div className={`grid xl:grid-cols-${length} lg:grid-cols-${length} grid-cols-${length} gap-8`}>
            {products.map((product:IProductDetails) => (
                <ProductItem key={product.id} product={product} variants={variants[product.id] ?? undefined}  images={product.images} />
            ))}
        </div>
    )
}

const ProductListLaster = ({ products, variants, length }: ProductListProps) =>{
    return (
        <div className={`grid xl:grid-cols-${length} lg:grid-cols-${length} grid-cols-${length} gap-8`}>
            {products.map((product: IProductDetails) => (
                console.log('Rendering ProductItem for product:', product.id),
                console.log('With variants:', variants[product.id]),
                <ProductItem key={product.id} product={product} variants={variants[product.id] ?? undefined} images={product.images} />
            ))}
        </div>
    )
}

export default ProductList;

export {ProductListLaster};
