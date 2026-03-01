import { useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';
import { connectSocket, disconnectSocket } from '../lib/socket';

/**
 * Manages the Socket.IO connection lifecycle based on auth state.
 * Mount this once near the top of your component tree (e.g. in App.tsx).
 */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}
