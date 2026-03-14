"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Printer, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import UserRegula from '@/components/icons/user';
import BagHandleRegular from '@/components/icons/bag-handle';
import { IOrder, IOrderCoupon, IOrderItem } from '@/interfaces/order';
import { IProductVariant } from '@/interfaces/variant';
import { IUserProfile } from '@/interfaces/user';
import { IAddress } from '@/interfaces/address';
import { IConditionalImage, IImage } from '@/interfaces/image';
import { IPayment } from '@/interfaces/payment';
import { getOrderById, getOrderCoupon, getOrderItemsByOrderId, updateOrderStatus } from '@/apis/order';
import { getUserById } from '@/apis/user';
import { getVariantById } from '@/apis/variant';
import { getAddressById } from '@/apis/address';
import { getImages } from '@/apis/image';
import { getPaymentByOrderId } from '@/apis/payment';
import { generateInvoicePdf } from '@/utils/generateInvoice';

type OrderDetailViewProps = {
  id: string;
};

const status = ['Processing', 'Shipped', 'Delivered','Completed', 'Canceled'];

function StatusBadge({ status }: { status: string }) {
  let colorClass = '';
  switch (status) {
    case 'Processing': colorClass = 'bg-[#FCD34D]/50 text-[#D97706] border border-[#FCD34D]'; break;
    case 'Delivered': colorClass = 'bg-[#93C5FD]/50 text-[#2563EB] border border-[#93C5FD]'; break;
    case 'Completed': colorClass = 'bg-[#6EE7B7]/50 text-[#059669] border border-[#6EE7B7]'; break;
    case 'Canceled': colorClass = 'bg-[#FECACA]/50 text-[#DC2626] border border-[#FECACA]'; break;
    default: colorClass = 'bg-gray/50 text-graymain border border-gray'; break;
  }
  return (
    <div className={`rounded-lg p-2 ${colorClass}`}>
        <span className={`text-darkgrey`}>{status}</span>
    </div>
  );
}

