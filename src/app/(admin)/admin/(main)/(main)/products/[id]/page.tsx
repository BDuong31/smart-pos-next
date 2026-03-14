import ProductEditPage from "@/sections/admin-dashboard/view/admin-product-detail-view";
export const metadata = {
    title: 'Product Detail | Baso Spark',
}
type Props = {
  params: Promise<{ id: string }>;
};

export default async function orderDetailPage({ params }: Props){
    const { id } = await params;
    return(
        <ProductEditPage id={id} />
    );
}