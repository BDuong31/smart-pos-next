'use client';
import { register } from "@/apis/auth";
import ArrowForward from "@/components/icons/arrow-forward";
import EyeRegular, { EyeBold } from "@/components/icons/eye";
import EyeOffRegular from "@/components/icons/eye-off";
import { DebouncedInput } from "@/components/input";
import { setToken } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import React from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { registerSchema } from "../data/schema";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/loading/splash-sceen";
import { useDispatch, useSelector } from "react-redux";

export default function RegisterView() {
        const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [username, setUsername] = React.useState('');
    const [usernameError, setUsernameError] = React.useState('');
    const [fullName, setFullName] = React.useState(''); 
    const [fullNameError, setFullNameError] = React.useState('');
    const [birthday, setBirthday] = React.useState(new Date());
    const [birthdayError, setBirthdayError] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const [isShowPassword, setIsShowPassword] = React.useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('handleRegister called');
        e.preventDefault();
        setLoading(true);
        setUsernameError('');
        setFullNameError('');
        setEmailError('');
        setBirthdayError('');
        setPasswordError('');

        const result = registerSchema.safeParse({ username, fullName, email, password, birthday });
        if(!result.success) {
            result.error.issues.forEach((error) => {
                if (error.path.includes('username')) {
                    setUsernameError(error.message);
                }
                if (error.path.includes('fullName')) {
                    setFullNameError(error.message);
                }
                if (error.path.includes('email')) {
                    setEmailError(error.message);
                }
                if (error.path.includes('password')) {
                    setPasswordError(error.message);
                }
                if (error.path.includes('birthday')) {
                    setBirthdayError(error.message);
                }
            });
            setLoading(false);
            return;
        }
        
        try {
            console.log('Registering user with data:', { username, fullName, email, password, birthday });
            const userData = await register({
                username,
                fullName,
                email,
                password,
                birthday,
            });

            console.log('Registration successful:', userData);

            if (userData){
                sessionStorage.setItem('tokenVerifyAccount', JSON.stringify({
                    sessionId: userData.token.sessionId,
                    expiry: userData.token.expiry
                }));
                router.push('/verify-account');
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setPasswordError(err.response.data.message);
            } else {
                setPasswordError('Đã có lỗi xảy ra, vui lòng thử lại sau');
            }
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => { 
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (loading) {
        return <SplashScreen className="h-[80vh]" />
    }

    return (
        <div className="flex gap-12 justify-center m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%]">
            <div className="w-[40%] p-8 rounded-lg justify-items-center">
                <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
                
                <form onSubmit={handleRegister}>
                    <div>
                        <div className='flex justify-center mt-6 gap-14'>
                            <button type="button" className="py-4 px-12 rounded-lg transition-colors border border-darkgrey">
                                <FaGoogle size={32} color="#4285F4" />
                            </button>
                            <button type="button" className="py-4 px-12 rounded-lg transition-colors border border-darkgrey">
                                <FaApple size={32}/>
                            </button>
                            <button type="button" className="py-4 px-12 rounded-lg transition-colors border border-darkgrey">
                                <FaFacebook size={32} color="#4285F4" />
                            </button>
                        </div>
                        <h2 className="my-4 text-center">Hoặc</h2>
                        <div className="flex flex-col gap-[0.875rem] mb-[1.5rem]">
                            <h1 className="text-lg font-semibold">Họ và tên</h1>
                            <DebouncedInput
                                type="text"
                                name="fullName"
                                placeholder={"Họ và tên"}
                                value={fullName}
                                className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(value: string) => setFullName(value)}
                            />
                            {fullNameError && <p className="text-[#FF0000] text-sm">{fullNameError}</p>}

                            <h1 className="text-lg font-semibold">Ngày sinh</h1>
                            <DebouncedInput
                                type="date"
                                name="birthday"
                                placeholder={"Ngày sinh"}
                                value={birthday.toISOString().split('T')[0]} // Format ngày sinh thành YYYY-MM-DD
                                className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(value: string) => setBirthday(new Date(value))}
                            />
                            {birthdayError && <p className="text-[#FF0000] text-sm">{birthdayError}</p>}
                        </div>
                        <div className="divider" />
                        <div className="flex flex-col gap-[0.875rem] mb-[1.5rem]">
                            <h1 className="text-lg font-semibold">Thông tin đăng nhập</h1>
                            <DebouncedInput
                                type="text"
                                name="username"
                                placeholder={"Tên đăng nhập"}
                                value={username}
                                className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(value: string) => setUsername(value)}
                            />
                            {usernameError && <p className="text-[#FF0000] text-sm">{usernameError}</p>}
                            <DebouncedInput
                                type="text"
                                name="email"
                                placeholder={"Email"}
                                value={email}
                                className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(value: string) => setEmail(value)}
                            />
                            {emailError && <p className="text-[#FF0000] text-sm">{emailError}</p>}

                            <div className="relative">
                                <DebouncedInput
                                    type={isShowPassword ? "text" : "password"}
                                    name="password"
                                    placeholder={"Mật khẩu"}
                                    value={password}
                                    className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(value: string) => setPassword(value)}
                                />
                                <div
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                >
                                    {isShowPassword ? <EyeRegular/> : <EyeOffRegular/>}
                                </div>
                            </div>
                            {passwordError && <p className="text-[#FF0000] text-sm">{passwordError}</p>}
                        </div>
                        <div className="max-w-md py-3 mb-3">
                            <li key='terms' className={`flex items-center pb-1`}>
                                <input id="terms-check" type="checkbox" name="terms" className="checkbox checkbox-sm" required />
                                <label htmlFor="terms-check" className="ml-3 font-medium capitalize">Bằng cách nhấp vào 'Đăng ký', bạn đồng ý với Điều khoản và Điều kiện sử dụng trang web Baso Corner, Thông báo về quyền riêng tư của Baso và Điều khoản & Điều kiện sử dụng.</label>
                            </li>
                            <li key='keep-logged' className={`flex items-center pb-1`}>
                                <input id="keep-logged-check" type="checkbox" name="keep-logged" className="checkbox checkbox-sm"/>
                                <label htmlFor="keep-logged-check" className="ml-3 font-medium capitalize">Giữ tôi đăng nhập - áp dụng cho tất cả các tùy chọn đăng nhập dưới đây. Tìm hiểu thêm</label>
                            </li>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-between px-4 py-3 bg-darkgrey text-white rounded-lg hover:bg-gray-700 transition-colors uppercase disabled:opacity-70"
                            >
                                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                                {loading ? <span className="loading loading-spinner"></span> : <ArrowForward className="stroke-[#F8F8F8]" />}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}