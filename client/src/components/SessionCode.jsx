import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';

export default function SessionCode({ code }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <Hash className="w-5 h-5 text-orange-300" />
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white font-bold text-xl font-mono tracking-wider"
      >
        {code}
      </motion.span>
    </div>
  );
}
