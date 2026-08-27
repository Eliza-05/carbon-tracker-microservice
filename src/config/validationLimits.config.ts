// Límites superiores razonables para este ejercicio académico, no restricciones operativas reales.
// Evitan que la multiplicación distancia x carga x eficiencia desborde a Infinity.
export const MAX_DISTANCE_KM = 20_000; // más que la distancia terrestre más larga posible en una sola ruta
export const MAX_CARGO_WEIGHT_TONS = 200; // rango superior de carga para camiones/trenes de carga pesada
export const MAX_EFFICIENCY_FACTOR = 10; // el factor es un multiplicador cercano a 1.0; 10x cubre cualquier ajuste realista
