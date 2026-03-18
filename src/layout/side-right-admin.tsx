"use client"; // BẮT BUỘC: Để sử dụng hook usePathname

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
LayoutDashboard,
FolderTree,
UtensilsCrossed,
SlidersHorizontal,
PackageOpen,
Carrot,
Truck,
BookOpen,
Download,
ClipboardCheck,
History,
Map,
Armchair,
Users,
TicketPercent,
Crown,
Star,
UserCog,
ShieldCheck,
Clock,
TrendingUp,
ClipboardList,
BarChart3,
DollarSign,
Activity,
Printer,
Scale,
FileText,
ChevronDown,
ChevronRight,
} from "lucide-react";

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

  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  const toggleMenu = (menuTitle: string) => {
    setOpenMenu((prev) => (prev === menuTitle ? null : menuTitle));
  };
  const menuGroups = [
    {
      title: "",
      items: [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
      ]
    },

    {
      title: "Thực đơn",
      items: [
        { name: "Danh mục", href: "/categories", icon: FolderTree },
        { name: "Món ăn", href: "/products", icon: UtensilsCrossed },
        { name: "Nhóm tùy chọn", href: "/options", icon: SlidersHorizontal },
        { name: "Combo", href: "/combos", icon: PackageOpen },
      ],
    },

    {
      title: "Kho & nguyên liệu",
      items: [
        { name: "Nguyên liệu", href: "/ingredients", icon: Carrot },
        { name: "Nhà cung cấp", href: "/suppliers", icon: Truck },
        { name: "Công thức món", href: "/recipes", icon: BookOpen },
        { name: "Phiếu nhập kho", href: "/stock-in", icon: Download },
        { name: "Kiểm kê kho", href: "/stock-check", icon: ClipboardCheck },
        { name: "Lịch sử điều chỉnh", href: "/stock-history", icon: History },
      ],
    },

    {
      title: "Bàn & khu vực",
      items: [
        { name: "Khu vực", href: "/areas", icon: Map },
        { name: "Bàn", href: "/tables", icon: Armchair },
      ],
    },

    {
      title: "Khách hàng",
      items: [
        { name: "Khách hàng", href: "/customers", icon: Users },
        { name: "Voucher", href: "/vouchers", icon: TicketPercent },
        { name: "Hạng thành viên", href: "/memberships", icon: Crown },
        { name: "Đánh giá", href: "/reviews", icon: Star },
      ],
    },

    {
      title: "Nhân sự",
      items: [
        { name: "Nhân viên", href: "/staff", icon: UserCog },
        { name: "Phân quyền", href: "/roles", icon: ShieldCheck },
        { name: "Ca làm việc", href: "/shifts", icon: Clock },
      ],
    },

    {
      title: "Dự báo",
      items: [
        { name: "Dự báo nhập hàng", href: "/forecast", icon: TrendingUp },
        { name: "Duyệt đề xuất", href: "/purchase-approval", icon: ClipboardList },
      ],
    },

    {
      title: "Báo cáo",
      items: [
        { name: "Doanh thu", href: "/revenue", icon: BarChart3 },
        { name: "Lợi nhuận", href: "/profit", icon: DollarSign },
        { name: "Hiệu suất nhân viên", href: "/staff-performance", icon: Activity },
      ],
    },

    {
      title: "Hệ thống",
      items: [
        { name: "Máy in", href: "/printers", icon: Printer },
        { name: "Quy đổi đơn vị", href: "/unit-conversion", icon: Scale },
        { name: "Nhật ký hệ thống", href: "/system-logs", icon: FileText },
      ],
    },
  ]

  const isCategoryActive = pathname?.startsWith('/admin/categories');

  return (
    <aside
      className="h-screen bg-white border-r flex flex-col"
      style={{ width: "20rem" }}
    >
      {/* LOGO */}
      <div className="h-20 flex items-center justify-center border-b">
        <Link href="/">
          <Image
            src="https://baso.id.vn/basoblack.png"
            alt="logo"
            width={120}
            height={40}
          />
        </Link>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuGroups.map((group, index) => {
          const isOpen = openMenu === group.title;

          if (!group.title) {
            return (
              <ul key={index} className="menu mb-4">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 ${
                          active ? "bg-blue text-white" : ""
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          }

          return (
            <div key={index} className="mb-3">

              {/* GROUP TITLE */}
              <button
                onClick={() => toggleMenu(group.title)}
                className="flex items-center justify-between w-full px-2 py-2 text-sm font-semibold text-gray-500 hover:text-black"
              >
                {group.title}

                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* SUBMENU */}
              {isOpen && (
                <ul className="menu ml-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 ${
                            active ? "bg-blue text-white" : ""
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button className="btn btn-ghost w-full justify-center">
          <LogoutRegular />
          Logout
        </button>
      </div>
    </aside>
  );
}