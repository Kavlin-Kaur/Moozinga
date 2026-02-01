import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SessionManager } from './sessionManager.js';
import { setupSocketHandlers } from './socketHandler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize session manager
const sessionManager = new SessionManager();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', sessions: sessionManager.getActiveSessions() });
});

app.post('/api/session/create', (req, res) => {
  const { userName } = req.body;
  
  if (!userName || userName.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const { code, userId } = sessionManager.createSession(userName);
  res.json({ code, userId });
});

app.post('/api/session/join', (req, res) => {
  const { code, userName } = req.body;
  
  if (!userName || userName.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!code || code.trim().length === 0) {
    return res.status(400).json({ error: 'Session code is required' });
  }

  const result = sessionManager.joinSession(code, userName);
  
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json(result);
});

app.get('/api/session/:code', (req, res) => {
  const { code } = req.params;
  const session = sessionManager.getSession(code);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(session);
});

// Setup Socket.io handlers
setupSocketHandlers(io, sessionManager);

// Auto-cleanup expired sessions every 5 minutes
setInterval(() => {
  sessionManager.cleanupExpiredSessions();
}, 5 * 60 * 1000);

// Start server
httpServer.listen(PORT, () => {
  console.log('🚀 MOOZINGA Server Started!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌐 WebSocket server ready`);
  console.log('================================');
});
