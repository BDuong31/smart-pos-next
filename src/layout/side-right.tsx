'use client'
import Image from "next/image"
import ClipboardRegular from "@/components/icons/clipboard"
import HeartRegular from "@/components/icons/heart"
import PenRegular from "@/components/icons/pen"
import UserRegula from "@/components/icons/user"
import VoucherRegular from "@/components/icons/voucher"
import React, { use } from "react"
import { useParams, usePathname} from "next/navigation"
import path from "path"
import { Wallet } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
export default function SideRight() {
    const user = useSelector((state: RootState) => state.user.user);
    const pathname = usePathname();
    const params = useParams();
    console.log("Pathname in SideRight:", pathname);
    console.log("Params in SideRight:", params);
    return (
        <aside className="w-64">
            <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12">
                <Image src={user?.avatar?.url || "/default-avatar.jpg"} alt="avatar" width={48} height={48} className="w-12 h-12 rounded-full"/>
            </div>
            <div>
                <div className="font-bold">{user?.fullName}</div>
                <div className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                    <PenRegular />
                    <p>Sửa thông tin</p>
                </div>
            </div>
            </div>

            <ul className="menu space-y-2 pl-0 w-full">
            <li>
                <details open>
                <summary className="font-bold px-0 flex">
                    <UserRegula width={24} height={24} className={`${pathname === "/user/account" ? "text-blue" : "text-darkgrey"}`} /> Tài khoản của tôi
                </summary>
                <ul>
                    <li className={pathname === "/user/account/profile" ? "text-blue" : ""}><a href="/user/account/profile" className="px-2">Thông tin cá nhân</a></li>
                    <li className={pathname === "/user/account/password" ? "text-blue" : ""}><a href="/user/account/password" className="px-2">Đổi mật khẩu</a></li>
                </ul>
                </details>
            </li>
            <li className={pathname === "/user/purchase" ? "text-blue" : pathname === `/user/purchase/order/${params.id}` ? "text-blue" : pathname === `/user/purchase/cancellation/${params.id}` ? "text-blue" : ""}>
                <a href="/user/purchase" className="font-bold px-0"><ClipboardRegular width={24} height={24} className={`${pathname === "/user/purchase" ? "text-blue" : "text-darkgrey"}`} />Đơn hàng</a>
            </li>
            </ul>
        </aside>
    )
}