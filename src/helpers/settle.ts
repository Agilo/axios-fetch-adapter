'use strict';

import { AxiosResponse } from 'axios';
import { createError } from './createError';

/**
 * Resolve or reject a Promise based on response status.
 */
export default function settle<Response extends AxiosResponse>(
  resolve: {
    (value: Response | PromiseLike<Response>): void;
    (arg0: any): void;
  },
  reject: (reason?: any) => void,
  response: Response,
) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      createError(
        'Request failed with status code ' + response.status,
        response.config,
        response.status.toString(),
        response.request,
        response,
      ),
    );
  }
}