export default function OrderDetailPage({ id }: OrderDetailViewProps) {
  const [customer, setCustomer] = useState<IUserProfile>();
  const [order, setOrder] = useState<IOrder>();
  const [orderItem, setOrderItem] = useState<IOrderItem[]>([]);
  const [orderCoupon, setOrderCoupon] = useState<IOrderCoupon>();
  const [payment, setPayment] = useState<IPayment>();
  const [address, setAddress] = useState<IAddress>();
  const [variant, setVariant] = useState<IProductVariant[]>([]);
  const [imagesMap, setImagesMap] = useState<Map<string, IImage>>(new Map());
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchCustomer = async (userId: string) => {
    try {
      const response = await getUserById(userId);
      if (response && response.data) setCustomer(response.data);
    } catch (error) { console.error(error); }
  }

  const fetcheOrder = async (id: string) => {
    try {
      const data = await getOrderById(id);
      if (data) {
        setOrder(data.data);
        setCurrentStatus(data.data.status);
      } else notFound();
    } catch (error) { console.error(error); notFound(); }
    finally { setLoading(false); }
  }

  const fetchOrderItems = async (orderId: string) => {
    try {
      const response = await getOrderItemsByOrderId(orderId);
      if (response) setOrderItem(response.data);
    } catch (error) { console.error(error); }
  }

  const fetchOrderCoupon = async (orderId: string) => {
    try {
      const response = await getOrderCoupon(orderId);
      if (response) setOrderCoupon(response.data);
    } catch (error) { console.error(error); }
  }

  const fetchAddress = async (addressId: string) => {
    try {
      const response = await getAddressById(addressId);
      if (response) setAddress(response.data);
    } catch (error) { console.error(error); }
  }

  const fetchPayment = async (orderId: string) => {
    try {
      const response = await getPaymentByOrderId(orderId);
      if (response && response.data.length > 0) setPayment(response.data[0]);
    } catch (error) { console.error(error); }
  }

  const fetchVariant = async (variantId: string) => {
    try {
      const response = await getVariantById(variantId);
      if (response) setVariant(prev => [...prev, response.data]);
    } catch (error) { console.error(error); }
  }

  const fetchImage = async (productId: string) => {
    try {
      const dto: IConditionalImage = { refId: productId, type: 'product', isMain: true };
      const response = await getImages(dto);
      if (response) {
        const image = response.data[0];
        setImagesMap(prev => new Map(prev).set(productId, image));
      }
    } catch (error) { console.error(error); }
  }

  const fetchUpdateOrder = async (orderId: string, status: IOrder['status']) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      if (response) {
        setOrder(response.data);
        setCurrentStatus(response.data.status);
        fetcheOrder(orderId); 
      }
    } catch (error) { console.error(error); } 
  }

  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => { if (id) fetcheOrder(id); }, [id]);

  useEffect(() => {
    if (order) {
      fetchCustomer(order.userId);
      fetchOrderItems(order.id);
      fetchOrderCoupon(order.id);
      fetchPayment(order.id);
      if (order.shippingAddressId !== 'collect_in_store' && order.shippingAddressId) fetchAddress(order.shippingAddressId);
    }
  }, [order]);

  useEffect(() => { orderItem.forEach(item => fetchVariant(item.variantId)); }, [orderItem]);
  useEffect(() => { variant.forEach(v => fetchImage(v.productId)); }, [variant]);

  const toggleDropdown = () => { setIsDropdownOpen(!isDropdownOpen); }

  const handleSave = () => { fetchUpdateOrder(order?.id || '', currentStatus as IOrder['status']); };

  // === THAY THẾ HÀM NÀY ===
  const handlePrint = async () => {
    if (!order) return;
    
    // 1. Tạo PDF (file này đã có doc.autoPrint())
    const data = { order, orderItems: orderItem, orderCoupon, customer, variant, payment, logoUrl: "https://res.cloudinary.com/dzyrtxn7j/image/upload/v1763369632/logo_w7uycg.png" };
    const pdf = await generateInvoicePdf(data);
    
    // 2. Lấy PDF dưới dạng "blob"
    const blob = pdf.output('blob');
    
    // 3. Tạo một URL an toàn từ blob
    const blobUrl = URL.createObjectURL(blob);
    console.log('PDF generated with autoPrint, opening in new tab...');

    // 4. Mở URL trong một tab mới
    const newWindow = window.open(blobUrl, '_blank');
    
    // 5. Kiểm tra xem pop-up có bị chặn không
    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        console.error('Pop-up bị chặn!');
        // Chỗ này bạn có thể dùng thư viện toast/notification để báo lỗi
        alert('Cửa sổ in (pop-up) đã bị chặn. Vui lòng cho phép pop-up cho trang web này và thử lại.');
    }
  };
  // === KẾT THÚC THAY THẾ ===

  if (loading) return (<div className="flex justify-center items-center h-96"><span className="loading loading-spinner loading-lg"></span></div>);

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders Details</h1>
          <p className="text-base-content/70 text-sm">Home &gt; Order List &gt; Order Details</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-fawhite px-4 py-6 rounded-2xl">
        <div className="card flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">Orders ID: {order?.id}</span>
                    <StatusBadge status={currentStatus} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button className="btn p-0 shadow-none border-none bg-transparent gap-2 w-full sm:w-auto">
                        <Calendar size={16} />
                        {formatDate(order?.createdAt || '')}
                    </button>
                </div>
            </div>
            <div className="flex place-self-end gap-5 w-full sm:w-auto">
                <div className='dropdown dropdown-end'>
                    <div
                        tabIndex={0}
                        role='button'
                        className=' bg-gray shadow-none text-darkgrey w-full sm:w-auto flex justify-around  items-center rounded-lg p-4 gap-2 dropdown-toggle group hover:bg-darkgrey hover:text-white'
                        onClick={toggleDropdown}
                    >
                        {currentStatus}
                        <ChevronDown className={`transition-transform duration-300 group-hover:stroke-white ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu z-50 p-2 shadow bg-base-100 rounded-box mt-2 w-52">
                        {status.map((stat) => (
                            <li key={stat}>
                                <a onClick={() => setCurrentStatus(stat)} className={stat === currentStatus ? 'font-bold' : ''}>{stat}</a>
                            </li>
))}
                    </ul>
                </div>    
                <button type='button' className=" bg-gray shadown-none flex justify-center items-center rounded-lg p-4 hover:bg-darkgrey hover:text-white group" 
                  onClick={handlePrint}
                >
                    <Printer />
                </button>
                <button type='button' className="bg-gray shadown-none flex justify-center items-center rounded-lg p-4 hover:bg-darkgrey hover:text-white group" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card bg-transparent border border-gray">
                <div className="card-body px-4 py-4 gap-4 justify-between">
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center p-4 bg-blue rounded-lg group">
                        <UserRegula className="w-6 h-6 text-white" width={24} height={24}/>  
                        </span>
                        <div>
                            <h2 className="card-title">Customer</h2>
                            <p className="text-graymain">Full Name: {customer?.fullName}</p>
                            <p className="text-graymain">Email: {customer?.email}</p>
                            <p className="text-graymain">Phone: {customer?.phone}</p>
                        </div>
                    </div>
                    <div className="card-actions">
                        <button className="btn-block bg-darkgrey text-white hover:bg-blue py-2 rounded-lg">View profile</button>
                    </div>
                </div>
            </div>

            <div className="card bg-transparent border border-gray">
            <div className="card-body  px-4 py-4 gap-4 justify-between">
                <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center p-4 bg-blue rounded-lg group">
                        <BagHandleRegular className="w-6 h-6 text-white" width={24} height={24}/>
                    </span>
                    <div>
                        <h2 className="card-title">Order Info</h2>
                        {order?.shippingAddressId === 'collect_in_store' ? (
                          <p className='text-graymain'>Shipping: Collect in Store</p>
                        ) : (
                          <p className='text-graymain'>Shipping: Baso Logistics</p>
                        )}
                        <p className='text-graymain'>Payment Method: {payment?.method.split('-')[0]}</p>
                        <p className='text-graymain'>Status: {order?.status}</p>
                    </div>
                </div>
                <div className="card-actions">
                    <button className="btn-block bg-darkgrey text-white hover:bg-blue py-2 rounded-lg">Download info</button>
                </div>
            </div>
            </div>

            <div className="card bg-transparent border border-gray">
            <div className="card-body px-4 py-4 gap-4 justify-between">
                <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center p-4 bg-blue rounded-lg group">
                        <BagHandleRegular className="w-6 h-6 text-white" width={24} height={24}/>
                    </span>
                    {order?.shippingAddressId === 'collect_in_store' ? (
                      <div>
                        <h2 className="card-title">Deliver to</h2>
                        <p className='text-graymain'>Collect in Store</p>
                      </div>
                      ) : (
                        <div>
                          <h2 className="card-title">Deliver to</h2>
                          <p className='text-graymain'>Recipient: {address?.fullName}</p>
                          <p className='text-graymain'>Phone: {address?.phone}</p>
                          <p className='text-graymain'>Address: {address?.streetAdress} {address?.cityProvince}</p>
                        </div>
                      )
                    }
                </div>
                <div className="card-actions">
                    <button className="btn-block bg-darkgrey text-white hover:bg-blue py-2 rounded-lg">View profile</button>
                </div>
            </div>
            </div>
        </div>

        <div className="w-full">
            <div className="card bg-transparent">
            <div className="card-body p-0">
                <h2 className="card-title">Note</h2>
                <textarea className="textarea min-h-28 textarea-bordered bg-transparent w-full" placeholder="Type some notes"></textarea>
            </div>
            </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                  <th>Product Name</th>
                  <th>Order ID</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItem && variant && orderItem.map((e: IOrderItem) => {
                  const variantData: IProductVariant | undefined = variant.find(v => v.id === e.variantId);
                  if (!variantData) return null;
                  return (
                    <tr key={variantData.id ?? e.id}>
                      <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <Image
                                src={imagesMap.get(variantData.productId ?? '')?.url || ''}
                                alt={variantData.product?.productName || ''}
                                width={40}
                                height={40}
                              />
                            </div>
                          </div>
                          {variantData.product?.productName}
                        </div>
                      </td>
                      <td>{order?.id}</td>
                      <td>{e?.quantity}</td>
                      <td>${(variantData?.product?.price ?? 0).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-base"><span>Subtotal</span><span className="font-semibold">${order?.totalAmount?.toFixed(2)}</span></div>
              <div className="flex justify-between text-base"><span>Tax</span><span className="font-semibold">{order?.shippingAddressId === 'collect_in_store' ? '$0.00' : '$60000.00'}</span></div>
              <div className="flex justify-between text-base"><span>Discount</span><span className="font-semibold">${orderCoupon?.discountApplied.toFixed(2)}</span></div>
              <div className="divider my-0"></div>
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${payment?.amount.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}