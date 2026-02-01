# MOOZINGA Color Update Guide
# Purple/Blue → Orange/Red Theme

## Color Mappings:
- `purple-900` → `[#2D1B1B]` (dark warm background)
- `blue-900` → `[#1A0B0B]` (darkest warm background)
- `purple-800` → `[#2D1B1B]`
- `purple-500` → `primary-500` (#FF6B35)
- `purple-600` → `primary-600`
- `purple-400` → `primary-400`
- `purple-300` → `orange-300`
- `purple-200` → `orange-200`
- `blue-500` → `accent-500` (#E63946)
- `blue-600` → `accent-600`
- `blue-400` → `red-400`
- `blue-300` → `red-300`

## Files to Update:
1. ✅ Home.jsx - DONE
2. CreateSession.jsx
3. JoinSession.jsx
4. SessionRoom.jsx
5. MoodSelector.jsx
6. UserCard.jsx
7. SessionCode.jsx
8. App.jsx (toast colors)

## Global Replacements Needed:
- All `bg-gradient-to-br from-purple-` → `bg-gradient-to-br from-[#2D1B1B] via-[#1A0B0B]`
- All `from-purple-500 to-blue-500` → `from-primary-500 to-accent-500`
- All `text-purple-` → `text-orange-`
- All `border-purple-` → `border-primary-`
- All `hover:bg-purple-` → `hover:bg-primary-`
- All `shadow-purple-` → `shadow-primary-`
