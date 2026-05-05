'use client'; // Bắt buộc vì có sử dụng hook của React

import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket'; // Import file socket.ts bạn đã tạo ở bước trước
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// Định nghĩa kiểu dữ liệu cho Context
interface SocketContextType {
  socket: typeof socket | null;
  isConnected: boolean;
}

// Khởi tạo Context
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Custom hook để các component khác gọi dùng cho tiện
export const useSocket = () => useContext(SocketContext);

// Provider bọc ngoài ứng dụng
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user)
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.io.opts.query = {
      userId: user?.id, 
      role: user?.role,
    };

    socket.connect();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [user]); 

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};