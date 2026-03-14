// src/app/admin/(main)/users/[id]/page.tsx

"use client"; // BẮT BUỘC: Vì đây là trang tương tác

import React, { useState, useEffect, useRef } from 'react'; // Thêm useRef
import { useParams, useRouter, notFound } from 'next/navigation'; // Import useParams và router
import { Mail, Phone, MapPin, Shield, Ban, Save } from 'lucide-react';
import Image from 'next/image';
import { IUserProfile } from '@/interfaces/user';
import { getUserById, getUserList } from '@/apis/user';
import { getAddressByCond, getAddresses } from '@/apis/address';
import { IAddress } from '@/interfaces/address';

type Props = {
  id: string;
};
type UserStatus = 'Active' | 'Banned' | 'Pending' | 'Inactive';
type UserRole = 'Admin' | 'Customer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string; 
  avatarUrl: string;
  phone: string;
  address: string;
}
// --- COMPONENT TRANG CHÍNH ---
export default function UserProfilePage({ id }: Props) {
    const router = useRouter();

  // State để lưu data
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [loading, setLoading] = useState(true);

  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(''); // URL để xem trước
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref để trỏ tới input file

  const fetcherUserById = async (userId: string) => {
    setLoading(true);
    try {
      const response = await getUserById(userId);
      setUser(response?.data || null);
      setAvatarPreview(response?.data?.avatar || ''); // Khởi tạo avatar preview
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetcherAddressByUserId = async (userId: string) => {
    setLoading(true);
    try {
      const response = await getAddressByCond(userId, true);
      setAddress(response?.data[0] || null);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // 1. Lấy data bằng useEffect
  useEffect(() => {
    fetcherUserById(id);
  }, [id]);

  useEffect(() => {
    if (user) {
      fetcherAddressByUserId(user.id);
    }
  }, [user]);

  // 2. Hàm xử lý thay đổi form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => (prev ? { ...prev, [name]: value } : null));
  };
  
  // 3. Hàm xử lý Cập nhật (Lưu)
  const handleUpdateProfile = async () => {
    // TODO:
    // 1. Nếu `newAvatarFile` tồn tại, upload file đó lên (Vercel Blob, S3...)
    // 2. Lấy URL mới trả về.
    // 3. Cập nhật `user.avatarUrl` bằng URL mới.
    // 4. Gửi toàn bộ object `user` lên API server.

    if (newAvatarFile) {
      console.log("Đang 'upload' file mới:", newAvatarFile.name);
      // Giả lập: const newUrl = await uploadFile(newAvatarFile);
      // setUser(prev => ({...prev!, avatarUrl: newUrl}));
    }
    
    console.log("Đang cập nhật user:", user);
    alert("Cập nhật thông tin thành công!");
    router.push('/users'); // Quay về trang danh sách
  };
  
  // 4. HÀM MỚI: Xử lý khi chọn file avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file); // Lưu file lại để upload
      setAvatarPreview(URL.createObjectURL(file)); // Tạo URL xem trước
    }
  };

  // (Hàm handleToggleStatus đã bị xóa, thay bằng select)

  // Trạng thái Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return notFound(); // Nếu user null sau khi loading
  }

  // 4. Giao diện (JSX)
  return (
    <div className="flex flex-col gap-6 p-6">

      {/* 1. Header (Title & Breadcrumbs) */}
      <div>
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-base-content/70 text-sm">Home &gt; Users &gt; {user.fullName}</p>
      </div>

      {/* 2. Grid Nội dung */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CỘT BÊN TRÁI (Thông tin & Actions) */}
        <div className="lg:col-span-1 space-y-6 h-full">
          <div className="card bg-base-100 shadow-sm h-full">
            <div className="card-body justify-between items-center text-center">
              
              {/* Avatar (ĐÃ SỬA) */}
              <div className="flex flex-col items-center">
                <div 
                  className="avatar mb-4 cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()} // Click vào avatar để mở file input
                  title="Click to change avatar"
                >
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image 
                        src={avatarPreview || '/default-avatar.jpg'} // Hiển thị ảnh xem trước
                        alt={user.fullName} 
                        width={128} 
                        height={128} 
                    />
                    </div>
                </div>
                {/* Input file ẩn */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
                
                <div className='flex flex-col items-center'>
                    <h2 className="card-title">{user.fullName}</h2>
                    <p className="text-base-content/70">{user.email}</p>
                    <p className="text-sm text-base-content/60">
                        Joined: {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </p>
                </div>  
              </div>
              
              <div className="w-full mt-6 space-y-4">
                <div className="form-control w-full">
                  <label className="label"><span className="label-text">Change Role</span></label>
                  <select 
                    name="role"
                    className="select select-bordered" 
                    value={user.role} 
                    onChange={handleFormChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {/* THAY ĐỔI: Dùng dropdown cho Status */}
                <div className="form-control w-full">
                  <label className="label"><span className="label-text">Change Status</span></label>
                  <select 
                    name="status"
                    className="select select-bordered" 
                    value={user.status} 
                    onChange={handleFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Banned">Banned</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
              </div>
              
            </div>
          </div>
        </div>

        {/* CỘT BÊN PHẢI (Thông tin chi tiết) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Profile Information</h2>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                
                {/* Full Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Full Name</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={user.fullName} 
                    onChange={handleFormChange}
                    className="input input-bordered"
                  />
                </div>
                
                {/* Email */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Email Address</span></label>
                  <input 
                    type="email" 
                    name="email"
                    value={user.email}
                    onChange={handleFormChange}
                    className="input input-bordered"
                  />
                </div>

                {/* Phone */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Phone Number</span></label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={user.phone}
                    placeholder='enter your phone'
                    onChange={handleFormChange}
                    className="input input-bordered"
                  />
                </div>

                {/* Address */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Address</span></label>
                  <input 
                    type="text" 
                    name="address"
                    value={address ? `${address.streetAdress}, ${address.cityProvince}` : ''}
                    onChange={handleFormChange}
                    className="input input-bordered"
                    placeholder='enter your address'
                    readOnly
                  />
                </div>
                
                {/* Nút Save */}
                <div className="card-actions justify-end pt-4">
                  <button type="button" className="btn btn-ghost" onClick={() => router.push('/users')}>Cancel</button>
                  <button type="submit" className="btn btn-neutral">
                    <Save size={18} />
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}