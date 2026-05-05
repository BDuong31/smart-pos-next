'use client'
import Image from "next/image"
import ClipboardRegular from "@/components/icons/clipboard"
import PenRegular from "@/components/icons/pen"
import UserRegula from "@/components/icons/user"
import React from "react"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export default function SideRight() {
    const user = useSelector((state: RootState) => state.user.user);
    const pathname = usePathname();

    return (
        <aside className="w-full lg:w-64">
            <div className="flex lg:flex-row flex-col items-center lg:items-start gap-4 mb-8">
                <div className="w-12 h-12 flex-shrink-0">
                    <Image 
                        src={user?.avatar?.url || "/default-avatar.jpg"} 
                        alt="avatar" 
                        width={48} 
                        height={48} 
                        className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                </div>
                <div className="text-center lg:text-left">
                    <div className="font-bold truncate max-w-[200px]">{user?.fullName}</div>
                    <div className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer flex items-center justify-center lg:justify-start gap-1">
                        <PenRegular />
                        <p>Sửa thông tin</p>
                    </div>
                </div>
            </div>

            {/* NAVIGATION: Giữ nguyên màu sắc và cấu trúc dropdown */}
            <ul className="menu p-0 w-full flex flex-col gap-1">
                <li className="w-full">
                    {/* details sẽ tự 'open' nếu đang ở trong các trang tài khoản */}
                    <details 
                        open={pathname.includes("/user/account")} 
                        className="group w-full"
                    >
                        <summary className="font-bold px-0 flex items-center gap-2 cursor-pointer list-none after:content-none focus:bg-transparent active:bg-transparent">
                            <UserRegula 
                                width={24} 
                                height={24} 
                                className={`${pathname.includes("/user/account") ? "text-blue" : "text-darkgrey"}`} 
                            /> 
                            <span>Tài khoản của tôi</span>
                            {/* Mũi tên nhỏ giúp user mobile nhận diện dropdown */}
                            <span className="lg:hidden text-[10px] transition-transform duration-300 group-open:rotate-180">
                                ▼
                            </span>
                        </summary>

                        <ul className="before:hidden ml-8 lg:ml-6 space-y-1 border-l-2 border-gray-100 lg:border-none mt-2">
                            <li className={pathname === "/user/account/profile" ? "text-blue" : ""}>
                                <a href="/user/account/profile" className="px-2 py-2 block text-sm hover:text-blue transition-colors">
                                    Thông tin cá nhân
                                </a>
                            </li>
                            <li className={pathname === "/user/account/password" ? "text-blue" : ""}>
                                <a href="/user/account/password" className="px-2 py-2 block text-sm hover:text-blue transition-colors">
                                    Đổi mật khẩu
                                </a>
                            </li>
                        </ul>
                    </details>
                </li>

                <li className={pathname.includes("/user/purchase") ? "text-blue" : ""}>
                    <a href="/user/purchase" className="font-bold px-0 flex items-center gap-2 py-3 lg:py-2">
                        <ClipboardRegular 
                            width={24} 
                            height={24} 
                            className={`${pathname.includes("/user/purchase") ? "text-blue" : "text-darkgrey"}`} 
                        />
                        <span>Đơn hàng</span>
                    </a>
                </li>
            </ul>
        </aside>
    )
}