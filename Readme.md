# VoiceBox

**VoiceBox** is an anonymous feedback platform designed for students to submit feedback on sessions. It allows teachers to create sessions, track feedback submissions, and view overall ratings and comments. Students can anonymously provide feedback without revealing their identity, fostering a safe space for honest input.

---

## Features

- **Teacher Features**:
  - Create new sessions for students to submit feedback.
  - View students who have or have not submitted feedback.
  - Access anonymous feedback responses for each session.
  - View overall session ratings.

- **Student Features**:
  - Join sessions created by teachers.
  - Submit anonymous feedback for each session.
  - Provide ratings and comments without their responses being linked to them.

---

## Tech Stack

- **Backend**:
  - **TypeScript** - For type-safe development.
  - **Express** - Web framework for building REST APIs.
  - **Prisma ORM** - For easy and efficient database queries.
  - **PostgreSQL** - Relational database to store user data and feedback information.

- **Frontend**:  
  - **React.js** - JavaScript library for building user interfaces.  
  - **TailwindCSS** - Utility-first CSS framework for fast styling.  
  - **Lucid React** - A library for visualizing data in the frontend.  
  - **Zod** - TypeScript-first schema declaration and validation.  
  - **Zustand** - A small, fast, and scalable state management library.  

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (or access to a PostgreSQL database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/voicebox.git
   cd voicebox
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the PostgreSQL database and configure the connection in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   ```

4. Run the Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   npm run start
   ```

6. For the frontend:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install the frontend dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm run dev
     ```

---

## Usage

- **Teachers** can log in, create sessions, and manage feedback submissions.
- **Students** can join the sessions and provide anonymous feedback.
- All feedback from students will be anonymous and cannot be traced back to the individual student.
- Teachers can view aggregated feedback and the overall rating for each session.

---

## Contributing

If you'd like to contribute to **VoiceBox**, feel free to fork the repository and submit a pull request. Please ensure that your code adheres to the following guidelines:

- Follow the [Code of Conduct](#).
- Write clear, concise commit messages.
- Ensure your code passes linting and formatting checks.
- Add tests for new features or bug fixes.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
