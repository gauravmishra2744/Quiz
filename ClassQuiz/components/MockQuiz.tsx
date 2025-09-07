'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRModal from './QRModal';

export default function MockQuizManager() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Load quiz from localStorage
    const demoQuizzes = JSON.parse(localStorage.getItem('demo_quizzes') || '{}');
    const currentQuiz = demoQuizzes[quizId];
    if (currentQuiz) {
      setQuiz(currentQuiz);
    }
  }, [quizId]);

  const quizUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/quiz/${quizId}`
    : `http://localhost:3000/quiz/${quizId}`;

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Created Successfully!</h1>
          <p className="text-gray-600 mb-6">Quiz ID: {quizId}</p>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowQR(true)}
              className="btn-primary"
            >
              Show QR Code
            </button>
            
            <div className="text-sm text-gray-500">
              Quiz URL: {quizUrl}
            </div>
          </div>

          <QRModal
            isOpen={showQR}
            onClose={() => setShowQR(false)}
            quizUrl={quizUrl}
            quizTitle={`Quiz ${quizId}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <div className="text-gray-600 mt-2">
              {Object.keys(quiz.questions).length} questions
              {quiz.duration && ` • ${quiz.duration}s time limit`}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="btn-primary"
            >
              Show QR Code
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(quizUrl);
                alert('Quiz URL copied!');
              }}
              className="btn-secondary"
            >
              Copy URL
            </button>
          </div>
        </div>

        <div className="quiz-card">
          <h2 className="text-xl font-bold mb-4">Quiz Ready!</h2>
          <p className="text-gray-600 mb-4">
            Your quiz has been created successfully. Students can now join using the QR code or URL.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Share with students:</h3>
            <div className="text-sm break-all bg-white p-2 rounded border">
              {quizUrl}
            </div>
          </div>
        </div>

        <QRModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          quizUrl={quizUrl}
          quizTitle={quiz.title}
        />
      </div>
    </div>
  );
}