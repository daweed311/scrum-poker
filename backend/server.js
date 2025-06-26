const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./utils/database');
const config = require('./config');
const roomRoutes = require('./routes/rooms');
const setupSocketHandlers = require('./sockets/socketHandler');
const Room = require('./models/Room');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with environment-based CORS
const io = socketIo(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware with environment-based CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/rooms', roomRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Scrum Poker Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      rooms: '/api/rooms'
    }
  });
});

// Setup Socket.io handlers
setupSocketHandlers(io);

// Periodic cleanup of empty rooms
setInterval(async () => {
  try {
    const rooms = await Room.find({});
    for (const room of rooms) {
      if (room.participants.length === 0) {
        await room.deleteOne();
        console.log(`🗑️ Cleaned up empty room: ${room.roomId}`);
      }
    }
  } catch (error) {
    console.error('Error during room cleanup:', error);
  }
}, 5 * 60 * 1000); // Every 5 minutes

// Periodic timer check for auto-reveal
setInterval(async () => {
  try {
    const rooms = await Room.find({ isTimerRunning: true });
    for (const room of rooms) {
      if (room.isTimerExpired()) {
        // Auto-reveal votes when timer expires
        await room.revealVotes();
        await room.stopTimer();
        
        // Get fresh room data
        const updatedRoom = await Room.findOne({ roomId: room.roomId });
        const votes = updatedRoom.getCurrentRoundVotes();
        
        // Notify all users in the room
        io.to(room.roomId).emit('votesRevealed', {
          votes,
          participants: updatedRoom.participants,
          currentRound: updatedRoom.currentRound,
          roundStats: updatedRoom.getRoundStats(),
          autoRevealed: true
        });
        
        console.log(`⏰ Timer expired - auto-revealed votes in room ${room.roomId}`);
      }
    }
  } catch (error) {
    console.error('Error during timer check:', error);
  }
}, 1000); // Every second

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for real-time communication`);
  console.log(`🗄️  MongoDB connected successfully`);
  console.log(`🌐 Environment: ${config.NODE_ENV}`);
  console.log(`🧹 Room cleanup scheduled every 5 minutes`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
}); 