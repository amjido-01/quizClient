"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle } from "lucide-react"

interface TimeUpDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
  totalQuestions: number
  questionsAnswered: number
}

export function TimeUpDialog({ isOpen, onClose, onSubmit, totalQuestions, questionsAnswered }: TimeUpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Time's Up!
          </DialogTitle>
          <DialogDescription>
            Your allocated time for this quiz has ended. Your answers will be submitted automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">
              You've answered {questionsAnswered} out of {totalQuestions} questions.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onSubmit} className="w-full">
            View Results
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
