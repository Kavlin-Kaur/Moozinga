import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Hash } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { API_BASE_URL, MAX_NAME_LENGTH } from '../utils/constants';
import { useNavigate } from './navigation';
import toast from 'react-hot-toast';

export default function JoinSession() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinSession } = useSession();
  const navigate = useNavigate();

  // Check for code in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      setCode(formatCode(codeParam));
      toast.success('Session code detected from URL!');
    }
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!code.trim()) {
      toast.error('Please enter session code');
      return;
    }

    if (name.trim().length > MAX_NAME_LENGTH) {
      toast.error(`Name must be ${MAX_NAME_LENGTH} characters or less`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/session/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userName: name.trim(), 
          code: code.trim().toUpperCase() 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join session');
      }

      // Save session info
      joinSession(code.trim().toUpperCase(), data.userId, name.trim());

      toast.success('Joined session! 🎉');
      navigate('session');

    } catch (error) {
      console.error('Join session error:', error);
      toast.error(error.message || 'Failed to join session');
    } finally {
      setLoading(false);
    }
  };

  const formatCode = (value) => {
    // Remove non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Add hyphen after 3 characters
    if (cleaned.length > 3) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`;
    }
    return cleaned;
  };

  const handleCodeChange = (e) => {
    const formatted = formatCode(e.target.value);
    setCode(formatted);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#2D1B1B] via-[#1A0B0B] to-[#2D1B1B]">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('home')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Glass card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 shadow-2xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <Hash className="w-12 h-12 text-accent-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
              Join Session
            </h2>
            <p className="text-orange-200 text-center mb-8">
              Enter the session code to join
            </p>

            <form onSubmit={handleJoin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-orange-200 mb-2">
                  Session Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="ABC-123"
                  maxLength={7}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all disabled:opacity-50 text-center text-xl sm:text-2xl font-mono tracking-wider"
                  autoFocus
                />
              </div>

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
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all disabled:opacity-50"
                />
                <p className="text-xs text-orange-300 mt-1">
                  {name.length}/{MAX_NAME_LENGTH}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || !code.trim()}
                className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 text-white font-bold text-base sm:text-lg hover:from-accent-600 hover:to-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-accent-500/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Session'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-accent-500/10 border border-accent-400/20">
              <p className="text-xs text-orange-200 text-center">
                Ask the session creator for the code
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
