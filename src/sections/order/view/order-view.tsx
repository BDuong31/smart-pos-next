'use client';
import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaArrowLeft, FaClipboardList, FaMoneyCheckAlt, 
  FaShippingFast, FaBoxOpen, FaStar, 
  FaUtensils,
  FaConciergeBell,
  FaCheckCircle
} from 'react-icons/fa';
import ArrowBack from '@/components/icons/arrow-back';
import { ChevronLeft } from 'lucide-react';
import ClipboardRegular from '@/components/icons/clipboard';
import OrderItem from '@/components/order/order-item';
import { IPayment } from '@/interfaces/payment';
import { create } from 'domain';
import { getVariantById } from '@/apis/variant';
import { is } from 'zod/v4/locales';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/loading';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { IOrderDetail, IOrderItemDetail } from '@/interfaces/order';
import { IVariant } from '@/interfaces/variant';
import { getOrderId, getOrderItems } from '@/apis/order';
import { getPayments } from '@/apis/payment';

type OrderDetailPageProps = {
    id: string;
};

const stepsToCollection: { name: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: 'Đã đặt món', icon: FaClipboardList },
  { name: 'Đã xác nhận thanh toán', icon: FaMoneyCheckAlt },
  { name: 'Đang chế biến', icon: FaUtensils },
  { name: 'Đã phục vụ', icon: FaConciergeBell },
  { name: 'Hoàn thành', icon: FaCheckCircle },
];

const STATUS = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  served: 'Đã phục vụ',
  completed: 'Hoàn thành',
  canceled: 'Đã hủy',
}

