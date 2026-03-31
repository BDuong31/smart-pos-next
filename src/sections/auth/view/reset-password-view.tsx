'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/apis/auth';
import { DebouncedInput } from '@/components/input';
import EyeRegular from '@/components/icons/eye';
import EyeOffRegular from '@/components/icons/eye-off';

export default function ResetPasswordView() {
    const router = useRouter();

    const [session, setSession] = React.useState<any>(null);
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isShowPassword, setIsShowPassword] = React.useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const stored = sessionStorage.getItem('tokenResetPassword');
        if (stored) {
            setSession(JSON.parse(stored));
        } else {
            router.push('/forgot-password');
        }
    }, []);

    

    // ======================
    // UI: RESET PASSWORD
    // ======================
    const handleResetPassword = async () => {
        setLoading(true);
        try {
            const resetToken = session.sessionId;
            await resetPassword(resetToken, password, confirmPassword);

            sessionStorage.removeItem('tokenResetPassword');

            router.push('/login');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-[400px] flex flex-col gap-4">
                <h1 className="text-xl font-bold">Đặt lại mật khẩu</h1>

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

                <div className="relative">
                    <DebouncedInput
                        type={isShowConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder={"Xác nhận mật khẩu"}
                        value={confirmPassword}
                        className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(value: string) => setConfirmPassword(value)}
                    />
                    <div
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                    >
                        {isShowConfirmPassword ? <EyeRegular/> : <EyeOffRegular/>}
                    </div>
                </div>

                <button
                    onClick={handleResetPassword}
                    className="btn btn-primary bg-darkgrey text-white rounded-lg"
                    disabled={loading}
                >
                    Đổi mật khẩu
                </button>
            </div>
        </div>
    );
}