'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import Link from 'next/link';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

interface Quiz {
  id: string;
  title: string;
  createdAt: number;
  duration?: number;
  questionCount: number;
}

export default function TeacherDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (passcode === process.env.NEXT_PUBLIC_TEACHER_PASSCODE || passcode === 'teacher123') {
      setIsAuthenticated(true);
      loadQuizzes();
    } else {
      setError('Invalid passcode');
    }
  };

  const loadQuizzes = () => {
    setLoading(true);
    
    try {
      // Load from localStorage for demo
      const demoQuizzes = JSON.parse(localStorage.getItem('demo_quizzes') || '{}');
      
      const quizzesArray = Object.entries(demoQuizzes).map(([id, quiz]: [string, any]) => ({
        id,
        title: quiz.title,
        createdAt: quiz.createdAt,
        duration: quiz.duration,
        questionCount: quiz.questions ? Object.keys(quiz.questions).length : 0,
      }));
      
      quizzesArray.sort((a, b) => b.createdAt - a.createdAt);
      setQuizzes(quizzesArray);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to load quizzes');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      return loadQuizzes();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="quiz-card">
            <h1 className="text-2xl font-bold mb-6 text-center">Teacher Login</h1>
            
            {error && <Error message={error} />}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Teacher Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Enter passcode"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  autoComplete="off"
                />
              </div>
              
              <button onClick={handleLogin} className="btn-primary w-full">
                Login
              </button>
              
              <div className="text-xs text-gray-500 text-center">
                Demo passcode: teacher123
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Link href="/teacher/create" className="btn-primary">
            Create New Quiz
          </Link>
        </div>

        {loading && <Loading />}
        {error && <Error message={error} onRetry={loadQuizzes} />}

        {!loading && !error && (
          <div className="quiz-card">
            <h2 className="text-xl font-semibold mb-4">Your Quizzes</h2>
            
            {quizzes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No quizzes created yet.</p>
                <Link href="/teacher/create" className="btn-primary">
                  Create Your First Quiz
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {quiz.questionCount} questions
                          {quiz.duration && ` • ${quiz.duration}s time limit`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(quiz.createdAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link 
                          href={`/teacher/quiz/${quiz.id}`}
                          className="btn-primary text-sm"
                        >
                          Manage
                        </Link>
                        <Link 
                          href={`/quiz/${quiz.id}`}
                          className="btn-secondary text-sm"
                          target="_blank"
                        >
                          Preview
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}