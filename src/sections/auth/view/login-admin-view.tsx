'use client';
import ArrowForward from "@/components/icons/arrow-forward";
import { DebouncedInput } from "@/components/input";
// import { useAuth } from "@/context/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";import Image from "next/image";
import React from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { FaGooglePlus } from "react-icons/fa6";
import { SiGoogle } from "react-icons/si";
import { loginSchema } from "../data";
import {introspect, login } from "@/apis/auth";
import EyeRegular from "@/components/icons/eye";
import EyeOffRegular from "@/components/icons/eye-off";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/loading/splash-sceen";

export default function LoginAdminView() {
    // const { setToken } = useAuth()
    const router = useRouter()
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [usernameError, setUsernameError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [isShowPassword, setIsShowPassword] = React.useState(false)
    const [check, setCheck] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheck(e.target.checked);
    }

    const Login = async () => {
        setLoading(true);
        setUsernameError('');
        setPasswordError('');

        const result = loginSchema.safeParse({ username, password});
        if (!result.success){
            result.error.issues.forEach((err) => {
                if(err.path.includes('username')){
                    setUsernameError(err.message)
                }
                if(err.path.includes('password')){
                    setPasswordError(err.message)
                }
            });
            setLoading(false)
            return
        }

        try {
            const data = await login({
                username,
                password
            })

            const dataIntrospect = {
                token: data.accessToken
            }

            const introspectCheck = await introspect(dataIntrospect)

            console.log("role: ", introspectCheck.role);
            if (introspectCheck.role ==='admin') {

                dispatch(setToken(data.accessToken));
                router.push('/')
            } else {
                setPasswordError('Vui lòng sử dụng tài khoản Admin để đăng nhập')
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message){
                setPasswordError(err.response.data.message);
            } else {
                setPasswordError('Đã có lỗi xảy ra, Vui lòng thử lại sau');
            }
        }
    }

    if (loading) {
        return <SplashScreen className='h-[100vh]'/>
    }
    return (
        <div className="h-[100vh] flex flex-row justify-center items-center">
            <div className="w-[50%] h-[100vh]" style={{backgroundImage: 'url(http://localhost:3000/bgadmin.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
                <Image src="/logo.png" alt="Logo" width={75} height={25} className="mx-auto mt-10"/>
            </div>
            <div className="w-[35%] mx-auto rounded-lg justify-items-center">
                <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
                <div>
                    <div className="flex flex-col gap-[0.875rem] mb-[1.5rem]">
                        <DebouncedInput
                            type="text"
                            name="username"
                            placeholder={"Tên người dùng hoặc email"}
                            value={username}
                            className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(value: string) => setUsername(value)}
                        />
                        {usernameError && <p className="text-[#FF0000] text-sm">{usernameError}</p>}
                        <div className="relative">
                            <DebouncedInput
                                type={isShowPassword ? "text" : "password"}
                                name="password"
                                placeholder={"Password"}
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
                            type="button"
                            onClick={Login}
                            className="w-full flex items-center justify-between px-4 py-3 bg-darkgrey text-white rounded-lg transition-colors uppercase"
                        >
                            Đăng nhập
                            <ArrowForward className="stroke-[#F8F8F8]"/>
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
                </div>
            </div>
        </div>
    )
}