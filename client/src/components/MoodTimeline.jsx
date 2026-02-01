import { motion, AnimatePresence } from 'framer-motion';
import { Download, Clock, TrendingUp } from 'lucide-react';
import { MOODS } from '../utils/constants';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function MoodTimeline({ moodHistory, userName }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const timelineRef = useRef(null);

  const handleExport = async () => {
    if (!timelineRef.current) return;

    try {
      const canvas = await html2canvas(timelineRef.current, {
        backgroundColor: '#1A0B0B',
        scale: 2,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `mood-timeline-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (!moodHistory || moodHistory.length === 0) {
    return (
      <div className="p-8 text-center text-orange-300">
        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No mood history yet. Update your mood to start tracking!</p>
      </div>
    );
  }

  const getMoodData = (moodId) => MOODS.find(m => m.id === moodId);
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const moodChanges = moodHistory.length - 1;
  const duration = moodHistory.length > 1 
    ? Math.round((new Date(moodHistory[moodHistory.length - 1].timestamp) - new Date(moodHistory[0].timestamp)) / 60000)
    : 0;

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-400/20">
            <span className="text-orange-200 text-sm">
              <span className="font-bold text-white">{moodChanges}</span> mood changes
            </span>
          </div>
          {duration > 0 && (
            <div className="px-4 py-2 rounded-xl bg-accent-500/10 border border-accent-400/20">
              <span className="text-orange-200 text-sm">
                <span className="font-bold text-white">{duration}</span> minutes
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Export</span>
        </button>
      </div>

      {/* Timeline */}
      <div 
        ref={timelineRef}
        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 overflow-hidden"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(255,107,53,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* Scrollable Timeline */}
        <div className="relative overflow-x-auto pb-4">
          <div className="flex items-center gap-3 min-w-max">
            {moodHistory.map((entry, index) => {
              const mood = getMoodData(entry.mood);
              const isHovered = hoveredIndex === index;
              const isFirst = index === 0;
              const isLast = index === moodHistory.length - 1;

              return (
                <div key={entry.timestamp} className="flex items-center">
                  {/* Mood Point */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative group"
                  >
                    {/* Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 rounded-xl bg-gray-900 border border-white/20 shadow-2xl min-w-[200px] z-10"
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{mood?.emoji}</div>
                            <div className="text-white font-bold mb-1">{mood?.label}</div>
                            <div className="flex items-center justify-center gap-1 text-xs text-orange-300">
                              <Clock className="w-3 h-3" />
                              {formatTime(entry.timestamp)}
                            </div>
                            {entry.status && (
                              <div className="mt-2 text-xs text-orange-200 italic">
                                "{entry.status}"
                              </div>
                            )}
                          </div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mood Circle */}
                    <div 
                      className={`relative flex items-center justify-center w-16 h-16 rounded-full cursor-pointer transition-all ${
                        isHovered ? 'scale-125' : 'scale-100'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${mood?.gradient?.replace('from-', '').replace('to-', '').split(' ').join(', ')})`,
                        boxShadow: isHovered ? '0 0 30px rgba(255, 107, 53, 0.5)' : 'none'
                      }}
                    >
                      <span className="text-3xl">{mood?.emoji}</span>
                      
                      {/* Badge for first/last */}
                      {(isFirst || isLast) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-gray-900">
                          {isFirst ? '1st' : 'Now'}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Connector Line */}
                  {!isLast && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.05, duration: 0.3 }}
                      className="h-1 w-12 origin-left"
                      style={{
                        background: `linear-gradient(90deg, ${getMoodGradientColor(entry.mood)}, ${getMoodGradientColor(moodHistory[index + 1].mood)})`
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Label */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-sm text-orange-200">
            <span className="font-bold text-white">{userName}'s</span> Mood Journey
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to get solid color from mood for gradient
function getMoodGradientColor(moodId) {
  const colors = {
    happy: '#10b981',
    sad: '#6366f1',
    tired: '#8b5cf6',
    energetic: '#f59e0b',
    focused: '#3b82f6'
  };
  return colors[moodId] || '#9ca3af';
}
