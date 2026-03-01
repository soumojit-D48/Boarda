import { io, Socket } from 'socket.io-client';

// Server base URL (without /api/v1 — Socket.IO connects to the root)
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true, // send cookies during handshake
  autoConnect: false, // connect only when the user is authenticated
});

export function connectSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
