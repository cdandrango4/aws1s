import { ZodError } from 'zod';
import { ApiResponseHelper } from '../shared/api-response';
export class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode = 400, code = 'APP_ERROR', details = null) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
export const errorHandler = (err, _req, res, _next) => {
    console.error('⚠️ [ErrorHandler]:', err?.message || err);
    if (err instanceof ZodError || err?.name === 'ZodError') {
        const rawIssues = err.issues || err.errors || [];
        const details = rawIssues.map((issue) => ({
            field: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path || ''),
            message: issue.message
        }));
        res.status(400).json(ApiResponseHelper.error('Los datos enviados no son válidos', 'VALIDATION_ERROR', details));
        return;
    }
    if (err instanceof AppError) {
        res.status(err.statusCode).json(ApiResponseHelper.error(err.message, err.code, err.details));
        return;
    }
    // Errores no controlados (blindaje de excepciones crudas)
    const isDev = process.env.NODE_ENV === 'development';
    res.status(500).json(ApiResponseHelper.error('Ha ocurrido un error interno en el servidor', 'INTERNAL_SERVER_ERROR', isDev ? err?.message : undefined));
};
//# sourceMappingURL=error-handler.middleware.js.map