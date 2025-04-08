"use client"
import { useSearchParams, useParams } from "next/navigation"
import Link from "next/link"
import { Brain, Trophy, ArrowRight, Home, RotateCcw } from "lucide-react"
import { Suspense } from "react"
export default function ResultPage() {
  const searchParams = useSearchParams()
  const { id } = useParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "0")
  const percentage = Math.round((score / total) * 100)

  const getFeedback = () => {
    if (percentage >= 90) return "Excellent! You're a master!"
    if (percentage >= 70) return "Great job! You did well!"
    if (percentage >= 50) return "Good effort! Keep practicing!"
    return "Keep learning! You'll improve!"
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Header */}
      <header className="px-6 pt-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#6C5CE7]" />
            <span className="text-lg font-medium text-[#6C5CE7]">QuizMaster</span>
          </div>
        </div>
      </header>

      <main className="px-6 mt-10 flex flex-col items-center text-center">
        <Suspense fallback={<div>Loading...</div>}>
        <div className="mb-8">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-[#6C5CE7]/20">
            <Trophy className="h-12 w-12 text-[#6C5CE7]" />
          </div>
        </div>

        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Quiz Completed!</h1>
            <p className="text-gray-500">{getFeedback()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Score</span>
              <span className="font-medium">
                {score} out of {total}
              </span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#6C5CE7] rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xl font-bold text-[#6C5CE7]">{percentage}%</p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href={`/quiz/${id}`}>
              <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#6C5CE7] bg-white px-4 py-3 font-medium text-[#6C5CE7] transition-all hover:bg-[#6C5CE7]/5">
                <RotateCcw className="h-4 w-4" /> Try Again
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#6C5CE7] px-4 py-3 font-medium text-white transition-all hover:bg-[#6C5CE7]/90">
                <Home className="h-4 w-4" /> Back to Dashboard
              </button>
            </Link>
            <Link href="/categories">
              <button className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-gray-700 transition-all hover:bg-gray-100">
                More Quizzes <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
        </Suspense>
      </main>
    </div>
  )
}

