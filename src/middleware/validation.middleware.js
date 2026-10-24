import { ZodError } from 'zod';
export const validateRequest = (schema, part = 'body') => {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse(req[part]);
            req[part] = parsed;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                next(error);
            }
            else {
                next(error);
            }
        }
    };
};
//# sourceMappingURL=validation.middleware.js.map