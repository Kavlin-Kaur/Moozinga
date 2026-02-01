import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

export function useSocket(sessionCode, userId, userName) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!sessionCode || !userId) return;

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
      
      // Join session room
      newSocket.emit('join-session', { code: sessionCode, userId, userName });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-session', { code: sessionCode, userId });
        socketRef.current.disconnect();
      }
    };
  }, [sessionCode, userId, userName]);

  const updateMood = (mood, status) => {
    if (socket && isConnected) {
      socket.emit('update-mood', {
        code: sessionCode,
        userId,
        mood,
        status
      });
    }
  };

  return { socket, isConnected, updateMood };
}
