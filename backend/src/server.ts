import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Controllers
import authController from './controllers/auth.controller';
import employeeController from './controllers/employee.controller';
import employerController from './controllers/employer.controller';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authController);
app.use('/api/v1/employee', employeeController);
app.use('/api/v1/hr', employerController);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Bootstrap server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 SyncHR SaaS Server booted successfully`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
