// src/components/admin/ProductCard.tsx

import Image from 'next/image';
import { MoreHorizontal, ArrowUp } from 'lucide-react';
import React from 'react';
import { IVariant } from '@/interfaces/variant';
type products = {
  id: string;
  name: string;
  category: string;
  price: number;
  sales: number;
  variant: IVariant[];
  img: string;
}

export default function ProductCard({ product }: { product: products }) {
  return (
    <div className="card bg-base-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="card-body">
        
        <div className="flex items-start gap-4">
          <div className="avatar">
            <div className="w-24 rounded bg-base-200 p-2">
              <Image src={product.img} alt={product.name} width={96} height={96} className='rounded-sm' />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-base-content/70">{product.category}</p>
            <p className="text-lg font-semibold mt-1">${product.price.toFixed(2)}</p>
          </div>
          <button className="btn btn-ghost btn-circle btn-sm -mt-2 -mr-2">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Biến thể</h4>

          <div className="flex flex-col gap-2">
            {product.variant.map((variant, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-xl bg-base-200 hover:bg-base-300 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{variant.name}</span>
                </div>

                <div>
                  <span
                    className={`badge ${
                      variant.priceDiff >= 0 ? "badge-success" : "badge-error"
                    } badge-outline`}
                  >
                    {variant.priceDiff >= 0
                      ? `+${variant.priceDiff}`
                      : variant.priceDiff}
                    đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Progress Bars */}
        {/* <div className="mt-4 space-y-3">
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Sales</span>
              <span className="flex items-center gap-1 text-success">
                <ArrowUp size={14} /> {product.sales}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Remaining Products</span>
              <div className='flex flex-row items-center w-1/3 gap-2'>
                <progress
                  className="progress progress-warning flex-1"
                  value={remainingPercent}
                  max="100"
                ></progress>
                <span className="flex items-center gap-1 text-warning">
                  {product.remaining}
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}