import { io, Socket } from 'socket.io-client';

// Đặt URL trỏ tới backend NestJS của bạn (ví dụ: http://localhost:8000)
const SOCKET_URL = process.env.NEXT_PUBLIC_HOST_API || 'http://localhost:5001';

// Khởi tạo socket nhưng tắt autoConnect để ta có thể truyền query vào sau
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  // Nếu có lỗi CORS từ NestJS, đôi khi cần cấu hình thêm transports
  transports: ['websocket', 'polling'] 
});