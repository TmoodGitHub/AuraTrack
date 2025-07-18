import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder: just logs for now
  console.log('Auth middleware hit');
  next();
};

export default authMiddleware;
