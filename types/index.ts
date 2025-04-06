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
  