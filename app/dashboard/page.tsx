"use client"

import { type JSX, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  Brain,
  Code,
  Globe,
  History,
  Lightbulb,
  Music,
  Palette,
  Search,
  SpaceIcon as Science,
  Calculator,
  BookOpen,
  Languages,
  Dumbbell,
  ArrowRight,
} from "lucide-react"
import QuizHeader from "@/components/ui/quiz-header"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<
    { name: string; slug: string; icon: JSX.Element; description: string; quizCount?: number }[]
  >([])
  const router = useRouter()

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/quizzes/categories")
        const data = await response.json()
        console.log(data, "data from dashboard")
        const categoryIcons: Record<string, JSX.Element> = {
          math: <Calculator className="h-5 w-5" />,
          science: <Science className="h-5 w-5" />,
          history: <History className="h-5 w-5" />,
          geography: <Globe className="h-5 w-5" />,
          music: <Music className="h-5 w-5" />,
          literature: <BookOpen className="h-5 w-5" />,
          languages: <Languages className="h-5 w-5" />,
          sports: <Dumbbell className="h-5 w-5" />,
          technology: <Code className="h-5 w-5" />,
          arts: <Palette className="h-5 w-5" />,
        }

        if (Array.isArray(data.categories)) {
          setCategories(
            data.categories.map((cat: { name: string; slug: string }) => ({
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"), // Ensure slug exists
              icon: categoryIcons[cat.slug || cat.name.toLowerCase()] || <BookOpen className="h-5 w-5" />,
              description: `Test your knowledge in ${cat.name}`,
              quizCount: Math.floor(Math.random() * 20) + 5,
            })),
          )
        } else {
          // Fallback to sample categories if API format is unexpected
          setCategories(sampleCategories)
          console.error("Unexpected API response format:", data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fallback to sample categories if API fails
        setCategories(sampleCategories)
      }
    }
    fetchCategories()
  }, [])

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleNextStep = () => {
    if (!selectedCategory) return

    // Navigate to difficulty selection page with the selected category
    router.push(`/difficulty-selection?category=${selectedCategory}`)
  }

  const handleCategorySelection = (slug: string) => {
    console.log("Selecting category with slug:", slug)
    setSelectedCategory(slug)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <QuizHeader />

      <main className="flex-1">
        {/* Welcome Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, John!</h1>
                <p className="text-muted-foreground">Ready to challenge your knowledge today?</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Brain className="h-4 w-4" />
                  <span>Level 5 Quiz Master</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                  <span>125 Points</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-6 border-b">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for quiz categories..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Quiz Categories</h2>
              <p className="text-muted-foreground">Select a category to test your knowledge</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredCategories.map((category, index) => (
                <Card
                  key={`category-${index}-${category.slug}`}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.slug
                      ? "border-primary bg-primary/5 shadow-md"
                      : "hover:border-primary/30 hover:shadow-sm"
                  }`}
                  onClick={() => handleCategorySelection(category.slug)}
                >
                  <CardHeader className="p-4 bg-muted/50 flex flex-row items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        selectedCategory === category.slug
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardDescription>
                      {category.description || `Test your knowledge in ${category.name}`}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-muted/20">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm text-muted-foreground">{category.quizCount} quizzes</span>
                      {selectedCategory === category.slug && (
                        <div className="flex items-center justify-center rounded-full bg-primary/10 px-2 py-1">
                          <span className="text-xs font-medium text-primary">Selected</span>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Search className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No categories found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching for something else or explore our featured categories
                </p>
                <Button className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}

            {/* Next Button */}
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-[#6C5CE7] hover:bg-[#6C5CE7]/90 gap-2"
                disabled={!selectedCategory}
                onClick={handleNextStep}
              >
                Next <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {selectedCategory && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                You've selected{" "}
                <span className="font-medium text-primary">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                </span>{" "}
                as your quiz category
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="py-12 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <p className="text-muted-foreground">Your recent quiz attempts and achievements</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz, index) => (
                      <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            quiz.score >= 70
                              ? "bg-green-100 text-green-700"
                              : quiz.score >= 40
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {quiz.score}%
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{quiz.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {quiz.category} • {quiz.date}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold">QuizMaster</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} QuizMaster. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sample categories as fallback if API fails
const sampleCategories = [
  {
    name: "Science",
    slug: "science",
    description: "Test your knowledge of scientific principles and discoveries",
    quizCount: 24,
    icon: <Science className="h-5 w-5" />,
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    description: "Challenge yourself with math problems and concepts",
    quizCount: 18,
    icon: <Calculator className="h-5 w-5" />,
  },
  {
    name: "History",
    slug: "history",
    description: "Explore historical events, figures, and time periods",
    quizCount: 18,
    icon: <History className="h-5 w-5" />,
  },
  {
    name: "Geography",
    slug: "geography",
    description: "Test your knowledge about countries, capitals, and landmarks",
    quizCount: 15,
    icon: <Globe className="h-5 w-5" />,
  },
]

const recentQuizzes = [
  {
    title: "Basic Science Quiz",
    category: "Science",
    score: 85,
    date: "Today",
  },
  {
    title: "World Geography Challenge",
    category: "Geography",
    score: 65,
    date: "Yesterday",
  },
  {
    title: "Math Fundamentals",
    category: "Mathematics",
    score: 90,
    date: "3 days ago",
  },
  {
    title: "History of Ancient Civilizations",
    category: "History",
    score: 35,
    date: "Last week",
  },
]

const achievements = [
  {
    title: "Science Expert",
    description: "Completed 10 science quizzes with 80%+ score",
    icon: <Science className="h-4 w-4" />,
  },
  {
    title: "Quick Thinker",
    description: "Completed a quiz in under 5 minutes with 90%+ score",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    title: "Knowledge Explorer",
    description: "Attempted quizzes in 5 different categories",
    icon: <Globe className="h-4 w-4" />,
  },
]

