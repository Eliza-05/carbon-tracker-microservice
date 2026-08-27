import { Request, Response, NextFunction } from 'express';
import { computeCarbonEmissionsKg } from '../domain/carbonEmissionService';
import { CarbonEmissionValidationError } from '../domain/carbonEmissionValidationError';

export function calculateCarbonEmission(req: Request, res: Response, next: NextFunction): void {
  try {
    const emissionsKg = computeCarbonEmissionsKg(req.body);
    res.status(200).json({ emissionsKg });
  } catch (error) {
    if (error instanceof CarbonEmissionValidationError) {
      res.status(400).json({
        code: error.code,
        field: error.field,
        message: error.message,
      });
      return;
    }
    next(error);
  }
}
