export interface User {
    id: number;
    email: string;
    password: string;
    username: string;
    frequency: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface RecentQuiz {
    id: string;
    title: string;
    topic: string;
    category: string;
    score: number;
    date: string; // or `Date` if you're converting it on the frontend
  }
  
  export interface Question {
    id: string;
    quizId: string;
    text: string;
    type: string;
    options: string[];
    correctAnswer: string;
    createdAt: string;
  }
  
  export interface Quiz {
    id: string;
    title: string;
    topicId: string;
    difficulty: "easy" | "medium" | "hard";
    createdAt: string;
    questions: Question[];
  }