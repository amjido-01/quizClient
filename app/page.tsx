"use client"

import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/ui/Footer"
import Image from "next/image"
// import heroImg from "/heroImg.png"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Header with logo and auth buttons */}
      <header className="border-2 p-4">
        <div className="flex items-center w-[90%] mx-auto justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-[#6C5CE7]" />
            <span className="text-xl font-medium text-[#6C5CE7]">QuizMaster</span>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#6C5CE7] md:font-bold hover:text-[#8b82d1] hover:bg-primary/5">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#6C5CE7] md:font-bold hover:bg-[#8b82d1] text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mb-6 flex flex-col items-center justify-center px-4 text-center">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 mb-12"
        >
          
          <Image width={200}
                  height={200} 
                  src="/heroImg.png" 
                  alt="This is the hero image for you!" 
                  />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[320px] space-y-4"
        >
          <h1 className="text-2xl font-semibold tracking-tight">Level Up Your Knowledge-One Quiz at a Time!</h1>
          <p className="text-sm text-muted-foreground">Fun, fast and smart quizzes to boost your understanding across categories</p>
          <Link href="/register">
            <Button size="lg" className="bg-[#6C5CE7] hover:bg-[#8b82d1] text-white">
              Start Learning
            </Button>
          </Link>
        </motion.div>
      </main>

       <Footer />
    </div>
  )
}

