# ClassQuiz - Real-time Classroom Quiz System

A production-ready Next.js application for conducting interactive classroom quizzes with real-time leaderboards using Firebase Realtime Database.

## Features

- **Teacher Dashboard**: Create quizzes, generate QR codes, monitor live leaderboards
- **Student Interface**: Join via QR code, take quizzes, view results
- **Real-time Updates**: Live leaderboard updates using Firebase Realtime Database
- **QR Code Generation**: Easy quiz sharing with QR codes
- **CSV Export**: Export quiz responses for analysis
- **Mobile Responsive**: Works on all devices
- **TypeScript**: Full type safety

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ClassQuiz
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Realtime Database**
4. Set database rules to test mode (for demo):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   ⚠️ **Important**: Tighten these rules for production use

5. Go to Project Settings > General > Your apps
6. Add a web app and copy the config

### 3. Environment Variables

Create `.env.local` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Base URL for QR code generation
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Teacher Authentication
TEACHER_PASSCODE=teacher123
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Usage Guide

### For Teachers

1. Go to `/teacher` and enter passcode (default: `teacher123`)
2. Click "Create New Quiz"
3. Fill in quiz details (pre-populated with sample questions)
4. Click "Create Quiz"
5. Use "Show QR Code" to display QR for students
6. Monitor live leaderboard as students submit

### For Students

1. Scan QR code or visit quiz URL
2. Enter your name
3. Answer questions one by one
4. View your score and leaderboard

### Testing Locally

1. Open teacher dashboard in one browser window
2. Create a quiz and get the QR code/URL
3. Open the quiz URL in another browser/mobile device
4. Take the quiz as a student
5. Watch the leaderboard update in real-time

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables in Vercel:
   - Go to Settings > Environment Variables
   - Add all the variables from your `.env.local`
   - Set `NEXT_PUBLIC_BASE_URL` to your Vercel domain (e.g., `https://your-app.vercel.app`)

### 3. Deploy

Vercel will automatically deploy. Your app will be available at `https://your-app.vercel.app`

## Project Structure

```
ClassQuiz/
├── app/                          # Next.js App Router pages
│   ├── teacher/                  # Teacher dashboard
│   │   ├── create/              # Create quiz page
│   │   └── quiz/[quizId]/       # Manage specific quiz
│   ├── quiz/[quizId]/           # Student quiz interface
│   ├── leaderboard/[quizId]/    # Public leaderboard
│   └── page.tsx                 # Home page
├── components/                   # Reusable React components
│   ├── QuizForm.tsx             # Quiz creation form
│   ├── QuestionCard.tsx         # Individual question display
│   ├── Leaderboard.tsx          # Real-time leaderboard
│   ├── QRModal.tsx              # QR code modal
│   ├── Loading.tsx              # Loading spinner
│   └── Error.tsx                # Error display
├── lib/
│   └── firebase.ts              # Firebase configuration
├── utils/
│   ├── calcScore.ts             # Score calculation
│   └── csv.ts                   # CSV export functionality
└── README.md
```

## Database Structure

```
Firebase Realtime Database:
├── quizzes/
│   └── {quizId}/
│       ├── title: string
│       ├── duration?: number
│       ├── createdAt: number
│       ├── createdBy: string
│       └── questions/
│           └── {questionId}/
│               ├── text: string
│               ├── options: string[]
│               └── correctIndex: number
└── responses/
    └── {quizId}/
        └── {responseId}/
            ├── name: string
            ├── score: number
            ├── timeTaken: number
            ├── createdAt: number
            └── answers: Array<{qId: string, selectedIndex: number}>
```

## Security Considerations

### For Production

1. **Tighten Firebase Rules**:
   ```json
   {
     "rules": {
       "quizzes": {
         ".read": true,
         ".write": "auth != null"
       },
       "responses": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

2. **Environment Variables**: Never commit `.env.local` to version control

3. **Teacher Authentication**: Consider implementing proper authentication instead of simple passcode

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check if all environment variables are set correctly
   - Verify Firebase project settings
   - Ensure Realtime Database is enabled

2. **QR Code Not Working**
   - Set `NEXT_PUBLIC_BASE_URL` to your production domain
   - Check if the generated URL is accessible

3. **Leaderboard Not Updating**
   - Check Firebase database rules
   - Verify network connection
   - Check browser console for errors

### Environment Variable Issues

If you see "Firebase configuration missing" errors:
1. Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set
2. Restart the development server after adding variables
3. Check for typos in variable names

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for educational purposes.

---

**Demo Credentials:**
- Teacher Passcode: `teacher123`
- No student authentication required

**Live Demo:** [Add your Vercel URL here]