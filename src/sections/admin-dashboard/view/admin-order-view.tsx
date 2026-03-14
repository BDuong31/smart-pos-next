// src/app/(admin)/admin/orders/page.tsx

"use client"; // BẮT BUỘC: Vì chúng ta cần useState cho phân trang

import { getListOrders, getOrderItemsByOrderId, getOrders } from '@/apis/order';
import { getPaymentById, getPayments } from '@/apis/payment';
import { getListUserByIdx, getUserProfile } from '@/apis/user';
import { getVariantById } from '@/apis/variant';
import SplashScreen from '@/components/loading/splash-sceen';
import { IOrder, IOrderItem } from '@/interfaces/order';
import { IOrder } from '@/interfaces/order';
import { IPayment } from '@/interfaces/payment';
import { IUserProfile } from '@/interfaces/user';
import { IProductVariant } from '@/interfaces/variant';
import { Calendar, ChevronDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useMemo, useEffect, use } from 'react'; // Import hooks
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; // Import icons

// --- Component nhỏ cho Status Badge ---
function StatusBadge({ status }: { status: string }) {
  let colorClass = '';
  switch (status) {
    case 'Delivered':
      colorClass = 'badge-success'; // Xanh lá
      break;
    case 'Canceled':
      colorClass = 'badge-error'; // Đỏ
      break;
    default:
      colorClass = 'badge-warning'; // Vàng
  }
  // Thêm text-white để chữ luôn là màu trắng cho dễ đọc
  return <span className={`badge badge-sm ${colorClass} text-white`}>{status}</span>;
}

// --- LOGIC PHÂN TRANG (Lấy từ code của bạn) ---

const ITEMS_PER_PAGE = 5; // Hiển thị 7 đơn hàng mỗi trang

const getPaginationRange = (currentPage, totalPages) => {
    const range = [];
    const maxVisiblePages = 7;
    if (totalPages <= maxVisiblePages) { for (let i = 1; i <= totalPages; i++) { range.push(i); } return range; }
    range.push(1);
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    if (startPage > 2) range.push('...');
    else if (startPage === 2 && totalPages > 3) range.push(2);
    for (let i = startPage; i <= endPage; i++) { if (!range.includes(i)) range.push(i); }
    if (endPage < totalPages - 1) range.push('...');
    else if (endPage === totalPages - 1 && totalPages > 3) range.push(totalPages - 1);
    if (!range.includes(totalPages)) range.push(totalPages);
    let finalRange = [];
    for (let i = 0; i < range.length; i++) { if (range[i] === '...' && i > 0 && i < range.length - 1 && range[i-1] + 1 === range[i+1]) { continue; } finalRange.push(range[i]); }
    return finalRange;
};

const orderStart = ['all', 'delivered', 'canceled', 'pending'];

