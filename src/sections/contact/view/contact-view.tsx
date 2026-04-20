'use client'
import React, { useState } from "react";
import Image from "next/image";

export default function ContactView() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert("Cảm ơn bạn đã liên hệ! Nhóm sẽ phản hồi sớm nhất.");
            setFormData({ name: "", email: "", message: "" });
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl">
                {/* Header Text (Gọn gàng hơn) */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Liên Hệ Với Chúng Tôi
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Bạn có ý tưởng hoặc cần hỗ trợ về hệ thống <span className="font-semibold text-gray-800 dark:text-gray-200">Smart POS & F&B</span>? Hãy để lại lời nhắn cho nhóm nhé.
                    </p>
                </div>

                {/* Main Split-Card Container */}
                <div className="bg-white dark:bg-[#111] border-none rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-200 dark:border-gray-800">
                    
                    {/* Nửa Trái: Information (Nền tối, có họa tiết trang trí) */}
                    <div className="relative w-full lg:w-2/5 bg-darkgrey text-white p-10 md:p-14 overflow-hidden flex flex-col justify-between">
                        {/* Họa tiết vòng tròn mờ trang trí góc */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="mb-12">
                                <Image src='/logo.png' alt='Smart POS Logo' width={60} height={60} className="mb-8" />
                                <h3 className="text-3xl font-bold mb-2">Thông tin liên hệ</h3>
                                <p className="text-white">Đội ngũ phát triển sẽ phản hồi bạn trong vòng 24 giờ.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="flex-shrink-0 p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">Địa điểm</p>
                                        <p className="text-lg font-medium">Thủ Đức, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="flex-shrink-0 p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">Email</p>
                                        <p className="text-lg font-medium">contact@smartpos.vn</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links phía dưới */}
                        <div className="relative z-10 mt-16 pt-8 border-t border-white/20 flex gap-4">
                            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" className="w-5 h-5">
                                    <path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Nửa Phải: Form (Nền sáng/trong suốt, Input tối giản) */}
                    <div className="w-full lg:w-3/5 p-10 md:p-14">
                        <form onSubmit={handleSubmit} className="h-full flex flex-col justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Tên của bạn</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-darkgrey/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:bg-white dark:focus:bg-transparent transition-all"
                                        placeholder="Vũ Thái Bình Dương"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-darkgrey/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:bg-white dark:focus:bg-transparent transition-all"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 mb-10 flex-grow">
                                <label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Lời nhắn</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full h-full min-h-[150px] px-5 py-4 bg-gray-50 dark:bg-darkgrey/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:bg-white dark:focus:bg-transparent transition-all resize-none"
                                    placeholder="Nói cho chúng mình biết ý tưởng của bạn..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-bold text-white bg-darkgrey hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] ${isSubmitting ? 'opacity-70' : 'hover:-translate-y-0.5'}`}
                            >
                                {isSubmitting ? (
                                    'Đang xử lý...'
                                ) : (
                                    <>
                                        <span>Gửi Lời Nhắn</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}