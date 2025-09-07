import './globals.css'

export const metadata = {
  title: 'Real Quiz App - Interactive Learning Platform by Team Astras',
  description: 'Transform your classroom with our interactive quiz system featuring real-time results, live leaderboards, and seamless QR code access. Created by Team Astras.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}