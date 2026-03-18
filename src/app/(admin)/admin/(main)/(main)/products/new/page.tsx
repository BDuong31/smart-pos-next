import ProductCreateView from "@/sections/admin-dashboard/view/admin-product-add-view";

export const metadata = {
    title: 'Thêm món | Baso Corner',
}

export default function AddProductPage() {
    return(
        <ProductCreateView/>
    );
}