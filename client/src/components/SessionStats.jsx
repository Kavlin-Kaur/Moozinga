import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trophy, TrendingUp, Zap, Heart, Users as UsersIcon, Clock, Copy, Check } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { useState } from 'react';
import { createPieChartConfig, pieChartOptions } from '../utils/chartConfig';
import html2canvas from 'html2canvas';

export default function SessionStats({ isOpen, onClose, stats }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!stats || !isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(stats.overview.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSummary = async () => {
    setDownloading(true);
    try {
      // Create a downloadable summary card
      const summaryCard = document.getElementById('session-summary-card');
      if (!summaryCard) return;

      const canvas = await html2canvas(summaryCard, {
        backgroundColor: '#1A0B0B',
        scale: 2,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `MOOZINGA_Session_${stats.overview.code}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const chartData = createPieChartConfig(stats.moodDistribution);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-4xl w-full my-8 z-10"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B1B] to-[#1A0B0B] border-2 border-primary-500/40 shadow-2xl shadow-primary-500/20">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/50 to-accent-600/50 blur-xl"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    🎉 Session Complete!
                  </h2>
                  <p className="text-white/90">
                    Here's how your team vibed together
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadSummary}
                    disabled={downloading}
                    className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all disabled:opacity-50"
                    title="Download Summary"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Session Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={<Clock />}
                  label="Duration"
                  value={stats.overview.duration}
                />
                <StatCard
                  icon={<UsersIcon />}
                  label="Participants"
                  value={stats.overview.totalParticipants}
                />
                <StatCard
                  icon={<TrendingUp />}
                  label="Mood Changes"
                  value={stats.overview.totalMoodChanges}
                />
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-300 text-sm">Session Code</span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 hover:bg-white/10 rounded transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-orange-300" />}
                    </button>
                  </div>
                  <p className="text-2xl font-bold font-mono text-white">{stats.overview.code}</p>
                </div>
              </div>

              {/* Mood Distribution Chart */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Mood Distribution
                </h3>
                <div className="h-64">
                  <Pie data={chartData} options={pieChartOptions} />
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.values(stats.moodDistribution).map(mood => (
                    mood.count > 0 && (
                      <div key={mood.label} className="text-center p-2 rounded-lg bg-white/5">
                        <div className="text-2xl mb-1">{mood.emoji}</div>
                        <div className="text-white text-sm font-medium">{mood.percentage}%</div>
                        <div className="text-orange-300 text-xs">{mood.count} times</div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Peak Vibe Moment */}
              {stats.peakVibe && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border-2 border-primary-400/40"
                  style={{ boxShadow: '0 0 30px rgba(255, 107, 53, 0.3)' }}
                >
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Peak Vibe Moment
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-6xl">{stats.peakVibe.emoji}</div>
                    <div>
                      <p className="text-2xl text-white font-bold">
                        {stats.peakVibe.count} people were {stats.peakVibe.label}!
                      </p>
                      <p className="text-orange-200">
                        at {stats.peakVibe.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mood Influencer */}
              {stats.moodInfluencer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/40"
                >
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Mood Influencer
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-5xl">👑</div>
                    <div>
                      <p className="text-2xl text-white font-bold">
                        {stats.moodInfluencer.name}
                      </p>
                      <p className="text-orange-200">
                        Matched the group vibe {stats.moodInfluencer.percentage}% of the time
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Highlights */}
              <div className="grid md:grid-cols-2 gap-4">
                {stats.highlights.longestStreak.userName && (
                  <HighlightCard
                    emoji="💪"
                    title="Longest Streak"
                    description={`${stats.highlights.longestStreak.userName} stayed ${stats.highlights.longestStreak.moodLabel} for ${stats.highlights.longestStreak.durationText}`}
                  />
                )}
                
                {stats.highlights.mostChanges.userName && (
                  <HighlightCard
                    emoji="🎭"
                    title="Most Mood Changes"
                    description={`${stats.highlights.mostChanges.userName} changed moods ${stats.highlights.mostChanges.count} times`}
                  />
                )}
                
                {stats.highlights.mostReactionsSent.count > 0 && (
                  <HighlightCard
                    emoji="❤️"
                    title="Most Reactions Sent"
                    description={`${stats.highlights.mostReactionsSent.userName} sent ${stats.highlights.mostReactionsSent.count} reactions`}
                  />
                )}
                
                {stats.highlights.mostReactionsReceived.count > 0 && (
                  <HighlightCard
                    emoji="🌟"
                    title="Most Reactions Received"
                    description={`${stats.highlights.mostReactionsReceived.userName} received ${stats.highlights.mostReactionsReceived.count} reactions`}
                  />
                )}
              </div>

              {/* Participants List */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">All Participants</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {stats.participants.map((participant, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{participant.name}</span>
                        {participant.moodEmoji && (
                          <span className="text-2xl">{participant.moodEmoji}</span>
                        )}
                      </div>
                      <div className="flex gap-3 text-xs text-orange-300">
                        <span>⏱️ {participant.timeInSession}</span>
                        <span>💬 {participant.reactionsSent}/{participant.reactionsReceived}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hidden summary card for download */}
            <div id="session-summary-card" className="hidden">
              <div className="w-[1080px] h-[1350px] bg-gradient-to-br from-primary-500 to-accent-500 p-12 flex flex-col">
                <div className="text-center mb-8">
                  <h1 className="text-6xl font-black text-white mb-4">MOOZINGA</h1>
                  <p className="text-2xl text-white/90">Session Summary</p>
                </div>

                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-8 space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold font-mono text-white mb-2">{stats.overview.code}</div>
                    <p className="text-white/80 text-xl">{stats.overview.duration} • {stats.overview.totalParticipants} people</p>
                  </div>

                  <div className="grid grid-cols-5 gap-4 my-8">
                    {Object.values(stats.moodDistribution).map(mood => (
                      mood.count > 0 && (
                        <div key={mood.label} className="text-center">
                          <div className="text-5xl mb-2">{mood.emoji}</div>
                          <div className="text-3xl font-bold text-white">{mood.percentage}%</div>
                        </div>
                      )
                    ))}
                  </div>

                  {stats.peakVibe && (
                    <div className="text-center my-8">
                      <div className="text-6xl mb-3">{stats.peakVibe.emoji}</div>
                      <p className="text-2xl text-white font-bold">
                        Peak: {stats.peakVibe.count} people {stats.peakVibe.label}
                      </p>
                      <p className="text-white/80 text-lg">at {stats.peakVibe.time}</p>
                    </div>
                  )}

                  {stats.moodInfluencer && (
                    <div className="text-center">
                      <div className="text-5xl mb-2">👑</div>
                      <p className="text-2xl text-white font-bold">{stats.moodInfluencer.name}</p>
                      <p className="text-white/80">Mood Influencer • {stats.moodInfluencer.percentage}% match</p>
                    </div>
                  )}
                </div>

                <div className="text-center mt-8">
                  <p className="text-white text-2xl font-medium">Created with MOOZINGA 🔥</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="text-orange-300 mb-2">{icon}</div>
      <p className="text-orange-300 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function HighlightCard({ emoji, title, description }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h4 className="text-white font-bold mb-1">{title}</h4>
          <p className="text-orange-200 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
