"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/hooks/use-auth"
import { Brain } from 'lucide-react'
import {User} from "@/types/index"

interface QuizHeaderProps {
  user?: User | null; // Use the imported UserData interface
}

export default function QuizHeader({user}: QuizHeaderProps) {
  const {logout} = useAuthStore()
  const router = useRouter()
  let initials = "??"; 

  if (user && user.username) {
    const parts = user.username.split(" "); // Split username at spaces
    initials = parts
      .map((part) => part.charAt(0).toUpperCase()) // Get first letter of each part
      .slice(0, 2) // Take only the first two initials
      .join(""); // Join the initials
  }

  
  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex py-4 px-8 h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-[#6C5CE7]" />
          <span className="text-xl text-[#6C5CE7] font-bold">QuizMaster</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/categories">
            <Button variant="ghost">Categories</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost">Leaderboard</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="text-[#6C5CE7]">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>My Quizzes</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