export default function OrdersView() {
  const router = useRouter()
  const [customerList, setCustomerList] = useState<IUserProfile[]>([]); 
  const [userIdx, setUserIdx] = useState<string>('');
  const [orderList, setOrderList] = useState<IOrder[]>([]);
  const [orderItemList, setOrderItemList] = useState<IOrderItem[]>([]);
  const [variantMap, setVariantMap] = useState<Record<string, IProductVariant>>({});
  const [paymentList, setPaymentList] = useState<IPayment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (idx: string[]) => {
    try {
      const response = await getListUserByIdx(idx);
      setCustomerList(response.data);
    } catch (error) {
      console.error('Failed to fetch user profiles:', error);
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await getListOrders();
      setOrderList(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }

  const fetchOrderItems = async (orderId: string) => {
    try {
      const response = await getOrderItemsByOrderId(orderId);
      setOrderItemList(response.data);
    } catch (error) {
      console.error('Failed to fetch order items:', error);
    }
  }

  const fetchVariant = async (id: string) => {
    try {
      const response = await getVariantById(id);
      setVariantMap(prev => ({ ...prev, [id]: response.data }));
    } catch (error) {
      console.error('Failed to fetch variant:', error);
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await getPayments();
      setPaymentList(response.data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  }

  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  React.useEffect(() => {
    fetchOrders();
    fetchPayments();
  }, []);

  React.useEffect(() => {
    orderList.forEach(order => {
      fetchOrderItems(order.id);
    });
  }, [orderList]);

  React.useEffect(() => {
    orderItemList.forEach(item => {
      if (!variantMap[item.variantId]) {
        fetchVariant(item.variantId);
      } 
    });
  }, [orderItemList, variantMap]);

  React.useEffect(() => {
    const idxSet = new Set<string>();
    orderList.forEach(order => {
      if (order.userId) {
        idxSet.add(order.userId);
      }
    });
    const idxArray = Array.from(idxSet);
    fetchUserProfile(idxArray);
  }, [orderList]);

  const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
  };


  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orderList;
    return orderList.filter(order => order.status.toLowerCase() === filterStatus);
  }, [filterStatus, orderList]);

  console.log('Filtered Orders:', filteredOrders);
  // --- Tính toán phân trang ---
  const totalPages = useMemo(() => {
    return Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  }, [filteredOrders]);

  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [currentPage, filteredOrders]);

  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);

  useEffect(() => {
    if (currentOrders.length > 0 && variantMap) setLoading(false);
  }, [currentOrders]);
  if (loading) {
      return <SplashScreen className='h-[100vh]'/>
  }

  return (
    <div className="flex flex-col gap-6 p-6  max-h-[90vh]">
      
      {/* 1. Header (Title, Date, Filter) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders List</h1>
          <p className="text-base-content/70 text-sm">Home &gt; Orders List</p>
        </div>
        
        <div className="flex flex-col sm:flex-col gap-4 w-full sm:w-auto">
          <button className="btn btn-outline border-none bg-transparent gap-2 w-full sm:w-auto">
            <Calendar size={16} />
            Feb 16,2022 - Feb 20,2022
          </button>
          {/* Nút Lọc Status */}
          {/* <select className="select select-bordered w-full sm:w-auto">
            <option disabled selected>Change Satus</option>
            <option>All</option>
            <option>Delivered</option>
            <option>Canceled</option>
            <option>Pending</option>
          </select> */}
          <div className="dropdown dropdown-end">
              <div 
                  tabIndex={0} 
                  role="button" 
                  className="btn bg-fawhite hover:text-white hover:bg-darkgrey flex items-center gap-2 group"
                  onClick={toggleDropdown} 
              >
                  {filterStatus === 'all' ? 'All Statuses' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                  <ChevronDown className={`transition-transform duration-300 group-hover:stroke-white ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {isDropdownOpen && (
                  <ul 
                  tabIndex={0} 
                  className="menu dropdown-content bg-base-100 rounded-box z-[1] w-full p-2 mt-2 shadow"
                  >
                  {orderStart.map((status) => (
                      <li key={status}>
                          <button
                              onClick={() => {
                                  setFilterStatus(status);
                                  setIsDropdownOpen(false);
                                  setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
                              }}
                          >
                              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                      </li>
                  ))}
                  </ul>
              )}
          </div>
        </div>
      </div>

      {/* 2. Bảng Đơn hàng */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body h-[60vh]">
          {/* Header của Card */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Recent Purchases</h2>
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
                  <th>Payment Method</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Rows - map qua 'currentOrders' */}
                {currentOrders.map((order) => {
                  const variant: IProductVariant[] = [];
                  const customer = customerList.find(cust => cust.id === order.userId);
                  const payment = paymentList.find(pay => pay.orderId === order.id);
                  const orderItems = orderItemList.filter(item => item.orderId === order.id);
                  orderItems.forEach(item => {
                    const varnt = variantMap[item.variantId];
                    if (varnt) {
                      variant.push(varnt);
                    }
                  });
                  return (
                    <tr key={order.id} className="hover" onClick={() => router.push(`/orders/${order.id}`)}>
                      <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                      <td>{variant.map((v) => (
                        <>
                          <p>{v.product?.productName}</p>
                          <br/>
                        </>
                      ))}
                      </td>
                      <td>{order.id}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{(payment?.method.split('-')[0]?.toUpperCase())}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar">
                            <div className="mask mask-squircle w-8 h-8 rounded-full">
                              <Image src={customer?.avatar ?? '/default-avatar.jpg'} alt={customer?.fullName ?? ''} width={32} height={32} />
                            </div>
                          </div>
                          {customer?.fullName}
                        </div>
                      </td>
                      <td><StatusBadge status={order.status} /></td>
                      <td>${payment?.amount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* 3. Pagination (Code JSX từ file của bạn) */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-0">
              
              {/* Nút PREVIOUS */}
              <button 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"
              >
                  <GrFormPrevious size={18} /> PREVIOUS
              </button>
              
              {/* Các Nút Trang và Dấu Ba Chấm */}
              {pageNumbers.map((item, index) => (
                  <React.Fragment key={index}>
                      {item === '...' ? (
                          <span className="px-3 py-2 text-gray-700">...</span>
                      ) : (
                          <button
                              onClick={() => goToPage(item as number)}
                              className={`px-4 py-2 rounded-xl font-semibold transition border ${
                                  currentPage === item 
                                      ? 'bg-black text-white border-black bg-neutral-950' 
                                      : 'text-black border-gray-300 hover:bg-gray-100'
                              }`}
                          >
                              {item}
                          </button>
                      )}
                  </React.Fragment>
              ))}

              {/* Nút NEXT */}
              <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"
              >
                  NEXT <GrFormNext size={18} />
              </button>
          </div>
      )}
    </div>
  );
}