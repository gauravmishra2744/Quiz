'use client';

import { useState } from 'react';
import { database } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

const sampleQuestions: Omit<Question, 'id'>[] = [
  {
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctIndex: 2
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1
  },
  {
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1
  },
  {
    text: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
    correctIndex: 2
  },
  {
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3
  }
];

export default function QuizForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState<Question[]>(
    sampleQuestions.map((q, index) => ({ ...q, id: `q${index + 1}` }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Quiz title is required');
      return;
    }

    if (questions.some(q => !q.text.trim() || q.options.some(opt => !opt.trim()))) {
      setError('All questions and options must be filled');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate a mock quiz ID for demo
      const mockQuizId = 'quiz_' + Date.now();
      
      // Store in localStorage for demo
      const quizData = {
        id: mockQuizId,
        title: title.trim(),
        duration: duration ? parseInt(duration) : null,
        questions: questions.reduce((acc, q) => {
          acc[q.id] = {
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex
          };
          return acc;
        }, {} as Record<string, any>),
        createdAt: Date.now(),
        createdBy: 'teacher'
      };

      // Store in localStorage for demo
      const existingQuizzes = JSON.parse(localStorage.getItem('demo_quizzes') || '{}');
      existingQuizzes[mockQuizId] = quizData;
      localStorage.setItem('demo_quizzes', JSON.stringify(existingQuizzes));
      
      // Simulate network delay
      setTimeout(() => {
        setLoading(false);
        router.push(`/teacher/quiz/${mockQuizId}`);
      }, 1000);
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="quiz-card">
            <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (seconds)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="input-field"
                  placeholder="Optional"
                  min="30"
                />
              </div>
            </div>
          </div>

          <div className="quiz-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn-secondary text-sm"
              >
                Add Question
              </button>
            </div>
            
            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">Question {qIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                      className="input-field"
                      placeholder="Enter question text"
                      required
                    />
                    
                    <div className="grid md:grid-cols-2 gap-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctIndex === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correctIndex', oIndex)}
                            className="text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            className="input-field flex-1"
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Select the radio button next to the correct answer
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating Quiz...' : 'Create Quiz'}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}