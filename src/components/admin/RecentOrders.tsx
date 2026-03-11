import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

const orders = [
  { id: 1, product: 'Adidas Ultra boost', orderId: '#25426', date: 'Jan 8th,2022', customer: { name: 'Leo Gouse', img: '/baso.jpg' }, status: 'Delivered', amount: 200.00 },
  { id: 2, product: 'Adidas Ultra boost', orderId: '#25425', date: 'Jan 7th,2022', customer: { name: 'Jaxson Korsgaard', img: '/baso.jpg' }, status: 'Canceled', amount: 200.00 },
  { id: 3, product: 'Adidas Ultra boost', orderId: '#25424', date: 'Jan 6th,2022', customer: { name: 'Talan Botosh', img: '/baso.jpg' }, status: 'Delivered', amount: 200.00 },
];

function StatusBadge({ status }: { status: string }) {
  let colorClass = '';
  switch (status) {
    case 'Delivered':
      colorClass = 'badge-success';
      break;
    case 'Canceled':
      colorClass = 'badge-error';
      break;
    default:
      colorClass = 'badge-warning';
  }
  return <span className={`badge badge-sm ${colorClass} text-white`}>{status}</span>;
}

export default function RecentOrders() {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Recent Orders</h2>
          <button className="btn btn-ghost btn-circle btn-sm">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="table">
            {/* Head */}
            <thead className="text-base-content/70">
              <tr>
                <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                <th>Product</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Rows */}
              {orders.map((order) => (
                <tr key={order.id} className="hover">
                  <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                  <td>{order.product}</td>
                  <td>{order.orderId}</td>
                  <td>{order.date}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="mask mask-squircle w-8 h-8">
                          <Image src={order.customer.img} alt={order.customer.name} width={32} height={32} />
                        </div>
                      </div>
                      {order.customer.name}
                    </div>
                  </td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>${order.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// Hãy đảm bảo bạn có ảnh avatar trong /public/images/