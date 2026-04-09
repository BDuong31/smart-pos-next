'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { axiosInstance, endpoints } from '@/utils/axios';
import { Construction, RefreshCw, Settings } from 'lucide-react';

interface LogoPosition {
  top: string;
  left: string;
  transform: string;
  opacity: number;
  width: string;
}
interface LogoData {
  top: number;  
  left: number; 
  transform: string;
  opacity: number;
  width: number; 
}
export default function MaintenancePage() {
  const [logoPositions, setLogoPositions] = useState<LogoPosition[]>([]);
  const NUMBER_OF_LOGOS = 20;
  const MIN_DISTANCE = 20;
  const MAX_ATTEMPTS_PER_LOGO = 50;
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  // Tạo dàn logo mờ ở nền (Client-side để tránh lỗi Hydration của Next.js)
  React.useEffect(() => {
      const generatedLogos: LogoData[] = [];
      while (generatedLogos.length < NUMBER_OF_LOGOS) {
        let attempts = 0;
        let foundValidSpot = false;
        while (attempts < MAX_ATTEMPTS_PER_LOGO && !foundValidSpot) {
          attempts++;
          const candidateLogo: LogoData = {
            top: Math.random() * 100,
            left: Math.random() * 100,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: Math.random() * 0.15 + 0.05,
            width: 80 + Math.random() * 40,
          };
          
          let hasCollision = false;
          for (const existingLogo of generatedLogos) {
            const dx = candidateLogo.left - existingLogo.left;
            const dy = candidateLogo.top - existingLogo.top;  
            const distance = Math.sqrt(dx * dx + dy * dy);
  
            if (distance < MIN_DISTANCE) {
              hasCollision = true;
              break;
            }
          }
          if (!hasCollision) {
            generatedLogos.push(candidateLogo);
            foundValidSpot = true;
          }
        }
        if (!foundValidSpot) {
          console.warn(`Không thể đặt logo thứ ${generatedLogos.length + 1}. Dừng lại.`);
          break; 
        }
      }
      
      const finalPositions: LogoPosition[] = generatedLogos.map(logo => ({
        top: `${logo.top}%`,
        left: `${logo.left}%`,
        transform: logo.transform,
        opacity: logo.opacity,
        width: `${logo.width}px`,
      }));
  
      setLogoPositions(finalPositions);
    }, []);

  const handleCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      const res = await axiosInstance.get(endpoints.system.maintenanceStatus);
      if (res?.data && !res.data.enabled) {
        router.push('/');
        router.refresh();
      }
    } catch (e) {
      console.log("Hệ thống vẫn đang nâng cấp...");
    } finally {
      // Thời gian delay nhẹ để trải nghiệm UX bấm nút được mượt mà
      setTimeout(() => setIsChecking(false), 800);
    }
  }, [router]);

  return (
    <div className="relative min-h-screen w-full bg-[#FCFCFD] flex items-center justify-center overflow-hidden px-6 py-12 md:py-20 font-sans selection:bg-[#1D1D35] selection:text-white">
      
      {/* NỀN: Logo mờ như chìm vào giấy (Watermark) */}
      {logoPositions.map((style, index) => (
          <Image
            key={index}
            src="/logo.png" // File logo bạn đã upload
            alt=""
            width={100} // width/height này là để Next.js tối ưu,
            height={100} // kích thước thật sẽ được quyết định bằng 'style'
            className="absolute z-0 transition-all duration-300"
            style={{
              top: style.top,
              left: style.left,
              transform: style.transform,
              opacity: style.opacity,
              width: style.width,
              height: 'auto', // Giữ tỷ lệ ảnh
            }}
            priority={false} // Không ưu tiên tải các ảnh này
          />
      ))}

      <main className="z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12">
        
        {/* === BÊN TRÁI: TYPOGRAPHY & ACTIONS === */}
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
          
          <div className="inline-flex items-center px-5 py-1.5 rounded-full border border-slate-200 bg-white text-[10px] md:text-xs font-bold tracking-widest text-slate-800 uppercase shadow-sm">
            Hệ thống đang nâng cấp
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black text-[#1D1D35] leading-[0.9] tracking-tighter italic">
              HỆ THỐNG
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D35] tracking-tight uppercase">
              Sắp trở lại
            </h2>
          </div>

          <p className="max-w-md text-slate-500 text-base md:text-lg leading-relaxed">
            Chúng tôi đang tháo dỡ các module cũ để lắp đặt những tính năng đột phá. 
            Vui lòng quay lại sau ít phút để trải nghiệm sự khác biệt.
          </p>

          <button 
            onClick={handleCheck}
            disabled={isChecking}
            className="group flex items-center gap-3 bg-[#1D1D35] hover:bg-[#2A2A4A] text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg transition-all shadow-xl shadow-slate-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isChecking ? (
              <RefreshCw className="animate-spin" size={22} />
            ) : (
              <Construction size={22} className="group-hover:rotate-12 transition-transform" />
            )}
            {isChecking ? "ĐANG KIỂM TRA..." : "KIỂM TRA NGAY"}
          </button>

        </div>

        {/* === BÊN PHẢI: CARD MINH HỌA === */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md md:max-w-lg aspect-[4/3] bg-white rounded-[40px] md:rounded-[60px] shadow-soft border border-slate-50 flex items-center justify-center p-8 md:p-12 overflow-hidden animate-float-slow">
            
            {/* Minh họa cái búa chìm ở nền card */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.3]">
                <Image 
                    src="/hammer-outline.png" 
                    alt="" 
                    width={300}
                    height={300}
                    className=" w-full h-full object-contain" 
                />
            </div>

            {/* Icon Settings nổi bật phía góc */}
            <div className="absolute top-6 right-6 md:top-12 md:right-12 w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100">
              <Settings className="text-slate-800 animate-spin-slow w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
            </div>

            {/* Nội dung trung tâm card (Logo chính) */}
            <div className="relative z-10 w-24 h-24 md:w-40 md:h-40 opacity-10">
              <Image src="/logo.png" alt="main-logo" fill className="object-contain" />
            </div>
            
            {/* Điểm nhấn bo góc phía dưới */}
            <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-tl-[40px] md:rounded-tl-[60px]" />
            
          </div>
        </div>

      </main>
    </div>
  );
}