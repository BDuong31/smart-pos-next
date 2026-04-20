'use client'
import React from "react";
import Image from "next/image";
import { menbers } from "../data";
import ArrowBack from "@/components/icons/arrow-back";
import ArrowUndoRegular from "@/components/icons/arrow-undo";
import ArrowForward from "@/components/icons/arrow-forward";

export default function AboutView() {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const goToPrevious = () => {
        const isFirstMember = currentIndex === 0;
        const newIndex = isFirstMember ? menbers.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastMember = currentIndex === menbers.length - 1;
        const newIndex = isLastMember ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const currentMember = menbers[currentIndex];
    const prevIndex = (currentIndex - 1 + menbers.length) % menbers.length;
    const nextIndex = (currentIndex + 1) % menbers.length;
    const prevMemberRole = menbers[prevIndex].name;
    const nextMemberRole = menbers[nextIndex].name;
    return (
        <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] py-10">
            <div className="flex flex-row max-h-[60vh] gap-3 p-3">
                <div className="w-[40%] flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="w-full h-full flex justify-center items-center p-12">
                        <Image src='/logo.png' alt='Well Shoes Logo' width={266} height={340} />
                    </div>
                </div>

                <div className="w-full h-auto flex flex-col gap-[10px]">
                    <p className="h-[50%] leading-relaxed p-12">
                        Hệ thống quản lý vận hành F&B và Smart POS này được phát triển dưới dạng một đồ án nhóm của sinh viên. Mục tiêu của dự án là khám phá và áp dụng các khái niệm cốt lõi trong việc vận hành dịch vụ ăn uống, thiết kế trải nghiệm người dùng và các chiến lược quản lý kỹ thuật số. Nhóm chúng tôi đã phối hợp cùng nhau để tạo ra một nền tảng đầy đủ chức năng, thân thiện với người dùng, minh chứng cho sự hiểu biết của nhóm về các hệ thống nhà hàng cũng như các khía cạnh kỹ thuật trong việc xây dựng một giải pháp F&B hiện đại. Hệ thống cung cấp tính năng quản lý thực đơn linh hoạt, tích hợp các cổng thanh toán, quy trình xử lý đơn hàng và các công cụ quản lý kho nguyên vật liệu, mang đến một giải pháp toàn diện cho các hoạt động kinh doanh nhà hàng hằng ngày. Dự án này không chỉ thể hiện kỹ năng phát triển phần mềm của chúng tôi mà còn phản ánh khả năng làm việc nhóm và triển khai các giải pháp công nghệ thực tế cho ngành công nghiệp thực phẩm và đồ uống (F&B).
                    </p>
                    <img className="w-full h-[50%] p-12 rounded-[3.5rem] object-cover" src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExanp5aGdwdGRweWpuOGJwMnRheXNpdjJ6dmoxZnE2dDdpYno0cmM4bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif" alt="Our Story" />  
                </div>
            </div>
            <div className="w-full mt-12">
                <h2 className="text-4xl font-bold text-center uppercase tracking-widest mb-16">
                    Thành viên nhóm
                </h2>
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={goToPrevious}
                        className="flex flex-col items-center gap-3 transition-all"
                    >
                        <div className="border border-graymain p-3 rounded-lg">
                            <ArrowBack />
                        </div>
                        <span className="font-bold text-lg uppercase tracking-wider">{prevMemberRole}</span>
                    </button>

                    <div className="relative w-full max-w-3xl p-4 font-sans">
                        <div className="relative pl-8">
                            <div
                            className="absolute -top-[50%] right-8 h-40 bg-darkgrey rounded-xl shadow-lg z-10"
                            >
                                <img src={currentMember.image} alt={currentMember.name} className="w-full h-full object-contain rounded-xl" />
                            </div>

                            <div
                            className="relative bg-transparent border border-graymain rounded-xl mt-16 pt-24 px-8 z-5"
                            >
                                <p className="w-1/2 justify-self-end">{currentMember.description}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={goToNext}
                        className="flex flex-col items-center gap-3 transition-all"
                    >
                        <div className="border border-graymain p-3 rounded-lg">
                            <ArrowForward />
                        </div>
                        <span className="font-bold text-lg uppercase tracking-wider">{nextMemberRole}</span>
                    </button>

                </div>
            </div>
        </div>
    );
}