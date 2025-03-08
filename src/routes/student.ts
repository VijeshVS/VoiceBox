import { Router, Request, Response } from "express";
import prisma from "../db/main";
import jwt from "jsonwebtoken";
import { checkStudent } from "../middlewares/auth";

const studentRouter = Router();
const secretKey = process.env.JWT_SECRET_KEY || "";

studentRouter.post(
  "/register",
  async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    try {
      const student = await prisma.student.create({
        data: {
          name,
          email,
          password,
        },
      });

      const token = jwt.sign(
        {
          id: student.id,
          email: student.email,
        },
        secretKey
      );

      return res.json({
        msg: "Student registered successfully",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

studentRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    try {
      const student = await prisma.student.findFirst({
        where: {
          email,
          password,
        },
      });

      if (!student) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          id: student.id,
          email: student.email,
        },
        secretKey
      );

      return res.json({
        msg: "Student logged in successfully",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

studentRouter.post(
  "/submit-feedback",
  checkStudent,
  async (req: Request, res: Response): Promise<any> => {
    const { rating, feedback, sessionId } = req.body;
    const studentId = Number(req.headers["student-id"]);

    if (!rating || !feedback) {
      return res.status(400).json({
        message: "Rating and feedback are required",
      });
    }

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

      // check wheather user was a part of the session
      const joinSession = await prisma.studentSession.findFirst({
        where: {
          sessionId,
          studentId,
        },
      });

      if (!joinSession) {
        return res.status(400).json({
          message: "Student is not part of the session",
        });
      }

      // check if feedback already submitted

      const didSubmitFeedback = await prisma.feedbackSubmitHistory.findFirst({
        where: {
          sessionId,
          studentId,
        },
      });

      if (didSubmitFeedback) {
        return res.status(400).json({
          message: "Feedback already submitted",
        });
      }

      // add feedback
      await prisma.sessionFeedback.create({
        data: {
          rating,
          feedback,
          sessionId,
        },
      });

      // add to history
      await prisma.feedbackSubmitHistory.create({
        data: {
          sessionId,
          studentId,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    return res.json({
      message: "Feedback submitted successfully",
    });
  }
);

studentRouter.post(
  "/join-session",
  checkStudent,
  async (req: Request, res: Response): Promise<any> => {
    const { sessionId } = req.body;
    const studentId = Number(req.headers["student-id"]);

    if (!sessionId) {
      return res.status(400).json({
        message: "Session id is required",
      });
    }

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

      // check if student is already part of the session
      const joinSession = await prisma.studentSession.findFirst({
        where: {
          sessionId,
          studentId,
        },
      });

      if (joinSession) {
        return res.status(400).json({
          message: "Student is already part of the session",
        });
      }

      await prisma.studentSession.create({
        data: {
          sessionId,
          studentId,
        },
      });

      return res.json({
        message: "Student joined session successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

export default studentRouter;
