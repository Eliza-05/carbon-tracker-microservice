import { computeCarbonEmissionsKg } from '../carbonEmissionService';
import { calculateCarbonEmissionsKg } from '../carbonEmissionCalculator';
import { CarbonEmissionValidationError } from '../carbonEmissionValidationError';
import { CarbonEmissionInput, RawCarbonEmissionInput } from '../carbonEmission.types';

describe('computeCarbonEmissionsKg', () => {
  it('validates and calculates emissions for a valid input', () => {
    const input: CarbonEmissionInput = {
      vehicleType: 'DIESEL',
      cargoWeightTons: 8,
      distanceKm: 200,
      efficiencyFactor: 1.1,
    };

    const result = computeCarbonEmissionsKg(input);

    expect(result).toBe(calculateCarbonEmissionsKg(input));
  });

  it('propagates a CarbonEmissionValidationError without transforming it when the input is invalid', () => {
    const raw: RawCarbonEmissionInput = {
      vehicleType: 'GASOLINE',
      cargoWeightTons: 8,
      distanceKm: 200,
      efficiencyFactor: 1,
    };

    expect(() => computeCarbonEmissionsKg(raw)).toThrow(CarbonEmissionValidationError);
  });
});
