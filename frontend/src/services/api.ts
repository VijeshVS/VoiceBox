import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export const auth = {
  studentLogin: (email: string, password: string) =>
    api.post('/student/login', { email, password }),
  teacherLogin: (email: string, password: string) =>
    api.post('/teacher/login', { email, password }),
  studentRegister: (name: string, email: string, password: string) =>
    api.post('/student/register', { name, email, password }),
  teacherRegister: (name: string, email: string, password: string) =>
    api.post('/teacher/register', { name, email, password }),
};

export const sessions = {
  create: (date: string) =>
    api.post('/session/create-session', { date }, {
      headers: { 'teacher-id': useAuthStore.getState().user?.id.toString() }
    }),
  getAllSessions: () =>
    api.get('/session/get-all-sessions'),
  getTeacherSessions: () =>
    api.get('/session/get-session', {
      headers: { 'teacher-id': useAuthStore.getState().user?.id.toString() }
    }),
  getStudentSessions: () =>
    api.get('/session/get-student-sessions', {
      headers: { 'student-id': useAuthStore.getState().user?.id.toString() }
    }),
  joinSession: (sessionId: number) =>
    api.post('/student/join-session', 
      { sessionId },
      { headers: { 'student-id': useAuthStore.getState().user?.id.toString() } }
    ),
  submitFeedback: (sessionId: number, rating: number, feedback: string) =>
    api.post('/student/submit-feedback',
      { sessionId, rating, feedback },
      { headers: { 'student-id': useAuthStore.getState().user?.id.toString() } }
    ),
  getNoFeedbackStudents: (sessionId: number) =>
    api.get(`/session/no-feedback?sessionId=${sessionId}`),
  getSessionFeedback: (sessionId: number) =>
    api.get(`/session/get-feedback?sessionId=${sessionId}`),
  getSessionRating: (sessionId: number) =>
    api.get(`/session/get-rating?sessionId=${sessionId}`),
};