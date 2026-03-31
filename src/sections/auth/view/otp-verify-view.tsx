'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { DebouncedInput } from "@/components/input";
import { verifyAccount } from "@/apis/auth";

export default function VerifyAccountView() {
    const router = useRouter();

    const [tokenVerify, setTokenVerify] = React.useState<any>(null);
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = React.useState<number>(0);

    // Load session
    React.useEffect(() => {
        const stored = sessionStorage.getItem('tokenVerifyAccount');

        if (stored) {
            const data = JSON.parse(stored);
            setTokenVerify(data);

            const remaining = data.expiry - Date.now();
            setTimeLeft(remaining > 0 ? remaining : 0);
        }
    }, []);

    // Countdown
    React.useEffect(() => {
        if (!tokenVerify) return;

        const interval = setInterval(() => {
            const diff = tokenVerify.expiry - Date.now();

            if (diff <= 0) {
                clearInterval(interval);
                sessionStorage.removeItem('tokenVerifyAccount');
                setTokenVerify(null);
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [tokenVerify]);

    // Format time
    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // Handle OTP input
    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // auto focus next input
        if (value && index < 5) {
            const next = document.getElementById(`otp-${index + 1}`);
            (next as HTMLInputElement)?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const code = otp.join('');

        console.log("Verify OTP:", {
            sessionId: tokenVerify.sessionId,
            otp: code,
        });

        await verifyAccount(tokenVerify.sessionId, code);

        sessionStorage.removeItem('tokenVerifyAccount');
        router.push('/login');
        
    };

    const handleSendEmail = async () => {
        console.log("Send OTP to email:", email);

        // TODO: call API resend OTP
        // Sau khi nhận response → lưu lại tokenVerify mới
    };

    if (!tokenVerify) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <h1 className="text-2xl font-bold">Xác minh tài khoản</h1>

                <div>
                    <label className="block mb-1 font-bold">Email</label>
                    <DebouncedInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        className="px-4 py-3 border rounded-lg w-[300px]"
                        onChange={(value: string) => setEmail(value)}
                    />
                </div>
                <button
                    onClick={handleSendEmail}
                    className="px-6 py-3 bg-darkgrey text-white rounded-lg"
                >
                    Gửi OTP
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
            <h1 className="text-2xl font-bold">Xác minh tài khoản</h1>

            <p className="text-sm text-gray-500">
                Mã sẽ hết hạn sau: {formatTime(300000)} 
            </p>

            <div>
                <label className="block mb-1 font-bold">Nhập mã OTP</label>
                <div className="flex gap-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            className="w-12 h-12 text-center border rounded-lg text-lg"
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={handleVerifyOtp}
                className="px-6 py-3 bg-darkgrey text-white rounded-lg"
            >
                Xác minh
            </button>
            <div>
                <button
                    onClick={() => {
                        sessionStorage.removeItem('tokenVerify');
                        setTokenVerify(null);
                    }}
                    className="text-sm text-blue-500"
                >
                    Dùng email khác
                </button>
                <button
                    onClick={handleSendEmail}
                    className="text-sm text-blue ml-4"
                >
                    Gửi lại
                </button>
            </div>
        </div>
    );
}