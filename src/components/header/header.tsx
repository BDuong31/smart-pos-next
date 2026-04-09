'use client';

import Link from "next/link";
import Image from "next/image";
import UserRegula from "../icons/user";
import CartRegular from "../icons/cart";
import SearchRegular, { SearchBold } from "../icons/search";
import React, { useEffect } from "react";
// import SearchPopup from "../search/search-popup";
// import { useUserProfile } from "@/context/user-context";
import ClipboardRegular from "../icons/clipboard";
// import { useAuth } from "@/context/auth-context";
import LogoutRegular from "../icons/logout";
import { LogIn, LogInIcon, UserPlus } from "lucide-react";
import { FaRegistered } from "react-icons/fa";
import { cn } from "@/lib";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getMe } from "@/store/slices/userSlice";
import { fetchCartByUserId } from "@/store/slices/cartSlice";
// import { ICategory } from "@/interfaces/category";
// import { getCategories } from "@/apis/category";
// import { useCart } from "@/context/cart-context";
const Header = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const cart = useSelector((state: RootState) => state.cart.cart);

    // const { setToken, isAuthenticated } = useAuth();
    // const [category, setCategory] = React.useState<ICategory[]>([]);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    
    // const fetcherCategory = async () => {
    //     try {
    //         const response = await getCategories()
    //         setCategory(response.data);
    //     } catch (error) {
    //         console.error('Error fetching categories:', error);
    //     }
    // }

    // React.useEffect(() => {
    //     fetcherCategory();
    // }, []);

    useEffect(() => {
        if (!user) {
            dispatch(getMe());
        } 
    }, [dispatch, user]);

    useEffect(() => {
        if (!cart) {
            dispatch(fetchCartByUserId(user?.id || '')); 
        }
    }, [user?.id, dispatch]);
    
    console.log('user', user);
    console.log('cart', cart);
    
    const toggleDropdown = () => {
        console.log('toggle dropdown');
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <>
            <div className={`navbar bg-fawhite rounded-3xl py-4 m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%]`}>
                <div className="navbar-start hidden lg:flex ml-5">
                    <Link href='/'><Image src="/logo.png" width={25} height={32} alt="baso logo"/></Link>
                    <h1 className='text-xl font-bold text-darkgrey ml-2'>Baso Corner</h1>
                </div>
                <div className="navbar-start lg:hidden">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[10] p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="text-darkgrey text-base font-bold"><a href="/">Trang Chủ</a></li>
                            <li className="text-darkgrey text-base font-bold"><a href="/menu">Thực Đơn</a></li>
                            <li className="text-darkgrey text-base font-bold"><a href="/booking">Đặt bàn</a></li>
                            <li className="text-darkgrey text-base font-bold"><a href="/contact">Liên Hệ</a></li>
                            <li className="text-darkgrey text-base font-bold"><a href="/about">Về Chúng Tôi</a></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li className="text-darkgrey text-base font-bold"><a href="/">Trang Chủ</a></li>
                     
                        <li className="text-darkgrey text-base font-bold"><a href="/menu">Thực Đơn</a></li>
                        <li className="text-darkgrey text-base font-bold"><a href="/booking">Đặt bàn</a></li>
                        <li className="text-darkgrey text-base font-bold"><a href="/contact">Liên Hệ</a></li>
                        <li className="text-darkgrey text-base font-bold"><a href="/about">Về Chúng Tôi</a></li>
                    </ul>
                </div>
                <div className="navbar-center lg:hidden">
                    <Link href='/'><Image src="/logo.png" width={25} height={32} alt="baso logo"/></Link>
                </div>
                <div className="navbar-end mr-5">
                    <div className="flex items-center gap-3">
                        <div className="dropdown dropdown-end">
                            {/* <SearchPopup /> */}
                        </div>
                        <div className="dropdown dropdown-end">
                        <Link href={'/cart'} tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                            <CartRegular/>
                            {cart && cart.totalItem > 0 &&
                                <span className="badge badge-sm indicator-item">{cart?.totalItem}</span>
                            }
                            </div>
                        </Link>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                {user ? (
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        onClick={toggleDropdown}
                                    >
                                        <Image
                                            src={
                                                user.avatar !== null ? `${user.avatar.url}` : '/default-avatar.jpg'  
                                            }
                                            alt="avatar"
                                            height={32}
                                            width={32}
                                            className="rounded-full w-8 h-8"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        onClick={toggleDropdown}
                                    >
                                        <UserRegula width={24} height={24} />
                                    </div>
                                )}
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 mt-2 shadow w-[9rem]"
                            >
                                {user ? (
                                    <>
                                        <li>
                                            <Link
                                                href={'/user/account/profile'}
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <UserRegula width={24} height={24} /> Trang cá nhân
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/user/purchase'}
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <ClipboardRegular width={24} height={24} /> Đơn mua
                                            </Link>
                                        </li>
                                        <li>
                                            <div
                                                // onClick={() => {
                                                //     setToken(null)
                                                // }}
                                            >
                                                <LogoutRegular /> Đăng xuất
                                            </div>
                                        </li>  
                                    </>
                                ):(
                                    <>
                                        <li>
                                            <Link
                                                href={'/login'}
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <LogIn width={24} height={24} /> Đăng nhập
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/register'}
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <UserPlus width={24} height={24} /> <p>Đăng ký</p>
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;