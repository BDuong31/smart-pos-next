'use client';
import EmailChangeModal from "@/components/email/email-popup";
import EditRegular from "@/components/icons/edit";
import DebounceInput from "@/components/input/debounce-input";
import { SplashScreen } from "@/components/loading";
import { useToast } from "@/context/toast-context";
import { RootState } from "@/store/store";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const RANKS_CONFIG = [
    { name: "Đồng", minPoint: 0, target: 1000, gradient: 'from-[#a77044] to-[#ffaf7b]', shadow: 'shadow-orange-200', icon: '/bronze.png', textColor: 'text-orange-900' },
    { name: "Bạc", minPoint: 1000, target: 5000, gradient: 'from-[#bdc3c7] to-[#2c3e50]', shadow: 'shadow-slate-300', icon: '/silver.png', textColor: 'text-slate-100' },
    { name: "Vàng", minPoint: 5000, target: 15000, gradient: 'from-[#f1c40f] to-[#e67e22]', shadow: 'shadow-yellow-300', icon: '/gold.png', textColor: 'text-yellow-950' },
    { name: "Bạch Kim", minPoint: 15000, target: 50000, gradient: 'from-[#eef2f3] to-[#8e9eab]', shadow: 'shadow-blue-100', icon: '/platinum.png', textColor: 'text-blue-900' },
    { name: "Kim Cương", minPoint: 50000, target: 50000, gradient: 'from-[#00c6ff] via-[#0072ff] to-[#7000ff]', shadow: 'shadow-blue-400', icon: '/diamond.png', textColor: 'text-white' },
];

const STATUS = [
    { name: "Đang hoạt động", value: "active", color: "bg-success" },
    { name: "Không hoạt động", value: "inactive", color: "bg-error" },
    { name: "Tạm khóa", value: "banned", color: "bg-warning" },
    { name: "Chưa kích hoạt", value: "pending", color: "bg-warning" },
]

const ROLES = [
    { name: "Khách hàng", value: "customer", color: "bg-[#000000]" },
    { name: "Phục vụ", value: "staff", color: "bg-[#000000]" },
    { name: "Quản lý", value: "admin", color: "bg-[#000000]" },
    { name: "Bếp", value: "kitchen", color: "bg-[#000000]" },
]

