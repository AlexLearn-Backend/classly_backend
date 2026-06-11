import express from 'express';
import cors from 'cors'
import subjectsRouter from './routes/subjects';

import { FRONTEND_URL, PORT } from './config/env';
import securityMiddleware from './middlewares/security';


const App = express();


App.use(express.json());

if (!FRONTEND_URL) throw new Error('FRONTEND_URL is not set');

App.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

App.use(securityMiddleware)


App.use('/api/subjects', subjectsRouter)


App.get('/', (req, res) => {
  res.json({ message: 'Welcome to Classly API' });
});


App.listen(PORT || 8000, () => {
  console.log(`Server is running at http://localhost:${PORT || 8000}`);
});