"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Brain } from "lucide-react";
// import { loginAction } from "@/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion"
import axios from "axios";
import {useAuthStore} from "@/hooks/use-auth"

export default function LoginPage() {
  // const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")

  // async function handleLogin(formData: FormData) {
  //   const result = await loginAction(formData);
    
  //   if (result?.error) {
  //     setError(result.error); // Show error message
  //   } else if (result?.success) {
  //     setError(null);
  //     router.push("/dashboard");
  //   }
  // }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error and safely extract response message
        // console.error("Axios error:", error.response?.data);
        setError(error.response?.data?.responseMessage || "An error occurred while signing up.");
      } else if (error instanceof Error) {
        // Handle generic JavaScript errors
        console.error("Error:", error.message);
        setError(error.message);
      } else {
        // Handle unexpected error types
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false)
    }
  }

  

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">

          <div className="flex flex-col space-y-2 text-center">

            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-[#6C5CE7]" />
              <span className="text-xl font-bold text-[#6C5CE7]">QuizMaster</span>
            </Link>

            <h1 className="text-3xl text-left font-bold">Welcome back</h1>

            <p className="text-muted-foreground -my-2 mb-2 text-left">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Show error message if exists */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="*******"
                required
              />
            </div>
            <Button 
             disabled={isLoading}
            type="submit" className="w-full bg-[#6C5CE7] hover:bg-[#8b82d1] text-white">
              {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full"
              />
            ) : (
              "Login"
            )}
            </Button>
          </form>

          <Separator className="my-4" />

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#6C5CE7] underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
