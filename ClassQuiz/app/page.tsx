import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ClassQuiz
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real-time classroom quiz system with live leaderboards
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="quiz-card">
            <h2 className="text-2xl font-semibold mb-4">For Teachers</h2>
            <p className="text-gray-600 mb-6">
              Create quizzes, generate QR codes, and monitor student progress in real-time
            </p>
            <Link href="/teacher" className="btn-primary inline-block">
              Teacher Dashboard
            </Link>
          </div>
          
          <div className="quiz-card">
            <h2 className="text-2xl font-semibold mb-4">For Students</h2>
            <p className="text-gray-600 mb-6">
              Scan QR code or enter quiz ID to join and compete with classmates
            </p>
            <div className="text-sm text-gray-500">
              Use QR code from your teacher to join a quiz
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <div className="text-2xl mb-2">📱</div>
              <div>QR Code Access</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🏆</div>
              <div>Live Leaderboard</div>
            </div>
            <div>
              <div className="text-2xl mb-2">📊</div>
              <div>CSV Export</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}