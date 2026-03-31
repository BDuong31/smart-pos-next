"use client";
import React, { useState, useEffect, useRef } from 'react'; // Thêm useRef
import { useParams, useRouter, notFound } from 'next/navigation'; // Import useParams và router
import { Mail, Phone, MapPin, Shield, Ban, Save, Plus } from 'lucide-react';
import Image from 'next/image';
import { IUserProfile, IUserProfileDetail } from '@/interfaces/user';
import { getUserId } from '@/apis/user';
import { SplashScreen } from '@/components/loading';
import { IPointHistoryCreate } from '@/interfaces/point-history';
import { createPointHistory } from '@/apis/loyalty';
import { useToast } from '@/context/toast-context';
type Props = {
  id: string;
};


export default function UserProfilePage({ id }: Props) {
    const router = useRouter();
    const { showToast } = useToast();

    const [user, setUser] = useState<IUserProfileDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(''); // URL để xem trước
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref để trỏ tới input file

    const [newPoint, setNewPoint] = useState<IPointHistoryCreate>({
      userId: '',
      amount: 0,
      reason: '',
    });

    const fetcherUserById = async (userId: string) => {
        setLoading(true);
        try {
            const response = await getUserId(userId);
            setUser(response?.data || null);
            setAvatarPreview(response?.data?.avatar.url || ''); // Khởi tạo avatar preview
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 1. Lấy data bằng useEffect
    useEffect(() => {
        fetcherUserById(id);
    }, [id]);

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

    const handleAddPoint = async () => {
      try {
        setLoading(true)
        const response = await createPointHistory(newPoint);
        if (response) {
          showToast("Thêm điểm thành công!", "success");
          (document.getElementById('add-point-modal') as HTMLDialogElement)?.close();
          fetcherUserById(id);
        }
      } catch (error) {
        console.error("Lỗi khi thêm điểm:", error);
        showToast("Lỗi khi thêm điểm", "error");
      } finally {
        setLoading(false);
      }
    }

    // Trạng thái Loading
    if (loading) {
        return <SplashScreen className='h-[100vh]'/>
    }

    if (!user) {
    return notFound(); // Nếu user null sau khi loading
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">Chi tiết nhân viên</h1>
                <p className="text-base-content/70 text-sm">Trang chủ &gt; Nhân viên &gt; {user.fullName}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6 h-full">
                    <div className="card bg-base-100 shadow-sm h-full">
                        <div className="card-body justify-between items-center text-center">
                            <div className="flex flex-col items-center w-full">
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
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='flex gap-2'>
                                        <span className='text-sm text-base-content/60'>Tên đăng nhập:</span>
                                        <h2 className="card-title font-bold">{user.username}</h2>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span className='text-sm text-base-content/60'>Tên đầy đủ:</span>
                                        <h2 className="card-title font-bold">{user.fullName}</h2>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span className='text-sm text-base-content/60'>Email:</span>
                                        <h2 className="card-title font-bold">{user.email}</h2>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span className='text-sm text-base-content/60'>Ngày sinh:</span>
                                        <h2 className="card-title font-bold">
                                            {new Date(user.birthday).toLocaleDateString('vi-VN')}
                                        </h2>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span className='text-sm text-base-content/60'>Hạng:</span>
                                        <h2 className="card-title font-bold">
                                            {user.rank ? user.rank.name : 'Chưa có hạng'}
                                        </h2>
                                        <span className="text-sm text-base-content/60">Điểm hiện tại:</span>
                                        <h2 className="card-title font-bold">
                                          {user.currentPoints}
                                        </h2>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span className='text-sm text-base-content/60'>Trạng thái:</span>
                                        <h2 className="card-title font-bold">
                                            {user.status === 'active' ? 'Hoạt động' : user.status === 'inactive' ? 'Không hoạt động' : user.status === 'banned' ? 'Bị cấm' : 'Chưa kích hoạt'}
                                        </h2>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span className='text-sm text-base-content/60'>Ngày tham gia:</span>
                                        <h2 className="card-title font-bold">
                                            {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6 h-full">
                    <div className="card bg-base-100 shadow-sm h-full">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Thông tin chi tiết</h2>
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                                {/* Tên đầy đủ */}
                                <div className="flex items-center gap-4">
                                    <label className="w-28 shrink-0 text-sm font-medium text-gray-700">
                                        Tên đầy đủ
                                    </label>
                                    <input 
                                        type="text"
                                        name="name"
                                        value={user.fullName}
                                        onChange={handleFormChange}
                                        className="input input-bordered rounded-lg flex-1 w-full"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-4">
                                    <label className="w-28 shrink-0 text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleFormChange}
                                        className="input input-bordered rounded-lg flex-1 w-full"
                                    />
                                </div>

                                {/* Ngày sinh */}
                                <div className="flex items-center gap-4">
                                    <label className="w-28 shrink-0 text-sm font-medium text-gray-700">
                                        Ngày sinh
                                    </label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={new Date(user.birthday).toISOString().split('T')[0]}
                                        onChange={handleFormChange}
                                        className="input input-bordered rounded-lg flex-1 w-full"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="w-28 shrink-0 text-sm font-medium text-gray-700">Trạng thái</label>
                                    <select
                                        name="status"
                                        className="select select-bordered rounded-lg flex-1 w-full"
                                        value={user.status}
                                        onChange={handleFormChange}
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="banned">Bị cấm</option>
                                        <option value="pending">Chưa kích hoạt</option>
                                        <option value="inactive">Không hoạt động</option>
                                    </select>
                                </div>
                                {/* Nút Save */}
                                <div className="card-actions justify-end pt-4">
                                    <button type="button" className="btn btn-ghost mr-2" onClick={() => router.push('/users')}>
                                        Huỷ
                                    </button>
                                    <button type="button" className="btn btn-ghost bg-blue text-white px-2 mr-2" onClick={() => {
                                      setNewPoint({
                                        userId: id,
                                        amount: 0,
                                        reason: '',
                                      });
                                      (document.getElementById('add-point-modal') as HTMLDialogElement)?.showModal();
                                    }}>
                                        <Plus size={18} />
                                        Tặng điểm thưởng
                                    </button>
                                    <button type="submit" className="btn btn-neutral text-white bg-darkgrey px-2">
                                        <Save size={18} />
                                        Cập nhật
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <dialog id='add-point-modal' className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-3">Tặng điểm thưởng</h3>

                <div className="flex flex-col gap-2">
                  <div className="form-control flex flex-row w-full">
                    <label className="label w-20">
                      <span className="label-text">Số điểm</span>
                    </label>
                    <input type="number" className="input input-bordered rounded-lg w-full" value={newPoint.amount} onChange={(e) => setNewPoint({ ...newPoint, amount: Number(e.target.value) })} placeholder='e.g. , 10000' />
                  </div>
                  <div className="form-control flex flex-row w-full">
                    <label className="label w-20">
                      <span className="label-text">Lý do</span>
                    </label>
                    <input type="text" className="input input-bordered rounded-lg w-full" value={newPoint.reason} onChange={(e) => setNewPoint({ ...newPoint, reason: e.target.value })} placeholder='e.g. , Mua hàng' />
                  </div>
                </div>

                <div className="modal-action">
                  <button className="btn btn-ghost mr-2" onClick={() => (document.getElementById('add-point-modal') as HTMLDialogElement)?.close()}>
                    Huỷ
                  </button>
                  <button className="btn btn-primary bg-darkgrey text-white px-2" onClick={() => {handleAddPoint}}>
                    Tặng điểm
                  </button>
                </div>
              </div>
            </dialog>
        </div>
    );
}