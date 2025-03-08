export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

export interface Session {
  id: number;
  date: string;
  teacherId: number;
}

export interface Feedback {
  id: number;
  sessionId: number;
  feedback: string;
  rating: number;
}

export interface Student {
  id: number;
  name: string;
}

export interface SessionRating {
  totalRating: number;
}