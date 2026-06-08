import express from 'express';
import cors from 'cors'
import subjectsRouter from './routes/subjects';

import { FRONTEND_URL, PORT } from './config/env';


const app = express();


app.use(express.json());

if (!FRONTEND_URL) throw new Error('FRONTEND_URL is not set');

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use('/api/subjects', subjectsRouter)


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Classly API' });
});


app.listen(PORT || 8000, () => {
  console.log(`Server is running at http://localhost:${PORT || 8000}`);
});