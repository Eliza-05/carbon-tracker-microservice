import { RawCarbonEmissionInput } from './carbonEmission.types';
import { validateCarbonEmissionInput } from './carbonEmissionValidator';
import { calculateCarbonEmissionsKg } from './carbonEmissionCalculator';

export function computeCarbonEmissionsKg(raw: RawCarbonEmissionInput): number {
  const validatedInput = validateCarbonEmissionInput(raw);
  return calculateCarbonEmissionsKg(validatedInput);
}
