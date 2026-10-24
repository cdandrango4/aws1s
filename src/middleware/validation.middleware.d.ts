import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
type RequestPart = 'body' | 'params' | 'query';
export declare const validateRequest: (schema: ZodSchema, part?: RequestPart) => (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map