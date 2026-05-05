'use client';
import CashRegular from "@/components/icons/cash";
import PaymentDynamicContent from "@/components/payment/paymentDymamic";
import { DollarSign } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { IPayment } from "@/interfaces/payment";
import { IOrder } from "@/interfaces/order";
import { createPayment, getPaymentById, initiatePayment, updatePayment } from "@/apis/payment";
import { useToast } from "@/context/toast-context";
import SplashScreen from "@/components/loading/splash-sceen";
import { getOrderId } from "@/apis/order";

interface PaymentViewProps {
    id: string;
}

const paymentOptions = [
    {
        id: 'vnpay',
        title: 'VNPay',
        description: 'Pay with VNPay gateway',
        icon: <Image src="/VNPAYMART.png" alt="VNPay" width={58} height={58} />
    },
    {
        id: 'momo',
        title: 'Momo',
        description: 'Pay with Momo wallet',
        icon: <Image src="/momo.png" alt="Momo" width={58} height={58} />
    },
    {
        id: 'zalo',
        title: 'ZaloPay',
        description: 'Pay with ZaloPay wallet',
        icon: <Image src="/zalopay.png" alt="ZaloPay" width={58} height={58} />
    },
    {
        id: 'cash',
        title: 'Cash on Delivery',
        description: 'cash on delivery.',
        icon: <CashRegular width={58} height={58} />
    },
]

type PaymentMethodId = 'vnpay' | 'momo' | 'zalo' | 'cash';

export default function PaymentView({ id }: PaymentViewProps) {
    const router = useRouter();
    const [payment, setPayment] = React.useState<IPayment | null>(null);
    const [order, setOrder] = React.useState<IOrder | null>(null);
    const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethodId>('cash');
    const [selectedMethodChild, setSelectedMethodChild] = React.useState<string>('');

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const { showToast } = useToast()
    const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMethod(event.target.value as PaymentMethodId);
    };

    // const fetchePayment = async (paymentId: string) => {
    //     setLoading(true);
    //     try {
    //         const response = await getPaymentById(paymentId)
    //         console.log(response.data);
    //         if (response) {
    //             setPayment(response.data);
    //         } else {
    //             console.error('Error fetching payment:', response);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching payment:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const fetcheOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await getOrderId(orderId);
            if (response) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    }


    React.useEffect(() => {
        fetcheOrder(id);
    }, [id]);

    React.useEffect(() => {
        if (payment?.method) {
            const [method] = payment.method.split('-');
            setSelectedMethod(method as PaymentMethodId);
            const [methodChild] = payment.method.split('-').slice(1);
            setSelectedMethodChild(methodChild || '');
        }
    }, [payment]);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const paymentData = {
                orderId: order?.id || id,
                externalTransactionId: null,
                amount: order?.totalAmount || 0,
                method: selectedMethod,
                gatewayResponse: null,
                paidAt: null,
            };

            const newPaymentResponse = await createPayment(paymentData);
            const newPaymentId = newPaymentResponse.id;

            if (selectedMethod === 'cash') {
                const response = await updatePayment(newPaymentId, {
                    status: 'success',
                    method: 'cash',
                })
                showToast('Thanh toán thành công! Đơn hàng của bạn đang được xử lý.', 'success');
                router.push(`/order-result/${newPaymentId}?resultCode=-1`);
            } else {
                const response = await initiatePayment({
                    paymentId: newPaymentId,
                    method: selectedMethod,
                    methodChild: selectedMethodChild,
                });
                if (response.success && response.paymentUrl) {
                    router.push(response.paymentUrl);
                } else {
                    setError('Payment initiation failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Payment initiation failed:', error);
            console.error(error);
            showToast('Khởi tạo thanh toán thất bại. Vui lòng thử lại.', 'error');
            setError('Payment initiation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <SplashScreen className="h-[80vh]"/>;
    }

    return (
        <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] min-h-screen p-4 md:p-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                <h1 className="text-lg font-bold tracking-widest mb-4">
                    {order ? `Thanh toán đơn hàng #${order?.code}` : 'Payment Details'}
                </h1>
                <p className="text-sm font-bold text-graymain">TỔNG TIỀN THANH TOÁN</p>
                <p className="text-5xl font-bold text-blue mt-2">
                    ${order ? order.totalAmount.toFixed(2) : '0.00'}
                </p>
                </div>
                <div className="border border-gray-400 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 md:gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Chọn Phương Thức Thanh Toán</h2>
                        {paymentOptions.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => setSelectedMethod(option.id as PaymentMethodId)}
                                className={`
                                flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
                                ${selectedMethod === option.id
                                    ? 'bg-white shadow-md'
                                    : 'bg-transparent border border-gray-400' 
                                }
                                `}
                            >
                                <div className="flex-shrink-0">{option.icon}</div>
                                <div>
                                <h3 className="font-bold text-gray-900">{option.title}</h3>
                                <p className="text-sm text-gray-600">{option.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 md:mt-0">
                        <PaymentDynamicContent
                            selectedMethod={selectedMethod}
                            selectedMethodChild={selectedMethodChild}
                            setSelectedMethodChild={setSelectedMethodChild}
                        />
                    </div>
                </div>
                {error && (
                    <p className="text-[#FF0000] text-center mt-4">{error}</p>
                )}
                <div className="mt-8 flex flex-col md:flex-row gap-4">
                    <button 
                        className="w-full md:w-1/2 py-3 border border-gray-400 rounded-lg font-semibold hover:bg-gray"
                        onClick={() => router.back()}
                    >
                        QUAY LẠI
                    </button>
                    <button className="w-full md:w-1/2 py-3 bg-[#000000] text-white rounded-lg font-semibold"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        THANH TOÁN NGAY
                    </button>
                </div>
            </div>
        </div>
    );
}