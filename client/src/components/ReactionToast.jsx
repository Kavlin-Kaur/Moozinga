import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { REACTIONS } from '../utils/constants';

export default function ReactionToast({ reactions, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {reactions.map((reaction) => {
          const reactionData = REACTIONS.find(r => r.id === reaction.type);
          
          return (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 25 
              }}
              className="pointer-events-auto"
            >
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 backdrop-blur-md border border-white/20 shadow-2xl min-w-[280px]">
                <span className="text-3xl">{reactionData?.emoji}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {reaction.fromUserName}
                  </p>
                  <p className="text-white/90 text-sm">
                    sent you a {reactionData?.label}!
                  </p>
                </div>
                <button
                  onClick={() => onDismiss(reaction.id)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
