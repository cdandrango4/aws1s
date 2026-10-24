import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponseHelper } from '../api-response';

export interface AuthUser {
  id: string;
  rol: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json(
      ApiResponseHelper.error('Token de autenticación requerido', 'UNAUTHORIZED')
    );
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  const secret = process.env.JWT_SECRET || 'UnAHeXAdEcImAL_o_FrAsE_UlTrA_SeCrEtA_Y_LaRgA_2026';

  if (!secret) {
    res.status(500).json(
      ApiResponseHelper.error('Configuración de seguridad incompleta', 'INTERNAL_SERVER_ERROR')
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    req.user = { id: decoded.id as string, rol: decoded.rol as string };
    next();
  } catch (error) {
    const expired = error instanceof jwt.TokenExpiredError;
    res.status(403).json(
      ApiResponseHelper.error(
        expired ? 'El token ha expirado' : 'Token inválido',
        'FORBIDDEN'
      )
    );
  }
};
