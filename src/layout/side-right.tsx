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
export default function SideRight() {
    const pathname = usePathname();
    const params = useParams();
    console.log("Pathname in SideRight:", pathname);
    console.log("Params in SideRight:", params);
    return (
        <aside className="w-64">
            <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12">
                <Image src="/baso.jpg" alt="avatar" width={48} height={48} className="w-12 h-12 rounded-full"/>
            </div>
            <div>
                <div className="font-bold">NickName</div>
                <div className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                    <PenRegular />
                    <p>Edit profile</p>
                </div>
            </div>
            </div>

            <ul className="menu space-y-2 pl-0">
            <li>
                <details open>
                <summary className="font-bold px-0">
                    <UserRegula width={24} height={24} className={`${pathname === "/user/account" ? "text-blue" : "text-darkgrey"}`} /> My Account
                </summary>
                <ul>
                    <li className={pathname === "/user/account/profile" ? "text-blue" : ""}><a href="/user/account/profile" className="px-2">Profile</a></li>
                    <li className={pathname === "/user/account/address" ? "text-blue" : ""}><a href="/user/account/address" className="px-2">Addresses</a></li>
                    <li className={pathname === "/user/account/password" ? "text-blue" : ""}><a href="/user/account/password" className="px-2">Change Password</a></li>
                </ul>
                </details>
            </li>
            <li className={pathname === "/user/purchase" ? "text-blue" : pathname === `/user/purchase/order/${params.id}` ? "text-blue" : pathname === `/user/purchase/cancellation/${params.id}` ? "text-blue" : ""}>
                <a href="/user/purchase" className="font-bold px-0"><ClipboardRegular width={24} height={24} className={`${pathname === "/user/purchase" ? "text-blue" : "text-darkgrey"}`} /> My Purchase</a>
            </li>
            <li className={pathname === "/user/wishlist" ? "text-blue" : ""}>
                <a href="/user/wishlist" className="font-bold px-0"><HeartRegular width={24} height={24} className={`${pathname === "/user/wishlist" ? "text-blue" : "text-darkgrey"}`} /> My Wishlist</a>
            </li>
            <li className={pathname === "/user/vouchers" ? "text-blue" : ""}>
                <a href="/user/vouchers" className="font-bold px-0"><VoucherRegular width={24} height={24} className={`${pathname === "/user/vouchers" ? "text-blue" : "text-darkgrey"}`} /> My Vouchers</a>
            </li>
            {/* <li className={pathname === "/user/nft" ? "text-blue" : ""}>
                <a href="/user/nft" className="font-bold px-0"><Wallet width={24} height={24} className={`${pathname === "/user/nfts" ? "text-blue" : "text-darkgrey"}`} /> My NFTs</a>
            </li> */}
            </ul>
        </aside>
    )
}