'use client'

import { useState } from 'react'
import { database } from '@/lib/firebase'
import { ref, push, set } from 'firebase/database'
import { useRouter } from 'next/navigation'

interface Question {
  question: string
  options: string[]
  correct: number
}

export const dynamic = 'force-dynamic'

export default function CreateQuizPage() {
  const router = useRouter()
  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correct: 0
    }
  ])
  const [loading, setLoading] = useState(false)

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correct: 0
    }])
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    if (field === 'question') {
      updated[index].question = value
    } else if (field === 'correct') {
      updated[index].correct = value
    }
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const createQuiz = async () => {
    if (!quizTitle.trim()) {
      alert('Please enter quiz title')
      return
    }

    if (questions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()))) {
      alert('Please fill all questions and options')
      return
    }

    setLoading(true)
    
    try {
      const quizzesRef = ref(database, 'quizzes')
      const newQuizRef = push(quizzesRef)
      
      const quizData = {
        title: quizTitle,
        questions: questions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correct: q.correct
        })),
        createdAt: Date.now(),
        status: 'created'
      }

      await set(newQuizRef, quizData)
      
      router.push(`/teacher/control/${newQuizRef.key}`)
    } catch (error) {
      alert('Error creating quiz')
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen p-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>Create Quiz</h1>
          <button 
            onClick={() => router.back()}
            className='btn btn-secondary'
          >
            Back
          </button>
        </div>

        <div className='quiz-card mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Quiz Details</h2>
          <input
            type='text'
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder='Enter quiz title (e.g., Math Quiz - Chapter 5)'
            className='input'
          />
        </div>

        <div className='quiz-card mb-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>Questions</h2>
            <button onClick={addQuestion} className='btn btn-secondary'>
              + Add Question
            </button>
          </div>

          <div className='space-y-6'>
            {questions.map((question, qIndex) => (
              <div key={qIndex} className='border border-gray-200 rounded-lg p-4'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-medium'>Question {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className='text-red-600 hover:text-red-800 text-sm'
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className='space-y-4'>
                  <input
                    type='text'
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    placeholder='Enter your question'
                    className='input'
                  />

                  <div className='grid md:grid-cols-2 gap-3'>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className='flex items-center gap-3'>
                        <input
                          type='radio'
                          name={`correct-${qIndex}`}
                          checked={question.correct === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correct', oIndex)}
                          className='text-green-600'
                        />
                        <input
                          type='text'
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          className='input flex-1'
                        />
                      </div>
                    ))}
                  </div>

                  <div className='text-xs text-gray-500'>
                    Select the radio button next to the correct answer
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-4'>
          <button
            onClick={createQuiz}
            disabled={loading}
            className='btn btn-primary flex-1 text-lg py-3 disabled:opacity-50'
          >
            {loading ? 'Creating Quiz...' : 'Create Quiz & Show QR'}
          </button>
        </div>
      </div>
    </div>
  )
}