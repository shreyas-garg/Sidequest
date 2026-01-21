#!/bin/bash

# SideQuest Setup Script
# This script helps set up both backend and mobile app

echo "🚀 Welcome to SideQuest Setup!"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Backend Setup${NC}"
echo "========================================"
echo ""
echo "1a. Do you have MongoDB running? (y/n)"
read -r has_mongo

if [ "$has_mongo" != "y" ]; then
    echo -e "${YELLOW}⚠️  MongoDB not running. Please install MongoDB:${NC}"
    echo "   • Local: https://www.mongodb.com/try/download/community"
    echo "   • Cloud: https://www.mongodb.com/cloud/atlas"
    echo ""
    echo "After installing, come back and run this script again."
    exit 1
fi

echo ""
echo "1b. Creating/checking .env file..."
if [ ! -f "sidequest-backend/.env" ]; then
    echo "Creating .env file..."
    cat > "sidequest-backend/.env" << EOF
MONGODB_URI=mongodb://localhost:27017/sidequest
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
EOF
    echo -e "${GREEN}✓ .env created!${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Install Backend Dependencies${NC}"
echo "========================================"
cd sidequest-backend
npm install
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo ""
echo -e "${BLUE}Step 3: Install Mobile Dependencies${NC}"
echo "========================================"
cd sidequest-mobile
npm install --legacy-peer-deps
cd ..
echo -e "${GREEN}✓ Mobile dependencies installed${NC}"

echo ""
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Setup Complete! ✨${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
echo "📱 Next Steps:"
echo ""
echo "1️⃣  Start Backend Server (in a new terminal):"
echo "   cd sidequest-backend"
echo "   npm run dev"
echo ""
echo "2️⃣  Start Mobile App (in another terminal):"
echo "   cd sidequest-mobile"
echo "   npx expo start"
echo ""
echo "3️⃣  Test on your device:"
echo "   • Scan QR code with Expo Go app (iOS/Android)"
echo "   • OR: npm run ios / npm run android"
echo ""
echo "🔗 To connect mobile to backend:"
echo "   • If backend is on localhost: no changes needed"
echo "   • If backend is remote: update API_URL in"
echo "     src/services/api.ts (line 3)"
echo ""
echo "📖 For detailed info, see BUILD_PROGRESS.md"
echo ""
