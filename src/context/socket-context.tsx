'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SocketContextType {
  socket: typeof socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra nếu không có user thì ngắt kết nối ngay
    if (!user?.id) {
      if (socket.connected) socket.disconnect();
      return;
    }

    // 2. Cập nhật query một cách trực tiếp vào engine của Socket.io
    // Cách này đảm bảo khi socket.connect() chạy, nó mang theo userId và role mới nhất
    socket.io.opts.query = {
      userId: user.id,
      role: user.role,
    };

    // 3. Nếu đang kết nối thì ngắt ra để buộc nó nhận query mới
    if (socket.connected) {
      socket.disconnect();
    }

    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      console.log("Connected to NestJS with Role:", user.role);
    };
    
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [user?.id, user?.role]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};