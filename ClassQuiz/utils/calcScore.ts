export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Answer {
  qId: string;
  selectedIndex: number;
}

export function calculateScore(questions: Question[], answers: Answer[]): number {
  let correct = 0;
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.qId);
    if (question && question.correctIndex === answer.selectedIndex) {
      correct++;
    }
  });
  
  return Math.round((correct / questions.length) * 100);
}