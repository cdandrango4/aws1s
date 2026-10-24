import type { ErrorRequestHandler } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    code: string;
    details: any;
    constructor(message: string, statusCode?: number, code?: string, details?: any);
}
export declare const errorHandler: ErrorRequestHandler;
//# sourceMappingURL=error-handler.middleware.d.ts.map