// 'use client'
// import EmailChangeModal from "@/components/email/email-popup";
// import ClipboardRegular from "@/components/icons/clipboard";
// import EditRegular from "@/components/icons/edit";
// import HeartRegular from "@/components/icons/heart";
// import PenRegular from "@/components/icons/pen";
// import UserRegula from "@/components/icons/user";
// import VoucherRegular from "@/components/icons/voucher";
// import DebounceInput from "@/components/input/debounce-input";
// import SplashScreen from "@/components/loading/splash-sceen";
// import PhoneChangeModal from "@/components/phone/phone-popup";
// import { useToast } from "@/context/toast-context";
// import { IUserProfile } from "@/interfaces/user";
// import { RootState } from "@/store/store";
// import Image from "next/image";
// import React, { use } from "react";
// import { useSelector } from "react-redux";

// export default function ProfileView() {
//     const { showToast } = useToast();
//     const user = useSelector((state: RootState) => state.user.user);
//     const [fullName, setFullName] = React.useState<string>(user?.fullName ?? '');
//     const [email, setEmail] = React.useState<string>(user?.email ?? '');
//     const [birthday, setBirthday] = React.useState<string>(() => {
//         if (!user?.birthday) return '';
//         const date = new Date(user.birthday);
//         return date.toLocaleDateString('vi-VN');
//     });
//     const [avatarUrl, setAvatarUrl] = React.useState<string>(user?.avatar?.url ?? '/default-avatar.jpg');
//     const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const hideEmail = (email: string) => {
//         const parts = email.split('@');
//         if (parts.length !== 2) return email;
//         const namePart = parts[0];
//         const domainPart = parts[1];
//         const hiddenName = namePart.length <= 2 ? namePart[0] + '*' : namePart[0] + '*'.repeat(namePart.length - 2) + namePart[namePart.length - 1];
//         return `${hiddenName}@${domainPart}`;
//     }

//     const hidePhone = (phone: string) => {
//         if (phone.length < 4) return phone;
//         return '*'.repeat(phone.length - 2) + phone.slice(-2);
//     }

//     const openModal = (id: string) => {
//         (document.getElementById(id) as HTMLDialogElement)?.showModal();
//     };

//     React.useEffect(() => {
//         setFullName(user?.fullName ?? '');
//         setEmail(user?.email ?? '');
//         setBirthday(new Date(user?.birthday ?? '').toLocaleDateString('vi-VN'));
//     }, [user]);

//     const updateProfile = async () => {
//         setIsLoading(true);
//         const updatedProfiles = {
//             fullName,
//             email,
//             birthday,
//         };
//         try {
//             // const response = await updateUserProfile(updatedProfiles, avatarFile);
//             // if (response && response.data) {
//             //     setUserProfile(response.data);
//             // }
//         } catch (error) {
//             console.error('Failed to update profile:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     }
//     const handleEmailChange = (oldEmail: string, newEmail: string) => {
//         if (oldEmail !== email) {
//             showToast("Old email does not match current email.", "error");
//             return;
//         }
//         setEmail(newEmail);
//         updateProfile();
//     }

//     const getRankStyle = (rank: string | undefined = 'Đồng') => {
//         const styles: Record<string, any> = {
//             "Đồng": { label: 'Đồng', shadow: 'shadow-orange-200', gradient: 'bg-gradient-to-br from-[#a77044] to-[#ffaf7b]', icon: '🥉' },
//             "Bạc": { label: 'Bạc', shadow: 'shadow-slate-200', gradient: 'bg-gradient-to-br from-[#bdc3c7] to-[#2c3e50]', icon: '🥈' },
//             "Vàng": { label: 'Vàng', shadow: 'shadow-yellow-200', gradient: 'bg-gradient-to-br from-[#f1c40f] to-[#e67e22]', icon: '🥇' },
//             "Bạch Kim": { label: 'Bạch Kim', shadow: 'shadow-blue-100', gradient: 'bg-gradient-to-br from-[#eef2f3] to-[#8e9eab]', icon: '💎' },
//             "Kim Cương": { label: 'Kim Cương', shadow: 'shadow-blue-400', gradient: 'bg-gradient-to-br from-[#00c6ff] to-[#0072ff] animate-pulse', icon: '👑' },
//         };
//         return styles[rank] || styles["Đồng"];
//     };

//     const rankStyle = getRankStyle(user?.rank.name || "Đồng");

