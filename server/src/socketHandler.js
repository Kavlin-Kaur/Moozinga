export function setupSocketHandlers(io, sessionManager) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join session
    socket.on('join-session', ({ code, userId, userName }) => {
      // Store session info in socket
      socket.data = { code, userId };

      // Set socket ID in session
      sessionManager.setUserSocket(code, userId, socket.id);

      // Join socket room
      socket.join(code);

      // Broadcast to others in session
      const sessionData = sessionManager.getSessionData(code);
      if (sessionData) {
        socket.to(code).emit('user-joined', {
          user: sessionData.users.find(u => u.id === userId),
          userCount: sessionData.userCount
        });

        // Send full session state to joining user
        socket.emit('session-state', sessionData);
      }

      console.log(`✅ ${userName} joined session ${code} via socket`);
    });

    // Update mood
    socket.on('update-mood', ({ code, userId, mood, status }) => {
      const sessionData = sessionManager.updateMood(code, userId, mood, status);
      
      if (sessionData) {
        // Broadcast to entire session including sender
        io.to(code).emit('mood-updated', {
          userId,
          mood,
          status,
          vibe: sessionData.vibe
        });
      }
    });

    // Send reaction
    socket.on('send-reaction', ({ code, fromUserId, toUserId, reactionType }) => {
      const reaction = sessionManager.sendReaction(code, fromUserId, toUserId, reactionType);
      
      if (reaction) {
        // Send to specific user
        const session = sessionManager.getSession(code);
        const toUser = session?.users.find(u => u.id === toUserId);
        
        if (toUser && toUser.socketId) {
          io.to(toUser.socketId).emit('receive-reaction', {
            fromUserName: reaction.fromUserName,
            toUserId: reaction.toUserId,
            reactionType: reaction.type,
            timestamp: reaction.timestamp
          });
        }
      }
    });

    // End session (only creator can do this)
    socket.on('end-session', ({ code, userId }) => {
      const session = sessionManager.getSession(code);
      if (!session) return;

      // Check if user is the creator (first user)
      const users = Array.from(session.users || []);
      const isCreator = users.length > 0 && users[0].id === userId;

      if (!isCreator) {
        socket.emit('error', { message: 'Only the creator can end the session' });
        return;
      }

      // Get stats before deleting
      const stats = sessionManager.getSessionStats(code);
      
      // Broadcast to all users in session
      io.to(code).emit('session-ended', stats);

      // End session after 5 seconds to allow users to see stats
      setTimeout(() => {
        sessionManager.endSession(code);
      }, 5000);
    });

    // Send chat message
    socket.on('send-message', ({ code, userId, message }) => {
      const messageData = sessionManager.sendMessage(code, userId, message);
      
      if (messageData) {
        // Broadcast to entire session
        io.to(code).emit('receive-message', messageData);
      }
    });

    // Create poll
    socket.on('create-poll', ({ code, userId, question, options }) => {
      const poll = sessionManager.createPoll(code, userId, question, options);
      
      if (poll && !poll.error) {
        // Broadcast to entire session
        io.to(code).emit('poll-created', poll);
      } else if (poll?.error) {
        socket.emit('error', { message: poll.error });
      }
    });

    // Vote on poll
    socket.on('vote-poll', ({ code, userId, optionIndex }) => {
      const poll = sessionManager.votePoll(code, userId, optionIndex);
      
      if (poll) {
        // Broadcast updated poll to entire session
        io.to(code).emit('poll-updated', poll);
      }
    });

    // Clear poll (creator only)
    socket.on('clear-poll', ({ code }) => {
      sessionManager.clearPoll(code);
      io.to(code).emit('poll-cleared');
    });

    // Leave session
    socket.on('leave-session', ({ code, userId }) => {
      const result = sessionManager.removeUser(code, userId);
      
      if (result) {
        socket.to(code).emit('user-left', {
          userId,
          userName: result.userName,
          userCount: result.sessionData ? result.sessionData.userCount : 0
        });
      }

      socket.leave(code);
      console.log(`👋 User ${userId} left session ${code}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const socketData = socket.data;
      
      if (socketData && socketData.code && socketData.userId) {
        const result = sessionManager.removeUser(socketData.code, socketData.userId);
        
        if (result) {
          socket.to(socketData.code).emit('user-left', {
            userId: socketData.userId,
            userName: result.userName,
            userCount: result.sessionData ? result.sessionData.userCount : 0
          });
        }
      }

      console.log(`🔌 Client disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      socket.emit('error', { message: 'Something went wrong' });
    });
  });
}