const tabs = ['Chờ xử lý', 'Đã xác nhận', 'Đang xử lý', 'Đã phục vụ', 'Hoàn thành', 'Đã hủy'];
const hiddenTabs = ['pending', 'confirmed', 'processing', 'served', 'completed', 'canceled'];
export default function OrderView({ id }: OrderDetailPageProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
   const [order, setOrder] = React.useState<IOrderDetail | null>(null);
   const [orderItems, setOrderItems] = React.useState<IOrderItemDetail[]>([]);
   const [variantMap, setVariantMap] = React.useState<Map<string, IVariant>>(new Map());
   const [payment, setPayment] = React.useState<IPayment | null>(null);
   const [stepsOrder, setStepsOrder] = React.useState<{ name: string; icon: React.ComponentType<{ className?: string }> }[]>([]);
   const [isAddress, setIsAddress] = React.useState<boolean>(true);

   const [total, setTotal] = React.useState<number>(0);
   const [discount, setDiscount] = React.useState<number>(0);
   const [deliveryFee, setDeliveryFee] = React.useState<number>(0);
   const [totalPayment, setTotalPayment] = React.useState<number>(0);
   const [loading, setLoading] = React.useState<boolean>(false);

  const fetchOrderById = async (id: string) => {
    setLoading(true);
    try {
      const response = await getOrderId(id);
      setOrder(response.data);
    }  catch (error) {
      console.error('Error fetching order by ID:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetcheOrderItem = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await getOrderItems({orderId: orderId}, 1, 100);
      setOrderItems(response.data);
    } catch (error) {
      console.error('Error fetching order items by order ID:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetcheVariant = async (varinatId: string) => {
    setLoading(true);
    try {
      const response = await getVariantById(varinatId);
      const variantData = response.data;
      setVariantMap((prev) => new Map(prev).set(varinatId, variantData));
    } catch (error) {
      console.error('Error fetching variant by ID:', error);
    } finally {
      setLoading(false);
    }
  } 

  const fetchePaymentById = async (id: string) => {
    setLoading(true);
    try {
      const response = await getPayments({orderId: id}, 1, 100);
      setPayment(response.data[0]);
    } catch (error) {
      console.error('Error fetching payment by order ID:', error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchOrderById(id);
    fetchePaymentById(id);
  }, [id]);

  React.useEffect(() => {
    setStepsOrder(stepsToCollection);
    fetcheOrderItem(id);
  }, [order]);

  React.useEffect(() => {
    if (orderItems) {
      orderItems.forEach((item) => {
        fetcheVariant(item.variantId);
      });
    }
  }, [orderItems]);

  const currentStep = React.useMemo(() => {
    if (!order) return 0;
    if (!payment) return 0;
    if (isAddress) {
      if (payment?.status === 'success' && order.status === 'Processing') {
        return hiddenTabs.indexOf(order.status) + 1;
      } else { 
        return hiddenTabs.indexOf(order.status);
      }
    } else {
      if (payment?.status === 'success' && order.status === 'Processing') {
        return hiddenTabs.indexOf(order.status) + 1;
      } else { 
        return hiddenTabs.indexOf(order.status);
      }
    }
  }, [order, payment, isAddress]);


  React.useEffect(() => {
    if (order) {
      setTotal(order.totalAmount);
    }
  }, [order, payment]);

  if (loading || !order) {
    return <SplashScreen className="h-[80vh]" />;
  }
  return (
    <div className="rounded-lg bg-fawhite w-full p-6">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <Link href="/user/purchase" className="btn btn-ghost">
            <ChevronLeft /> Quay lại
          </Link>
          <div className="flex justify-center items-center gap-1 text-right">
            <span className="text-sm text-gray-600 text-center">Mã đơn hàng: {order?.code}</span>
            <h1 className="text-2xl font-bold uppercase">{STATUS[order?.status as keyof typeof STATUS]}</h1>
          </div>
        </div>

        <div className="p-8 rounded-lg mb-6">
          <div className="flex items-center w-full px-6">
              {stepsOrder.map((step, index) => {
                const IconComponent = step.icon;
                const isCompleted = index <= currentStep;
                const isLineCompleted = index < currentStep;
                const isLastStep = index === stepsOrder.length - 1;
                let iconColor = 'text-gray';
                let circleColor = 'border-gray border-[0.25rem]';
                let lineColor = 'bg-gray';

                if (isCompleted) {
                  iconColor = 'text-[#22C55E]';
                  circleColor = 'bg-transparent border-[0.25rem] border-[#22C55E]';
                  if (isLineCompleted) {
                    lineColor = 'bg-[#22C55E]';
                  }
                }
                
                if (isLastStep) {
                  if (isCompleted) {
                    iconColor = 'text-[#22C55E]';
                    circleColor = 'bg-transparent border-[0.25rem] border-[#22C55E]';
                  } else {
                    iconColor = 'text-gray';
                    circleColor = 'bg-white border-[0.25rem] border-gray';
                  }
                }

                return (
                  <React.Fragment key={step.name}>
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${circleColor}`}>
                        <IconComponent className={`w-6 h-6 ${iconColor}`} />
                      </div>
                    </div>
                    
                    {!isLastStep && (
                      <div className={`flex-auto h-1 ${lineColor}`} />
                    )}
                  </React.Fragment>
                );
              })}
          </div>

          <div className="flex justify-between w-full mt-2">
            {stepsOrder.map((step) => (
              <div key={step.name} className="text-center w-24">
                <span className="font-semibold text-sm">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-lg mb-6">
          <div>
            {orderItems && variantMap &&
              orderItems.map((item: IOrderItemDetail) => {
                const variantData = variantMap.get(item.variantId);
                return (
                    <React.Fragment key={item.id}>
                    <OrderItem item={item} variant={variantData!} />
                    <div className="divider my-1"></div>
                    </React.Fragment>
                );
              })
            }
          </div>
        </div>

        <div className="p-8 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-2">Thông tin người nhận</h3>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Họ tên</span>
                <span>{user?.fullName}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-2">Thông tin thanh toán</h3>
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng tiền hàng</span>
                <span>${total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Giảm giá</span>
                <span>{discount === 0 ? '-' : `$${(discount ?? 0).toFixed(2)}`}</span>
              </div>
              <div className="divider my-1"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng tiền</span>
                <span>
                  ${(totalPayment ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-500">Phương thức thanh toán</span>
                <span className="font-semibold">
                  {
                    payment?.method === 'cash' ? 'Thanh toán khi nhận hàng' :
                    payment?.method === 'vnpay' ? 'VNPay' :
                    payment?.method === 'vnpay-VNPAYQR' ? 'VNPay Banking Apps and E-wallets' :
                    payment?.method === 'vnpay-VNBANK' ? 'VNPay Domestic card and bank account' : 
                    payment?.method === 'vnpay-INTCARD' ? 'VNPay International payment cards' :
                    payment?.method === 'vnpay-VNMART' ? 'VNPAY e-Money' :
                    payment?.method === 'momo' ? 'MoMo' :
                    payment?.method === 'momo-captureWallet' ? 'MoMo E-wallet' :
                    payment?.method === 'momo-payWithVTS' ? 'MoMo Postpaid Wallet' :
                    payment?.method === 'momo-payWithATM' ? 'MoMo ATM Card' :
                    payment?.method === 'momo-payWithCC' ? 'MoMo Credit Card' : 
                    payment?.method === 'zalopay' ? 'ZaloPay' :
                    payment?.method === 'zalopay-qr' ? 'ZaloPay QR Code' :
                    payment?.method === 'zalopay-cc' ? 'ZaloPay Credit Card' :
                    payment?.method === 'zalopay-vietqr' ? 'ZaloPay VietQR' :
                    payment?.method === 'zalopay-atm-one-form' ? 'ZaloPay ATM One Form' : ''
                  }
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-500">Trạng thái thanh toán</span>
                <span className="font-semibold">
                  {
                    payment?.status === 'success' ? 'Thành công' :
                    payment?.status === 'pending' ? 'Đang chờ thanh toán' :
                    payment?.status === 'failed' ? 'Thanh toán thất bại' : ''
                  }
                </span>
              </div>
              {payment && (payment.status === 'failed' || payment.status === 'pending') && payment.method !== 'cod' && order && order.status !== 'Canceled' &&
                <div className="flex justify-end">
                  <button
                    className='text-blue'
                    onClick={() => {
                      router.push(`/payment/${payment?.id}`);
                    }}
                  >
                    Thanh toán lại
                  </button>
                </div>
              }
              {
                order && order?.status === 'Completed' && (
                  <div className="flex justify-end">
                    <button
                      className='text-[#FF0000]'
                      onClick={() => {
                        console.log('Cancellation and Refund Process Initiated');
                      }}
                    >
                      Hủy đơn và hoàn tiền
                    </button>
                  </div>
                )
              }
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}