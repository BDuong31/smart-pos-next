import StaffDetailView from "@/sections/admin-dashboard/view/admin-staff-detail-view";
export const metadata = {
    title: 'Thông tin chi tiết nhân viên | Baso Spark',
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
        <StaffDetailView id={id} />
    );
}