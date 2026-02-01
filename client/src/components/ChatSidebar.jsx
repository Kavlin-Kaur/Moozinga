import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, ChevronLeft, ChevronRight, Smile } from 'lucide-react';

export default function ChatSidebar({ 
  isOpen, 
  onToggle, 
  messages = [], 
  onSendMessage, 
  currentUserId,
  currentUserName 
}) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickEmojis = ['😊', '😂', '❤️', '🔥', '👍', '🎉', '✨', '💪'];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message.trim());
    setMessage('');
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <>
      {/* Toggle Button (always visible) */}
      {!isOpen && (
        <motion.button
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          onClick={onToggle}
          className="fixed right-6 bottom-6 p-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-2xl hover:scale-110 transition-transform z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-6 h-6" />
          {messages.length > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent-500 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-bold">{messages.length}</span>
            </div>
          )}
        </motion.button>
      )}

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gradient-to-b from-[#2D1B1B] to-[#1A0B0B] border-l border-white/20 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-orange-300" />
                <h3 className="text-lg font-bold text-white">Team Chat</h3>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-orange-300 opacity-50" />
                  <p className="text-orange-300 text-sm">No messages yet</p>
                  <p className="text-orange-200 text-xs mt-1">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.userId === currentUserId;
                  const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      {showAvatar ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isOwn 
                            ? 'bg-gradient-to-br from-primary-500 to-accent-500' 
                            : 'bg-gradient-to-br from-orange-500 to-orange-600'
                        } text-white flex-shrink-0`}>
                          {msg.userName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-8 flex-shrink-0" />
                      )}

                      {/* Message Bubble */}
                      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        {showAvatar && !isOwn && (
                          <span className="text-xs text-orange-300 mb-1 px-2">{msg.userName}</span>
                        )}
                        
                        <div className={`px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-tr-sm'
                            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-tl-sm'
                        }`}>
                          <p className="text-sm break-words">{msg.message}</p>
                        </div>
                        
                        <span className="text-xs text-orange-300/60 mt-1 px-2">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Emoji Bar */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/20 bg-white/5 overflow-hidden"
                >
                  <div className="p-3 flex gap-2 flex-wrap">
                    {quickEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-sm">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-3 rounded-xl transition-all ${
                    showEmojiPicker 
                      ? 'bg-primary-500/20 text-primary-300' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  } border border-white/20`}
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  maxLength={500}
                />
                
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-orange-300/60 mt-2">
                {message.length}/500
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
