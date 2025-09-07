'use client'

import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue, push, set } from 'firebase/database'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  questions: any[]
  createdAt: number
}

export const dynamic = 'force-dynamic'

export default function TeacherPage() {
  const [passcode, setPasscode] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [newQuizTitle, setNewQuizTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (passcode === 'teacher123') {
      setIsAuthenticated(true)
      loadQuizzes()
    } else {
      alert('Wrong passcode!')
    }
  }

  const loadQuizzes = () => {
    if (!database) return
    
    const quizzesRef = ref(database, 'quizzes')
    onValue(quizzesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const quizList = Object.entries(data).map(([id, quiz]: [string, any]) => ({
          id,
          title: quiz.title,
          questions: quiz.questions || [],
          createdAt: quiz.createdAt
        }))
        setQuizzes(quizList.sort((a, b) => b.createdAt - a.createdAt))
      }
    })
  }

  const createQuiz = async () => {
    if (!newQuizTitle.trim() || !database) return
    
    setLoading(true)
    const quizzesRef = ref(database, 'quizzes')
    const newQuizRef = push(quizzesRef)
    
    const sampleQuestions = [
      {
        id: 1,
        question: "What is the capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        correct: 1
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
      },
      {
        id: 3,
        question: "What is 15 + 25?",
        options: ["35", "40", "45", "50"],
        correct: 1
      }
    ]

    await set(newQuizRef, {
      title: newQuizTitle,
      questions: sampleQuestions,
      createdAt: Date.now(),
      createdBy: 'teacher'
    })

    setNewQuizTitle('')
    setLoading(false)
    alert('Quiz created successfully!')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="quiz-card max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Teacher Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter teacher passcode"
              className="input"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={handleLogin} className="btn btn-primary w-full">
              Login
            </button>
            <div className="text-center text-sm text-gray-500">
              Demo passcode: teacher123
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="quiz-card">
              <h2 className="text-xl font-semibold mb-4">Your Quizzes</h2>
              
              {quizzes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No quizzes created yet. Create your first quiz!
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <p className="text-sm text-gray-600">
                            {quiz.questions.length} questions • Created {new Date(quiz.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            href={`/quiz/${quiz.id}`}
                            className="btn btn-primary text-sm"
                            target="_blank"
                          >
                            Open Quiz
                          </Link>
                          <Link 
                            href={`/leaderboard/${quiz.id}`}
                            className="btn btn-secondary text-sm"
                            target="_blank"
                          >
                            Leaderboard
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="quiz-card">
              <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
              <Link href="/teacher/create" className="btn btn-primary w-full">
                + Create New Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}