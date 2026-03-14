"use client"; // BẮT BUỘC: Để sử dụng hook usePathname

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package,         
  ClipboardList,
  Wallet,
  Ship,
  Truck,
  LayoutDashboardIcon,
  AlbumIcon,
  Album,
  Folder,
  FolderTree,
  Grip,
  Boxes,
  Briefcase,
  Layers,  
} from 'lucide-react';
import React from 'react'; // Import React
import DashboadRegular from '@/components/icons/dashboard';
import AlbumsRegular from '@/components/icons/albums';
import DocumentTextRegular from '@/components/icons/document-text';
import UserRegula from '@/components/icons/user';
import LogoutRegular from '@/components/icons/logout';
import VoucherRegular from '@/components/icons/voucher';
import { MdCategory } from 'react-icons/md';
import { SiBrandfolder } from 'react-icons/si';
import { Tabs } from '@mui/material';


export default function SideRightAdmin() {
  const pathname = usePathname();

  const isCategoryActive = pathname?.startsWith('/admin/categories');

  return (
    <aside className="min-h-screen bg-white border-gray flex flex-col" style={{width: '20rem', borderRightWidth: '1px'}}>
      
      <div className="h-20 flex items-center justify-center">
        <Link href="/">
            <Image 
              src="https://baso.id.vn/basoblack.png"
              alt="Admin Logo"
              width={128}
              height={32}
              className="h-8 w-auto"
            />
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="menu text-[14px] font-medium gap-2">
          <li>
            <Link 
              href="/" 
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/' ? 'bg-blue text-white' : ''}`}
            >
              <DashboadRegular 
                className={`
                  w-6 h-6
                  group-hover:stroke-white
                  ${pathname === '/' ? 'fill-[#FFFFFF]' : ''}`}
                width={24}
                height={24}
              />
              BẢNG ĐIỀU KHIỂN
            </Link>
          </li>
          
          <li>
            <Link 
              href="/products"
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/products' ? 'bg-blue text-white' : ''}
              `}
            >
              <AlbumsRegular 
                className={`
                  w-6 h-6
                group-hover:stroke-white
                  ${pathname === '/products' ? 'fill-none stroke-white' : 'fill-none stroke-[#1F1F1F]'}
                `}
              />
              THỰC ĐƠN
            </Link>
          </li>

          <li>
            <Link 
              href="/categories"
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/categories' ? 'bg-blue text-white' : ''}`}
            >
              <Boxes              
                className={`
                  w-6 h-6
                  group-hover:stroke-white
                  ${pathname === '/categories' ? 'stroke-white' : 'stroke-[#1F1F1F]'}`} 
              />
              DANH MỤC
            </Link>
          </li>

          <li>
            <Link
              href="/brands"
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/brands' ? 'bg-blue text-white' : ''}`}
            >
              <Layers 
                className={`
                  w-6 h-6
                  group-hover:stroke-white
                  ${pathname === '/brands' ? 'stroke-white' : 'stroke-[#1F1F1F]'}`} 
              />
              NHÀ CUNG CẤP
            </Link>
          </li>
          
          <li>
            <Link 
              href="/orders"
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/orders' ? 'bg-blue text-white' : ''}`}
            >
              <DocumentTextRegular 
                className={`
                  w-6 h-6
                  group-hover:stroke-white
                  ${pathname === '/orders' ? 'fill-white stroke-white' : 'fill-[#1F1F1F] stroke-[#1F1F1F]'}`} 
                width={24}
                height={24}
              />
              ĐƠN HÀNG
            </Link>
          </li>
          
          <li>
            <Link 
              href="/users"
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/users' ? 'bg-blue text-white' : ''}`}
            >
              <UserRegula 
                className={`
                  w-6 h-6
                  group-hover:stroke-white
                  ${pathname === '/users' ? 'fill-white stroke-white' : 'fill-[#1F1F1F] stroke-[#1F1F1F]'}
                `}
                width={24}
                height={24}
              />  
              NGƯỜI DÙNG
            </Link>
          </li>
        
          <li>
            <Link 
              href="/vouchers"
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/vouchers' ? 'bg-blue text-white' : ''}`}
            >
              <VoucherRegular className={`
                w-6 h-6
                group-hover:stroke-white
                ${pathname === '/nfts' ? 'stroke-white' : 'stroke-[#1F1F1F]'}`} />
              KHUYẾN MÃI
            </Link>
          </li>

          {/* <li>
            <Link 
              href="/nfts"
              className={`
                hover:bg-darkgrey group hover:text-white
                ${pathname === '/nfts' ? 'bg-blue text-white' : ''}`}
            >
              <Wallet className={`
                w-6 h-6
                group-hover:stroke-white
                ${pathname === '/nfts' ? 'stroke-white' : 'stroke-[#1F1F1F]'}`} />
              NFTs LIST
            </Link>
          </li> */}
        </ul>
      </nav>
      
      <div className="p-4">
        <button className="btn btn-ghost justify-center w-full">
          <LogoutRegular /> LOGOUT 
        </button>
      </div>
    </aside>
  );
}