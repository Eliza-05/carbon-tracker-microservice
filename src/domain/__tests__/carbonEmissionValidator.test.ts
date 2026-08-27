import { validateCarbonEmissionInput } from '../carbonEmissionValidator';
import { CarbonEmissionValidationError } from '../carbonEmissionValidationError';
import { RawCarbonEmissionInput } from '../carbonEmission.types';
import {
  MAX_CARGO_WEIGHT_TONS,
  MAX_DISTANCE_KM,
  MAX_EFFICIENCY_FACTOR,
} from '../../config/validationLimits.config';

function buildRawInput(overrides: RawCarbonEmissionInput = {}): RawCarbonEmissionInput {
  return {
    vehicleType: 'DIESEL',
    cargoWeightTons: 10,
    distanceKm: 500,
    efficiencyFactor: 1,
    ...overrides,
  };
}

function getThrownValidationError(raw: RawCarbonEmissionInput): CarbonEmissionValidationError {
  try {
    validateCarbonEmissionInput(raw);
  } catch (error) {
    if (error instanceof CarbonEmissionValidationError) {
      return error;
    }
    throw error;
  }
  throw new Error('Expected validateCarbonEmissionInput to throw a CarbonEmissionValidationError');
}

describe('validateCarbonEmissionInput', () => {
  it('returns the validated input unchanged when all fields are valid', () => {
    const raw = buildRawInput();

    expect(validateCarbonEmissionInput(raw)).toEqual(raw);
  });

  it('accepts distanceKm equal to 0', () => {
    const raw = buildRawInput({ distanceKm: 0 });

    expect(() => validateCarbonEmissionInput(raw)).not.toThrow();
  });

  it('accepts cargoWeightTons equal to 0', () => {
    const raw = buildRawInput({ cargoWeightTons: 0 });

    expect(() => validateCarbonEmissionInput(raw)).not.toThrow();
  });

  it('rejects a negative distanceKm', () => {
    const error = getThrownValidationError(buildRawInput({ distanceKm: -1 }));

    expect(error.code).toBe('NEGATIVE_VALUE');
    expect(error.field).toBe('distanceKm');
  });

  it('rejects a negative cargoWeightTons', () => {
    const error = getThrownValidationError(buildRawInput({ cargoWeightTons: -5 }));

    expect(error.code).toBe('NEGATIVE_VALUE');
    expect(error.field).toBe('cargoWeightTons');
  });

  it('rejects efficiencyFactor equal to 0', () => {
    const error = getThrownValidationError(buildRawInput({ efficiencyFactor: 0 }));

    expect(error.code).toBe('NON_POSITIVE_EFFICIENCY_FACTOR');
    expect(error.field).toBe('efficiencyFactor');
  });

  it('rejects a negative efficiencyFactor', () => {
    const error = getThrownValidationError(buildRawInput({ efficiencyFactor: -0.5 }));

    expect(error.code).toBe('NON_POSITIVE_EFFICIENCY_FACTOR');
    expect(error.field).toBe('efficiencyFactor');
  });

  it('rejects an unsupported vehicle type', () => {
    const error = getThrownValidationError(buildRawInput({ vehicleType: 'GASOLINE' }));

    expect(error.code).toBe('UNSUPPORTED_VEHICLE_TYPE');
    expect(error.field).toBe('vehicleType');
  });

  it('accepts distanceKm equal to the maximum allowed value', () => {
    const raw = buildRawInput({ distanceKm: MAX_DISTANCE_KM });

    expect(() => validateCarbonEmissionInput(raw)).not.toThrow();
  });

  it('rejects distanceKm above the maximum allowed value', () => {
    const error = getThrownValidationError(buildRawInput({ distanceKm: MAX_DISTANCE_KM + 1 }));

    expect(error.code).toBe('VALUE_EXCEEDS_MAXIMUM');
    expect(error.field).toBe('distanceKm');
  });

  it('accepts cargoWeightTons equal to the maximum allowed value', () => {
    const raw = buildRawInput({ cargoWeightTons: MAX_CARGO_WEIGHT_TONS });

    expect(() => validateCarbonEmissionInput(raw)).not.toThrow();
  });

  it('rejects cargoWeightTons above the maximum allowed value', () => {
    const error = getThrownValidationError(buildRawInput({ cargoWeightTons: MAX_CARGO_WEIGHT_TONS + 1 }));

    expect(error.code).toBe('VALUE_EXCEEDS_MAXIMUM');
    expect(error.field).toBe('cargoWeightTons');
  });

  it('accepts efficiencyFactor equal to the maximum allowed value', () => {
    const raw = buildRawInput({ efficiencyFactor: MAX_EFFICIENCY_FACTOR });

    expect(() => validateCarbonEmissionInput(raw)).not.toThrow();
  });

  it('rejects efficiencyFactor above the maximum allowed value', () => {
    const error = getThrownValidationError(buildRawInput({ efficiencyFactor: MAX_EFFICIENCY_FACTOR + 1 }));

    expect(error.code).toBe('VALUE_EXCEEDS_MAXIMUM');
    expect(error.field).toBe('efficiencyFactor');
  });

  describe('missing required fields', () => {
    const requiredFields: Array<keyof RawCarbonEmissionInput> = [
      'vehicleType',
      'distanceKm',
      'cargoWeightTons',
      'efficiencyFactor',
    ];

    it.each(requiredFields)('rejects the input when %s is missing', (field) => {
      const raw = buildRawInput();
      delete raw[field];

      const error = getThrownValidationError(raw);

      expect(error.code).toBe('MISSING_FIELD');
      expect(error.field).toBe(field);
    });
  });

  describe('non-finite numeric values', () => {
    const invalidNumericCases: Array<[keyof RawCarbonEmissionInput, number]> = [
      ['distanceKm', NaN],
      ['distanceKm', Infinity],
      ['cargoWeightTons', NaN],
      ['cargoWeightTons', Infinity],
      ['efficiencyFactor', NaN],
      ['efficiencyFactor', Infinity],
    ];

    it.each(invalidNumericCases)('rejects %s when the value is %p', (field, value) => {
      const raw: RawCarbonEmissionInput = { ...buildRawInput(), [field]: value };

      const error = getThrownValidationError(raw);

      expect(error.code).toBe('INVALID_TYPE');
      expect(error.field).toBe(field);
    });
  });
});
