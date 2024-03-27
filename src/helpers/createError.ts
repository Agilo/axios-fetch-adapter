import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Note:
 *
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 *
 *
 *
 * Create an Error with the specified message, config, error code, request and response.
 */
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code: string,
  request: Request,
  response?: AxiosResponse,
): AxiosError {
  const error = new Error(message);
  return enhanceError(error, config, code, request, response);
}
/**
 *
 * Note:
 *
 *   This function is for backward compatible.
 *
 *
 * Update an Error with the specified config, error code, and response.
 */
function enhanceError(
  error: Error,
  config: AxiosRequestConfig,
  code: string,
  request: Request,
  response: AxiosResponse,
): AxiosError {
  return Object.assign(error, {
    config,
    code: code || undefined,
    request,
    response,
    isAxiosError: true,
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code,
        status:
          this.response && this.response.status ? this.response.status : null,
      };
    },
  });
}
