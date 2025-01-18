import { Toaster } from 'sonner'
import WordForm from './components/WordForm'
import WordDisplay from './components/WordDisplay'
import Calendar from './components/Calendar'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8">Language Learning Journal</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-xl font-semibold mb-4">Add New Word</h2>
            <WordForm />
          </div>
          <WordDisplay />
        </div>
        
        <div>
          <Calendar />
        </div>
      </div>
    </main>
  )
}

