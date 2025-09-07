'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { useParams } from 'next/navigation';
import Leaderboard from '@/components/Leaderboard';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import Link from 'next/link';

interface Quiz {
  title: string;
  createdAt: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!quiz) return <Error message="Quiz not found" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-gray-600">Live Leaderboard</p>
        </div>

        <Leaderboard quizId={quizId} />

        <div className="text-center mt-8">
          <Link 
            href={`/quiz/${quizId}`}
            className="btn-primary"
          >
            Take Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}