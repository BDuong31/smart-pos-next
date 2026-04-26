'use client';

import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getMe } from "@/store/slices/userSlice";
import { fetchCartByUserId } from "@/store/slices/cartSlice";

import UserRegula from "../icons/user";
import CartRegular from "../icons/cart";
import ClipboardRegular from "../icons/clipboard";
import LogoutRegular from "../icons/logout";
import { LogIn, UserPlus } from "lucide-react";

const Header = () => {
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.user.user);
    const cart = useSelector((state: RootState) => state.cart.cart);

    useEffect(() => {
        if (!user) {
            dispatch(getMe());
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartByUserId(user.id));
        }
    }, [user?.id, dispatch]);

    return (
        <div className="navbar bg-fawhite rounded-3xl py-4 m-auto max-w-[95%] lg:max-w-[90%] xl:max-w-[90%] 2xl:max-w-[1450px] 3xl:max-w-[1500px]">

            {/* LEFT */}
            <div className="navbar-start hidden lg:flex ml-5">
                <Link href='/' className="flex items-center gap-2">
                    <Image src="/logo.png" width={25} height={32} alt="logo"/>
                    <h1 className='text-xl font-bold text-darkgrey'>Baso Corner</h1>
                </Link>
            </div>

            {/* MOBILE MENU */}
            <div className="navbar-start lg:hidden">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        ☰
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[10] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href="/">Trang Chủ</Link></li>
                        <li><Link href="/menu">Thực Đơn</Link></li>
                        <li><Link href="/booking">Đặt bàn</Link></li>
                        <li><Link href="/contact">Liên Hệ</Link></li>
                        <li><Link href="/about">Về Chúng Tôi</Link></li>
                    </ul>
                </div>
            </div>

            {/* CENTER */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href="/">Trang Chủ</Link></li>
                    <li><Link href="/menu">Thực Đơn</Link></li>
                    <li><Link href="/booking">Đặt bàn</Link></li>
                    <li><Link href="/contact">Liên Hệ</Link></li>
                    <li><Link href="/about">Về Chúng Tôi</Link></li>
                </ul>
            </div>

            {/* MOBILE LOGO */}
            <div className="navbar-center lg:hidden">
                <Link href='/'><Image src="/logo.png" width={25} height={32} alt="logo"/></Link>
            </div>

            {/* RIGHT */}
            <div className="navbar-end mr-5 flex items-center gap-3">

                {/* CART */}
                <Link href="/cart" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <CartRegular />
                        {cart && cart?.totalItem > 0 && (
                            <span className="badge badge-sm indicator-item">
                                {cart.totalItem}
                            </span>
                        )}
                    </div>
                </Link>

                {/* USER DROPDOWN */}
                <div className="dropdown dropdown-end">

                    {/* TRIGGER */}
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-8 rounded-full flex items-center justify-center overflow-hidden">
                            {user ? (
                                <Image
                                    src={user?.avatar?.url ?? '/default-avatar.jpg'}
                                    alt="avatar"
                                    width={32}
                                    height={32}
                                />
                            ) : (
                                <UserRegula width={24} height={24} />
                            )}
                        </div>
                    </label>

                    {/* MENU */}
                    <ul tabIndex={0} className="menu dropdown-content mt-2 z-[10] p-2 shadow bg-base-100 rounded-box w-[10rem]">

                        {user ? (
                            <>
                                <li>
                                    <Link href="/user/account/profile">
                                        <UserRegula width={20} height={20}/> Trang cá nhân
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/user/purchase">
                                        <ClipboardRegular width={20} height={20}/> Đơn mua
                                    </Link>
                                </li>
                                <li>
                                    <button>
                                        <LogoutRegular /> Đăng xuất
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login">
                                        <LogIn size={18}/> Đăng nhập
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register">
                                        <UserPlus size={18}/> Đăng ký
                                    </Link>
                                </li>
                            </>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;