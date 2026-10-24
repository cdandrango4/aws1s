import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import type { LoginDto } from '../dtos/auth.dto';
import { ApiResponseHelper } from '../../../shared/api-response';

export class AuthController {
  constructor(private readonly repository: IAuthRepository) {}

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as LoginDto;

      const user = await this.repository.findByEmail(email);
      if (!user) {
        res.status(401).json(ApiResponseHelper.error('Credenciales inválidas', 'UNAUTHORIZED'));
        return;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json(ApiResponseHelper.error('Credenciales inválidas', 'UNAUTHORIZED'));
        return;
      }

      const secret = process.env.JWT_SECRET || 'UnAHeXAdEcImAL_o_FrAsE_UlTrA_SeCrEtA_Y_LaRgA_2026';
      if (!secret) {
        throw new Error('JWT_SECRET no está configurado');
      }

      const token = jwt.sign({ id: user._id, rol: user.rol }, secret, { expiresIn: '2h' });

      res.status(200).json(
        ApiResponseHelper.success(
          { token, user: { id: user._id, email: user.email, rol: user.rol } },
          'Autenticación exitosa'
        )
      );
    } catch (error) {
      next(error);
    }
  };
}
