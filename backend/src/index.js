import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
export const app = express();
const server = http.createServer(app);

// Setup Socket.io
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

export const prisma = new PrismaClient();

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

for (const directory of ['vehicle-images', 'profile-images', 'organization-logos', 'chat-images']) {
  app.use(`/uploads/${directory}`, express.static(path.join(__dirname, `../uploads/${directory}`)));
}

import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

import orgRoutes from './routes/orgRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_chat', (chatId) => {
    if (chatId) {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
    }
  });

  socket.on('leave_chat', (chatId) => {
    if (chatId) {
      socket.leave(chatId);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EasyGo API is running smoothly' });
});

const PORT = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

server.on('error', (err) => {
  if ((err.code === 'EACCES' || err.code === 'EADDRINUSE') && PORT === 5000) {
    console.log(`Port 5000 unavailable (${err.code}). Trying fallback port 5001...`);
    startServer(5001);
  } else {
    console.error('Server listen error:', err);
  }
});

startServer(PORT);
