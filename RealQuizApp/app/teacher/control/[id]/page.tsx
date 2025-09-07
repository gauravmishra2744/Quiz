'use client'

import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue, update } from 'firebase/database'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

interface Quiz {
  title: string
  questions: any[]
  status: string
}

interface Response {
  id: string
  studentName: string
  answers: number[]
  score: number
  timestamp: number
}

export default function QuizControlPage() {
  const params = useParams()
  const quizId = params.id as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [showQR, setShowQR] = useState(true)
  const [quizStatus, setQuizStatus] = useState('created')

  const quizUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/quiz/${quizId}`
    : `http://localhost:3000/quiz/${quizId}`

  useEffect(() => {
    if (!quizId) return

    // Load quiz
    const quizRef = ref(database, `quizzes/${quizId}`)
    onValue(quizRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setQuiz(data)
        setQuizStatus(data.status || 'created')
      }
    })

    // Load responses
    const responsesRef = ref(database, `responses/${quizId}`)
    onValue(responsesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const responsesList = Object.entries(data).map(([id, response]: [string, any]) => ({
          id,
          studentName: response.studentName,
          answers: response.answers,
          score: response.score,
          timestamp: response.timestamp
        }))
        
        responsesList.sort((a, b) => b.score - a.score)
        setResponses(responsesList)
      } else {
        setResponses([])
      }
    })
  }, [quizId])

  const startQuiz = async () => {
    await update(ref(database, `quizzes/${quizId}`), { status: 'active' })
    setQuizStatus('active')
    setShowQR(false)
  }

  const endQuiz = async () => {
    await update(ref(database, `quizzes/${quizId}`), { status: 'ended' })
    setQuizStatus('ended')
  }

  const showResults = () => {
    setShowQR(false)
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

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{quiz.title}</h1>
          <div className="text-xl text-gray-300">
            {quiz.questions.length} Questions • {responses.length} Students Joined
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-center mb-8">
          <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${
            quizStatus === 'created' ? 'bg-yellow-600' :
            quizStatus === 'active' ? 'bg-green-600' :
            'bg-red-600'
          }`}>
            {quizStatus === 'created' ? '📱 Ready to Start' :
             quizStatus === 'active' ? '🔴 Quiz Active' :
             '✅ Quiz Ended'}
          </div>
        </div>

        {/* QR Code Section */}
        {showQR && (
          <div className="text-center mb-8">
            <div className="bg-white p-8 rounded-2xl inline-block shadow-2xl">
              <QRCodeSVG 
                value={quizUrl} 
                size={300}
                level="M"
                includeMargin={true}
              />
            </div>
            <div className="mt-4 text-lg text-gray-300">
              📱 Students scan this QR code to join
            </div>
            <div className="mt-2 text-sm text-gray-400 break-all max-w-md mx-auto">
              {quizUrl}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {quizStatus === 'created' && (
            <>
              <button onClick={startQuiz} className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-semibold">
                🚀 Start Quiz
              </button>
              <button onClick={() => setShowQR(!showQR)} className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg">
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
            </>
          )}
          
          {quizStatus === 'active' && (
            <>
              <button onClick={endQuiz} className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-xl font-semibold">
                🛑 End Quiz
              </button>
              <button onClick={showResults} className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg">
                📊 Show Results
              </button>
            </>
          )}

          {quizStatus === 'ended' && (
            <button onClick={() => setShowQR(false)} className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-xl font-semibold">
              🏆 Final Results
            </button>
          )}
        </div>

        {/* Live Results */}
        {!showQR && responses.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              🏆 Live Leaderboard
            </h2>
            
            <div className="space-y-4">
              {responses.slice(0, 10).map((response, index) => (
                <div key={response.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-600' :
                  index === 1 ? 'bg-gray-600' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-gray-700'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{response.studentName}</div>
                      <div className="text-sm opacity-75">
                        Submitted: {new Date(response.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{response.score}%</div>
                    <div className="text-sm opacity-75">
                      {Math.round(response.score * quiz.questions.length / 100)}/{quiz.questions.length} correct
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {responses.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-xl">Waiting for students to submit...</div>
              </div>
            )}
          </div>
        )}

        {/* Waiting for Students */}
        {showQR && responses.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">👥</div>
            <div className="text-xl">Waiting for students to join...</div>
          </div>
        )}
      </div>
    </div>
  )
}