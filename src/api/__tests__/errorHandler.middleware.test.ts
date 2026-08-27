import { Request, Response } from 'express';
import { errorHandler } from '../errorHandler.middleware';

function buildMockResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('responds with a generic 500 message for an unexpected error, without leaking its details', () => {
    const res = buildMockResponse();
    const error = new Error('Sensitive internal detail: /home/user/app/src/secret.ts');

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('logs the technical detail of an unexpected error for server-side diagnostics', () => {
    const res = buildMockResponse();
    const error = new Error('boom');

    errorHandler(error, {} as Request, res, jest.fn());

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String), error);
  });

  it('responds with a generic 400 message for a malformed JSON body error', () => {
    const res = buildMockResponse();
    const malformedJsonError = Object.assign(new SyntaxError('Unexpected token n in JSON'), {
      status: 400,
      body: 'not-json{{{',
    });

    errorHandler(malformedJsonError, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Malformed JSON payload' });
  });

  it('delegates to next when the response headers were already sent', () => {
    const res = { headersSent: true } as Response;
    const next = jest.fn();
    const error = new Error('too late');

    errorHandler(error, {} as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