//     // const handlePhoneChange = (oldPhone: string,newPhone: string) => {
//     //     if ( oldPhone !== phone) {
//     //         showToast("Old phone number does not match current phone number.", "error");
//     //         return;
//     //     }
//     //     setPhone(newPhone);
//     //     updateProfile();
//     // }

//     // if (isLoading) {
//     //     return <SplashScreen className="h-[80vh]"/>;
//     // }

//     return (
//         <>
//             <div className="w-full">
//                 <div className="w-full bg-white p-8 rounded-2xl shadow-lg">
//                     <h1 className="text-2xl font-bold mb-1">Thông tin cá nhân</h1>
//                     <p className="text-gray-500 mb-8">Quản lý và bảo vệ tài khoản của bạn</p>

//                     <div className={`${rankStyle.gradient} ${rankStyle.shadow} px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl transform hover:scale-105 transition-transform cursor-default`}>
//                         <span className="text-2xl">{rankStyle.icon}</span>
//                         <div className="flex flex-col">
//                             <span className="text-[10px] uppercase font-bold text-white/80 leading-none">Thành viên</span>
//                             <span className="text-lg font-black text-white italic tracking-wider">{rankStyle.label}</span>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-3 gap-8">
//                         <div className="col-span-2 space-y-6">

//                         <div className="flex items-center">
//                             <label className="w-32 text-gray-500 text-right pr-4" htmlFor="fullName">
//                                 Họ và tên
//                             </label>
//                             <DebounceInput 
//                                 type="text"
//                                 id="fullName"
//                                 name="fullName"
//                                 placeholder="Enter your full name"
//                                 value={fullName}
//                                 onChange={(value: string) => setFullName(value)}
//                                 className="flex-1 px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div className="flex items-center">
//                             <label className="w-32 text-gray-500 text-right pr-4">
//                                 Email
//                             </label>
//                             <span>{hideEmail(email)}</span>
//                             <button 
//                                 type="button"
//                                 onClick={() => openModal("email_modal")} 
//                                 className="link link-primary ml-4"
//                             >
//                                 Thay đổi
//                             </button>
//                         </div>

//                         <div className="flex items-center">
//                             <label className="w-32 text-gray-500 text-right pr-4">
//                                 Ngày sinh
//                             </label>
//                             <input
//                                 type="date"
//                                 value={birthday.split('T')[0]}
//                                 onChange={(e) => setBirthday(e.target.value)}
//                                 className="flex-1 px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>

//                         {/* <div className="flex items-center">
//                             <label className="w-32 text-gray-500 text-right pr-4">
//                                 Phone number
//                             </label>
//                             <span>{hidePhone(phone)}</span>
//                             <button
//                                 type="button"
//                                 onClick={() => openModal("phone_modal")} 
//                                 className="link link-primary ml-4"
//                             >
//                                 Change
//                             </button>
//                         </div> */}

//                         {/* <div className="flex items-center">
//                             <label className="w-32 text-gray-500 text-right pr-4">
//                                 Gender
//                             </label>
//                             <div className="flex space-x-4">
//                                 <label className="label cursor-pointer space-x-1">
//                                     <input id="idx1" type="checkbox" name="category" checked={gender === 'male'} className="h-5 w-5 rounded border-[#232321] bg-transparent checked:bg-[#000000] checked:border-[#000000] checked:text-[#000000] appearance-none" onChange={() => setGender('male')}/>
//                                     <span className="label-text">Male</span>
//                                 </label>
//                                 <label className="label cursor-pointer space-x-1">
//                                     <input id="idx2" type="checkbox" name="category" checked={gender === 'female'} className="h-5 w-5 rounded border-[#232321] bg-transparent checked:bg-[#000000] checked:border-[#000000] checked:text-[#000000] appearance-none" onChange={() => setGender('female')}/>
//                                     <span className="label-text">Female</span>
//                                 </label>
//                                 <label className="label cursor-pointer space-x-1">
//                                     <input id="idx3" type="checkbox" name="category" checked={gender === 'other'} className="h-5 w-5 rounded border-[#232321] bg-transparent checked:bg-[#000000] checked:border-[#000000] checked:text-[#000000] appearance-none" onChange={() => setGender('other')}/>
//                                     <span className="label-text">Other</span>
//                                 </label>
//                             </div>
//                         </div> */}

//                         <div className="justify-self-center">
//                             <div className="w-32"></div>
//                             <button type="button" className="btn btn-neutral bg-darkgrey text-white px-2" onClick={updateProfile}>
//                                 Lưu thay đổi
//                             </button>
//                         </div>

