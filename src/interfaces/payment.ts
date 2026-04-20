
export interface IPayment {
    id: string;
    orderId: string;
    externalTransactionId: string | null;
    amount: number;
    method: string;
    gatewayResponse: any | null;
    status: string;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentCreate {
    orderId: string;
    externalTransactionId: string | null;
    amount: number;
    method: string;
    gatewayResponse: any | null;
    paidAt: Date | null;
}

export interface IPaymentUpdate {
    externalTransactionId?: string,
    amount?: number,
    method?: string,
    gatewayResponse?: any,
    status?: string,
    paidAt?: Date,
}

export interface IPaymentQuery {
    orderId?: string,
    externalTransactionId?: string,
    method?: string,
    status?: string,
    paidAt?: Date,
}

export interface InitiatePayment {
    paymentId: string,
    method: string,
    methodChild: string,
}