'use client';

import Link from "next/link";
import Image from "next/image";
import UserRegula from "@/components/icons/user";
import CartRegular from "@/components/icons/cart";
import SearchRegular, { SearchBold } from "../icons/search";
import React, { useState } from "react";
import SearchPopup from "../search/search-popup";
import ChevronDown from "../icons/chevron-down";
import User from "@/components/icons/user";
import SettingRegular from "../icons/settings";
import LogoutRegular from "../icons/logout";
import { useUserProfile } from "@/context/user-context";

const HeaderAdmin = () => {
    const { userProfile } = useUserProfile()
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <header>
            <div className={`navbar bg-white justify-end`}>
                <div className="navbar-end mr-5">
                    <div className="flex items-center gap-3">
                        <div className="dropdown dropdown-end">
                            <div 
                                tabIndex={0} 
                                role="button" 
                                className="btn btn-outline flex items-center gap-2 group"
                                onClick={toggleDropdown} 
                            >
                                {userProfile?.fullName}
                                <ChevronDown className={`transition-transform duration-300 group-hover:stroke-white ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                            {isDropdownOpen && (
                                <ul 
                                tabIndex={0} 
                                className="menu dropdown-content bg-base-100 rounded-box z-[1] w-auto p-2 mt-2 shadow"
                                >
                                <li>
                                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                                    <UserRegula width={24} height={24} />
                                    Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/settings" onClick={() => setIsDropdownOpen(false)}>
                                    <SettingRegular />
                                    Settings
                                    </Link>
                                </li>
                                <li className="border-t border-base-200 mt-2 pt-2">
                                    <Link href="/logout" onClick={() => setIsDropdownOpen(false)}>
                                    <LogoutRegular />
                                    Logout
                                    </Link>
                                </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HeaderAdmin;