# ⚡ SideQuest - 5-Minute Quick Start

## 🚀 Start the App (3 Terminal Windows)

### Terminal 1: MongoDB
```bash
# If you have MongoDB installed locally:
mongod
# OR use MongoDB Atlas (cloud) - just update .env
```

### Terminal 2: Backend
```bash
cd /Users/shreyasgarg/Desktop/SideQuest/sidequest-backend
npm run dev
```
✅ You'll see: `Server running on port 5000`

### Terminal 3: Mobile
```bash
cd /Users/shreyasgarg/Desktop/SideQuest/sidequest-mobile
npx expo start
```
✅ You'll see: QR code + `Press a` (Android) / `Press i` (iOS) / `Press w` (web)

---

## 📱 Try the App

### On Your Phone
1. Download **Expo Go** app (iOS App Store or Android Play Store)
2. Scan the QR code shown in Terminal 3
3. Wait for app to load (30 seconds)

### Test Flow (2 minutes)
```
1. Tap "Sign Up"
   Email: test@test.com
   Password: Test123!
   Name: Test User
   → See Home Feed (empty initially)

2. Tap "+" button (bottom right)
   → Create a SideQuest:
      Title: Coffee Meetup
      Category: café (tap it)
      Date: tomorrow at 2pm
      Location: Downtown Café
      Max Participants: 5
   → Tap "Create"

3. Go back to Home
   → See your "Coffee Meetup" card!

4. Tap the card
   → See full details
   → Tap "Request to Join"
   → Status changes to "You've Joined"
```

---

## 🔧 If Something Doesn't Work

### "Cannot connect to backend" on mobile
**Solution:** Update API URL in `sidequest-mobile/src/services/api.ts` (line 3)
```typescript
// Change this:
const API_URL = 'http://localhost:5000/api';

// To this (your machine's IP):
const API_URL = 'http://192.168.x.x:5000/api';
// Find IP: Run `ifconfig` in terminal, look for inet
```

### "Cannot connect to MongoDB"
**Solution:** Make sure MongoDB is running
```bash
# Test connection:
mongosh
# Type: exit
# If it works, MongoDB is running
```

### "EADDRINUSE: port 5000 is already in use"
**Solution:** Kill the process using port 5000
```bash
# macOS/Linux:
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Then restart backend
```

### Mobile app won't load
**Solution:** Hard refresh
```bash
# In Expo terminal:
Press 'r' to reload
# Wait 10 seconds
```

---

## 📡 Test Backend Directly (Optional)

### Using curl (macOS/Linux)

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

**Create SideQuest** (replace TOKEN with token from login)
```bash
curl -X POST http://localhost:5000/api/sidequests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Coffee Date",
    "description": "Casual coffee with friends",
    "category": "café",
    "dateTime": "2025-01-22T14:00:00Z",
    "location": "Downtown Café",
    "maxParticipants": 5
  }'
```

---

## 📁 Project Layout

```
SideQuest/
├── sidequest-backend/
│   ├── src/
│   │   ├── models/        ← Database schemas
│   │   ├── controllers/   ← Business logic
│   │   ├── routes/        ← API endpoints
│   │   ├── middleware/    ← Auth verification
│   │   └── index.js       ← Main server
│   ├── .env               ← Config (MongoDB, JWT)
│   └── package.json
│
└── sidequest-mobile/
    ├── src/
    │   ├── screens/       ← App pages (Login, Home, Create, etc)
    │   ├── components/    ← Reusable buttons, inputs, cards
    │   ├── navigation/    ← Screen routing
    │   ├── services/      ← API client
    │   ├── contexts/      ← Auth state
    │   └── theme/         ← Colors, fonts, spacing
    └── package.json
```

---

## 🎨 App Structure

```
SideQuest App
└── Auth Stack (Not logged in)
    ├── Login
    └── Sign Up

SideQuest App
└── Home Stack (Logged in)
    ├── Home Feed
    │   ├── Browse sidequests
    │   ├── Pull to refresh
    │   └── Floating action button (+)
    ├── Create SideQuest
    │   ├── Form with validation
    │   └── Date picker
    └── SideQuest Details
        ├── Full information
        ├── Creator info
        ├── Participants list
        └── Join button
```

---

## 🛠️ Common Commands

### Backend
```bash
cd sidequest-backend

npm run dev      # Start dev server (auto-reload)
npm run start    # Start production server
npm test         # Run tests (when added)
```

### Mobile
```bash
cd sidequest-mobile

npx expo start           # Start dev server
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
npm run web              # Run in browser (limited)
```

---

## 📚 Documentation to Read

1. **README.md** (5 min) - Overview & setup
2. **GETTING_STARTED.md** (10 min) - Visual guide
3. **BUILD_PROGRESS.md** (15 min) - What's built & next steps
4. **COMPLETE_REFERENCE.md** (30 min) - Full architecture
5. **FILES_CREATED.md** (10 min) - File-by-file breakdown

---

## ✅ Verification Checklist

- [ ] MongoDB running (test with `mongosh`)
- [ ] Backend running (`npm run dev` in sidequest-backend)
- [ ] Mobile app running (`npx expo start` in sidequest-mobile)
- [ ] Can create account
- [ ] Can create sidequest
- [ ] Can see sidequest in feed
- [ ] Can view sidequest details

---

## 🎯 Next Steps After Testing

1. Build ManageRequestsScreen (accept/reject join requests)
2. Build ProfileScreen (user settings)
3. Add error handling & loading states
4. Add animations
5. Deploy backend to cloud
6. Test on real devices

---

## 📞 Debugging Tips

### Check Backend Logs
```bash
# Terminal running backend - look for errors
# Should see: Server running on port 5000
```

### Check Mobile Logs
```bash
# In Expo (press 'j' for web inspector)
# Or: Open browser DevTools (press 'w')
```

### Common Issues
| Issue | Solution |
|-------|----------|
| Can't connect to MongoDB | Run `mongod` first |
| Backend port in use | Kill process: `lsof -i :5000 \| awk '{print $2}' \| xargs kill` |
| Mobile won't load | Press 'r' in Expo to reload |
| CORS error | Check backend `.env` and server setup |
| Token invalid | Logout and login again |

---

## 🎉 Success!

When you see:
- ✅ Backend: "Server running on port 5000"
- ✅ Mobile: QR code displayed
- ✅ App loads in Expo Go
- ✅ Can create account
- ✅ Can create sidequest

**You're done! The app is running!** 🚀

---

## 💡 Pro Tips

1. **Use Expo Go** - Easiest way to test (no build needed)
2. **Keep terminals open** - You'll need all 3 running
3. **Test on real phone** - Better UX than simulator
4. **Read error messages** - They're usually helpful!
5. **Check both logs** - Backend + mobile may have clues

---

## 📱 Screenshots You Should See

**Login Screen**: Purple header with email/password inputs
**Home Feed**: Cards showing sidequests with "+" button
**Create Form**: Input fields with date picker
**Details Screen**: Full info with "Request to Join" button
**Success**: "You've Joined" badge appears

---

**Ready? Let's go! 🚀**

Ask any questions, check the docs, or inspect logs. You've got this!

---

*SideQuest Quick Start - 5 minutes to a running app!*
