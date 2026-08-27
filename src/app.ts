import express, { Express } from 'express';
import carbonEmissionRouter from './api/carbonEmission.routes';
import { errorHandler } from './api/errorHandler.middleware';

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api', carbonEmissionRouter);
  app.use(errorHandler);
  return app;
}
