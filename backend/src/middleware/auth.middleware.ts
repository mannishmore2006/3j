import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sync_hr_saas_portal_jwt_secret_key_2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  employeeId?: string;
}

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

export function authenticateJWT(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Session expired or invalid token' });
      }

      req.user = decoded as AuthenticatedUser;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header is missing' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    next();
  };
}
