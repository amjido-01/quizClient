


export interface Interest {
    id: number
    interest: string
    userId: string
  }

  export interface Notification {
    id: string
    productName: string
    message: string
    createdAt: string
    sent: boolean
  }

export interface User {
    id: number;
    email: string;
    password: string;
    username: string;
    frequency: string;
    createdAt: string;
    updatedAt: string;
    interest: Interest[];
    notifications: Notification[]
  }