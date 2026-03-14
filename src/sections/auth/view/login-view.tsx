'use client';
import ArrowForward from "@/components/icons/arrow-forward";
import { DebouncedInput } from "@/components/input";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import React from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { SiGoogle } from "react-icons/si";
import { loginSchema } from "../data";
import { login } from "@/apis/auth";
import { useRouter } from "next/navigation"; 
import { Check } from "lucide-react";
import EyeRegular from "@/components/icons/eye";
import EyeOffRegular from "@/components/icons/eye-off";
import { SplashScreen } from "@/components/loading";

export default function LoginView() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [usernameError, setUsernameError] = React.useState('')
    const [passwordError, setPasswordError] = React.useState('')
    const [loading, setLoading] = React.useState(false);
    const [isShowPassword, setIsShowPassword] = React.useState(false)
    const [check, setCheck] = React.useState(false)
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('handleLogin called');
        e.preventDefault();
        setLoading(true);
        setUsernameError('');
        setPasswordError('');

        const result = loginSchema.safeParse({ username, password});
        if(!result.success){
            result.error.issues.forEach((error) => {
                if(error.path.includes('username')){
                    setUsernameError(error.message)
                }
                if(error.path.includes('password')){
                    setPasswordError(error.message)
                }
            });
            setLoading(false);
            return;
        }

        try {
            const data = await login({
                username,
                password
            })

            console.log("data: ", data);
            if (data) {
                dispatch(setToken(data.accessToken));
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message){
                setPasswordError(err.response.data.message);
            } else {
                setPasswordError('Đã có lỗi xảy ra, Vui lòng thử lại sau');
            }
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (isAuthenticated){
            router.push('/')
        }
    }, [isAuthenticated, router])

    if (loading) {
        return <SplashScreen className="h-[80vh]" />
    }
    return (
        <div className="flex gap-12 justify-center m-auto 3xl:max-w-[1500px] 2xl:max-w-362.5 xl:max-w-[90%] lg:max-w-[90%] max-w-[95%]">
            <div className="w-[40%] py-20 rounded-lg justify-items-center">
                <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
                <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-3.5 mb-[1.5rem]">
                        <DebouncedInput
                            type="text"
                            name="username"
                            placeholder={"Tên đăng nhập hoặc email"}
                            value={username}
                            className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(value: string) => setUsername(value)}
                        />
                        {usernameError && <p className="text-[#FF0000] text-sm">{usernameError}</p>}
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
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-between px-4 py-3 bg-darkgrey text-white rounded-lg transition-colors uppercase"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            {loading ? <span className="loading loading-spinner"></span> : <ArrowForward className="stroke-[#F8F8F8]" />}
                        </button>
                    </div>
                    <div className='flex justify-center mt-6 gap-14'>
                        <button 
                            type="button"
                            className="py-4 px-12 rounded-lg transition-colors border border-darkgrey"
                        >
                            <FaGoogle size={32} color="#4285F4" />
                        </button>
                        <button 
                            type="button"
                            className="py-4 px-12 rounded-lg transition-colors border border-darkgrey"
                        >
                            <FaApple size={32}/>
                        </button>
                        <button 
                            type="button"
                            className="py-4 px-12 rounded-lg transition-colors border border-darkgrey"
                        >
                            <FaFacebook size={32} color="#4285F4" />
                        </button>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="idx1" className="font-medium text-graymain capitalize">Bằng cách nhấp vào 'Đăng nhập', bạn đồng ý với Điều khoản và Điều kiện sử dụng trang web Baso Corner, Thông báo về quyền riêng tư của Baso và Điều khoản & Điều kiện sử dụng.</label>
                    </div>
                </form>
            </div>
            {/* <div className="w-[60%] flex flex-col justify-center p-8 mt-8 bg-[#f5f5f5] rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Join  Baso Club Get Rewarded Today.</h1>
                <p className="mb-6">As Baso club member you get rewarded with what you love for doing what you love. Sign up today and receive immediate access to these Level 1 benefits:</p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>Exclusive offers and promotions</li>
                    <li>Early access to new products and releases</li>
                    <li>Invitations to special events</li>
                    <li>Personalized recommendations</li>
                </ul>
                <p className="mb-6">Join Baso Club today and start enjoying the perks of being a valued member of our community!</p>
                <button
                    type="button"
                    className="w-full bg-darkgrey text-white py-3 rounded-lg hover:bg-gray-700 transition-colors uppercase flex items-center justify-center gap-2"
                >
                    Join Now <ArrowForward />
                </button>
            </div> */}
        </div>
    )
}