"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Brain, Clock, ArrowRight } from 'lucide-react'
import { Progress } from "@/components/ui/progress";
import withAuth from "@/components/ui/withAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import QuizHeader from "@/components/ui/quiz-header";
export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: string;
  options: string[];
  correctAnswer: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  questions: Question[];
}


const QuizPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/quizzes/${id}`)
        if (!response.ok) throw new Error("Failed to load quiz")

        const quizData = await response.json()
        setQuiz(quizData)
      } catch (error) {
        console.error("Error fetching quiz:", error)
      }
    }

    if (id) {
      fetchQuiz()
    }
  }, [id])

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center">
        <Brain className="h-12 w-12 text-[#6C5CE7] animate-pulse" />
        <p className="mt-4 text-gray-500">Loading quiz...</p>
      </div>
    )
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    setSelectedAnswer(null)

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Navigate to the result page
      router.push(`/quiz/${id}/result?score=${score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)}&total=${quiz.questions.length}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Header */}
     <QuizHeader />

      <main className="px-6 py-6 max-w-3xl mx-auto">

      <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 rounded-md bg-[#6C5CE7]/10 px-3 py-1.5">
            <Clock className="h-4 w-4 text-[#6C5CE7]" />
            <span className="text-sm font-medium text-[#6C5CE7]">30s</span>
          </div>
          <div className="text-[#6C5CE7]">
          <Link href="/dashboard">
          <Button className={`flex items-center hover:bg-[#786eeb]  bg-[#6C5CE7] gap-2`}>
        <X className="h-4 w-4" />
      Exit Quiz
    </Button>
    </Link>
          </div>


      </div>

        {/* Quiz title */}
        <div>
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span className="font-medium">Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2  bg-gray-200">
            <div 
              className="h-full bg-[#6C5CE7] rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </Progress>
        </div>

        {/* Question card */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedAnswer === option
                    ? "border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]"
                    : "border-gray-200 hover:border-[#6C5CE7]/30 hover:bg-[#6C5CE7]/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    selectedAnswer === option ? "border-[#6C5CE7] bg-[#6C5CE7] text-white" : "border-gray-400"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className={`flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-6 py-3 font-medium text-white transition-all ${
              !selectedAnswer ? "opacity-50 cursor-not-allowed" : "hover:bg-[#6C5CE7]/90"
            }`}
          >
            {currentQuestionIndex + 1 === quiz.questions.length ? "Finish" : "Next"} 
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}

export default withAuth(QuizPage)
