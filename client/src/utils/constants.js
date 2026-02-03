export const MOODS = [
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    color: '#FFB347',
    gradient: 'from-orange-300 to-orange-400'
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    color: '#6C9BCF',
    gradient: 'from-blue-400 to-blue-500'
  },
  {
    id: 'tired',
    label: 'Tired',
    emoji: '😴',
    color: '#9D84B7',
    gradient: 'from-purple-400 to-purple-500'
  },
  {
    id: 'energetic',
    label: 'Energetic',
    emoji: '🔥',
    color: '#FF4500',
    gradient: 'from-red-500 to-orange-600'
  },
  {
    id: 'focused',
    label: 'Focused',
    emoji: '💪',
    color: '#F59E0B',
    gradient: 'from-amber-400 to-orange-500'
  }
];

export const REACTIONS = [
  { id: 'hug', emoji: '❤️', label: 'Hug' },
  { id: 'wave', emoji: '👋', label: 'Wave' },
  { id: 'chai', emoji: '☕', label: 'Chai break?' },
  { id: 'letgo', emoji: '🔥', label: "Let's go!" },
  { id: 'encourage', emoji: '💪', label: 'You got this!' }
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://moozinga.fly.dev';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://moozinga.fly.dev';

export const SESSION_EXPIRY_HOURS = 24;
export const MAX_SESSION_USERS = 50;
export const MAX_NAME_LENGTH = 30;
export const MAX_STATUS_LENGTH = 100;
