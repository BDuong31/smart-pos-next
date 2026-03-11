import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

const bestSellers = [
  { id: 1, name: 'Adidas Ultra boost', price: 126.50, sales: 999, img: '/shoes.jpg' },
  { id: 2, name: 'Adidas Ultra boost', price: 126.50, sales: 999, img: '/shoes.jpg' },
  { id: 3, name: 'Adidas Ultra boost', price: 126.50, sales: 999, img: '/shoes.jpg' },
];

export default function BestSellers() {
  return (
    <div className="card bg-base-100 shadow-sm h-full">

      <div className="card-body p-4 flex flex-col">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Best Sellers</h2>
          <button className="btn btn-ghost btn-circle btn-sm">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {bestSellers.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded">
                  <Image src={item.img} alt={item.name} width={64} height={64} />
                </div>
              </div>
              <div className="">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-graymain">${item.price}</p>
              </div>
              <div className="">
                <p className="text-sm text-graymain">${item.price}</p>
                <p className="flex font-semibold">{item.sales} sales</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions mt-auto pt-6">
          <button className="btn btn-neutral btn-block">REPORT</button>
        </div>
      </div>
    </div>
  );
}