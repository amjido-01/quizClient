"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Brain, Clock, ArrowRight, X } from 'lucide-react'
import { Progress } from "@/components/ui/progress";
import withAuth from "@/components/ui/withAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import QuizHeader from "@/components/ui/quiz-header";
import { Quiz } from "@/types";
import api from "@/app/api/axiosConfig";
import Footer from "@/components/ui/Footer";
import { useAuthStore } from "@/hooks/use-auth";
import { TimeUpDialog } from "@/components/ui/time-up-dialog";


const QuizPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const {user} = useAuthStore()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(200);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false)


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`)
        if (!response.data) throw new Error("Failed to load quiz")
        setQuiz(response.data)
      } catch (error) {
        console.error("Error fetching quiz:", error)
      }
    }

    if (id) {
      fetchQuiz()
    }
  }, [id])


  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUpDialogOpen(true)
      // const finalAnswer = selectedAnswers[currentQuestionIndex];
      // const finalScore = finalAnswer === currentQuestion.correctAnswer ? score + 1 : score;
      // router.push(`/quiz/${id}/result?score=${finalScore}&total=${quiz?.questions.length}`);
      return;
    }
  
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeLeft, currentQuestionIndex]);

  const handleSubmitQuiz = () => {
    const finalAnswer = selectedAnswers[currentQuestionIndex]
    const finalScore = finalAnswer === currentQuestion?.correctAnswer ? score + 1 : score
    router.push(`/quiz/${id}/result?score=${finalScore}&total=${quiz?.questions.length}`)
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }
  

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center">
        <Brain className="h-12 w-12 text-[#6C5CE7] animate-pulse" />
        <p className="mt-4 text-gray-500">Loading quiz...</p>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    const updatedAnswers = [...selectedAnswers]
    updatedAnswers[currentQuestionIndex] = answer
    setSelectedAnswers(updatedAnswers)
  }

  const handleNextQuestion = () => {
    const answer = selectedAnswers[currentQuestionIndex]
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      router.push(`/quiz/${id}/result?score=${score + (answer === currentQuestion.correctAnswer ? 1 : 0)}&total=${quiz.questions.length}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <QuizHeader user={user}/>

      <main className="px-6 py-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 rounded-md bg-[#6C5CE7]/10 px-3 py-1.5">
            <Clock className="h-4 w-4 text-[#6C5CE7]" />
            <span className="text-sm font-medium text-[#6C5CE7]">{formatTime(timeLeft)}</span>
          </div>
          <Link href="/dashboard">
            <Button className="flex items-center gap-2 bg-[#6C5CE7] hover:bg-[#786eeb]">
              <X className="h-4 w-4" />
              Exit Quiz
            </Button>
          </Link>
        </div>

        <h1 className="text-2xl font-bold">{quiz.title}</h1>

        <div className="mt-4 mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span className="font-medium">Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]"
                      : "border-gray-200 hover:border-[#6C5CE7]/30 hover:bg-[#6C5CE7]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        isSelected ? "border-[#6C5CE7] bg-[#6C5CE7] text-white" : "border-gray-400"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all ${
              currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className={`flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-6 py-3 font-medium text-white transition-all ${
              !selectedAnswers[currentQuestionIndex] ? "opacity-50 cursor-not-allowed" : "hover:bg-[#6C5CE7]/90"
            }`}
          >
            {currentQuestionIndex + 1 === quiz.questions.length ? "Finish" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <TimeUpDialog
        isOpen={isTimeUpDialogOpen}
        onClose={() => setIsTimeUpDialogOpen(false)}
        onSubmit={handleSubmitQuiz}
        totalQuestions={quiz.questions.length}
        questionsAnswered={Object.keys(selectedAnswers).length}
      />
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(QuizPage)
