import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { REACTIONS } from '../utils/constants';

export default function ReactionButton({ toUserId, onSendReaction, disabled }) {
  const [showPicker, setShowPicker] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleReactionClick = (reactionId) => {
    if (cooldown) return;

    onSendReaction(toUserId, reactionId);
    setShowPicker(false);
    
    // 3-second cooldown to prevent spam
    setCooldown(true);
    setTimeout(() => setCooldown(false), 3000);

    // Trigger particle animation
    createParticles();
  };

  const createParticles = () => {
    // Simple particle effect - hearts float up
    const button = document.getElementById(`reaction-btn-${toUserId}`);
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.innerHTML = '❤️';
    particle.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top}px;
      font-size: 20px;
      pointer-events: none;
      z-index: 9999;
      animation: floatUp 1.5s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1500);
  };

  return (
    <div className="relative">
      {/* Add CSS animation */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
          }
        }
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <motion.button
        id={`reaction-btn-${toUserId}`}
        onClick={() => !disabled && setShowPicker(!showPicker)}
        disabled={disabled || cooldown}
        className={`p-2 rounded-lg transition-all ${
          cooldown 
            ? 'bg-gray-500/20 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 hover:from-primary-500/30 hover:to-accent-500/30'
        } border border-white/10 hover:border-white/20`}
        whileHover={!cooldown && !disabled ? { scale: 1.05 } : {}}
        whileTap={!cooldown && !disabled ? { scale: 0.95 } : {}}
        style={!cooldown && !disabled ? { animation: 'gentlePulse 2s ease-in-out infinite' } : {}}
        title={cooldown ? 'Wait a moment...' : 'Send a reaction'}
      >
        <Heart className="w-4 h-4 text-primary-300" />
      </motion.button>

      {/* Reaction Picker Popover */}
      <AnimatePresence>
        {showPicker && (
          <>
            {/* Backdrop to close */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowPicker(false)}
            />

            {/* Picker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 p-2 rounded-xl bg-gradient-to-br from-primary-500/90 to-accent-500/90 backdrop-blur-md border border-white/20 shadow-2xl z-50"
            >
              <div className="flex gap-1">
                {REACTIONS.map((reaction) => (
                  <motion.button
                    key={reaction.id}
                    onClick={() => handleReactionClick(reaction.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={reaction.label}
                  >
                    <span className="text-2xl">{reaction.emoji}</span>
                    <span className="text-xs text-white whitespace-nowrap">{reaction.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Arrow pointing down */}
              <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-gradient-to-br from-primary-500 to-accent-500 transform rotate-45 border-r border-b border-white/20"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
