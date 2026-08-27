import request from 'supertest';
import { createApp } from '../app';
import { MAX_DISTANCE_KM } from '../config/validationLimits.config';

describe('createApp', () => {
  const app = createApp();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('returns 200 with the calculated emissions for a valid request', async () => {
    const response = await request(app).post('/api/carbon-emissions').send({
      vehicleType: 'DIESEL',
      cargoWeightTons: 10,
      distanceKm: 500,
      efficiencyFactor: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ emissionsKg: 600 });
  });

  it('returns 400 with a domain error code when a required field is missing', async () => {
    const response = await request(app).post('/api/carbon-emissions').send({
      cargoWeightTons: 10,
      distanceKm: 500,
      efficiencyFactor: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'MISSING_FIELD',
      field: 'vehicleType',
      message: 'vehicleType is required',
    });
  });

  it('returns 400 when the vehicle type is not supported', async () => {
    const response = await request(app).post('/api/carbon-emissions').send({
      vehicleType: 'GASOLINE',
      cargoWeightTons: 10,
      distanceKm: 500,
      efficiencyFactor: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('UNSUPPORTED_VEHICLE_TYPE');
    expect(response.body.field).toBe('vehicleType');
  });

  it('returns 400 when a numeric value exceeds its configured maximum', async () => {
    const response = await request(app)
      .post('/api/carbon-emissions')
      .send({
        vehicleType: 'DIESEL',
        cargoWeightTons: 10,
        distanceKm: MAX_DISTANCE_KM + 1,
        efficiencyFactor: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALUE_EXCEEDS_MAXIMUM');
    expect(response.body.field).toBe('distanceKm');
  });

  it('returns a generic 400 response for malformed JSON without leaking server details', async () => {
    const response = await request(app)
      .post('/api/carbon-emissions')
      .set('Content-Type', 'application/json')
      .send('not-json{{{');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Malformed JSON payload' });
    expect(JSON.stringify(response.body)).not.toMatch(/at Object|node_modules|\.ts:\d+/);
  });
});
