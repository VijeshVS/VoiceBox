import { Router, Request, Response } from "express";
import prisma from "../db/main";
import jwt from "jsonwebtoken";
import { checkTeacher } from "../middlewares/auth";

const teacherRouter = Router();
const secretKey = process.env.JWT_SECRET_KEY || "";

teacherRouter.post(
  "/register",
  async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    try {
      const teacher = await prisma.teacher.create({
        data: {
          name,
          email,
          password,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      const token = jwt.sign(
        {
          id: teacher.id,
          email: teacher.email,
        },
        secretKey
      );

      return res.json({
        user: teacher,
        msg: "Teacher registered successfully",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

teacherRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    try {
      const teacher = await prisma.teacher.findFirst({
        where: {
          email,
          password,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      const token = jwt.sign(
        {
          id: teacher.id,
          email: teacher.email,
        },
        secretKey
      );

      return res.json({
        user: teacher,
        msg: "Teacher logged in successfully",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

export default teacherRouter;
