import { motion } from 'framer-motion';
import { User, Clock } from 'lucide-react';
import { MOODS } from '../utils/constants';
import ReactionButton from './ReactionButton';

export default function UserCard({ user, isCurrentUser, onSendReaction }) {
  const mood = MOODS.find(m => m.id === user.mood);
  const timeAgo = getTimeAgo(user.lastUpdate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-5 rounded-2xl backdrop-blur-md border transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-br from-primary-500/20 to-accent-500/20 border-primary-400/40 shadow-lg shadow-primary-500/20'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      {isCurrentUser && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary-500/50 text-white text-xs font-medium">
          You
        </div>
      )}

      {/* User Info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-full bg-white/10">
          <User className="w-5 h-5 text-orange-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg leading-tight">
            {user.name}
          </h3>
          {user.lastUpdate && (
            <div className="flex items-center gap-1 text-xs text-orange-300 mt-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mood Display */}
      {mood ? (
        <div className="space-y-2">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${mood.gradient}`}>
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-white font-bold">{mood.label}</span>
          </div>

          {user.status && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-orange-100 text-sm italic">"{user.status}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-orange-300 text-sm">No mood set yet</p>
        </div>
      )}

      {/* Reaction Button - Only show for other users */}
      {!isCurrentUser && onSendReaction && (
        <div className="mt-3">
          <ReactionButton
            onSendReaction={(type, emoji) => onSendReaction(user.id, type, emoji)}
          />
        </div>
      )}
    </motion.div>
  );
}

function getTimeAgo(timestamp) {
  if (!timestamp) return '';

  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}
