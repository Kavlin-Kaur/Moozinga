import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOODS, MAX_STATUS_LENGTH } from '../utils/constants';

export default function MoodSelector({ currentMood, onMoodSelect }) {
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const [status, setStatus] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  const handleMoodClick = (moodId) => {
    setSelectedMood(moodId);
    setShowStatus(true);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood, status.trim());
      setShowStatus(false);
      setStatus('');
    }
  };

  return (
    <div className="relative">
      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-white text-xl font-bold mb-4 text-center">
          How are you feeling?
        </h3>

        {/* Mood Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodClick(mood.id)}
              className={`relative p-4 rounded-xl transition-all ${
                selectedMood === mood.id
                  ? `bg-gradient-to-br ${mood.gradient} shadow-lg`
                  : 'bg-white/5 hover:bg-white/10'
              } border ${
                selectedMood === mood.id ? 'border-white/40' : 'border-white/10'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className={`text-sm font-medium ${
                  selectedMood === mood.id ? 'text-white' : 'text-orange-200'
                }`}>
                  {mood.label}
                </div>
              </div>

              {currentMood === mood.id && selectedMood !== mood.id && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary-400 rounded-full"></div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Status Input */}
        {showStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm text-orange-200 mb-2">
                What's on your mind? (optional)
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Working on a big project..."
                maxLength={MAX_STATUS_LENGTH}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                autoFocus
              />
              <p className="text-xs text-orange-300 mt-1">
                {status.length}/{MAX_STATUS_LENGTH}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!selectedMood}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Mood
              </button>
              <button
                onClick={() => {
                  setShowStatus(false);
                  setSelectedMood(currentMood);
                  setStatus('');
                }}
                className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Update Button */}
        {!showStatus && currentMood && (
          <button
            onClick={() => setShowStatus(true)}
            className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            Change Mood
          </button>
        )}
      </div>
    </div>
  );
}
