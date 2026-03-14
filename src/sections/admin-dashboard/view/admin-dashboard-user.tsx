// src/app/(admin)/admin/users/page.tsx

"use client"; // BẮT BUỘC: Vì chúng ta cần useState cho phân trang

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react'; // Import hooks
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; // Import icons
import { IUserProfile } from '@/interfaces/user';
import { getListUser, getUserList } from '@/apis/user';
import { useRouter } from 'next/navigation';

// --- Dữ liệu mẫu (Giả lập 30 người dùng) ---
const mockUsers = [
  { id: 1, name: 'Bessie Cooper', email: 'bessie.cooper@example.com', role: 'Admin', status: 'Active', joined: 'Jan 8th, 2022', img: '/baso.jpg' },
  { id: 2, name: 'Jaxson Korsgaard', email: 'jaxson.k@example.com', role: 'Customer', status: 'Active', joined: 'Jan 7th, 2022', img: '/baso.jpg' },
  { id: 3, name: 'Talan Botosh', email: 'talan.botosh@example.com', role: 'Customer', status: 'Banned', joined: 'Jan 6th, 2022', img: '/baso.jpg' },
  { id: 4, name: 'Leo Gouse', email: 'leo.gouse@example.com', role: 'Customer', status: 'Active', joined: 'Jan 5th, 2022', img: '/baso.jpg' },
  // Thêm 26 user nữa để test phân trang
  ...Array.from({ length: 26 }, (_, i) => ({
    id: i + 5,
    name: `User ${i + 5}`,
    email: `user${i + 5}@example.com`,
    role: 'Customer',
    status: i % 4 === 0 ? 'Banned' : 'Active',
    joined: `Dec ${20 - i}th, 2021`,
    img: `/baso.jpg`
  }))
];

// --- Component nhỏ cho Status Badge ---
type BadgeType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

function Badge({ text, type }: { text: string; type: BadgeType }) {
  const colorMap: Record<BadgeType, string> = {
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info',
    neutral: 'badge-neutral',
  };
  return <span className={`badge badge-sm ${colorMap[type]} text-white`}>{text}</span>;
}


const ITEMS_PER_PAGE = 6;

const getPaginationRange = (currentPage, totalPages) => {
    const range = [];
    const maxVisiblePages = 7;
    if (totalPages <= maxVisiblePages) { for (let i = 1; i <= totalPages; i++) { range.push(i); } return range; }
    range.push(1);
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    if (startPage > 2) range.push('...');
    else if (startPage === 2 && totalPages > 3) range.push(2);
    for (let i = startPage; i <= endPage; i++) { if (!range.includes(i)) range.push(i); }
    if (endPage < totalPages - 1) range.push('...');
    else if (endPage === totalPages - 1 && totalPages > 3) range.push(totalPages - 1);
    if (!range.includes(totalPages)) range.push(totalPages);
    let finalRange = [];
    for (let i = 0; i < range.length; i++) { if (range[i] === '...' && i > 0 && i < range.length - 1 && range[i-1] + 1 === range[i+1]) { continue; } finalRange.push(range[i]); }
    return finalRange;
};
// --- KẾT THÚC LOGIC PHÂN TRANG ---


export default function UsersView() {
  const router = useRouter();
  const [usersList, setUsersList] = useState<IUserProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fecherUsers = async () => {
    try {
      const response = await getListUser();
      setUsersList(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  React.useEffect(() => {
    fecherUsers();
  }, []);
  
  const filteredUsers = useMemo(() => {
    return usersList.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, usersList]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / ITEMS_PER_PAGE); 
  }, [filteredUsers]);

  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex); 
  }, [currentPage, filteredUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Quan trọng: Reset về trang 1 khi gõ tìm kiếm
  };

  // Các hàm xử lý
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-[90vh]">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-base-content/70 text-sm">Home &gt; Users</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <label className="input input-bordered bg-transparent flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              className="grow border-none" 
              placeholder="Search by name or email" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search size={16} className="opacity-50" />
          </label>
          
          {/* Nút Add New User */}
          <Link href="/users/new" className="btn btn-neutral">
            <Plus size={18} />
            ADD NEW USER
          </Link>
        </div>
      </div>

      {/* 2. Bảng Users */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body h-[65vh]">
          <div className="overflow-x-auto">
            <table className="table">
              {/* Head */}
              <thead className="text-base-content/70">
                <tr>
                  <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover" onClick={() => router.push(`/users/${user.id}`)}>
                    <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10 rounded-full">
                              <Image src={user.avatar === null ? '/default-avatar.jpg' : user.avatar} alt={user.fullName} width={40} height={40} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.fullName}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Badge 
                          text={user.role} 
                          type={user.role === 'admin' ? 'info' : 'neutral'} 
                        />
                      </td>
                      <td>
                        <Badge 
                          text={user.status} 
                          type={user.status === 'active' ? 'success' : 'error'} 
                        />
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-circle btn-sm">
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-ghost btn-circle btn-sm text-error">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* 3. Pagination (Code JSX từ file của bạn) */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-0">
              
              {/* Nút PREVIOUS */}
              <button 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"
              >
                  <GrFormPrevious size={18} /> PREVIOUS
              </button>
              
              {/* Các Nút Trang và Dấu Ba Chấm */}
              {pageNumbers.map((item, index) => (
                  <React.Fragment key={index}>
                      {item === '...' ? (
                          <span className="px-3 py-2 text-gray-700">...</span>
                      ) : (
                          <button
                              onClick={() => goToPage(item as number)}
                              className={`px-4 py-2 rounded-xl font-semibold transition border ${
                                  currentPage === item 
                                      ? 'bg-black text-white border-black bg-neutral-950' 
                                      : 'text-black border-gray-300 hover:bg-gray-100'
                              }`}
                          >
                              {item}
                          </button>
                      )}
                  </React.Fragment>
              ))}

              {/* Nút NEXT */}
              <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"
              >
                  NEXT <GrFormNext size={18} />
              </button>
          </div>
      )}
    </div>
  );
}