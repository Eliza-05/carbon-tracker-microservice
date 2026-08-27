import { CarbonEmissionInput, RawCarbonEmissionInput, VehicleType } from './carbonEmission.types';
import { CarbonEmissionValidationError } from './carbonEmissionValidationError';
import {
  MAX_CARGO_WEIGHT_TONS,
  MAX_DISTANCE_KM,
  MAX_EFFICIENCY_FACTOR,
} from '../config/validationLimits.config';

export const SUPPORTED_VEHICLE_TYPES: readonly VehicleType[] = ['ELECTRIC', 'DIESEL', 'HYBRID'];

function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isSupportedVehicleType(value: unknown): value is VehicleType {
  return typeof value === 'string' && (SUPPORTED_VEHICLE_TYPES as string[]).includes(value);
}

export function validateCarbonEmissionInput(raw: RawCarbonEmissionInput): CarbonEmissionInput {
  const { vehicleType, cargoWeightTons, distanceKm, efficiencyFactor } = raw;

  if (!isPresent(vehicleType)) {
    throw new CarbonEmissionValidationError('MISSING_FIELD', 'vehicleType', 'vehicleType is required');
  }
  if (!isPresent(distanceKm)) {
    throw new CarbonEmissionValidationError('MISSING_FIELD', 'distanceKm', 'distanceKm is required');
  }
  if (!isPresent(cargoWeightTons)) {
    throw new CarbonEmissionValidationError('MISSING_FIELD', 'cargoWeightTons', 'cargoWeightTons is required');
  }
  if (!isPresent(efficiencyFactor)) {
    throw new CarbonEmissionValidationError('MISSING_FIELD', 'efficiencyFactor', 'efficiencyFactor is required');
  }

  if (!isSupportedVehicleType(vehicleType)) {
    throw new CarbonEmissionValidationError(
      'UNSUPPORTED_VEHICLE_TYPE',
      'vehicleType',
      `Unsupported vehicle type: ${String(vehicleType)}. Expected one of: ${SUPPORTED_VEHICLE_TYPES.join(', ')}`,
    );
  }
  if (!isFiniteNumber(distanceKm)) {
    throw new CarbonEmissionValidationError('INVALID_TYPE', 'distanceKm', 'distanceKm must be a finite number');
  }
  if (!isFiniteNumber(cargoWeightTons)) {
    throw new CarbonEmissionValidationError(
      'INVALID_TYPE',
      'cargoWeightTons',
      'cargoWeightTons must be a finite number',
    );
  }
  if (!isFiniteNumber(efficiencyFactor)) {
    throw new CarbonEmissionValidationError(
      'INVALID_TYPE',
      'efficiencyFactor',
      'efficiencyFactor must be a finite number',
    );
  }

  if (distanceKm < 0) {
    throw new CarbonEmissionValidationError('NEGATIVE_VALUE', 'distanceKm', 'distanceKm must not be negative');
  }
  if (cargoWeightTons < 0) {
    throw new CarbonEmissionValidationError(
      'NEGATIVE_VALUE',
      'cargoWeightTons',
      'cargoWeightTons must not be negative',
    );
  }
  if (efficiencyFactor <= 0) {
    throw new CarbonEmissionValidationError(
      'NON_POSITIVE_EFFICIENCY_FACTOR',
      'efficiencyFactor',
      'efficiencyFactor must be greater than 0',
    );
  }

  if (distanceKm > MAX_DISTANCE_KM) {
    throw new CarbonEmissionValidationError(
      'VALUE_EXCEEDS_MAXIMUM',
      'distanceKm',
      `distanceKm must not exceed ${MAX_DISTANCE_KM}`,
    );
  }
  if (cargoWeightTons > MAX_CARGO_WEIGHT_TONS) {
    throw new CarbonEmissionValidationError(
      'VALUE_EXCEEDS_MAXIMUM',
      'cargoWeightTons',
      `cargoWeightTons must not exceed ${MAX_CARGO_WEIGHT_TONS}`,
    );
  }
  if (efficiencyFactor > MAX_EFFICIENCY_FACTOR) {
    throw new CarbonEmissionValidationError(
      'VALUE_EXCEEDS_MAXIMUM',
      'efficiencyFactor',
      `efficiencyFactor must not exceed ${MAX_EFFICIENCY_FACTOR}`,
    );
  }

  return { vehicleType, cargoWeightTons, distanceKm, efficiencyFactor };
}
