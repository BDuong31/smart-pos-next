'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ErrorCircleBold } from "@/components/icons/error-circle";
import { BagRemoveBold } from "@/components/icons/bag-remove";
import { BagCheckBold } from "@/components/icons/bag-check";
import SplashScreen from "@/components/loading/splash-sceen";
import { getPaymentById, queryStatus, updatePayment, verifyPayment } from "@/apis/payment";
import { getOrderId } from "@/apis/order";
import { IOrder } from "@/interfaces/order";
import { IPayment } from "@/interfaces/payment";

type PaymentResultViewProps = {
    id: string;
};

export default function PaymentResultView({ id }: PaymentResultViewProps) {
    const searchParams = useSearchParams();
    const [payment, setPayment] = useState<IPayment | null>(null);
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);

    const externalId = useMemo(() => {
        return searchParams?.get('transId') || 
               searchParams?.get('vnp_TransactionNo') || 
               searchParams?.get('apptransid');
    }, [searchParams]);

    /**
     * Hàm fetch dữ liệu từ Server
     * Backend lúc này đã được IPN cập nhật trạng thái thành 'completed' hoặc 'failed'
     */
    const fetchData = async () => {
        try {
            const payRes = await getPaymentById(id);
            if (payRes?.data) {
                setPayment(payRes.data);
                let status;
                if (payRes.data.method !== 'cash') {
                    const res = await queryStatus(payRes.data.method, externalId as string); 
                    status = res;
                } else {
                    status = payRes.data.status;
                }
                if (status === 'failed') {
                    const res = await updatePayment(payRes.data.id, { status: 'failed', externalTransactionId: externalId as string });
                } else if (status === 'success') {
                    const res = await updatePayment(payRes.data.id, { status: 'success', externalTransactionId: externalId as string });
                } else {
                    const res = await updatePayment(payRes.data.id, { status: 'pending', externalTransactionId: externalId as string });
                }
                // Nếu chưa có thông tin Order thì fetch luôn
                if (!order) {
                    const orderRes = await getOrderId(payRes.data.orderId);
                    if (orderRes?.data) setOrder(orderRes.data);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        let retryCount = 0;
        const interval = setInterval(() => {
            if (payment?.status === 'pending' && retryCount < 5) {
                fetchData();
                retryCount++;
            } else {
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [id, payment?.status]);

    if (loading && !payment) {
        return <SplashScreen className="h-[80vh]"/>;
    }

    /**
     * Giao diện THẤT BẠI (Dựa hoàn toàn vào database từ Server)
     */
    if (payment?.status === 'failed') {
        return (
            <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] pt-10">
                <div className="flex flex-col justify-center items-center text-center">
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-red-600 mb-12">THANH TOÁN THẤT BẠI</h1>
                    <div className="flex flex-col w-full gap-auto justify-center items-center p-12">
                        <div className="p-5 text-red-500">
                            <ErrorCircleBold width={100} height={100} />
                        </div>
                        <h2 className="text-3xl font-semibold text-gray-900 p-5">Giao dịch không thành công</h2>
                        <p className="text-graymain p-5">
                            Yêu cầu thanh toán cho đơn hàng <span className="font-bold text-gray-900">#{order?.code || '...'}</span> đã bị từ chối hoặc hủy bỏ.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full p-5">
                            <Link className="w-full py-3 px-6 rounded-lg border border-graymain font-semibold text-center" href="/">VỀ TRANG CHỦ</Link>
                            <Link className="w-full py-3 px-6 rounded-lg bg-darkgrey text-white font-semibold text-center" href="/checkout">THỬ LẠI</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (payment?.status === 'pending') {
        return (
            <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] pt-10">
                <div className="flex flex-col justify-center items-center text-center">
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-orange-500 mb-12">ĐANG XỬ LÝ...</h1>
                    <div className="flex flex-col w-full gap-auto justify-center items-center p-12">
                        <div className="animate-pulse p-5 text-orange-400">
                            <BagRemoveBold width={100} height={100} />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 p-5">Đang kiểm tra kết quả thanh toán</h2>
                        <p className="text-graymain p-5">Vui lòng chờ trong giây lát trong khi chúng tôi xác nhận giao dịch từ nhà cung cấp.</p>
                        <div className="flex justify-center">
                             <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Giao diện THÀNH CÔNG (status === 'completed')
     */
    return (
        <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] pt-10">
            <div className="flex flex-col justify-center items-center text-center">
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-green-600 mb-12">THANH TOÁN THÀNH CÔNG</h1>
                <div className="flex flex-col w-full gap-auto justify-center items-center p-12">
                    <div className="p-5 text-green-500">
                        <BagCheckBold width={100} height={100} />
                    </div>
                    <h2 className="text-3xl font-semibold text-gray-900 p-5">Thanh toán thành công!</h2>
                    <p className="text-graymain p-5">
                        Chúc mừng! Đơn hàng <span className="font-bold text-gray-900">#{order?.code}</span> đã được thanh toán hoàn tất.
                        {payment?.method !== 'cash' ? <> <br /> Mã giao dịch: <span className="font-mono text-blue-600 font-bold">{externalId}</span></> : <></>}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full p-5">
                        <Link className="w-full py-3 px-6 rounded-lg border border-graymain font-semibold text-center" href="/">TIẾP TỤC MUA SẮM</Link>
                        <Link className="w-full py-3 px-6 rounded-lg bg-darkgrey text-white font-semibold text-center" href={`/user/purchase/order/${order?.id}`}>CHI TIẾT ĐƠN HÀNG</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}