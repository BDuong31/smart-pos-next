import UserProfileView from "@/sections/admin-dashboard/view/admin-users-detail-view";
export const metadata = {
    title: 'User Details | Baso Spark',
}

export default function userDetailPage({
    params
}: {
    params: { id: string }
}
) {
    const { id } = params;
    console.log(id)
    return(
        <UserProfileView id={id} />
    );
}