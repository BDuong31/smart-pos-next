"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import CheckoutDetails from "@/components/checkout/checkoutDetails";
import CheckoutForm from "@/components/checkout/checkoutForm";
import SplashScreen from "@/components/loading/splash-sceen";
import { useToast } from "@/context/toast-context";

import { AppDispatch, RootState } from "@/store/store";
import { fetchCartByUserId } from "@/store/slices/cartSlice";
import { getMe } from "@/store/slices/userSlice";

import { deleteCartItem, getCartItemOptions, getCartItems } from "@/apis/cart";
import { getVariantById } from "@/apis/variant";

// IMPORT CÁC API ORDER & PAYMENT MỚI CỦA BẠN
import { 
    createOrder, 
    createOrderItem, 
    createOrderItemOption, 
    createOrderVoucher, 
    createOrderTable 
} from "@/apis/order";
import { createPayment } from "@/apis/payment";

import { IOrderCreate, IOrderItemCreate, IOrderItemOptionCreate, IOrderVoucherCreate, IOrderTableCreate } from "@/interfaces/order"
import { IPaymentCreate } from "@/interfaces/payment";
import { ICartItemDetail, ICartItemOptionDetail } from "@/interfaces/cart";
import { IVariant } from "@/interfaces/variant";
import { ITableDetail } from "@/interfaces/table";
import { getTableById } from "@/apis/table";

// Form data tại quán (có thể nhập Table ID)
type CheckoutFormData = {
    tableId?: string | null;
    note?: string;
}

