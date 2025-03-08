# Session, Student & Teacher API

This API manages session creation, retrieval, feedback, and ratings for teachers and students. It also includes student and teacher authentication and session participation.

## Base URLs
```
http://localhost:3000/session
http://localhost:3000/student
http://localhost:3000/teacher
```

---

## Session Endpoints

### 1. Create a Session
**POST** `/create-session`

#### Request
Headers:
- `teacher-id` (number, required): ID of the teacher creating the session.

Body:
- `date` (string, required): Date of the session in `YYYY-MM-DD` format.

#### Response
- `id` (number): Session ID.
- `date` (string): Date of the session.
- `teacherId` (number): ID of the teacher who created the session.

---

### 2. Get Sessions for a Teacher
**GET** `/get-session`

#### Request
Headers:
- `teacher-id` (number, required): ID of the teacher.

#### Response
Array of objects containing:
- `id` (number): Session ID.
- `date` (string): Date of the session.
- `teacherId` (number): ID of the teacher.

---

### 3. Get All Sessions
**GET** `/get-all-sessions`

#### Response
Array of objects containing:
- `id` (number): Session ID.
- `date` (string): Date of the session.
- `teacherId` (number): ID of the teacher.

---

### 4. Get Sessions for a Student
**GET** `/get-student-sessions`

#### Request
Headers:
- `student-id` (number, required): ID of the student.

#### Response
Array of objects containing:
- `id` (number): Session ID.
- `date` (string): Date of the session.
- `teacherId` (number): ID of the teacher.

---

### 5. Get Feedback for a Session
**GET** `/get-feedback?sessionId={sessionId}`

#### Request
Query Parameters:
- `sessionId` (number, required): ID of the session.

#### Response
Array of objects containing:
- `id` (number): Feedback ID.
- `sessionId` (number): ID of the session.
- `feedback` (string): Feedback content.
- `rating` (number): Rating given.

---

### 6. Get Rating for a Session
**GET** `/get-rating?sessionId={sessionId}`

#### Request
Query Parameters:
- `sessionId` (number, required): ID of the session.

#### Response
- `totalRating` (number): Average rating of the session.

---

### 7. Get Students Who Haven't Submitted Feedback
**GET** `/no-feedback?sessionId={sessionId}`

#### Request
Query Parameters:
- `sessionId` (number, required): ID of the session.

#### Response
Array of objects containing:
- `id` (number): Student ID.
- `name` (string): Name of the student.

---

## Student Endpoints

### 1. Register a Student
**POST** `/register`

#### Request
Body:
- `name` (string, required): Name of the student.
- `email` (string, required): Email of the student.
- `password` (string, required): Password for the student account.

#### Response
- `msg` (string): Registration success message.
- `token` (string): JWT authentication token.

---

### 2. Student Login
**POST** `/login`

#### Request
Body:
- `email` (string, required): Email of the student.
- `password` (string, required): Password of the student.

#### Response
- `msg` (string): Login success message.
- `token` (string): JWT authentication token.

---

### 3. Submit Feedback
**POST** `/submit-feedback`

#### Request
Headers:
- `student-id` (number, required): ID of the student.

Body:
- `rating` (number, required): Rating given by the student.
- `feedback` (string, required): Feedback text.
- `sessionId` (number, required): ID of the session.

#### Response
- `message` (string): Feedback submission status.

---

### 4. Join a Session
**POST** `/join-session`

#### Request
Headers:
- `student-id` (number, required): ID of the student.

Body:
- `sessionId` (number, required): ID of the session to join.

#### Response
- `message` (string): Session joining status.

---

## Teacher Endpoints

### 1. Register a Teacher
**POST** `/register`

#### Request
Body:
- `name` (string, required): Name of the teacher.
- `email` (string, required): Email of the teacher.
- `password` (string, required): Password for the teacher account.

#### Response
- `msg` (string): Registration success message.
- `token` (string): JWT authentication token.

---

### 2. Teacher Login
**POST** `/login`

#### Request
Body:
- `email` (string, required): Email of the teacher.
- `password` (string, required): Password of the teacher.

#### Response
- `msg` (string): Login success message.
- `token` (string): JWT authentication token.

