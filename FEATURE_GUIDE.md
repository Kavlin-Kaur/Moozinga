# 🎯 MOOZINGA - Priority 2 Features User Guide

## How to Use the New Features

### 🕐 Mood Timeline

**Location:** Session Room → Left column below Mood Selector

**How to Use:**
1. Click **"Show"** button to reveal your mood timeline
2. **Hover** over any mood emoji to see details:
   - Exact time you changed mood
   - Mood name
   - Status message (if you added one)
3. **Scroll horizontally** to see your full mood journey
4. Click **"Export"** button to download timeline as image
5. Share the image on social media!

**Stats Shown:**
- Total mood changes during session
- Session duration in minutes
- First mood (marked with "1st" badge)
- Current mood (marked with "Now" badge)

**Timeline Features:**
- Color-coded lines showing mood transitions
- Gradient effects between different moods
- Smooth animations when moods appear
- Grid background for visual appeal

---

### 💬 In-Session Chat

**Location:** Floating button (bottom-right corner)

**How to Use:**
1. Click the **chat button** (💬) to open sidebar
2. Type your message in the input field (max 500 characters)
3. Click **smiley face** button to open emoji picker
4. Select from 8 quick emojis or type your own
5. Click **Send** button or press Enter
6. **Close** sidebar by clicking X (chat stays in background)

**Chat Features:**
- **Your messages:** Orange gradient bubbles on right
- **Others' messages:** White bubbles on left
- **Timestamps:** Show below each message
- **Auto-scroll:** Always shows latest message
- **Unread counter:** Badge shows message count when closed
- **Message history:** Keeps last 100 messages

**Tips:**
- Messages show sender's name and avatar initial
- Your avatar is orange gradient
- Others' avatars are different colors
- Chat persists throughout session

---

### 🗳️ Quick Polls

**Location:** Session Room → Right column below Mood Selector

**How to Create a Poll:**
1. Click **"Create Quick Poll"** button
2. Enter your **question** (max 200 characters)
3. Add at least **2 options** (max 6 options, 100 chars each)
4. Click **+ Add Option** to add more choices
5. Click **X** next to option to remove it
6. Click **"Create Poll"** when ready
7. Poll appears instantly for all users!

**How to Vote:**
1. See the poll question and options
2. Click on your choice
3. **Confetti celebration!** 🎉
4. See real-time results:
   - Your vote highlighted with ring
   - Progress bars show percentages
   - Vote counts for each option
5. Change your vote by clicking another option

**Poll Features:**
- **One poll at a time** - Clear before creating new
- **Real-time updates** - See votes as they come in
- **Anonymous voting** - Only you know your choice
- **Creator shown** at bottom
- **Total vote count** displayed
- **Percentage bars** animated smoothly

**Tips:**
- Only one active poll allowed
- Creator's name shown at bottom
- Your vote has a checkmark ✓
- Percentages update instantly
- Confetti makes voting fun!

---

## 🔔 Feature Interactions

### **Timeline + Mood Changes:**
- Every time you update your mood
- A new point appears on timeline
- Line connects to previous mood
- Stats update automatically

### **Chat + Reactions:**
- Send message in chat
- Send reaction to user
- Both work together!

### **Poll + Chat:**
- Create poll to ask question
- Discuss results in chat
- Vote together as team

---

## 🎨 Visual Guide

### **Mood Timeline Layout:**
```
┌─────────────────────────────────────┐
│  📊 Your Mood Journey    [Show/Hide]│
├─────────────────────────────────────┤
│  [3] mood changes • [45] minutes    │
├─────────────────────────────────────┤
│  😊─────😴─────🔥─────💪  [Export]  │
│  ^1st              ^Now              │
└─────────────────────────────────────┘
```

### **Chat Sidebar Layout:**
```
┌──────────────────────┐
│ 💬 Team Chat      [X]│
├──────────────────────┤
│  [Other] Hey!        │
│      [You] Hello! 😊 │
│  [Other] How are you?│
├──────────────────────┤
│ [😊] [Type msg] [▶] │
└──────────────────────┘
```

### **Quick Poll Layout:**
```
┌─────────────────────────────┐
│ 📊 What should we do next?  │
│    5 votes • You voted       │
├─────────────────────────────┤
│ ✓ Option 1  ▓▓▓▓▓▓░░ 60% [3]│
│   Option 2  ▓▓▓░░░░░ 40% [2]│
├─────────────────────────────┤
│ Created by Rahul            │
└─────────────────────────────┘
```

---

## 💡 Pro Tips

### **Mood Timeline:**
- Keep changing moods throughout session for rich timeline
- Add status messages - they appear in hover tooltips!
- Export timeline at end of session as memory
- Timeline shows YOUR journey, not group's

### **Chat:**
- Use emojis to make messages fun
- Keep messages under 500 chars (counter shows remaining)
- Chat history saved during session
- Close sidebar to focus, reopen to check messages

### **Polls:**
- Keep questions short and clear
- Offer 3-4 options for best results
- Vote immediately to see confetti!
- Watch percentages change as team votes
- Create new poll by ending session (creator only)

---

## 🐛 Troubleshooting

### **Timeline is empty?**
- Update your mood at least once
- Timeline needs mood changes to show
- Backend must send user-specific timeline data

### **Chat not working?**
- Check if you're connected (green "Live" indicator)
- Refresh page if offline
- Messages require active socket connection

### **Poll won't create?**
- Only creator can create first poll
- Clear existing poll first (end session)
- Need at least 2 options with text
- Question must not be empty

### **Can't vote?**
- Already voted? Click different option to change
- Must be member of session
- Poll must be active (not expired)

---

## 🚀 Feature Combinations

### **Best Practices:**

1. **Start Session:**
   - Set initial mood
   - Create welcome poll: "Ready to start?"
   - Say hi in chat

2. **During Session:**
   - Update mood as it changes
   - Use chat for quick questions
   - Create polls for decisions
   - Check timeline to see progress

3. **End Session:**
   - Export timeline before leaving
   - Save interesting poll results
   - Review chat history
   - View session stats

---

## 🎁 Hidden Features

1. **Confetti** shoots when you vote (canvas-confetti library)
2. **Auto-scroll** in chat keeps latest visible
3. **Unread badge** shows message count when chat closed
4. **Grid background** in timeline for aesthetic appeal
5. **Gradient connectors** between timeline moods
6. **Spring physics** in chat sidebar animation
7. **Character counters** in poll creator
8. **Hover tooltips** show full mood details

---

## 📊 Metrics & Stats

### **Chat:**
- Up to 100 messages stored
- 500 character limit per message
- 8 quick emojis available
- Real-time delivery (<100ms)

### **Poll:**
- 1 active poll at a time
- 2-6 options allowed
- 200 char question limit
- 100 char per option
- Unlimited voters

### **Timeline:**
- Tracks all mood changes
- Shows session duration
- Counts total changes
- Export as 2x PNG

---

## 🎉 Enjoy MOOZINGA!

All Priority 2 features are now live and ready to use. Create amazing mood tracking sessions with your team! 🚀

**Questions?** Check the main README or contact support.
**Bugs?** Report in GitHub issues.
**Feedback?** We'd love to hear it!
