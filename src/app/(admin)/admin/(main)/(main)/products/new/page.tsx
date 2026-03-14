import ProductCreateView from "@/sections/admin-dashboard/view/admin-product-add-view";

export const metadata = {
    title: 'Add Product | Baso Spark',
}

export default function AddProductPage() {
    return(
        <ProductCreateView/>
    );
}