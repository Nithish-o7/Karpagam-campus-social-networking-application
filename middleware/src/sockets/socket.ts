import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_ORIGIN as string,
      ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Join personal room for notifications
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`👤 Socket ${socket.id} joined room user-${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Helper to emit to a specific user
export const emitToUser = (userId: number, event: string, data: any) => {
  if (io) {
    io.to(`user-${userId}`).emit(event, data);
  }
};

// Helper to broadcast to everyone
export const broadcast = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};
