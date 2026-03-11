'use client';
import React from 'react';

// Xác định các breakpoint dựa trên kích thước
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | undefined;

// Hook để theo dõi breakpoint hiện tại
const useBreakPoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setBreakpoint(identifyBreakpoint(window.innerWidth));
      };

      window.addEventListener('resize', handleResize);

      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { breakpoint };
};

// Hàm để xác định breakpoint dựa trên chiều rộng
export const identifyBreakpoint = (width: number): Breakpoint => {
  if (width >= 768 && width < 1024) {
    return 'md';
  }
  if (width >= 1024 && width < 1280) {
    return 'lg';
  }
  if (width >= 1280 && width < 1440) {
    return 'xl';
  }
  if (width >= 1440 && width < 1600) {
    return '2xl';
  }
  if (width >= 1600) {
    return '3xl';
  }
  return 'sm';
};

// Sử dụng hook trong component
export default useBreakPoint;