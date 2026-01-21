# SideQuest - Your Spontaneous Adventure Hub

A React Native Expo mobile app that helps people create and join spontaneous or planned activities.

## 📁 Project Structure

```
SideQuest/
├── sidequest-mobile/     # React Native Expo app (iOS/Android)
└── sidequest-backend/    # Node.js + Express API
```

## 🚀 Quick Start

### Backend Setup

1. **Install MongoDB**
   - Option A: Use MongoDB Atlas (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)
   - Option B: Install locally - [Download](https://www.mongodb.com/try/download/community)

2. **Configure Environment Variables**
   ```bash
   cd sidequest-backend
   # Update .env file with your MongoDB URI and JWT secret
   ```

3. **Start Backend Server**
   ```bash
   cd sidequest-backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Mobile App Setup

1. **Install Dependencies**
   ```bash
   cd sidequest-mobile
   npm install
   ```

2. **Update API URL** (if not localhost)
   - Edit `src/services/api.ts`
   - Change `API_URL` to your backend server

3. **Run on iOS/Android**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Expo Go (preview)
   npx expo start
   ```

## 📱 Core Features

✅ **Authentication**
- User registration & login
- Secure JWT-based sessions
- Token stored in device secure storage

✅ **SideQuest Management**
- Create sidequests with title, description, category, date, location, max participants
- Browse & discover sidequests
- Filter by category, location, search

✅ **Join Requests**
- Request to join a sidequest
- Creator can accept/reject requests
- Auto-close when max capacity reached

✅ **User Profiles**
- Profile management with bio and interests
- Creator visibility on cards
- Participant management

## 🎨 UI/UX Features

- Modern card-based feed with hero images
- Category badges with color coding
- Smooth animations & transitions
- Responsive design across all devices
- Dark/light mode ready
- Accessibility-first component design

## 🛠️ Tech Stack

**Mobile**
- React Native + Expo
- React Navigation
- TanStack React Query
- Formik + Yup (forms)
- React Native Paper (UI)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### SideQuests
- `GET /api/sidequests` - Get all sidequests
- `GET /api/sidequests/:id` - Get sidequest details
- `GET /api/sidequests/my-sidequests` - Get user's sidequests
- `POST /api/sidequests` - Create sidequest
- `PUT /api/sidequests/:id` - Update sidequest
- `DELETE /api/sidequests/:id` - Delete sidequest

### Join Requests
- `POST /api/joinrequests/request-join` - Request to join
- `GET /api/joinrequests/:sideQuestId/requests` - Get pending requests
- `PUT /api/joinrequests/:requestId/accept` - Accept request
- `PUT /api/joinrequests/:requestId/reject` - Reject request
- `DELETE /api/joinrequests/:sideQuestId/participant/:userId` - Remove participant

## 🔐 Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiration
- Secure token storage using Expo SecureStore
- Authorization checks on all protected routes
- Input validation on all endpoints

## 📅 Development Progress

- [x] Project initialization
- [x] Backend scaffolding (models, routes, controllers)
- [x] Mobile app setup with navigation
- [x] Auth system (login, register, token handling)
- [x] API service layer (Axios)
- [x] Theme system (colors, typography, spacing)
- [x] Core UI components (Button, Input, Card)
- [ ] Detailed screens (Details, Manage Requests, Profile)
- [ ] Join request flows
- [ ] UI animations & polishing
- [ ] Testing & deployment

## 🚢 Deployment

### Backend
- Heroku, Railway, or Vercel
- Set environment variables on host

### Mobile
- EAS Build for production
- Submit to App Store/Google Play

## 📝 Environment Variables

**Backend (.env)**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

1. Create feature branches
2. Keep commits clean and descriptive
3. Test before pushing

## 📄 License

ISC

---

**Happy exploring! 🚀**
