import Papa from 'papaparse';

export interface ResponseData {
  name: string;
  score: number;
  timeTaken: number;
  createdAt: number;
  answers: Array<{
    qId: string;
    selectedIndex: number;
  }>;
}

export function exportToCSV(responses: Record<string, ResponseData>, filename: string = 'quiz-responses.csv') {
  const data = Object.entries(responses).map(([id, response]) => ({
    ID: id,
    Name: response.name,
    Score: response.score,
    'Time Taken (seconds)': response.timeTaken,
    'Submit Time': new Date(response.createdAt).toLocaleString(),
    'Answers': response.answers.map(a => `Q${a.qId}:${a.selectedIndex}`).join(';')
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}