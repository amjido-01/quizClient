"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import withAuth from "@/components/ui/withAuth"
import {
  Award,
  CheckCircle2,
  Home,
  RotateCcw,
  Share2,
  XCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"
import QuizHeader from "@/components/ui/quiz-header"
import { useAuthStore } from "@/hooks/use-auth"
import api from "@/app/api/axiosConfig"
// import { RecentQuiz } from "@/types"
const Page = () => {
  const {id} = useParams()
  const router = useRouter()
  const {user} = useAuthStore()
//   const [activeTab, setActiveTab] = useState("summary")
//   const [expandedQuestions, setExpandedQuestions] = useState<number[]>([])
  const [quizData, setQuizData] = useState<any>(null)


  // Fetch quiz history data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll simulate a delay and use mock data
        const response = await api.get(`/recent/${id}`)
        const data = response.data

        if (data) {
          setQuizData(data)
        } else {
          // If quiz not found, use the first one as fallback
          setQuizData(mockQuizHistory[0])
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error)
      } 
    }

    fetchQuizData()
  }, [id])



//   const toggleQuestionExpand = (index: number) => {
//     if (expandedQuestions.includes(index)) {
//       setExpandedQuestions(expandedQuestions.filter((i) => i !== index))
//     } else {
//       setExpandedQuestions([...expandedQuestions, index])
//     }
//   }

  const handleRetakeQuiz = () => {
    if (!quizData) return
    router.push(`/quiz/${quizData.quizId}`)
  }

  if (!quizData) {
    return (
      <div className="flex min-h-screen flex-col">
        <QuizHeader user={user}/>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl">Quiz not found</p>
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  const percentage = Math.round((quizData.correctAnswers / quizData.totalQuestions) * 100)

  return (
    <div className="flex min-h-screen flex-col">
      <QuizHeader user={user}/>

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <Button
              variant="ghost"
              className="mb-6 pl-0 flex items-center gap-2"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="mb-8">
              <h1 className="text-3xl font-bold">{quizData.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-sm font-normal">
                  {quizData.category}
                </Badge>
                <Badge variant="outline" className="text-sm font-normal">
                  {quizData.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Completed on{" "}
                  {new Date(quizData.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your Score</CardTitle>
                <CardDescription>{quizData.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-primary/20">
                    <div className="text-center">
                      <span className="text-4xl font-bold">
                        {quizData.correctAnswers}/{quizData.totalQuestions}
                      </span>
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">
                      {percentage >= 70 ? "Great job!" : percentage >= 40 ? "Good effort!" : "Keep practicing!"}
                    </p>
                    <p className="text-sm text-muted-foreground">You scored {percentage}% on this quiz</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {percentage >= 70 && (
                    <Badge className="flex items-center gap-1 px-3 py-1 text-sm">
                      <Award className="h-4 w-4" />
                      Achievement Unlocked
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {quizData.correctAnswers} Correct
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-sm">
                    <XCircle className="h-4 w-4 text-red-500" />
                    {quizData.totalQuestions - quizData.correctAnswers} Incorrect
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-sm">
                    <Clock className="h-4 w-4" />
                    {quizData.timeTaken}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Results
                </Button>
                <Button variant="outline" className="flex items-center gap-2" onClick={handleRetakeQuiz}>
                  <RotateCcw className="h-4 w-4" />
                  Retry Quiz
                </Button>
                <Link href="/dashboard">
                  <Button className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Time Taken</span>
                        <span>{quizData.timeTaken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Time per Question</span>
                        <span>{quizData.avgTimePerQuestion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ranking</span>
                        <span>{quizData.ranking}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Performance by Topic</h3>
                      {quizData.topicPerformance.map((topic: any, index: number) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{topic.name}</span>
                            <span>{topic.score}%</span>
                          </div>
                          <Progress value={topic.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Improvement Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quizData.improvementAreas.map((area: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            <Brain className="h-4 w-4" />
                          </div>
                          <p>{area}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="mt-6 space-y-6">
                {quizData.questions.map((question: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="cursor-pointer" onClick={() => toggleQuestionExpand(index)}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                              question.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span>{question.text}</span>
                        </CardTitle>
                        {expandedQuestions.includes(index) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>

                    {expandedQuestions.includes(index) && (
                      <CardContent className="space-y-4 pt-0">
                        <div className="space-y-3">
                          {question.options.map((option: string, optIndex: number) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                option === question.correctAnswer
                                  ? "border-green-500 bg-green-50"
                                  : option === question.userAnswer && option !== question.correctAnswer
                                    ? "border-red-500 bg-red-50"
                                    : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                    option === question.correctAnswer
                                      ? "border-green-500 bg-green-500 text-white"
                                      : option === question.userAnswer && option !== question.correctAnswer
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "border-gray-300"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <span>{option}</span>

                                {option === question.correctAnswer && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                                )}
                                {option === question.userAnswer && option !== question.correctAnswer && (
                                  <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm font-medium mb-1">Explanation:</p>
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </TabsContent>
            </Tabs> */}
          </div>
        </div>
      </main>
    </div>
  )
}

export default withAuth(Page)

// Mock data for quiz history
const mockQuizHistory = [
  {
    id: "quiz-1",
    quizId: "science-101",
    title: "Basic Science Quiz",
    category: "Science",
    difficulty: "Medium",
    date: "2023-04-15T14:30:00",
    correctAnswers: 7,
    totalQuestions: 10,
    timeTaken: "8:24 minutes",
    avgTimePerQuestion: "50 seconds",
    ranking: "Top 25%",
    topicPerformance: [
      { name: "Physics", score: 80 },
      { name: "Chemistry", score: 60 },
      { name: "Biology", score: 75 },
    ],
    improvementAreas: [
      "Review chemical reactions and equations",
      "Practice questions on Newton's laws of motion",
      "Study cell structure and function",
    ],
    questions: [
      {
        text: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correctAnswer: "H2O",
        userAnswer: "H2O",
        isCorrect: true,
        explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence the chemical formula H2O.",
      },
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        userAnswer: "Mars",
        isCorrect: true,
        explanation: "Mars appears reddish because of iron oxide (rust) on its surface.",
      },
      {
        text: "What is the largest organ in the human body?",
        options: ["Heart", "Liver", "Skin", "Brain"],
        correctAnswer: "Skin",
        userAnswer: "Skin",
        isCorrect: true,
        explanation: "The skin is the largest organ in the human body, covering about 20 square feet in adults.",
      },
      {
        text: "Which of these is NOT a primary color?",
        options: ["Red", "Blue", "Green", "Yellow"],
        correctAnswer: "Green",
        userAnswer: "Yellow",
        isCorrect: false,
        explanation:
          "The primary colors are red, blue, and yellow. Green is a secondary color made by mixing blue and yellow.",
      },
      {
        text: "What is the process by which plants make their own food?",
        options: ["Photosynthesis", "Respiration", "Digestion", "Fermentation"],
        correctAnswer: "Photosynthesis",
        userAnswer: "Photosynthesis",
        isCorrect: true,
        explanation:
          "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
      },
      {
        text: "What is the smallest unit of matter?",
        options: ["Atom", "Molecule", "Cell", "Electron"],
        correctAnswer: "Atom",
        userAnswer: "Electron",
        isCorrect: false,
        explanation:
          "The atom is the smallest unit of matter that defines the chemical elements. Electrons are subatomic particles.",
      },
      {
        text: "Which of these animals is a mammal?",
        options: ["Snake", "Crocodile", "Dolphin", "Lizard"],
        correctAnswer: "Dolphin",
        userAnswer: "Dolphin",
        isCorrect: true,
        explanation:
          "Dolphins are mammals because they breathe air, give birth to live young, and produce milk for their offspring.",
      },
      {
        text: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correctAnswer: "Diamond",
        userAnswer: "Diamond",
        isCorrect: true,
        explanation:
          "Diamond is the hardest known natural material on Earth, scoring 10 on the Mohs scale of mineral hardness.",
      },
      {
        text: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: "Carbon Dioxide",
        userAnswer: "Carbon Dioxide",
        isCorrect: true,
        explanation:
          "Plants absorb carbon dioxide from the atmosphere during photosynthesis and release oxygen as a byproduct.",
      },
      {
        text: "What is the speed of light in a vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "200,000 km/s"],
        correctAnswer: "300,000 km/s",
        userAnswer: "150,000 km/s",
        isCorrect: false,
        explanation:
          "The speed of light in a vacuum is approximately 300,000 kilometers per second (or 186,282 miles per second).",
      },
    ],
  },
  {
    id: "quiz-2",
    quizId: "geography-101",
    title: "World Geography Challenge",
    category: "Geography",
    difficulty: "Easy",
    date: "2023-04-14T10:15:00",
    correctAnswers: 6,
    totalQuestions: 10,
    timeTaken: "7:30 minutes",
    avgTimePerQuestion: "45 seconds",
    ranking: "Top 40%",
    topicPerformance: [
      { name: "Countries", score: 70 },
      { name: "Capitals", score: 60 },
      { name: "Landmarks", score: 50 },
    ],
    improvementAreas: [
      "Study European capitals",
      "Review major world landmarks",
      "Practice identifying countries on a map",
    ],
    questions: [
      {
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        userAnswer: "Paris",
        isCorrect: true,
        explanation: "Paris is the capital and most populous city of France.",
      },
      {
        text: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "Thailand", "South Korea"],
        correctAnswer: "Japan",
        userAnswer: "Japan",
        isCorrect: true,
        explanation:
          "Japan is often referred to as the Land of the Rising Sun because from China, it appears that the sun rises from the direction of Japan.",
      },
      // More questions would be here
    ],
  },
]

