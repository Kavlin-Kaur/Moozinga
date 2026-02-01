import { MOODS } from './constants';

export function calculateSessionStats(sessionData, moodTimeline, reactionsLog) {
  if (!sessionData || !sessionData.users) {
    return null;
  }

  const stats = {
    overview: calculateOverview(sessionData, moodTimeline),
    moodDistribution: calculateMoodDistribution(moodTimeline),
    peakVibe: findPeakVibeMoment(moodTimeline),
    moodInfluencer: findMoodInfluencer(sessionData.users, moodTimeline),
    highlights: calculateHighlights(sessionData.users, moodTimeline, reactionsLog),
    participants: formatParticipants(sessionData.users, moodTimeline, reactionsLog)
  };

  return stats;
}

function calculateOverview(sessionData, moodTimeline) {
  const now = new Date();
  const createdAt = new Date(sessionData.createdAt);
  const durationMs = now - createdAt;
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    code: sessionData.code,
    duration: `${hours}h ${minutes}m`,
    totalParticipants: sessionData.users.length,
    totalMoodChanges: moodTimeline.length,
    startTime: createdAt.toLocaleString(),
    endTime: now.toLocaleString()
  };
}

function calculateMoodDistribution(moodTimeline) {
  const moodCounts = {};
  
  moodTimeline.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  const total = moodTimeline.length || 1;
  const distribution = {};

  MOODS.forEach(mood => {
    const count = moodCounts[mood.id] || 0;
    distribution[mood.id] = {
      count,
      percentage: Math.round((count / total) * 100),
      emoji: mood.emoji,
      label: mood.label,
      color: mood.color
    };
  });

  return distribution;
}

function findPeakVibeMoment(moodTimeline) {
  if (moodTimeline.length === 0) return null;

  // Group moods by 10-minute windows
  const windows = {};
  
  moodTimeline.forEach(entry => {
    const time = new Date(entry.timestamp);
    const windowKey = Math.floor(time.getTime() / (10 * 60 * 1000));
    
    if (!windows[windowKey]) {
      windows[windowKey] = { timestamp: time, moods: [] };
    }
    windows[windowKey].moods.push(entry.mood);
  });

  // Find window with most positive moods (happy, energetic, focused)
  let peakWindow = null;
  let maxPositiveCount = 0;

  Object.values(windows).forEach(window => {
    const positiveCount = window.moods.filter(mood => 
      ['happy', 'energetic', 'focused'].includes(mood)
    ).length;

    if (positiveCount > maxPositiveCount) {
      maxPositiveCount = positiveCount;
      peakWindow = window;
    }
  });

  if (!peakWindow || maxPositiveCount === 0) return null;

  // Find dominant mood in peak window
  const moodCounts = {};
  peakWindow.moods.forEach(mood => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b
  );

  const moodData = MOODS.find(m => m.id === dominantMood);

  return {
    timestamp: peakWindow.timestamp,
    time: peakWindow.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    count: maxPositiveCount,
    mood: dominantMood,
    emoji: moodData?.emoji,
    label: moodData?.label
  };
}

function findMoodInfluencer(users, moodTimeline) {
  const userMoodMatches = {};

  users.forEach(user => {
    userMoodMatches[user.id] = { name: user.name, matches: 0, total: 0 };
  });

  // Group timeline by time windows and calculate dominant mood
  const windows = {};
  
  moodTimeline.forEach(entry => {
    const windowKey = Math.floor(new Date(entry.timestamp).getTime() / (5 * 60 * 1000));
    
    if (!windows[windowKey]) {
      windows[windowKey] = {};
    }
    windows[windowKey][entry.userId] = entry.mood;
  });

  // For each window, find dominant mood and see who matched
  Object.values(windows).forEach(window => {
    const moods = Object.values(window);
    const moodCounts = {};
    
    moods.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    Object.entries(window).forEach(([userId, mood]) => {
      if (userMoodMatches[userId]) {
        userMoodMatches[userId].total++;
        if (mood === dominantMood) {
          userMoodMatches[userId].matches++;
        }
      }
    });
  });

  // Find user with highest match percentage
  let topInfluencer = null;
  let maxPercentage = 0;

  Object.entries(userMoodMatches).forEach(([userId, data]) => {
    if (data.total > 0) {
      const percentage = Math.round((data.matches / data.total) * 100);
      if (percentage > maxPercentage) {
        maxPercentage = percentage;
        topInfluencer = { userId, name: data.name, percentage };
      }
    }
  });

  return topInfluencer;
}

