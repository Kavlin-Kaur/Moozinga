import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { API_BASE_URL, MAX_NAME_LENGTH } from '../utils/constants';
import { useNavigate } from './navigation';
import toast from 'react-hot-toast';

export default function CreateSession() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinSession } = useSession();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (name.trim().length > MAX_NAME_LENGTH) {
      toast.error(`Name must be ${MAX_NAME_LENGTH} characters or less`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session');
      }

      // Save session info
      joinSession(data.code, data.userId, name.trim());

      toast.success('Session created! 🎉');
      navigate('session');

    } catch (error) {
      console.error('Create session error:', error);
      toast.error(error.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#2D1B1B] via-[#1A0B0B] to-[#2D1B1B]">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('home')}
        className="absolute top-8 left-8 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Glass card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12 text-orange-300" />
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Create Session
            </h2>
            <p className="text-orange-200 text-center mb-8">
              Start tracking your team's vibe
            </p>

            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-orange-200 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={MAX_NAME_LENGTH}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all disabled:opacity-50"
                  autoFocus
                />
                <p className="text-xs text-orange-300 mt-1">
                  {name.length}/{MAX_NAME_LENGTH}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Session'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-primary-500/10 border border-primary-400/20">
              <p className="text-xs text-orange-200 text-center">
                You'll get a unique session code to share with your team
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
