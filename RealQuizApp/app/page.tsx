import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Real Quiz App
          </h1>
          <p className="text-xl text-gray-600">
            Interactive classroom quiz system with real-time results
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="quiz-card text-center">
            <div className="text-6xl mb-6">👨‍🏫</div>
            <h2 className="text-2xl font-bold mb-4">For Teachers</h2>
            <p className="text-gray-600 mb-6">
              Create quizzes, generate QR codes, and monitor student progress in real-time
            </p>
            <Link href="/teacher" className="btn btn-primary inline-block">
              Teacher Dashboard
            </Link>
          </div>

          <div className="quiz-card text-center">
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="text-2xl font-bold mb-4">For Students</h2>
            <p className="text-gray-600 mb-6">
              Scan QR code or enter quiz ID to join and compete with classmates
            </p>
            <div className="text-sm text-gray-500">
              Get quiz link from your teacher
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">QR Code Access</h3>
              <p className="text-sm text-gray-600">Easy joining via QR scan</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold mb-2">Live Leaderboard</h3>
              <p className="text-sm text-gray-600">Real-time competition</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Immediate feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}