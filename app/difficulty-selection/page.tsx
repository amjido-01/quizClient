"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Trophy,
  Shield,
  Zap,
  ArrowLeft,
  ArrowRight,
  Calculator,
  BookOpen,
  FlaskRoundIcon as Flask,
  Atom,
  Dna,
  Microscope,
  Ruler,
  PiSquare,
  ActivityIcon as Function,
} from "lucide-react"
import QuizHeader from "@/components/ui/quiz-header"
import { useAuthStore } from "@/hooks/use-auth"
import Footer from "@/components/ui/Footer"
import api from "../api/axiosConfig"


export default function SubcategorySelection() {
  const router = useRouter()
  const {user} = useAuthStore()
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState<string>("")
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  console.log(loading)
  useEffect(() => {
    // Get the category name from the slug and fetch subcategories 
    if (category) {
      setCategoryName(category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " "))
      fetchSubcategories(category)
    }
  }, [category])

  const fetchSubcategories = async (categorySlug: string) => {
    setLoading(true)
    try {
      // In a real app, you would fetch subcategories from an API
      // For now, we'll use our predefined subcategories
      const response = await fetch(`http://localhost:8080/api/v1/quizzes/subcategories?category=${categorySlug}`)
      if (response.ok) {
        const data = await response.json()
        setSubcategories(
          data.subcategories.map((sub: string) => ({
            name: sub,
            slug: sub.toLowerCase().replace(/\s+/g, "-"),
            description: `Test your knowledge in ${sub}`,
            icon: getSubcategoryIcon(sub.toLowerCase()),
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error)
    //   setSubcategories(getSubcategoriesForCategory(categorySlug))
    } finally {
      setLoading(false)
    }
  }

  const getSubcategoryIcon = (subcategory: string) => {
    const icons: Record<string, React.JSX.Element> = {
      algebra: <Function className="h-6 w-6" />,
      calculus: <Calculator className="h-6 w-6" />,
      geometry: <Ruler className="h-6 w-6" />,
      statistics: <PiSquare className="h-6 w-6" />,
      physics: <Atom className="h-6 w-6" />,
      chemistry: <Flask className="h-6 w-6" />,
      biology: <Dna className="h-6 w-6" />,
      astronomy: <Microscope className="h-6 w-6" />,
    }

    return icons[subcategory] || <BookOpen className="h-6 w-6" />
  }


  // const handleStartQuiz = async () => {
  //   console.log(category, selectedDifficulty, selectedSubcategory)
  //   if (!category || !selectedSubcategory || !selectedDifficulty) return

  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/v1/quizzes?category=${category}&subcategory=${selectedSubcategory}&difficulty=${selectedDifficulty}`,
  //     )

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch quiz questions")
  //     }

  //     const quizData = await response.json()

  //     if (!quizData || quizData.length === 0) {
  //       console.error("No quiz data available")
  //       return
  //     }

  //     router.push(`/quiz/${quizData[0].id}`)
  //   } catch (error) {
  //     console.error("Error starting quiz:", error)
  //   }
  // }

  const handleStartQuiz = async () => {
    if (!category || !selectedSubcategory || !selectedDifficulty) return;
  
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/quizzes?category=${category}&subcategory=${selectedSubcategory}&difficulty=${selectedDifficulty}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch quiz questions");
      }
  
      const quizData = await response.json();
  
      if (!quizData || quizData.length === 0) {
        console.error("No quiz data available");
        return;
      }
  
      const quizId = quizData[0].id;
  
      // Create quiz attempt
      const attemptResponse = await fetch("http://localhost:8080/api/v1/attempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id, quizId }),
      });
  
      if (!attemptResponse.ok) {
        throw new Error("Failed to create quiz attempt");
      }
  
      const attemptData = await attemptResponse.json();
  
      // Navigate to the quiz page with the attempt ID
      router.push(`/quiz/${quizId}?attemptId=${attemptData.id}`);
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };
  

  const handleBack = () => {
    router.back()
  }

  const difficulties = [
    {
      name: "Easy",
      level: "easy",
      description: "Perfect for beginners.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "Medium",
      level: "medium",
      description: "For those with good knowledge.",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      name: "Hard",
      level: "hard",
      description: "For experts only.",
      icon: <Zap className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <QuizHeader user={user}/>

      <main className="flex-1 w-[95%] mx-auto">
        {/* Header Section */}
        <section className="py-8 border-b">
          <div className="containe px-4 md:px-6">
            <Button variant="ghost" className="mb-4 pl-0 flex items-center gap-2" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" /> Back to Categories
            </Button>

            <div className="mb-6">
              <h1 className="text-3xl font-bold">{categoryName}</h1>
              <p className="text-muted-foreground">Select a topic and difficulty level to start your quiz</p>
            </div>
          </div>
        </section>

        {/* Subcategory Selection */}
        <section className="py-8 border-b">
          <div className="containe px-4 md:px-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Select Topic</h2>
              <p className="text-muted-foreground">Choose a specific area to test your knowledge</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {subcategories.map((subcategory) => (
                <Card
                  key={subcategory.slug}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedSubcategory === subcategory.slug
                      ? "border-[#6C5CE7] bg-[#dee0fd] shadow-md"
                      : "hover:border-primary/30 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedSubcategory(subcategory.slug)}
                >
                  <CardHeader className="p-4 flex flex-row items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        selectedSubcategory === subcategory.slug
                          ? "bg-[#6C5CE7]  text-white"
                          : "bg-primary/10 text-[#6C5CE7]"
                      }`}
                    >
                      {subcategory.icon}
                    </div>
                    <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardDescription>{subcategory.description}</CardDescription>
                  </CardContent>
                  
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Difficulty Selection */}
        <section className="py-8">
          <div className="containe px-4 md:px-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Select Difficulty Level</h2>
              <p className="text-muted-foreground">Choose how challenging you want your quiz to be</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {difficulties.map((difficulty) => (
                <Card
                  key={difficulty.level}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedDifficulty === difficulty.level
                      ? "border-[#6C5CE7] bg-[#dee0fd] shadow-md"
                      : "hover:border-primary/30 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedDifficulty(difficulty.level)}
                >
                  <CardHeader className="p-4 flex flex-row items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        selectedDifficulty === difficulty.level
                          ? "bg-[#6C5CE7]  text-white"
                          : "bg-primary/10  text-[#6C5CE7]"
                      }`}
                    >
                      {difficulty.icon}
                    </div>
                    <CardTitle className="text-lg">{difficulty.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription>{difficulty.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Start Quiz Button */}
            <div className="mt-12 flex justify-end">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-[#6C5CE7] hover:bg-[#6C5CE7]/90 gap-2"
                disabled={!selectedSubcategory || !selectedDifficulty}
                onClick={handleStartQuiz}
              >
                Start Quiz <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
          <Footer />
    </div>
  )
}

