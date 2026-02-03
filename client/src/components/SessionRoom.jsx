import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Users, Copy, Check, Wifi, WifiOff, QrCode, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from './navigation';
import MoodSelector from './MoodSelector';
import UserCard from './UserCard';
import SessionCode from './SessionCode';
import QRCodeModal from './QRCodeModal';
import SessionStats from './SessionStats';
import ReactionToast from './ReactionToast';
import MoodTimeline from './MoodTimeline';
import ChatSidebar from './ChatSidebar';
import QuickPoll from './QuickPoll';
import toast from 'react-hot-toast';
import { MOODS } from '../utils/constants';

export default function SessionRoom() {
  const { sessionCode, userId, userName, sessionData, updateSessionData, leaveSession } = useSession();
  const { socket, isConnected, updateMood } = useSocket(sessionCode, userId, userName);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [messages, setMessages] = useState([]);
  const [poll, setPoll] = useState(null);

  // Redirect if not in session
  useEffect(() => {
    if (!sessionCode || !userId) {
      navigate('home');
    }
  }, [sessionCode, userId, navigate]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('session-state', (data) => {
      updateSessionData(data);
      setMessages(data.messages || []);
      setPoll(data.poll || null);
    });

    socket.on('user-joined', ({ user, userCount }) => {
      toast.success(`${user.name} joined the session`, {
        icon: '👋',
        duration: 3000
      });
      
      // Refresh session data
      if (sessionData) {
        updateSessionData({
          ...sessionData,
          userCount,
          users: [...sessionData.users, user]
        });
      }
    });

    socket.on('mood-updated', ({ userId: updatedUserId, mood, status, vibe }) => {
      if (sessionData) {
        const updatedUsers = sessionData.users.map(user =>
          user.id === updatedUserId
            ? { ...user, mood, status, lastUpdate: new Date() }
            : user
        );
        
        updateSessionData({
          ...sessionData,
          users: updatedUsers,
          vibe
        });
      }
    });

    socket.on('user-left', ({ userId: leftUserId, userName: leftUserName, userCount }) => {
      toast(`${leftUserName} left the session`, {
        icon: '👋',
        duration: 3000
      });

      if (sessionData) {
        updateSessionData({
          ...sessionData,
          userCount,
          users: sessionData.users.filter(u => u.id !== leftUserId)
        });
      }
    });

    socket.on('receive-reaction', ({ fromUserId, fromUserName, type, emoji }) => {
      setReactions(prev => [...prev, {
        id: Date.now() + Math.random(),
        fromUserName,
        type,
        emoji
      }]);
    });

    socket.on('session-ended', ({ stats }) => {
      setStatsData(stats);
      setShowStatsModal(true);
    });

    socket.on('receive-message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    socket.on('poll-created', (pollData) => {
      setPoll(pollData);
      toast.success('New poll created!', { icon: '📊' });
    });

    socket.on('poll-updated', (pollData) => {
      setPoll(pollData);
    });

    socket.on('poll-cleared', () => {
      setPoll(null);
    });

    return () => {
      socket.off('session-state');
      socket.off('user-joined');
      socket.off('mood-updated');
      socket.off('user-left');
      socket.off('receive-reaction');
      socket.off('session-ended');
      socket.off('receive-message');
      socket.off('poll-created');
      socket.off('poll-updated');
      socket.off('poll-cleared');
    };
  }, [socket, sessionData, updateSessionData]);

  const handleMoodSelect = (moodId, status) => {
    updateMood(moodId, status);
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-session', { code: sessionCode, userId });
    }
    leaveSession();
    toast.success('You left the session');
    navigate('home');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendReaction = (toUserId, type, emoji) => {
    if (socket) {
      socket.emit('send-reaction', {
        code: sessionCode,
        fromUserId: userId,
        toUserId,
        type,
        emoji
      });
    }
  };

  const handleEndSession = () => {
    if (!confirm('Are you sure you want to end this session for everyone?')) return;
    
    if (socket) {
      socket.emit('end-session', { code: sessionCode });
    }
  };

  const removeReaction = (id) => {
    setReactions(prev => prev.filter(r => r.id !== id));
  };

  const isCreator = sessionData?.users?.[0]?.id === userId;

  const handleSendMessage = (message) => {
    if (socket) {
      socket.emit('send-message', {
        code: sessionCode,
        userId,
        message
      });
    }
  };

  const handleCreatePoll = ({ question, options }) => {
    if (socket) {
      socket.emit('create-poll', {
        code: sessionCode,
        userId,
        question,
        options
      });
    }
  };

  const handleVotePoll = (optionIndex) => {
    if (socket) {
      socket.emit('vote-poll', {
        code: sessionCode,
        userId,
        optionIndex
      });
    }
  };

  // Get mood history for timeline
  const getMoodHistory = () => {
    if (!sessionData?.users) return [];
    const currentUser = sessionData.users.find(u => u.id === userId);
    // In a real app, this would come from backend mood timeline
    // For now, return empty - will be populated when backend sends timeline data
    return [];
  };

  // Get current user's mood
  const currentUser = sessionData?.users?.find(u => u.id === userId);
  const currentMood = currentUser?.mood;

  // Calculate vibe stats
  const vibeEmoji = sessionData?.vibe?.dominant 
    ? MOODS.find(m => m.id === sessionData.vibe.dominant)?.emoji 
    : '😐';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B1B] via-[#1A0B0B] to-[#2D1B1B] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Session Info */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
              <SessionCode code={sessionCode} />
              
              <button
                onClick={handleCopyCode}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
                title="Copy session code"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Users className="w-5 h-5 text-orange-300" />
                <span className="text-white font-medium">
                  {sessionData?.userCount || 0}
                </span>
              </div>

              <button
                onClick={() => setShowQRModal(true)}
                className="p-3 rounded-xl bg-primary-500/20 backdrop-blur-sm border border-primary-400/30 text-primary-300 hover:bg-primary-500/30 transition-all"
                title="Show QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>

              {isCreator && (
                <button
                  onClick={handleEndSession}
                  className="px-4 py-2 rounded-xl bg-accent-500/20 backdrop-blur-sm border border-accent-400/30 text-accent-300 hover:bg-accent-500/30 transition-all flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">End Session</span>
                </button>
              )}

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-accent-400" />
                    <span className="text-accent-300 text-sm">Offline</span>
                  </>
                )}
              </div>
            </div>

            {/* Leave Button */}
            <button
              onClick={handleLeave}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-500/20 backdrop-blur-sm border border-accent-400/30 text-accent-300 hover:bg-accent-500/30 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Leave Session
            </button>
          </div>

          {/* Overall Vibe */}
          {sessionData?.vibe?.dominant && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-4xl sm:text-5xl">{vibeEmoji}</span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">Overall Vibe</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sessionData.vibe.breakdown).map(([mood, percentage]) => {
                      const moodData = MOODS.find(m => m.id === mood);
                      return (
                        <div
                          key={mood}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm"
                        >
                          <span>{moodData?.emoji}</span>
                          <span className="text-white font-medium">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <MoodSelector
            currentMood={currentMood}
            onMoodSelect={handleMoodSelect}
          />
        </motion.div>

        {/* Mood Timeline & Quick Poll - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-300" />
                  <h3 className="text-lg font-bold text-white">Your Mood Journey</h3>
                </div>
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className="px-3 py-1 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-sm transition-all"
                >
                  {showTimeline ? 'Hide' : 'Show'}
                </button>
              </div>
              
              <AnimatePresence>
                {showTimeline && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <MoodTimeline 
                      moodHistory={getMoodHistory()} 
                      userName={userName}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!showTimeline && (
                <p className="text-orange-300 text-sm text-center py-4">
                  Click "Show" to view your mood timeline
                </p>
              )}
            </div>
          </motion.div>

          {/* Quick Poll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <QuickPoll
                poll={poll}
                onCreatePoll={handleCreatePoll}
                onVote={handleVotePoll}
                currentUserId={userId}
                canCreatePoll={!poll}
              />
            </div>
          </motion.div>
        </div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team Members
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {sessionData?.users?.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isCurrentUser={user.id === userId}
                  onSendReaction={!user.id !== userId ? handleSendReaction : undefined}
                />
              ))}
            </AnimatePresence>
          </div>

          {(!sessionData?.users || sessionData.users.length === 0) && (
            <div className="text-center py-12 text-orange-300">
              <p>No one here yet...</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        sessionCode={sessionCode}
      />

      <SessionStats
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={statsData}
      />

      {/* Reaction Toasts */}
      <ReactionToast
        reactions={reactions}
        onDismiss={removeReaction}
      />

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={showChat}
        onToggle={() => setShowChat(!showChat)}
        messages={messages}
        onSendMessage={handleSendMessage}
        currentUserId={userId}
        currentUserName={userName}
      />
    </div>
  );
}
