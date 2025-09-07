'use client';

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: string[];
  };
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  questionNumber, 
  totalQuestions 
}: QuestionCardProps) {
  return (
    <div className="quiz-card">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
      </div>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
    </div>
  );
}