import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../db/main'

const secretKey = process.env.JWT_SECRET_KEY || "";

export async function checkStudent(req: Request, res: Response, next: NextFunction) : Promise<any> {
    // check jwt token
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        jwt.verify(token, secretKey);
        const decoded = jwt.decode(token) as JwtPayload;
        const student = await prisma.student.findUnique({
            where: {
                id: decoded.id
            }
        });

        if(!student) {
            return res.status(401).send('Unauthorized');
        }

        req.headers["student-id"] = decoded.id;

        next();
    } catch (error) {
        return res.status(401).send('Unauthorized');
    }   
}

export async function checkTeacher(req: Request, res: Response, next: NextFunction): Promise<any> {
    // check jwt token
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        jwt.verify(token, secretKey);
        const decoded = jwt.decode(token) as JwtPayload;
        const teacher = await prisma.teacher.findUnique({
            where: {
                id: decoded.id
            }
        });

        if(!teacher) {
            return res.status(401).send('Unauthorized');
        }

        req.headers["teacher-id"] = decoded.id;
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized');
    }   
}