export default function CheckoutView() {
    const router = useRouter();
    const { showToast } = useToast();
    const dispatch = useDispatch<AppDispatch>();
    
    const user = useSelector((state: RootState) => state.user.user);
    const cart = useSelector((state: RootState) => state.cart.cart);

    const [cartItem, setCartItem] = useState<ICartItemDetail[]>([]);
    const [variantMap, setVariantMap] = useState<Record<string, IVariant>>({});
    const [optionMap, setOptionMap] = useState<Record<string, ICartItemOptionDetail[]>>({});
    const [cartTotal, setCartTotal] = useState(0);
    const [voucherDiscount, setVoucherDiscount] = useState<number>(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState<number>(0);
    
    const [loading, setLoading] = useState(true);
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

    // 1. FETCH CART ITEMS
    const fetchCartItems = useCallback(async () => {
        if (cart) {
            try {
                const response = await getCartItems(cart.id, undefined, undefined, undefined, undefined, 1, 100);
                setCartItem(response.data as ICartItemDetail[] || []);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        } else if (user?.id) {
            dispatch(fetchCartByUserId(user.id));
        }
    }, [cart, user?.id, dispatch]);

    useEffect(() => {
        if (user) {
            fetchCartItems();
        } else {
            dispatch(getMe());
        }
    }, [user, fetchCartItems, dispatch]);

    // 2. FETCH VARIANTS & OPTIONS
    useEffect(() => {
        if (!cartItem || cartItem.length === 0) {
            setLoading(false);
            return;
        }

        const loadCartDetails = async () => {
            const newVariantMap = { ...variantMap };
            const newOptionMap = { ...optionMap };
            let hasChanges = false;

            for (const item of cartItem) {
                if (!newVariantMap[item.variantId]) {
                    try {
                        const res = await getVariantById(item.variantId);
                        if (res.data) {
                            newVariantMap[item.variantId] = res.data;
                            hasChanges = true;
                        }
                    } catch (e) {
                        console.error(`Failed to fetch variant ${item.variantId}`, e);
                    }
                }

                if (!newOptionMap[item.id]) {
                    try {
                        const optionRes = await getCartItemOptions(item.id, undefined, 1, 100);
                        newOptionMap[item.id] = optionRes.data || [];
                        hasChanges = true;
                    } catch (error) {
                        console.error(`Error fetching options for cart item ${item.id}:`, error);
                    }
                }
            }

            if (hasChanges) {
                setVariantMap(newVariantMap);
                setOptionMap(newOptionMap);
            }
            setLoading(false);
        };

        loadCartDetails();
    }, [cartItem]);

    // 3. TÍNH TOÁN TỔNG TIỀN (Giá Base + Giá Topping)
    useEffect(() => {
        if (!cartItem || cartItem.length === 0 || Object.keys(variantMap).length === 0) {
            setCartTotal(0);
            return;
        }

        const total = cartItem.reduce((acc, item) => {
            const variant = variantMap[item.variantId];
            if (!variant) return acc;

            const basePrice = item.product?.basePrice || 0;
            const variantPrice = variant?.priceDiff;
            const optionsPrice = optionMap[item.id]?.reduce((optAcc, opt) => optAcc + (opt.optionItem?.priceExtra || 0), 0) || 0;

            return acc + ((basePrice + variantPrice + optionsPrice) * item.quantity);
        }, 0);

        setCartTotal(total);
    }, [cartItem, variantMap, optionMap]);

    // // 4. KIỂM TRA VÀ ÁP DỤNG VOUCHER
    // const checkCouponValidity = (coupon: ICoupon) => {
    //     const currentDate = new Date();
    //     if (coupon.expiryDate && new Date(coupon.expiryDate) < currentDate) {
    //         return false;
    //     }
    //     return true;
    // }

    // useEffect(() => {
    //     if (voucherCode) {
    //         getCouponByCondition({ code: voucherCode })
    //             .then(res => setCoupon(res.data[0]))
    //             .catch(console.error);
    //     } else {
    //         setCoupon(undefined);
    //     }
    // }, [voucherCode]);

    useEffect(() => {
        let discount = 0;
        // if (coupon && checkCouponValidity(coupon)) {
        //     if (coupon.type === 'percentage' && coupon.discountValue) {
        //         discount = (coupon.discountValue / 100) * cartTotal;
        //     } else if (coupon.type === 'fixed' && coupon.discountValue) {
        //         discount = coupon.discountValue;
        //     }
        // }

        setVoucherDiscount(discount);
        setTotalAfterDiscount(Math.max(0, cartTotal - discount));
    }, [ cartTotal]);

    // 5. LUỒNG XỬ LÝ THANH TOÁN ĐẦY ĐỦ
    const handleSubmit = async (data: CheckoutFormData) => {
        if (!user?.id || cartItem.length === 0) {
            showToast("Giỏ hàng rỗng hoặc chưa đăng nhập", "error");
            return;
        }

        setIsProcessingCheckout(true);
        try {
            // Bước 1: Tạo Đơn Hàng (Order)
            const orderData: IOrderCreate = {
                totalAmount: cartTotal,
                userId: user.id,
            };
            const createdOrderId = await createOrder(orderData); // Trả về Order ID

            if (!createdOrderId) throw new Error("Failed to create order");

            // Bước 2: Tạo Order Items và Order Item Options
            for (const item of cartItem) {
                const variant = variantMap[item.variantId];
                const basePrice = variant?.priceDiff || item.product?.basePrice || 0;
                const optionsPrice = optionMap[item.id]?.reduce((acc, opt) => acc + (opt.optionItem?.priceExtra || 0), 0) || 0;
                const finalUnitPrice = basePrice + optionsPrice; 

                // Tạo Món
                const orderItemData: IOrderItemCreate = {
                    orderId: createdOrderId,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    productName: item.product.name,
                };
                const createdOrderItemId = await createOrderItem(orderItemData); // Trả về OrderItem ID

                // Tạo Topping/Option cho món vừa tạo
                const itemOptions = optionMap[item.id] || [];
                for (const opt of itemOptions) {
                    const optionData: IOrderItemOptionCreate = {
                        orderItemId: createdOrderItemId,
                        optionItemId: opt.optionItemId,
                        optionName: opt.optionItem?.name,
                        price: opt.optionItem?.priceExtra || 0,
                    };
                    await createOrderItemOption(optionData);
                }

                // Xoá món khỏi giỏ hàng
                // await deleteCartItem(item.id); 
            }

            // Bước 3: Áp dụng Voucher (Lưu vào bảng OrderVoucher)
            // if (coupon) {
            //     const orderVoucherData: IOrderVoucherCreate = {
            //         orderId: createdOrderId,
            //         voucherId: coupon.id,
            //         discountApplied: voucherDiscount,
            //     }
            //     await createOrderVoucher(orderVoucherData);
            // }

            // Bước 4: Lưu thông tin Bàn (Nếu nhập Table ID)
            if (data.tableId) {
                const tableData: IOrderTableCreate = {
                    orderId: createdOrderId,
                    tableId: data.tableId
                }
                await createOrderTable(tableData);
            }

            showToast("Tạo đơn hàng thành công!", "success");
            // Điều hướng tới trang kết quả / thanh toán
            router.push(`/payment/${createdOrderId}`);

        } catch (error) {
            console.error("Checkout process failed:", error);
            showToast("Có lỗi xảy ra trong quá trình thanh toán", "error");
        } finally {
            setIsProcessingCheckout(false);
        }
    }

    if (loading || isProcessingCheckout) {
        return <SplashScreen className="h-[80vh]" />
    }

    return (
        <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] py-10">
            <div className="h-auto lg:grid grid-cols-2 gap-10">
                <div className='h-fit mt-8 lg:mt-0'>
                    <CheckoutForm onSubmit={handleSubmit} />
                </div>

                <div className='h-auto relative mt-8 lg:mt-0'>
                    <div className="lg:absolute lg:top-0 lg:left-0 lg:w-full lg:h-full lg:overflow-hidden">
                        <CheckoutDetails 
                            cartTotal={cartTotal} 
                            cartCount={cartItem.length} 
                            deliveryFee={0}  
                            voucherDiscount={voucherDiscount} 
                            totalAfterDiscount={totalAfterDiscount} 
                            variantMap={variantMap} 
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}