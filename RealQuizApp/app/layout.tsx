import './globals.css'

export const metadata = {
  title: 'Real Quiz App - Classroom Quiz System',
  description: 'Interactive quiz platform for classrooms',
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