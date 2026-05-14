import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface RealtimeContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🔌 Connected to Socket.io');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket.io');
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && user) {
      console.log('👤 Joining user room:', user.id);
      socket.emit('join-user-room', user.id.toString());

      // Listen for personal notifications
      socket.on('new-notification', (notification: any) => {
        console.log('🔔 New Notification:', notification);
        toast.success(notification.content || 'New activity on your post!', {
          icon: '🔔',
          duration: 4000,
        });
      });

      return () => {
        socket.off('new-notification');
      };
    }
  }, [socket, user]);

  return (
    <RealtimeContext.Provider value={{ socket, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error('useRealtime must be used within a RealtimeProvider');
  return ctx;
};
