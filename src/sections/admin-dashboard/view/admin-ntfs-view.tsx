// src/app/(admin)/admin/nfts/page.tsx

"use client"; // BẮT BUỘC: Vì chúng ta cần useState cho phân trang

import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react'; // Import hooks
import { GrFormPrevious, GrFormNext } from "react-icons/gr"; // Import icons

// --- Dữ liệu mẫu (Giả lập 20 NFTs) ---
const mockNfts = [
  { id: 1, name: 'Well Shoes #001', ownerAddress: '0xAbC...dE12f', status: 'Minted', mintDate: 'Jan 8th, 2022', img: '/shoes.jpg', productId: 123 },
  { id: 2, name: 'Well Shoes #002', ownerAddress: '0x123...aB45d', status: 'Minted', mintDate: 'Jan 7th, 2022', img: '/shoes.jpg', productId: 123 },
  { id: 3, name: 'Collab NFT #001', ownerAddress: 'N/A', status: 'Pending', mintDate: 'Jan 6th, 2022', img: '/shoes.jpg', productId: 456 },
  { id: 4, name: 'Well Shoes #003', ownerAddress: '0x789...cE67f', status: 'Burned', mintDate: 'Jan 5th, 2022', img: '/shoes.jpg', productId: 123 },
  // Thêm 16 NFT nữa để test phân trang
  ...Array.from({ length: 16 }, (_, i) => ({
    id: i + 5,
    name: `Digital Asset #${i + 5}`,
    ownerAddress: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 8)}`,
    status: i % 3 === 0 ? 'Pending' : 'Minted',
    mintDate: `Dec ${20 - i}th, 2021`,
    img: `/shoes.jpg`,
    productId: 100 + i
  }))
];

// --- Component nhỏ cho Status Badge (Giữ nguyên) ---
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


// --- LOGIC PHÂN TRANG (Giữ nguyên) ---
const ITEMS_PER_PAGE = 6; // Hiển thị 8 NFT mỗi trang

const getPaginationRange = (currentPage, totalPages) => {
    // (Copy y hệt hàm getPaginationRange từ file trước của bạn vào đây)
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


export default function NftsView() {
  // State cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Lọc và Tính toán phân trang ---
  
  // 1. Lọc theo search term
  const filteredNfts = useMemo(() => {
    return mockNfts.filter(nft =>
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.ownerAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // 2. Tính toán phân trang dựa trên kết quả đã lọc
  const totalPages = useMemo(() => {
    return Math.ceil(filteredNfts.length / ITEMS_PER_PAGE); 
  }, [filteredNfts]);

  const currentNfts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredNfts.slice(startIndex, endIndex); 
  }, [currentPage, filteredNfts]);

  // Reset về trang 1 khi search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Quan trọng: Reset về trang 1 khi gõ tìm kiếm
  };

  // Các hàm xử lý
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);
  // -------------------------

  return (
    <div className="flex flex-col gap-6 p-6 h-[90vh]">
      
      {/* 1. Header (Title, Search, Add New) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">NFT Management</h1>
          <p className="text-base-content/70 text-sm">Home &gt; NFTs</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Nút Tìm kiếm */}
          <label className="input input-bordered bg-transparent flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              className="grow border-none" 
              placeholder="Search by name or owner address" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search size={16} className="opacity-50" />
          </label>
          
          {/* Nút Mint New NFT */}
          <Link href="/admin/nfts/mint" className="btn btn-neutral">
            <Plus size={18} />
            MINT NEW NFT
          </Link>
        </div>
      </div>

      {/* 2. Bảng NFTs */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body h-[65vh]">
          <div className="overflow-x-auto">
            <table className="table">
              {/* Head */}
              <thead className="text-base-content/70">
                <tr>
                  <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                  <th>NFT</th>
                  <th>Owner Address</th>
                  <th>Product ID</th>
                  <th>Status</th>
                  <th>Mint Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Rows - map qua 'currentNfts' */}
                {currentNfts.map((nft) => (
                  <tr key={nft.id} className="hover">
                    <th><input type="checkbox" className="checkbox checkbox-sm" /></th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <Image src={nft.img} alt={nft.name} width={40} height={40} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{nft.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{nft.ownerAddress}</td>
                    <td>
                      <Link href={`/admin/products/edit/${nft.productId}`} className="link link-hover">
                        {nft.productId}
                      </Link>
                    </td>
                    <td>
                      <Badge 
                        text={nft.status} 
                        type={
                          nft.status === 'Minted' ? 'success' : 
                          nft.status === 'Pending' ? 'warning' : 'error'
                        } 
                      />
                    </td>
                    <td>{nft.mintDate}</td>
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

      {/* 3. Pagination (Code JSX giữ nguyên) */}
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