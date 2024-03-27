'use strict';

import { AxiosError, AxiosResponse } from 'axios';

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
      new AxiosError(
        'Request failed with status code ' + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][
          Math.floor(response.status / 100) - 4
        ],
        response.config,
        response.request,
        response,
      ),
    );
  }
}