//                         </div>

//                         <div className="col-span-1 flex flex-col items-center pt-8">
                            
//                             <div className="mb-4">
//                                 <div className="rounded-full w-[100px] h-[100px] bg-gray-200 flex items-center justify-center">
//                                     <Image src={avatarUrl} alt="avatar" width={64} height={64} className="w-[100px] h-[100px] rounded-full object-cover"/>
//                                 </div>
//                             </div>

//                             <label className="btn btn-outline btn-sm mb-4">
//                                 Chọn ảnh
//                                 <input 
//                                     type="file" 
//                                     onChange={(e) => {
//                                         const file = e.target.files?.[0];
//                                         if (file) {
//                                             const reader = new FileReader();
//                                             reader.onloadend = () => {
//                                                 setAvatarUrl(reader.result as string);
//                                                 setAvatarFile(file);
//                                             };
//                                             reader.readAsDataURL(file);
//                                         }
//                                     }}
//                                     className="hidden"
//                                     accept=".jpeg,.jpg,.png" 
//                                 />
//                             </label>

//                             <div className="text-center text-sm text-gray-500">
//                                 <p>Dung lượng file: tối đa 1 MB</p>
//                                 <p>Định dạng file: .JPEG, .PNG</p>
//                             </div>
//                             </div>
//                         </div>
//                         </div>
//                 </div>
//                 <EmailChangeModal modalId="email_modal" onEmailChange={handleEmailChange} />
//                 {/* <PhoneChangeModal modalId="phone_modal" onPhoneChange={handlePhoneChange} /> */}
//         </>
//     );
// }

'use client';
import EmailChangeModal from "@/components/email/email-popup";
import EditRegular from "@/components/icons/edit";
import DebounceInput from "@/components/input/debounce-input";
import { useToast } from "@/context/toast-context";
import { RootState } from "@/store/store";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

