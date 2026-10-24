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

export class ApiResponseHelper {
  static success<T>(data: T, message = 'Operación completada con éxito'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      error: null
    };
  }

  static error(
    message: string,
    code = 'INTERNAL_ERROR',
    details: ApiErrorDetail[] | string | any = null
  ): ApiResponse<null> {
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
