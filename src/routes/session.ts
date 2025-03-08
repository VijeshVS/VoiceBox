import { Router, Request, Response } from "express";
import prisma from "../db/main";
import { checkStudent, checkTeacher } from "../middlewares/auth";

const sessionRouter = Router();

sessionRouter.post(
  "/create-session",
  checkTeacher,
  async (req: Request, res: Response): Promise<any> => {
    const { date } = req.body;
    const teacherId = Number(req.headers["teacher-id"]);

    if (!date) {
      return res.status(400).json({
        message: "Session date is required",
      });
    }

    try {
      const session = await prisma.sessions.create({
        data: {
          date: new Date(date),
          teacherId,
        },
      });

      return res.json(session);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

sessionRouter.get(
  "/get-session",
  checkTeacher,
  async (req: Request, res: Response): Promise<any> => {
    const teacherId = Number(req.headers["teacher-id"]);

    try {
      const sessions = await prisma.sessions.findMany({
        where: {
          teacherId,
        },
      });

      return res.json(sessions);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

sessionRouter.get(
  "/get-all-sessions",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const sessions = await prisma.sessions.findMany();

      return res.json(sessions);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

sessionRouter.get(
  "/get-student-sessions",
  checkStudent,
  async (req: Request, res: Response): Promise<any> => {
    const studentId = Number(req.headers["student-id"]);

    try {
      const sessions = await prisma.sessions.findMany({
        where: {
          students: {
            some: {
              studentId,
            },
          },
        },
      });

      return res.json(sessions);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

sessionRouter.get(
  "/get-feedback",
  checkTeacher,
  async (req: Request, res: Response): Promise<any> => {
    const sessionId = parseInt(req.query.sessionId as string, 10);

    try {
      const session = await prisma.sessions.findUnique({
        where: {
          id: sessionId,
        },
      });

      if (!session) {
        return res.status(400).json({
          message: "Invalid session id",
        });
      }

      const sessionFeedback = await prisma.sessionFeedback.findMany({
        where: {
          sessionId,
        },
      });

      return res.json(sessionFeedback);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

sessionRouter.get(
  "/get-rating",
  checkTeacher,
  async (req: Request, res: Response): Promise<any> => {
    const sessionId = parseInt(req.query.sessionId as string, 10);

    try {
      const session = await prisma.sessions.findUnique({
        where: {
          id: sessionId,
        },
      });

      if (!session) {
        return res.status(400).json({
          message: "Invalid session id",
        });
      }

      const sessionFeedback = await prisma.sessionFeedback.findMany({
        where: {
          sessionId,
        },
        select: {
          rating: true,
        },
      });

      const totalRating = sessionFeedback.reduce((acc, feedback) => {
        return acc + feedback.rating;
      }, 0);

      return res.json({ totalRating: totalRating / sessionFeedback.length });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

sessionRouter.get(
  "/no-feedback",
  checkTeacher,
  async (req: Request, res: Response): Promise<any> => {
    const sessionId = parseInt(req.query.sessionId as string, 10);

    if (!sessionId) {
      return res.status(400).json({
        message: "Session id is required",
      });
    }

    try {
      const session = await prisma.sessions.findUnique({
        where: {
          id: sessionId as any as number,
        },
        select: {
          students: true,
        },
      });

      if (!session) {
        return res.status(400).json({
          message: "Invalid session id",
        });
      }

      // get students who have submitted feedback
      const feedbackSubmittedStudents =
        await prisma.feedbackSubmitHistory.findMany({
          where: {
            sessionId: sessionId as any as number,
          },
        });

      // filter students who have not submitted feedback
      const noFeedbackStudents = session.students.filter((student) => {
        return !feedbackSubmittedStudents.some(
          (feedback) => feedback.studentId === student.studentId
        );
      });

      const noFeedbackStudentsData = await prisma.student.findMany({
        where: {
          id: {
            in: noFeedbackStudents.map((student) => student.studentId),
          },
        },
      });

      return res.json(noFeedbackStudentsData);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

export default sessionRouter;
