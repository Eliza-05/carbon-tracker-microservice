import { CarbonEmissionValidationError } from '../carbonEmissionValidationError';

describe('CarbonEmissionValidationError', () => {
  it('stores code, field and message, and is recognizable via instanceof', () => {
    const error = new CarbonEmissionValidationError(
      'NEGATIVE_VALUE',
      'distanceKm',
      'distanceKm must not be negative',
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CarbonEmissionValidationError);
    expect(error.name).toBe('CarbonEmissionValidationError');
    expect(error.code).toBe('NEGATIVE_VALUE');
    expect(error.field).toBe('distanceKm');
    expect(error.message).toBe('distanceKm must not be negative');
  });
});
