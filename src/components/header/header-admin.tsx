'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// Icons
import UserRegula from "@/components/icons/user";
import ChevronDown from "../icons/chevron-down";
import SettingRegular from "../icons/settings";
import LogoutRegular from "../icons/logout";

// Redux
import { RootState } from "@/store/store";

const HeaderAdmin = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);
    
    // State quản lý đóng mở dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Ref để kiểm tra xem người dùng có click ra ngoài dropdown không
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hàm toggle
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Logic: Click ra ngoài thì đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-white">
            <div className="navbar justify-end px-6 h-20">
                <div className="flex items-center gap-4">
                    
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            type="button"
                            className={`btn btn-outline flex items-center gap-2 transition-all duration-200 ${
                                isDropdownOpen ? 'bg-gray-100' : ''
                            }`}
                            onClick={toggleDropdown}
                        >
                            <span className="font-medium">
                                {user?.fullName || "Loading..."}
                            </span>
                            
                            <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-300 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`} 
                            />
                        </button>

                        {isDropdownOpen && (
                            <ul className="absolute right-0 mt-2 w-56 p-2 bg-white rounded-xl shadow-xl z-[100] animate-in fade-in zoom-in duration-200">
                                <li className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Tài khoản
                                </li>
                                <li>
                                    <Link 
                                        href="/profile" 
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <UserRegula width={20} height={20} className="text-gray-600" />
                                        <span>Trang cá nhân</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/settings" 
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <SettingRegular />
                                        <span>Cài đặt</span>
                                    </Link>
                                </li>
                                
                                <div className="my-1 border-t border-gray-100" />
                                
                                <li>
                                    <Link 
                                        href="/logout" 
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <LogoutRegular />
                                        <span className="font-medium">Đăng xuất</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}

export default HeaderAdmin;