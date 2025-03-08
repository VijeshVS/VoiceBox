import express, { Request, Response } from 'express';
import studentRouter from './routes/student';
import teacherRouter from './routes/teacher';
import sessionRouter from './routes/session';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: "*"
}))
app.get('/health', (req: Request, res: Response) : any => {
  return res.json({
    status: 'UP',
  });
});

app.use('/student',studentRouter);
app.use('/teacher',teacherRouter);
app.use('/session',sessionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
