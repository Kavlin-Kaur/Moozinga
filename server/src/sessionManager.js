import { customAlphabet } from 'nanoid';

// Generate readable session codes (ABC-123 format)
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create a new session
   */
  createSession(creatorName) {
    const code = this.generateCode();
    const userId = this.generateUserId();
    const now = new Date();

    const session = {
      code,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
      users: new Map(),
      moodTimeline: [], // Track all mood changes with timestamps
      reactionsLog: [],  // Track all reactions sent
      messages: [],      // Chat messages
      poll: null         // Active poll (only one at a time)
    };

    // Add creator as first user
    session.users.set(userId, {
      id: userId,
      name: creatorName,
      mood: null,
      status: '',
      joinedAt: now,
      lastUpdate: now,
      socketId: null,
      reactionsReceived: []
    });

    this.sessions.set(code, session);
    console.log(`✅ Session created: ${code} by ${creatorName}`);

    return { code, userId };
  }

  /**
   * Join an existing session
   */
  joinSession(code, userName) {
    const session = this.sessions.get(code);

    if (!session) {
      return { error: "Oops! This session doesn't exist" };
    }

    if (new Date() > session.expiresAt) {
      this.sessions.delete(code);
      return { error: 'This session has expired' };
    }

    if (session.users.size >= 50) {
      return { error: 'This session is full (max 50 people)' };
    }

    const userId = this.generateUserId();
    const now = new Date();

    session.users.set(userId, {
      id: userId,
      name: userName,
      mood: null,
      status: '',
      joinedAt: now,
      lastUpdate: now,
      socketId: null,
      reactionsReceived: []
    });

    console.log(`👤 ${userName} joined session ${code}`);

    return {
      sessionData: this.getSessionData(code),
      userId
    };
  }

  /**
   * Get session data (sanitized for client)
   */
  getSession(code) {
    return this.getSessionData(code);
  }

  /**
   * Update user's mood and status
   */
  updateMood(code, userId, mood, status) {
    const session = this.sessions.get(code);
    if (!session) return null;

    const user = session.users.get(userId);
    if (!user) return null;

    user.mood = mood;
    user.status = status || '';
    user.lastUpdate = new Date();

    // Add to mood timeline for stats
    session.moodTimeline.push({
      userId,
      mood,
      status,
      timestamp: new Date()
    });

    console.log(`🎭 ${user.name} is now ${mood}`);

    return this.getSessionData(code);
  }

  /**
   * Send reaction from one user to another
   */
  sendReaction(code, fromUserId, toUserId, reactionType) {
    const session = this.sessions.get(code);
    if (!session) return null;

    const fromUser = session.users.get(fromUserId);
    const toUser = session.users.get(toUserId);
    
    if (!fromUser || !toUser) return null;

    const reaction = {
      fromUserId,
      fromUserName: fromUser.name,
      toUserId,
      type: reactionType,
      timestamp: new Date()
    };

    // Add to reactions log
    session.reactionsLog.push(reaction);

    // Add to recipient's received reactions (keep last 10)
    toUser.reactionsReceived.push(reaction);
    if (toUser.reactionsReceived.length > 10) {
      toUser.reactionsReceived.shift();
    }

    console.log(`❤️ ${fromUser.name} sent ${reactionType} to ${toUser.name}`);

    return reaction;
  }

  /**
   * Set user's socket ID
   */
  setUserSocket(code, userId, socketId) {
    const session = this.sessions.get(code);
    if (!session) return;

    const user = session.users.get(userId);
    if (user) {
      user.socketId = socketId;
    }
  }

  /**
   * Remove user from session
   */
  removeUser(code, userId) {
    const session = this.sessions.get(code);
    if (!session) return null;

    const user = session.users.get(userId);
    if (!user) return null;

    const userName = user.name;
    session.users.delete(userId);

    console.log(`👋 ${userName} left session ${code}`);

    // Delete session if empty
    if (session.users.size === 0) {
      this.sessions.delete(code);
      console.log(`🗑️  Session ${code} deleted (empty)`);
      return null;
    }

    return { userName, sessionData: this.getSessionData(code) };
  }

  /**
   * Remove user by socket ID
   */
  removeUserBySocket(socketId) {
    for (const [code, session] of this.sessions.entries()) {
      for (const [userId, user] of session.users.entries()) {
        if (user.socketId === socketId) {
          return { code, userId, result: this.removeUser(code, userId) };
        }
      }
    }
    return null;
  }

  /**
   * Send a chat message
   */
  sendMessage(code, userId, message) {
    const session = this.sessions.get(code);
    if (!session) return null;

    const user = session.users.get(userId);
    if (!user) return null;

    const messageData = {
      id: `msg_${Date.now()}_${Math.random()}`,
      userId,
      userName: user.name,
      message,
      timestamp: new Date()
    };

    session.messages.push(messageData);

    // Keep only last 100 messages
    if (session.messages.length > 100) {
      session.messages = session.messages.slice(-100);
    }

    return messageData;
  }

  /**
   * Create a poll
   */
  createPoll(code, userId, question, options) {
    const session = this.sessions.get(code);
    if (!session) return null;

    const user = session.users.get(userId);
    if (!user) return null;

    // Only one poll at a time
    if (session.poll) {
      return { error: 'A poll is already active' };
    }

    session.poll = {
      question,
      options,
      createdBy: user.name,
      createdAt: new Date(),
      votes: {} // { optionIndex: [userIds] }
    };

    return session.poll;
  }

  /**
   * Vote on a poll
   */
  votePoll(code, userId, optionIndex) {
    const session = this.sessions.get(code);
    if (!session || !session.poll) return null;

    // Remove any previous vote by this user
    Object.keys(session.poll.votes).forEach(key => {
      session.poll.votes[key] = session.poll.votes[key].filter(id => id !== userId);
    });

    // Add new vote
    if (!session.poll.votes[optionIndex]) {
      session.poll.votes[optionIndex] = [];
    }
    session.poll.votes[optionIndex].push(userId);

    return session.poll;
  }

  /**
   * Clear active poll
   */
  clearPoll(code) {
    const session = this.sessions.get(code);
    if (session) {
      session.poll = null;
    }
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions() {
    const now = new Date();
    let cleaned = 0;

    for (const [code, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(code);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired sessions`);
    }
  }

  /**
   * Get active sessions count
   */
  getActiveSessions() {
    return this.sessions.size;
  }

  /**
   * Generate session code (ABC-123 format)
   */
  generateCode() {
    let code;
    do {
      const raw = nanoid();
      code = `${raw.slice(0, 3)}-${raw.slice(3, 6)}`;
    } while (this.sessions.has(code));
    return code;
  }

  /**
   * Generate unique user ID
   */
  generateUserId() {
    return nanoid();
  }

  /**
   * Get session data formatted for client
   */
  getSessionData(code) {
    const session = this.sessions.get(code);
    if (!session) return null;

    const users = Array.from(session.users.values()).map(user => ({
      id: user.id,
      name: user.name,
      mood: user.mood,
      status: user.status,
      lastUpdate: user.lastUpdate
    }));

    // Calculate overall vibe
    const vibe = this.calculateOverallVibe(users);

    return {
      code,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      userCount: users.length,
      users,
      vibe,
      messages: session.messages || [],
      poll: session.poll || null
    };
  }

  /**
   * Calculate overall vibe of the session
   */
  calculateOverallVibe(users) {
    const moodCounts = {};
    let totalWithMood = 0;

    users.forEach(user => {
      if (user.mood) {
        moodCounts[user.mood] = (moodCounts[user.mood] || 0) + 1;
        totalWithMood++;
      }
    });

    if (totalWithMood === 0) {
      return { dominant: null, breakdown: {} };
    }

    // Find dominant mood
    let dominant = null;
    let maxCount = 0;

    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = mood;
      }
    }

    // Calculate percentages
    const breakdown = {};
    for (const [mood, count] of Object.entries(moodCounts)) {
      breakdown[mood] = Math.round((count / totalWithMood) * 100);
    }

    return { dominant, breakdown };
  }

  /**
   * Get comprehensive session stats (for end session)
   */
  getSessionStats(code) {
    const session = this.sessions.get(code);
    if (!session) return null;

    return {
      sessionData: this.getSessionData(code),
      moodTimeline: session.moodTimeline || [],
      reactionsLog: session.reactionsLog || []
    };
  }

  /**
   * End session and delete data
   */
  endSession(code) {
    const stats = this.getSessionStats(code);
    this.sessions.delete(code);
    console.log(`🏁 Session ${code} ended and deleted`);
    return stats;
  }
}
