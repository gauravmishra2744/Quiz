'use client'

import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue } from 'firebase/database'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Response {
  id: string
  studentName: string
  score: number
  timeTaken: number
  timestamp: number
}

interface Quiz {
  title: string
}

export default function LeaderboardPage() {
  const params = useParams()
  const quizId = params.id as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!quizId) return

    // Load quiz info
    const quizRef = ref(database, `quizzes/${quizId}`)
    onValue(quizRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setQuiz(data)
      }
      setLoading(false)
    })

    // Load responses
    const responsesRef = ref(database, `responses/${quizId}`)
    onValue(responsesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const responsesList = Object.entries(data).map(([id, response]: [string, any]) => ({
          id,
          studentName: response.studentName,
          score: response.score,
          timeTaken: response.timeTaken,
          timestamp: response.timestamp
        }))
        
        // Sort by score (desc) then by time (asc)
        responsesList.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score
          }
          return a.timeTaken - b.timeTaken
        })
        
        setResponses(responsesList)
      } else {
        setResponses([])
      }
    })
  }, [quizId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-gray-600">Live Leaderboard</p>
        </div>

        <div className="quiz-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Rankings</h2>
            <div className="text-sm text-gray-600">
              {responses.length} participants
            </div>
          </div>

          {responses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-gray-600 mb-6">
                Students will appear here as they complete the quiz
              </p>
              <Link 
                href={`/quiz/${quizId}`}
                className="btn btn-primary"
              >
                Take Quiz
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Score</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response, index) => (
                    <tr key={response.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className={`font-bold text-lg ${
                            index === 0 ? 'text-yellow-600' : 
                            index === 1 ? 'text-gray-500' : 
                            index === 2 ? 'text-orange-600' : 'text-gray-700'
                          }`}>
                            #{index + 1}
                          </span>
                          {index < 3 && (
                            <span className="ml-2 text-xl">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{response.studentName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          response.score >= 80 ? 'bg-green-100 text-green-800' :
                          response.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {response.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600">{response.timeTaken}s</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-500">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <div className="space-x-4">
            <Link 
              href={`/quiz/${quizId}`}
              className="btn btn-primary"
            >
              Take Quiz
            </Link>
            <Link 
              href="/"
              className="btn btn-secondary"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}