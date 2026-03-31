import UserProfileView from "@/sections/admin-dashboard/view/admin-users-detail-view";
export const metadata = {
    title: 'Thông tin chi tiết khách hàng | Baso Spark',
}

export default async function userDetailPage({
    params
}: {
    params: Promise<{ id: string }>;
}
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    return(
        <UserProfileView id={id} />
    );
}