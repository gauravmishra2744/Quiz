# 🔥 FIREBASE REALTIME DATABASE SETUP

## ⚠️ IMPORTANT: Realtime Database Enable Karo

**Bhai, abhi sirf project bana hai, database enable nahi kiya!**

### 1. Firebase Console mein jao:
https://console.firebase.google.com/project/ai-class-quiz

### 2. Realtime Database Enable karo:
1. Left sidebar → **"Build"** → **"Realtime Database"**
2. **"Create Database"** button click karo
3. **"Start in test mode"** select karo
4. **"Enable"** click karo

### 3. Database Rules set karo:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 4. Test karo:
```bash
npm run dev
```

## ✅ VERIFICATION STEPS:

### Test 1: Teacher Dashboard
1. Go to `http://localhost:3000/teacher`
2. Login: `teacher123`
3. Click "Create New Quiz"
4. Add questions
5. Click "Create Quiz & Show QR"

### Test 2: Student Quiz
1. Open quiz URL in new tab
2. Enter name → Join Quiz
3. Answer questions
4. Check if data saves in Firebase

### Test 3: Real-time Updates
1. Keep teacher control page open
2. Student submits quiz
3. Check if leaderboard updates live

## 🚨 COMMON ERRORS:

### Error: "Permission denied"
**Fix:** Database rules not set properly
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Error: "Database not found"
**Fix:** Realtime Database not enabled
- Go to Firebase Console → Build → Realtime Database → Create

### Error: "Invalid configuration"
**Fix:** Check .env.local file
```
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://ai-class-quiz-default-rtdb.firebaseio.com
```

## 📱 MOBILE TESTING:

1. Run `npm run dev`
2. Get your local IP: `ipconfig`
3. Access from mobile: `http://YOUR_IP:3000`
4. Test QR scanning

## 🚀 DEPLOYMENT READY:

Once local testing works:
1. Push to GitHub
2. Deploy to Vercel
3. Add environment variables
4. Test live URL

**Bhai, Firebase Realtime Database enable karo pehle!** 🔥