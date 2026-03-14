'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

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
export default function NotFound() {
  const [logoPositions, setLogoPositions] = React.useState<LogoPosition[]>([]);
  const NUMBER_OF_LOGOS = 10;
  const MIN_DISTANCE = 20;
  const MAX_ATTEMPTS_PER_LOGO = 50;

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
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent p-6">
      {}
      {/* <Image
        src="/logo.png" 
        alt=""
        width={100}
        height={100}
        className="absolute left-10 top-10 z-0 rotate-12 opacity-20"
      />
      <Image
        src="/logo.png"
        alt=""
        width={80}
        height={80}
        className="absolute right-1/4 top-1/2 z-0 -rotate-6 opacity-20"
      />
      <Image
        src="/logo.png"
        alt=""
        width={120}
        height={120}
        className="absolute bottom-1/4 left-1/3 z-0 rotate-45 opacity-20"
      />
      <Image
        src="/logo.png"
        alt=""
        width={90}
        height={90}
        className="absolute bottom-1/4 right-1/4 z-0 -rotate-12 opacity-20"
      /> */}
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

      <main className="z-10 flex flex-col items-center text-center gap-5">        
        <Image
          src="/404.png"
          alt="404"
          width={400}
          height={400}
          className="h-auto w-96 md:w-[500px]"
        />
        <p className="max-w-sm text-lg text-base-content/80 md:text-xl">
          The page cannot be found. The requested URL was not found on this
          server.
        </p>

        <Link href="/" className="btn btn-neutral">
          BACK TO HOME
        </Link>
      </main>
    </div>
  );
}