// 1. Định nghĩa bảng cấu hình hạng (theo thứ tự tăng dần)
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

    // State form
    const [fullName, setFullName] = React.useState<string>(user?.fullName ?? '');
    const [email, setEmail] = React.useState<string>(user?.email ?? '');
    const [birthday, setBirthday] = React.useState<string>(() => {
        if (!user?.birthday) return '';
        const date = new Date(user.birthday);
        console.log("date: ", date)
        console.log("date.toLocaleDateString('en-CA'): ", date.toLocaleDateString('en-CA'))
        console.log("date.toISOString().split('T')[0]: ", date.toISOString().split('T')[0])
        return date.toLocaleDateString('en-CA');
    });
    const [avatarUrl, setAvatarUrl] = React.useState<string>(user?.avatar?.url ?? '/default-avatar.jpg');
    const [isLoading, setIsLoading] = React.useState(false);

    // 2. Logic tự động xác định hạng hiện tại và hạng kế tiếp
    const currentRankName = user?.rank?.name || "Đồng";
    const currentRankIndex = RANKS_CONFIG.findIndex(r => r.name === currentRankName);
    const rank = RANKS_CONFIG[currentRankIndex] || RANKS_CONFIG[0];

    const nextRank = currentRankIndex < RANKS_CONFIG.length - 1 ? RANKS_CONFIG[currentRankIndex + 1] : null;
    const isMaxRank = !nextRank;

    // Tính điểm còn thiếu: Lấy minPoint của hạng sau trừ đi điểm hiện tại
    const pointsToNextRank = nextRank ? nextRank.minPoint - (user?.currentPoints || 0) : 0;
    
    // Tính % progress: (Điểm hiện tại / Điểm cần để lên hạng tiếp theo)
    const progressPercent = isMaxRank ? 100 : Math.min(((user?.currentPoints || 0) / nextRank!.minPoint) * 100, 100);

    const hideEmail = (email: string) => {
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        return `${parts[0][0]}***${parts[0].slice(-1)}@${parts[1]}`;
    };

    const openModal = (id: string) => {
        (document.getElementById(id) as HTMLDialogElement)?.showModal();
    };

    React.useEffect(() => {
        setFullName(user?.fullName ?? '');
        setEmail(user?.email ?? '');
        setBirthday(new Date(user?.birthday ?? '').toLocaleDateString('vi-VN'));
    }, [user]);

    const handleEmailChange = (oldEmail: string, newEmail: string) => {
        if (oldEmail !== email) {
            showToast("Old email does not match current email.", "error");
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

    console.log("ngày sinh: ", birthday)

    return (
        <div className="w-full">
            <div className="w-full bg-white p-8 rounded-2xl shadow-lg">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Hồ sơ cá nhân</h1>
                        <p className="text-gray-500 mb-8">Quản lý và bảo vệ tài khoản của bạn</p>
                    </div>

                    <div className={`relative overflow-hidden bg-gradient-to-br ${rank.gradient} ${rank.shadow} px-8 py-5 rounded-2xl flex items-center gap-5 transition-all hover:scale-105 shadow-xl`}>
                        {isMaxRank && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>}
                        <Image 
                            src={rank.icon}
                            alt={rank.name}
                            width={50}
                            height={50}
                            className='w-12 h-12 object-contain'
                        />
                        <div className="flex flex-col relative z-10">
                            <span className={`text-[10px] uppercase font-black ${rank.textColor} opacity-70 tracking-widest leading-none`}>Hạng thành viên</span>
                            <span className={`text-xl font-black ${rank.textColor}`}>{rank.name}</span>
                            <span className={`text-[11px] font-bold ${rank.textColor} mt-1 opacity-90`}>Giảm giá {user?.rank?.discountPercent}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-darkgrey/90 text-white p-8 rounded-2xl border border-white shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Điểm tích lũy hiện có</p>
                                    <p className="text-4xl font-black text-gray-900 leading-none">
                                        {user?.currentPoints?.toLocaleString()} 
                                        <span className="text-sm font-medium text-gray-400 ml-2">Điểm</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    {isMaxRank ? (
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-4 py-2 rounded-full uppercase border border-blue-200">
                                            Hạng cao nhất
                                        </span>
                                    ) : (
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tiếp theo: {nextRank?.name}</p>
                                            <p className="text-xs font-bold text-blue-600 italic">Còn {(pointsToNextRank).toLocaleString()} điểm</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full bg-darkgrey rounded-full h-4 p-1 shadow-inner overflow-hidden">
                                <div 
                                    className={`h-2 rounded-full bg-gradient-to-r ${rank.gradient} transition-all duration-1000 shadow-md`} 
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            
                            <p className="text-[11px] text-gray-400 mt-4 font-bold uppercase tracking-tighter">
                                {isMaxRank 
                                    ? "Bạn đang sở hữu cấp bậc cao quý nhất của hệ thống." 
                                    : `Bạn đã hoàn thành ${Math.floor(progressPercent)}% tiến trình lên hạng ${nextRank?.name}.`}
                            </p>
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                                <DebounceInput
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Nhập họ và tên"
                                    value={fullName}
                                    onChange={(val: string) => setFullName(val)}
                                    className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    name='birthday'
                                    id='birthday'
                                    placeholder='dd/mm/yyyy'
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button 
                            type="button" 
                            disabled={isLoading}
                            className={`w-full md:w-auto px-12 py-5 rounded-2xl bg-darkgrey text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3`}
                            onClick={updateProfile}
                        >
                            {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                            Lưu thông tin hồ sơ
                        </button>
                    </div>

                    {/* Right Column: Avatar Section */}
                    <div className="col-span-1 flex flex-col items-center pt-8">
                        <div className="relative group">
                            <div className={`absolute -inset-4 bg-gradient-to-r ${rank.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse`}></div>
                            <div className="relative p-2 bg-transparent rounded-full border-none">
                                <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-[6px] border-none">
                                    <Image 
                                        src={avatarUrl} 
                                        alt="avatar" 
                                        width={200} 
                                        height={200} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <label className="absolute bottom-6 right-6">
                                    <EditRegular />
                                    <input type="file" className="hidden" accept=".jpeg,.jpg,.png" />
                                </label>
                            </div>

                        </div>

                        <div className="text-center text-sm text-gray-500">
                            <p>Dung lượng file: tối đa 1 MB</p>
                            <p>Định dạng file: .JPEG, .PNG</p>
                        </div>

                        <div className="mt-10 text-center">
                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{fullName || "Thành viên"}</h3>
                            <div className="mt-4 flex gap-2 justify-center">
                                <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[9px] font-black rounded-lg uppercase tracking-widest">{ROLES.find((role) => role.value === user?.role)?.name}</span>
                                <span className={`px-4 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-widest ${STATUS.find((status) => status.value === user?.status)?.color}`}>{STATUS.find((status) => status.value === user?.status)?.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EmailChangeModal modalId="email_modal" onEmailChange={handleEmailChange} />
        </div>
    );
}