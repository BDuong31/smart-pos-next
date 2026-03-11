// src/components/admin/ProductCard.tsx

import Image from 'next/image';
import { MoreHorizontal, ArrowUp } from 'lucide-react';

type products = {
  id: string;
  name: string;
  category: string;
  price: number;
  sales: number;
  remaining: number;
  img: string;
}

export default function ProductCard({ product }: { product: products }) {
  const salesPercent = (product.sales / 2000) * 100;
  const remainingPercent = (product.remaining / 2000) * 100;

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
          <h4 className="font-semibold">Summary</h4>
          <p className="text-sm text-base-content/70 mt-1">
            Long distance running requires a lot from athletes.
          </p>
        </div>

        {/* Stats & Progress Bars */}
        <div className="mt-4 space-y-3">
          
          {/* Sales */}
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
        </div>
      </div>
    </div>
  );
}