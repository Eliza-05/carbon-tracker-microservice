import { VehicleType } from '../domain/carbonEmission.types';

// Valores de referencia académica, no factores oficiales o certificados.
// Unidad: kg CO2 por tonelada-kilómetro.
export const EMISSION_FACTOR_BASE_BY_VEHICLE_TYPE: Record<VehicleType, number> = {
  DIESEL: 0.12,
  HYBRID: 0.07,
  ELECTRIC: 0.03,
};