export default function ProfileView() {
    const { showToast } = useToast();
    const user = useSelector((state: RootState) => state.user.user);
    const loadingUser = useSelector((state: RootState) => state.user.isLoading);

    const [fullName, setFullName] = React.useState<string>(user?.fullName ?? '');
    const [email, setEmail] = React.useState<string>(user?.email ?? '');
    const [birthday, setBirthday] = React.useState<string>(() => {
        if (!user?.birthday) return '';
        const date = new Date(user.birthday);
        return date.toLocaleDateString('en-CA');
    });
    const [avatarUrl, setAvatarUrl] = React.useState<string>(user?.avatar?.url ?? '/default-avatar.jpg');
    const [isLoading, setIsLoading] = React.useState(false);

    const currentRankName = user?.rank?.name || "Đồng";
    const currentRankIndex = RANKS_CONFIG.findIndex(r => r.name === currentRankName);
    const rank = RANKS_CONFIG[currentRankIndex] || RANKS_CONFIG[0];
    const nextRank = currentRankIndex < RANKS_CONFIG.length - 1 ? RANKS_CONFIG[currentRankIndex + 1] : null;
    const isMaxRank = !nextRank;
    const pointsToNextRank = nextRank ? nextRank.minPoint - (user?.currentPoints || 0) : 0;
    const progressPercent = isMaxRank ? 100 : Math.min(((user?.currentPoints || 0) / nextRank!.minPoint) * 100, 100);

    const hideEmail = (email: string) => {
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        const namePart = parts[0];
        const domainPart = parts[1];
        const hiddenName = namePart.length <= 2 ? namePart[0] + '*' : namePart[0] + '*'.repeat(namePart.length - 2) + namePart[namePart.length - 1];
        return `${hiddenName}@${domainPart}`;
    }

    React.useEffect(() => {
        setFullName(user?.fullName ?? '');
        setEmail(user?.email ?? '');
        setBirthday(new Date(user?.birthday ?? '').toLocaleDateString('vi-VN'));
        setAvatarUrl(user?.avatar?.url ?? '/default-avatar.jpg');
    }, [user]);

    const openModal = (id: string) => {
        (document.getElementById(id) as HTMLDialogElement)?.showModal();
    };

    const handleEmailChange = (oldEmail: string, newEmail: string) => {
        if (oldEmail !== email) {
            showToast("Email cũ không khớp.", "error");
            return;
        }
        setEmail(newEmail);
        updateProfile();
    }

    const updateProfile = async () => {
        setIsLoading(true);
        setTimeout(() => {
            showToast("Cập nhật thành công!", "success");
            setIsLoading(false);
        }, 800);
    };

    const formatDateToInput = (dateStr: string) => {
        if (!dateStr || !dateStr.includes('/')) return dateStr;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    if (loadingUser) return <SplashScreen className="h-[80vh]" />;

    return (
        <div className="w-full">
            {/* Thêm px-4 và py-6 cho mobile, p-8 cho desktop */}
            <div className="w-full bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
                
                {/* Header Section: Tự động stack trên mobile */}
                <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-8 gap-6">
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold mb-1">Hồ sơ cá nhân</h1>
                        <p className="text-gray-500">Quản lý và bảo vệ tài khoản của bạn</p>
                    </div>

                    <div className={`relative overflow-hidden bg-gradient-to-br ${rank.gradient} ${rank.shadow} px-6 py-4 sm:px-8 sm:py-5 rounded-2xl flex items-center justify-center lg:justify-start gap-4 sm:gap-5 transition-all hover:scale-105 shadow-xl`}>
                        {isMaxRank && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>}
                        <Image src={rank.icon} alt={rank.name} width={45} height={45} className='w-10 h-10 sm:w-12 sm:h-12 object-contain' />
                        <div className="flex flex-col relative z-10 text-left">
                            <span className={`text-[9px] sm:text-[10px] uppercase font-black ${rank.textColor} opacity-70 tracking-widest leading-none`}>Hạng thành viên</span>
                            <span className={`text-lg sm:text-xl font-black ${rank.textColor}`}>{rank.name}</span>
                            <span className={`text-[10px] sm:text-[11px] font-bold ${rank.textColor} mt-1 opacity-90`}>Giảm giá {user?.rank?.discountPercent}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
                    {/* Left Column: Form Info */}
                    <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                        <div className="bg-darkgrey/90 text-white p-6 sm:p-8 rounded-2xl border border-white shadow-sm relative overflow-hidden">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Điểm tích lũy hiện có</p>
                                    <p className="text-3xl sm:text-4xl font-black text-gray-900 leading-none">
                                        {user?.currentPoints?.toLocaleString()} 
                                        <span className="text-xs sm:text-sm font-medium text-gray-400 ml-2">Điểm</span>
                                    </p>
                                </div>
                                <div className="text-left sm:text-right w-full sm:w-auto">
                                    {isMaxRank ? (
                                        <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full uppercase border border-blue-200">Hạng cao nhất</span>
                                    ) : (
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tiếp theo: {nextRank?.name}</p>
                                            <p className="text-[11px] font-bold text-blue-400 italic">Còn {(pointsToNextRank).toLocaleString()} điểm</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full bg-darkgrey rounded-full h-3 sm:h-4 p-1 shadow-inner overflow-hidden">
                                <div className={`h-full rounded-full bg-gradient-to-r ${rank.gradient} transition-all duration-1000 shadow-md`} style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            
                            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-4 font-bold uppercase tracking-tighter">
                                {isMaxRank ? "Cấp bậc cao quý nhất" : `Đã hoàn thành ${Math.floor(progressPercent)}% tiến trình lên ${nextRank?.name}.`}
                            </p>
                        </div>

                        {/* Form Inputs: Tự động xếp chồng dọc trên Mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className="space-y-2 sm:space-y-3 text-left">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                                <DebounceInput
                                    type="text" value={fullName} onChange={(val: string) => setFullName(val)}
                                    className="w-full px-4 py-3 sm:py-3.5 border border-darkgrey rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div className="space-y-2 sm:space-y-3 text-left">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày sinh</label>
                                <DebounceInput
                                    type="date" value={formatDateToInput(birthday)} onChange={(val: string) => setBirthday(val)}
                                    className="w-full px-4 py-3 sm:py-3.5 border border-darkgrey rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div className="text-left">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                <div className="flex gap-2">
                                    <DebounceInput
                                        type="text" value={hideEmail(email)}
                                        onChange={() => {}}
                                        disabled
                                        className="w-full px-4 py-3 sm:py-3.5 border border-darkgrey rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <button
                                        type="button" onClick={() => {openModal("email_modal")}}
                                        className={`w-1/3 px-2 py-2 sm:py-2 rounded-xl bg-darkgrey text-white font-black text-[7.5px] uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3`}
                                    >
                                        Thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="button" disabled={isLoading} onClick={updateProfile}
                            className={`w-full lg:w-auto px-10 py-4 sm:py-5 rounded-xl bg-darkgrey text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3`}
                        >
                            {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                            Lưu thông tin hồ sơ
                        </button>
                    </div>

                    {/* Right Column: Avatar Section - Hiện lên đầu trên Mobile */}
                    <div className="col-span-1 flex flex-col items-center order-1 lg:order-2 pb-6 lg:pb-0 border-b lg:border-none border-gray-100">
                        <div className="relative group">
                            <div className={`absolute -inset-3 bg-gradient-to-r ${rank.gradient} rounded-full blur-xl opacity-80 group-hover:opacity-100 transition duration-1000 animate-pulse`}></div>
                            <div className="relative p-1.5 bg-transparent rounded-full">
                                <div className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden shadow-xl">
                                    <Image src={avatarUrl} alt="avatar" width={200} height={200} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <label className="absolute bottom-4 right-4 bg-transparent rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                    <EditRegular />
                                    <input type="file" className="hidden" accept=".jpeg,.jpg,.png" />
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight truncate max-w-[250px]">{fullName || "Thành viên"}</h3>
                            <div className="mt-3 flex gap-2 justify-center flex-wrap">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[8px] sm:text-[9px] font-black rounded-lg uppercase tracking-widest">
                                    {ROLES.find((r) => r.value === user?.role)?.name}
                                </span>
                                <span className={`px-3 py-1 text-[8px] sm:text-[9px] font-black rounded-lg uppercase tracking-widest text-white ${STATUS.find((s) => s.value === user?.status)?.color}`}>
                                    {STATUS.find((s) => s.value === user?.status)?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EmailChangeModal modalId="email_modal" onEmailChange={handleEmailChange} />
        </div>
    );
}