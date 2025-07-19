import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1h') as StringValue;

export function signToken(payload: { id: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { id: string; role: string } {
  return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = (req as any).cookies?.jwt;
  if (token) {
    try {
      const decoded = verifyToken(token);
      (req as any).user = { id: decoded.id, role: decoded.role };
    } catch {
      // If token is invalid or expired, continue without attaching a user
    }
  }
  next();
};

export default authMiddleware;
