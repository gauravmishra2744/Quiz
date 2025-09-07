'use client'

import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue, push, set } from 'firebase/database'
import { useParams, useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
}

interface Quiz {
  title: string
  questions: Question[]
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [studentName, setStudentName] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showQR, setShowQR] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  const quizUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    if (!quizId) return
    
    const quizRef = ref(database, `quizzes/${quizId}`)
    onValue(quizRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setQuiz(data)
      }
    })
  }, [quizId])

  const joinQuiz = () => {
    if (!studentName.trim()) {
      alert('Please enter your name')
      return
    }
    setHasJoined(true)
    setStartTime(Date.now())
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const nextQuestion = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer')
      return
    }

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz(newAnswers)
    }
  }

  const finishQuiz = async (finalAnswers: number[]) => {
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === quiz!.questions[index].correct
    ).length
    
    const finalScore = Math.round((correctAnswers / quiz!.questions.length) * 100)
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    
    // Save to database first
    const responsesRef = ref(database, `responses/${quizId}`)
    const newResponseRef = push(responsesRef)
    
    await set(newResponseRef, {
      studentName,
      score: finalScore,
      timeTaken,
      answers: finalAnswers,
      timestamp: Date.now()
    })

    setScore(finalScore)
    setIsCompleted(true)
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="quiz-card max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{score}%</div>
            <div className="text-gray-600">Your Score</div>
            <div className="text-sm text-gray-500 mt-2">
              {Math.round(score * quiz.questions.length / 100)} out of {quiz.questions.length} correct
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Great job, {studentName}! You completed "{quiz.title}".
          </p>
          
          {/* Show correct answers */}
          <div className="text-left mb-6 max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-3">Correct Answers:</h3>
            {quiz.questions.map((q, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
                <div className="font-medium text-sm mb-1">Q{index + 1}: {q.question}</div>
                <div className={`text-sm ${
                  answers[index] === q.correct ? 'text-green-600' : 'text-red-600'
                }`}>
                  Your answer: {q.options[answers[index]] || 'Not answered'}
                </div>
                <div className="text-sm text-green-600">
                  Correct: {q.options[q.correct]}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/leaderboard/${quizId}`)}
              className="btn btn-primary w-full"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="btn btn-secondary w-full"
            >
              Share Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="quiz-card max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.questions.length} questions</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name"
              className="input"
              onKeyPress={(e) => e.key === 'Enter' && joinQuiz()}
            />
            <button onClick={joinQuiz} className="btn btn-primary w-full">
              Join Quiz
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowQR(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Show QR Code to Share
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium">
              {studentName}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="quiz-card">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Share Quiz</h3>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                <QRCodeSVG value={quizUrl} size={200} />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to join the quiz
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="btn btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}