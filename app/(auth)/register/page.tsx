"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Brain } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/hooks/use-auth";
// import { registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion"

export default function SignUpPage() {
  // const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const { register } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState("")
  const [password, setPassword] = useState('')


  // async function handleRegister(formData: FormData) {
  //   const result = await registerAction(formData);
  //   if (result && result.error) {
  //   setError(result.error);
  //   } else {
  //   setError(null);
  //   console.log("Registration successful", result);
  //   alert("registered")
  //   // Redirect or handle success
  //   }
  // }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await register(username, email, password)
      router.push('/login') // Redirect to onboarding or dashboard
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
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">QuizMaster</span>
            </Link>
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Enter your information to get started with QuizMaster</p>
          </div>
          <form
            // action={handleRegister}
            onSubmit={handleSignUp}
            className="space-y-4"
          >
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input value={username} onChange={(e) => setUserName(e.target.value)} id="username" name="username" placeholder="Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input value={password} onChange={(e)=>setPassword(e.target.value)} id="password" name="password" type="password" placeholder="*******" required />
            </div>
            <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full"
              />
            ) : (
              "Sign Up"
            )}
            </Button>
          </form>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
