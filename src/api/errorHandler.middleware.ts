import { NextFunction, Request, Response } from 'express';

interface MalformedJsonError extends SyntaxError {
  status?: number;
  body?: unknown;
}

function isMalformedJsonError(error: unknown): error is MalformedJsonError {
  return error instanceof SyntaxError && (error as MalformedJsonError).status === 400 && 'body' in error;
}

// Middleware de errores de Express: debe declarar exactamente 4 parámetros para que
// Express lo reconozca como manejador de errores, aunque `next` no siempre se use.
export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (isMalformedJsonError(error)) {
    res.status(400).json({ message: 'Malformed JSON payload' });
    return;
  }

  console.error('Unhandled error while processing request:', error);
  res.status(500).json({ message: 'Internal server error' });
}