function calculateHighlights(users, moodTimeline, reactionsLog) {
  const highlights = {};

  // Longest streak
  let longestStreak = { userId: null, userName: null, mood: null, duration: 0 };
  const streaks = {};

  moodTimeline.forEach((entry, index) => {
    const key = `${entry.userId}-${entry.mood}`;
    
    if (!streaks[key]) {
      streaks[key] = {
        userId: entry.userId,
        mood: entry.mood,
        start: entry.timestamp,
        end: entry.timestamp
      };
    } else {
      streaks[key].end = entry.timestamp;
    }

    const duration = new Date(streaks[key].end) - new Date(streaks[key].start);
    if (duration > longestStreak.duration) {
      const user = users.find(u => u.id === entry.userId);
      const moodData = MOODS.find(m => m.id === entry.mood);
      
      longestStreak = {
        userId: entry.userId,
        userName: user?.name,
        mood: entry.mood,
        moodLabel: moodData?.label,
        moodEmoji: moodData?.emoji,
        duration
      };
    }
  });

  // Format duration
  const hours = Math.floor(longestStreak.duration / (1000 * 60 * 60));
  const minutes = Math.floor((longestStreak.duration % (1000 * 60 * 60)) / (1000 * 60));
  longestStreak.durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  highlights.longestStreak = longestStreak;

  // Most changes
  const changeCounts = {};
  moodTimeline.forEach(entry => {
    changeCounts[entry.userId] = (changeCounts[entry.userId] || 0) + 1;
  });

  const mostChangesUserId = Object.keys(changeCounts).reduce((a, b) => 
    changeCounts[a] > changeCounts[b] ? a : b, Object.keys(changeCounts)[0]
  );

  const mostChangesUser = users.find(u => u.id === mostChangesUserId);
  highlights.mostChanges = {
    userName: mostChangesUser?.name,
    count: changeCounts[mostChangesUserId] || 0
  };

  // Reaction stats
  const reactionsSent = {};
  const reactionsReceived = {};

  reactionsLog.forEach(reaction => {
    reactionsSent[reaction.fromUserId] = (reactionsSent[reaction.fromUserId] || 0) + 1;
    reactionsReceived[reaction.toUserId] = (reactionsReceived[reaction.toUserId] || 0) + 1;
  });

  const mostSentUserId = Object.keys(reactionsSent).reduce((a, b) => 
    reactionsSent[a] > reactionsSent[b] ? a : b, Object.keys(reactionsSent)[0]
  );
  const mostReceivedUserId = Object.keys(reactionsReceived).reduce((a, b) => 
    reactionsReceived[a] > reactionsReceived[b] ? a : b, Object.keys(reactionsReceived)[0]
  );

  highlights.mostReactionsSent = {
    userName: users.find(u => u.id === mostSentUserId)?.name,
    count: reactionsSent[mostSentUserId] || 0
  };

  highlights.mostReactionsReceived = {
    userName: users.find(u => u.id === mostReceivedUserId)?.name,
    count: reactionsReceived[mostReceivedUserId] || 0
  };

  return highlights;
}

function formatParticipants(users, moodTimeline, reactionsLog) {
  return users.map(user => {
    // Find most common mood
    const userMoods = moodTimeline.filter(entry => entry.userId === user.id);
    const moodCounts = {};
    
    userMoods.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommonMood = Object.keys(moodCounts).length > 0 
      ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
      : null;

    const moodData = MOODS.find(m => m.id === mostCommonMood);

    // Calculate time in session
    const joinedAt = new Date(user.joinedAt);
    const now = new Date();
    const durationMs = now - joinedAt;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    // Count reactions
    const sent = reactionsLog.filter(r => r.fromUserId === user.id).length;
    const received = reactionsLog.filter(r => r.toUserId === user.id).length;

    return {
      name: user.name,
      mostCommonMood: mostCommonMood,
      moodEmoji: moodData?.emoji,
      moodLabel: moodData?.label,
      timeInSession: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      reactionsSent: sent,
      reactionsReceived: received
    };
  });
}
