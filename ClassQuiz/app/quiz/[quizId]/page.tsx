'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, off, push, set } from 'firebase/database';
import { useParams, useRouter } from 'next/navigation';
import QuestionCard from '@/components/QuestionCard';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { calculateScore } from '@/utils/calcScore';

interface Quiz {
  title: string;
  duration?: number;
  questions: Record<string, {
    text: string;
    options: string[];
    correctIndex: number;
  }>;
}

interface Answer {
  qId: string;
  selectedIndex: number;
}

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Student flow states
  const [studentName, setStudentName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const questions = quiz ? Object.entries(quiz.questions).map(([id, q]) => ({ id, ...q })) : [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!quizId) return;

    const quizRef = ref(database, `quizzes/${quizId}`);
    
    const unsubscribe = onValue(quizRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuiz(data);
      } else {
        setError('Quiz not found');
      }
      setLoading(false);
    }, (error) => {
      setError('Failed to load quiz');
      setLoading(false);
    });

    return () => off(quizRef, 'value', unsubscribe);
  }, [quizId]);

  const handleJoinQuiz = () => {
    if (!studentName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    setHasJoined(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer');
      return;
    }

    // Save the answer
    const newAnswer: Answer = {
      qId: currentQuestion.id,
      selectedIndex: selectedAnswer
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedAnswer(null);

    // Check if this was the last question
    if (currentQuestionIndex === questions.length - 1) {
      submitQuiz(updatedAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const submitQuiz = async (finalAnswers: Answer[]) => {
    if (!startTime) return;
    
    setIsSubmitting(true);
    
    try {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      const score = calculateScore(questions, finalAnswers);
      
      const responseRef = ref(database, `responses/${quizId}`);
      const newResponseRef = push(responseRef);
      
      const responseData = {
        name: studentName,
        answers: finalAnswers,
        score,
        timeTaken,
        createdAt: endTime
      };

      await set(newResponseRef, responseData);
      
      setFinalScore(score);
      setIsCompleted(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewLeaderboard = () => {
    router.push(`/leaderboard/${quizId}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!quiz) return <Error message="Quiz not found" />;

  // Completion screen
  if (isCompleted && finalScore !== null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="quiz-card">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {finalScore}%
              </div>
              <div className="text-gray-600">Your Score</div>
            </div>
            
            <div className="text-gray-600 mb-6">
              Great job, {studentName}! You've completed "{quiz.title}".
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleViewLeaderboard}
                className="btn-primary"
              >
                View Leaderboard
              </button>
              
              <button
                onClick={() => {
                  const url = `${window.location.origin}/quiz/${quizId}`;
                  navigator.clipboard.writeText(url);
                  alert('Quiz URL copied! Share with friends.');
                }}
                className="btn-secondary"
              >
                Share Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Join screen
  if (!hasJoined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="quiz-card text-center">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            
            <div className="text-gray-600 mb-6">
              {questions.length} questions
              {quiz.duration && ` • ${quiz.duration}s time limit`}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your name to join
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Your name"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinQuiz()}
                  autoComplete="off"
                />
              </div>
              
              <button
                onClick={handleJoinQuiz}
                className="btn-primary w-full"
              >
                Join Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  if (isSubmitting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Loading />
          <p className="mt-4 text-gray-600">Submitting your answers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="text-gray-600">Welcome, {studentName}!</div>
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="mt-6 flex justify-between">
          <div className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {questions.length} questions
          </div>
          
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}