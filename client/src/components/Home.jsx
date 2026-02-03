import { motion } from 'framer-motion';
import { Sparkles, Users, Zap } from 'lucide-react';
import { useNavigate } from './navigation';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#2D1B1B] via-[#1A0B0B] to-[#2D1B1B]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 blur-2xl opacity-50"></div>
              <h1 className="relative text-5xl sm:text-6xl md:text-8xl font-black bg-gradient-to-r from-orange-300 via-red-300 to-orange-300 bg-clip-text text-transparent">
                MOOZINGA
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-orange-200 mb-4"
          >
            Track your team's vibe in real-time
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-orange-300 text-sm md:text-base max-w-md mx-auto"
          >
            Create a session, share the code, and see how everyone's feeling — no signup needed!
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Simple & Fast"
            description="No signup, no hassle. Just start tracking."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Team Vibes"
            description="See everyone's mood in one glance."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Real-time Updates"
            description="Changes sync instantly across devices."
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('create')}
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl font-bold text-white text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
          >
            <span className="relative z-10">Create Session</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button
            onClick={() => navigate('join')}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl font-bold text-white text-lg hover:bg-white/20 transition-all hover:scale-105"
          >
            Join Session
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-16 text-orange-300 text-sm"
        >
          <p>Sessions expire after 24 hours • Up to 50 people per session</p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="text-orange-300 mb-3">{icon}</div>
      <h3 className="text-white font-bold mb-2">{title}</h3>
      <p className="text-orange-300 text-sm">{description}</p>
    </motion.div>
  );
}
