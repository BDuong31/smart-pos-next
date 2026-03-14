// src/context/toast-context.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// 1. Import `createPortal` từ 'react-dom'
import { createPortal } from 'react-dom';

// Định nghĩa các loại toast
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được dùng bên trong ToastProvider');
  }
  return context;
};

const getAlertType = (type: ToastType) => {
  switch (type) {
    case 'success': return 'bg-[#D1FAE5] text-[#065F46]';
    case 'error': return 'bg-[#FEE2E2] text-[#B91C1C]';
    case 'warning': return 'bg-[#FEF3C7] text-[#92400E]';
    default: return 'bg-[#DBEAFE] text-[#1E40AF]';
  }
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message: string, type: ToastType) => {
    // const id = crypto.randomUUID(); // Sử dụng khi web có bảo mật HTTPS
    const id = Math.random().toString(36).substring(2, 9); // Sử dụng phương pháp thay thế cho môi trường không HTTPS
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const toastContainer = (
    <div className="toast fixed right-4 z-[9999]" style={{ bottom: "1rem"}}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`alert ${getAlertType(toast.type)} shadow-lg mb-4`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {isMounted && document.body ? 
        createPortal(toastContainer, document.body) : 
        null
      }
    </ToastContext.Provider>
  );
};