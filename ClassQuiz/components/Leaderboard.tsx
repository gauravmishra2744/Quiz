'use client';

import { useEffect, useState } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import Loading from './Loading';
import Error from './Error';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  timeTaken: number;
  createdAt: number;
}

interface LeaderboardProps {
  quizId: string;
  showControls?: boolean;
  onExportCSV?: () => void;
  onResetQuiz?: () => void;
}

export default function Leaderboard({ quizId, showControls = false, onExportCSV, onResetQuiz }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const responsesRef = ref(database, `responses/${quizId}`);
    
    const unsubscribe = onValue(responsesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const entriesArray = Object.entries(data).map(([id, response]: [string, any]) => ({
            id,
            name: response.name,
            score: response.score,
            timeTaken: response.timeTaken,
            createdAt: response.createdAt,
          }));
          
          // Sort by score (desc) then by time taken (asc)
          entriesArray.sort((a, b) => {
            if (b.score !== a.score) {
              return b.score - a.score;
            }
            return a.timeTaken - b.timeTaken;
          });
          
          setEntries(entriesArray.slice(0, 20)); // Top 20
        } else {
          setEntries([]);
        }
        setLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    }, (error) => {
      setError('Failed to connect to database');
      setLoading(false);
    });

    return () => off(responsesRef, 'value', unsubscribe);
  }, [quizId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="quiz-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Live Leaderboard</h2>
        {showControls && (
          <div className="flex gap-2">
            {onExportCSV && (
              <button onClick={onExportCSV} className="btn-secondary text-sm">
                Export CSV
              </button>
            )}
            {onResetQuiz && (
              <button 
                onClick={onResetQuiz} 
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Reset Quiz
              </button>
            )}
          </div>
        )}
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No submissions yet. Students will appear here as they complete the quiz.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3">Rank</th>
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Score</th>
                <th className="text-left py-2 px-3">Time</th>
                <th className="text-left py-2 px-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <span className={`font-bold ${
                      index === 0 ? 'text-yellow-600' : 
                      index === 1 ? 'text-gray-500' : 
                      index === 2 ? 'text-orange-600' : 'text-gray-700'
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-medium">{entry.name}</td>
                  <td className="py-2 px-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {entry.score}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-600">
                    {entry.timeTaken}s
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-600">
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}