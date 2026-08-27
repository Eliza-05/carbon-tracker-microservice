import { CarbonEmissionInput } from './carbonEmission.types';

export type CarbonEmissionValidationErrorCode =
  | 'MISSING_FIELD'
  | 'INVALID_TYPE'
  | 'UNSUPPORTED_VEHICLE_TYPE'
  | 'NEGATIVE_VALUE'
  | 'NON_POSITIVE_EFFICIENCY_FACTOR'
  | 'VALUE_EXCEEDS_MAXIMUM';

// Error de dominio, sin conocimiento de HTTP. `code` permite a la capa de API
// distinguir causas sin parsear `message`; `field` identifica el dato afectado.
export class CarbonEmissionValidationError extends Error {
  constructor(
    public readonly code: CarbonEmissionValidationErrorCode,
    public readonly field: keyof CarbonEmissionInput,
    message: string,
  ) {
    super(message);
    this.name = 'CarbonEmissionValidationError';
    Object.setPrototypeOf(this, CarbonEmissionValidationError.prototype);
  }
}
