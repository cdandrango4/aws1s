export class ApiResponseHelper {
    static success(data, message = 'Operación completada con éxito') {
        return {
            success: true,
            message,
            data,
            error: null
        };
    }
    static error(message, code = 'INTERNAL_ERROR', details = null) {
        return {
            success: false,
            message,
            data: null,
            error: {
                code,
                details: details ?? []
            }
        };
    }
}
//# sourceMappingURL=api-response.js.map