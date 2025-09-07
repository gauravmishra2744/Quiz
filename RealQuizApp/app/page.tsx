import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header with Team Branding */}
      <header className="w-full py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Real Quiz App</h1>
              <p className="text-xs text-gray-400">by Team Astras</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
            <span className="px-3 py-1 bg-gray-800 text-blue-400 rounded-full font-medium">✨ Powered by Team Astras</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">Live Interactive Learning Platform</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent mb-6">
              Real Quiz App
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your classroom with our interactive quiz system featuring real-time results, 
              live leaderboards, and seamless QR code access
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="group quiz-card-enhanced text-center hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg group-hover:shadow-xl transition-shadow">
                👨🏫
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">For Teachers</h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Create engaging quizzes, generate instant QR codes, and monitor student progress 
                with real-time analytics and insights
              </p>
              <Link href="/teacher" className="btn-enhanced btn-primary inline-block group-hover:shadow-lg transition-shadow">
                Launch Teacher Dashboard →
              </Link>
            </div>

            <div className="group quiz-card-enhanced text-center hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg group-hover:shadow-xl transition-shadow">
                🎓
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">For Students</h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Join quizzes instantly by scanning QR codes, compete with classmates, 
                and see your results on the live leaderboard
              </p>
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 rounded-xl text-gray-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="font-medium">Get quiz link from your teacher</span>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Why Choose Our Platform?</h3>
            <p className="text-gray-300 text-lg">Built with modern technology for seamless learning experiences</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="feature-card group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center text-3xl text-white shadow-lg group-hover:shadow-xl transition-all">
                📱
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">QR Code Access</h3>
              <p className="text-gray-300 leading-relaxed">Students can join quizzes instantly by scanning QR codes - no complex setup required</p>
            </div>
            <div className="feature-card group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-3xl text-white shadow-lg group-hover:shadow-xl transition-all">
                🏆
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Live Leaderboard</h3>
              <p className="text-gray-300 leading-relaxed">Real-time competition tracking that motivates students and enhances engagement</p>
            </div>
            <div className="feature-card group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-3xl text-white shadow-lg group-hover:shadow-xl transition-all">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Instant Analytics</h3>
              <p className="text-gray-300 leading-relaxed">Get immediate feedback and detailed insights into student performance and understanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Team Branding */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-white">Created by Team Astras</p>
                <p className="text-gray-400">Innovative Learning Solutions</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <p>© 2025 Team Astras. Empowering education through technology.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}