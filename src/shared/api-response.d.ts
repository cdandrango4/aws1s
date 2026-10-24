export interface ApiErrorDetail {
    field?: string;
    message: string;
}
export interface ApiErrorInfo {
    code: string;
    details: ApiErrorDetail[] | string | any;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    error: ApiErrorInfo | null;
}
export declare class ApiResponseHelper {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static error(message: string, code?: string, details?: ApiErrorDetail[] | string | any): ApiResponse<null>;
}
//# sourceMappingURL=api-response.d.ts.map