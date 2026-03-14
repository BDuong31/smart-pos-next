import OrderDetailView from "@/sections/admin-dashboard/view/admin-order-detail-view";

export const metadata = {
    title: 'Order Detail | Baso Spark',
}

export default function orderDetailPage({
    params
}: {
    params: { id: string }
}
) {
    const { id } = params;
    return(
        <OrderDetailView id={id} />
    );
}