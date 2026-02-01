# 🔥 MOOZINGA - Team Mood Tracking v2.0

**Track your team's vibe in real-time** — A beautiful, session-based mood tracking web app with orange-red theme.

![Status](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-orange?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-red?style=for-the-badge&logo=node.js)

## ✨ NEW FEATURES (v2.0)

### 🎨 Orange-Red Theme
- Complete redesign with warm orange-red gradient
- Enhanced glass-morphism effects
- Better contrast and readability

### ❤️ Reactions & Nudges
- Send reactions to team members:
  - ❤️ Hug - Virtual hug
  - 👋 Wave - Say hi
  - ☕ Chai break? - Suggest tea/coffee
  - 🔥 Let's go! - Motivate
  - 💪 You got this! - Encourage
- Real-time toast notifications
- Reaction counters on user cards
- 3-second cooldown to prevent spam
- Floating heart particle effects

### 📊 Session Stats & Summary
- Comprehensive end-session statistics
- Mood distribution pie chart
- Peak vibe moment detection
- Mood influencer (who matched the group vibe most)
- Individual highlights
- Downloadable Instagram story-sized summary card
- Participant breakdown with time tracking

### 📱 QR Code Join
- Generate QR codes for easy session joining
- Scan to join (no manual code entry)
- Download QR codes as images
- URL parameter support (?code=XXX-XXX)
- Print-friendly format

### ✨ Smooth Animations
- Page transitions with Framer Motion
- Stagger animations for user cards
- Bounce and scale micro-interactions
- Chart animations
- Toast slide-in from right
- Particle effects for reactions

## ✨ Features

- 🚀 **No Signup Required** - Create or join sessions with just a code
- 🎨 **Beautiful UI** - Glass-morphism design with smooth animations
- ⚡ **Real-time Updates** - See mood changes instantly across all devices
- 🎭 **5 Moods** - Happy, Sad, Tired, Energetic, Focused
- 👥 **Team Overview** - See overall vibe and individual statuses
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- ⏰ **Auto-expiring Sessions** - Sessions last 24 hours
- 💾 **In-memory Storage** - No database needed

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time communication
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.io** - WebSocket server
- **Nanoid** - Session code generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
cd d:\Moozinga
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

### Running the App

1. **Start the server** (Terminal 1)
```bash
cd server
npm start
```
Server will run on `http://localhost:3001`

2. **Start the client** (Terminal 2)
```bash
cd client
npm run dev
```
Client will run on `http://localhost:5173`

3. **Open your browser** and visit `http://localhost:5173`

## 📖 How to Use

1. **Create a Session**
   - Click "Create Session"
   - Enter your name
   - Share the session code with your team

2. **Join a Session**
   - Click "Join Session"
   - Enter the session code
   - Enter your name

3. **Set Your Mood**
   - Select from 5 moods: Happy 😊, Sad 😢, Tired 😴, Energetic 🔥, Focused 💪
   - Optionally add a status message
   - See real-time updates from your team

## 🎨 Features in Detail

### Session Management
- **Unique Codes**: Each session gets a code like `ABC-123`
- **Auto-cleanup**: Sessions expire after 24 hours
- **Max Capacity**: Up to 50 users per session
- **Instant Join**: No authentication required

### Real-time Experience
- **Live Updates**: See mood changes as they happen
- **Connection Status**: Visual indicator for online/offline state
- **User Tracking**: Know when people join or leave
- **Overall Vibe**: See the dominant mood of your team

### Beautiful Design
- **Glass-morphism**: Modern frosted glass effects
- **Smooth Animations**: Powered by Framer Motion
- **Gradient Themes**: Purple and blue aesthetic
- **Responsive Layout**: Mobile-first design

## 📁 Project Structure

```
Moozinga/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Home.jsx
│   │   │   ├── CreateSession.jsx
│   │   │   ├── JoinSession.jsx
│   │   │   ├── SessionRoom.jsx
│   │   │   ├── MoodSelector.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── SessionCode.jsx
│   │   │   └── navigation.jsx
│   │   ├── context/       # React Context
│   │   │   └── SessionContext.jsx
│   │   ├── hooks/         # Custom hooks
│   │   │   └── useSocket.js
│   │   ├── utils/         # Constants & helpers
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                # Node.js backend
    ├── src/
    │   ├── server.js      # Express + Socket.io setup
    │   ├── sessionManager.js  # Session logic
    │   └── socketHandler.js   # WebSocket events
    └── package.json
```

## 🔧 Configuration

### Environment Variables (Optional)

**Client** - Create `client/.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

**Server** - Create `server/.env`:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

## 🎯 API Endpoints

### REST API

- `GET /api/health` - Server health check
- `POST /api/session/create` - Create new session
- `POST /api/session/join` - Join existing session
- `GET /api/session/:code` - Get session details

### WebSocket Events

**Client → Server:**
- `join-session` - Join session room
- `update-mood` - Update user's mood
- `leave-session` - Leave session

**Server → Client:**
- `session-state` - Full session state
- `user-joined` - New user joined
- `mood-updated` - Mood changed
- `user-left` - User left session

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Socket connection issues:**
- Check if server is running on port 3001
- Verify CORS settings in server.js
- Check browser console for errors

**Dependencies issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development

### Run in Development Mode

**Server** (with auto-reload):
```bash
cd server
npm run dev
```

**Client** (with hot reload):
```bash
cd client
npm run dev
```

### Build for Production

**Client:**
```bash
cd client
npm run build
```

### Preview Production Build

```bash
cd client
npm run preview
```

## 🌟 Future Enhancements

- [ ] Custom emoji reactions
- [ ] Session history/analytics
- [ ] Private messages
- [ ] Persistent storage option
- [ ] Admin controls
- [ ] Custom themes
- [ ] Export mood reports
- [ ] Mobile app (React Native)

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

---

**Built with ❤️ using React, Node.js, and Socket.io**

Happy mood tracking! 🎭✨
