import { calculateCarbonEmissionsKg } from '../carbonEmissionCalculator';
import { EMISSION_FACTOR_BASE_BY_VEHICLE_TYPE } from '../../config/emissionFactors.config';
import { CarbonEmissionInput, VehicleType } from '../carbonEmission.types';

function buildInput(overrides: Partial<CarbonEmissionInput> = {}): CarbonEmissionInput {
  return {
    vehicleType: 'DIESEL',
    cargoWeightTons: 10,
    distanceKm: 500,
    efficiencyFactor: 1,
    ...overrides,
  };
}

describe('calculateCarbonEmissionsKg', () => {
  it.each<VehicleType>(['DIESEL', 'ELECTRIC', 'HYBRID'])(
    'calculates emissions for a %s vehicle as distance x cargo x emission factor x efficiency',
    (vehicleType) => {
      const input = buildInput({ vehicleType, distanceKm: 500, cargoWeightTons: 10, efficiencyFactor: 1.2 });

      const result = calculateCarbonEmissionsKg(input);

      const expected =
        input.distanceKm *
        input.cargoWeightTons *
        EMISSION_FACTOR_BASE_BY_VEHICLE_TYPE[vehicleType] *
        input.efficiencyFactor;
      expect(result).toBeCloseTo(expected);
    },
  );

  it('returns 0 when distanceKm is 0', () => {
    const input = buildInput({ distanceKm: 0 });

    expect(calculateCarbonEmissionsKg(input)).toBe(0);
  });

  it('returns 0 when cargoWeightTons is 0', () => {
    const input = buildInput({ cargoWeightTons: 0 });

    expect(calculateCarbonEmissionsKg(input)).toBe(0);
  });

  it('produces a lower result when efficiencyFactor is below the standard factor of 1.0', () => {
    const standardResult = calculateCarbonEmissionsKg(buildInput({ efficiencyFactor: 1 }));
    const moreEfficientResult = calculateCarbonEmissionsKg(buildInput({ efficiencyFactor: 0.5 }));

    expect(moreEfficientResult).toBeLessThan(standardResult);
  });

  it('produces a higher result when efficiencyFactor is above the standard factor of 1.0', () => {
    const standardResult = calculateCarbonEmissionsKg(buildInput({ efficiencyFactor: 1 }));
    const lessEfficientResult = calculateCarbonEmissionsKg(buildInput({ efficiencyFactor: 1.5 }));

    expect(lessEfficientResult).toBeGreaterThan(standardResult);
  });

  it('throws when the calculation overflows to a non-finite result', () => {
    const input = buildInput({
      distanceKm: Number.MAX_VALUE,
      cargoWeightTons: Number.MAX_VALUE,
      efficiencyFactor: Number.MAX_VALUE,
    });

    expect(() => calculateCarbonEmissionsKg(input)).toThrow('Calculated carbon emissions value is not finite');
  });
});
