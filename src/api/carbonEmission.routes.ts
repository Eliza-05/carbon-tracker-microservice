import { Router } from 'express';
import { calculateCarbonEmission } from './carbonEmission.controller';

const carbonEmissionRouter = Router();

carbonEmissionRouter.post('/carbon-emissions', calculateCarbonEmission);

export default carbonEmissionRouter;
