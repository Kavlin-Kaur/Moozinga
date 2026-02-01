import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Plus, X, Check, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuickPoll({ 
  poll, 
  onCreatePoll, 
  onVote, 
  currentUserId,
  canCreatePoll = true 
}) {
  const [showCreator, setShowCreator] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleCreate = () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) return;

    onCreatePoll({
      question: question.trim(),
      options: options.filter(o => o.trim()).map(o => o.trim())
    });

    // Reset
    setQuestion('');
    setOptions(['', '']);
    setShowCreator(false);
  };

  const handleVote = (optionIndex) => {
    onVote(optionIndex);
    
    // Celebrate!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Calculate results
  const totalVotes = poll?.votes ? Object.values(poll.votes).reduce((sum, votes) => sum + votes.length, 0) : 0;
  const hasVoted = poll?.votes && Object.values(poll.votes).some(voters => voters.includes(currentUserId));
  const userVote = poll?.votes ? Object.entries(poll.votes).find(([_, voters]) => voters.includes(currentUserId))?.[0] : null;

  return (
    <div className="space-y-4">
      {/* Create Poll Button */}
      {!poll && canCreatePoll && !showCreator && (
        <button
          onClick={() => setShowCreator(true)}
          className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-orange-300 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create Quick Poll</span>
        </button>
      )}

      {/* Poll Creator */}
      <AnimatePresence>
        {showCreator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-300" />
                <h3 className="text-lg font-bold text-white">Create Poll</h3>
              </div>
              <button
                onClick={() => setShowCreator(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Question */}
              <div>
                <label className="block text-sm text-orange-200 mb-2">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What should we do next?"
                  maxLength={200}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm text-orange-200 mb-2">Options</label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        maxLength={100}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      />
                      {options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {options.length < 6 && (
                  <button
                    onClick={addOption}
                    className="mt-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-orange-300 text-sm transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Option
                  </button>
                )}
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create Poll
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Poll */}
      {poll && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 backdrop-blur-md border border-primary-400/30"
        >
          {/* Question */}
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-orange-300 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{poll.question}</h3>
                <p className="text-sm text-orange-300">
                  {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                  {hasVoted && <span className="ml-2">• You voted</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {poll.options.map((option, index) => {
              const votes = poll.votes?.[index]?.length || 0;
              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              const isUserVote = userVote !== null && parseInt(userVote) === index;

              return (
                <button
                  key={index}
                  onClick={() => !hasVoted && handleVote(index)}
                  disabled={hasVoted}
                  className={`w-full relative overflow-hidden rounded-xl transition-all ${
                    hasVoted
                      ? 'cursor-default'
                      : 'hover:scale-[1.02] cursor-pointer'
                  } ${
                    isUserVote
                      ? 'ring-2 ring-primary-400'
                      : ''
                  }`}
                >
                  {/* Progress Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 ${
                      isUserVote
                        ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/30'
                        : 'bg-white/10'
                    }`}
                  />

                  {/* Content */}
                  <div className="relative px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isUserVote && <Check className="w-4 h-4 text-primary-300" />}
                      <span className="text-white font-medium">{option}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-300 text-sm">{votes}</span>
                      {hasVoted && (
                        <span className="text-white font-bold text-sm min-w-[3rem] text-right">
                          {percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Created By */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-orange-300 text-center">
              Created by <span className="font-bold text-white">{poll.createdBy}</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
