"use client"

import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Header with logo and auth buttons */}
      <header className="border-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium text-primary">QuizMaster</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-primary hover:text-primary/90 hover:bg-primary/5">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className=" flex flex-col items-center justify-center px-4 text-center">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 mb-12"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b6078de3-6457-4c85-927e-9966678e36eb-b5aoYVXHHi8VRSuWPSWKhnbSTd5dOV.jpeg"
            alt="Learning Illustration"
            className="h-64 w-auto"
          />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[320px] space-y-4"
        >
          <h1 className="text-2xl font-semibold tracking-tight">Mastering Any Subject Through Quizzes</h1>
          <p className="text-sm text-muted-foreground">Challenge yourself, learn, and compete with others</p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Start Learning
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}

