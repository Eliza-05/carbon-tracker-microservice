import { CarbonEmissionInput } from './carbonEmission.types';
import { EMISSION_FACTOR_BASE_BY_VEHICLE_TYPE } from '../config/emissionFactors.config';

export function calculateCarbonEmissionsKg(input: CarbonEmissionInput): number {
  const emissionFactorBase = EMISSION_FACTOR_BASE_BY_VEHICLE_TYPE[input.vehicleType];
  const result = input.distanceKm * input.cargoWeightTons * emissionFactorBase * input.efficiencyFactor;

  if (!Number.isFinite(result)) {
    throw new RangeError('Calculated carbon emissions value is not finite');
  }

  return result;
}
