export type VehicleType = 'ELECTRIC' | 'DIESEL' | 'HYBRID';

export interface CarbonEmissionInput {
  vehicleType: VehicleType;
  cargoWeightTons: number;
  distanceKm: number;
  efficiencyFactor: number;
}

// Forma de los datos tal como pueden llegar antes de validarse (p. ej. desde un body HTTP).
export type RawCarbonEmissionInput = {
  [K in keyof CarbonEmissionInput]?: unknown;
};
