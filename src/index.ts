import { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';
import settle from './helpers/settle';
import buildURL from './helpers/buildURL';
import buildFullPath from './helpers/buildFullPath';
import { isUndefined, isStandardBrowserEnv, isFormData } from './utils';
import { createError } from './helpers/createError';

/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */
const fetchAdapter: AxiosAdapter = async (config) => {
  const request = createRequest(config);
  const promiseChain = [getResponse(request, config)];

  if (config.timeout && config.timeout > 0) {
    promiseChain.push(
      new Promise((res) => {
        setTimeout(() => {
          const message = config.timeoutErrorMessage
            ? config.timeoutErrorMessage
            : 'timeout of ' + config.timeout + 'ms exceeded';
          res(createError(message, config, 'ECONNABORTED', request));
        }, config.timeout);
      }),
    );
  }

  const data = await Promise.race(promiseChain);
  return new Promise((resolve, reject) => {
    if (data instanceof Error) {
      reject(data);
    } else {
      settle(resolve, reject, data);
    }
  });
};

/**
 * Fetch API stage two is to get response body. This function tries to retrieve
 * response body based on response's type
 */
async function getResponse(
  request: Request,
  config: AxiosRequestConfig,
): Promise<AxiosResponse | Error> {
  let stageOne: Response;
  try {
    stageOne = await fetch(request);
  } catch (e) {
    return createError('Network Error', config, 'ERR_NETWORK', request);
  }

  let data: any;
  if (stageOne.status >= 200 && stageOne.status !== 204) {
    switch (config.responseType) {
      case 'arraybuffer':
        data = await stageOne.arrayBuffer();
        break;
      case 'blob':
        data = await stageOne.blob();
        break;
      case 'json':
        data = await stageOne.json();
        break;
      case 'stream':
        data = stageOne.body;
        break;
      default:
        data = await stageOne.text();
        break;
    }
  }

  const response: AxiosResponse<any> = {
    data,
    status: stageOne.status,
    statusText: stageOne.statusText,
    headers: Object.fromEntries(Object.entries(stageOne.headers)), // Make a copy of headers
    config: config,
    request,
  };

  return response;
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config: AxiosRequestConfig): Request {
  const headers = config.headers
    ? new Headers(
        Object.keys(config.headers).reduce((obj, key) => {
          if (config.headers === undefined) throw Error();
          obj[key] = String(config.headers[key]);
          return obj;
        }, {}),
      )
    : new Headers({});

  // HTTP basic authentication
  if (config.auth) {
    const username = config.auth.username || '';
    const password = config.auth.password
      ? decodeURI(encodeURIComponent(config.auth.password))
      : '';
    headers.set(
      'Authorization',
      `Basic ${Buffer.from(username + ':' + password).toString('base64')}`,
    );
  }

  const method = config.method?.toUpperCase();
  const options: Partial<Writeable<Request>> = {
    headers: headers,
    method,
  };
  if (method !== 'GET' && method !== 'HEAD') {
    options.body = config.data;

    // In these cases the browser will automatically set the correct Content-Type,
    // but only if that header hasn't been set yet. So that's why we're deleting it.
    if (isFormData(options.body) && isStandardBrowserEnv()) {
      headers.delete('Content-Type');
    }
  }
  // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
  // So if withCredentials is not set, default value 'same-origin' will be used
  if (!isUndefined(config.withCredentials)) {
    options.credentials = config.withCredentials ? 'include' : 'omit';
  }

  const fullPath = buildFullPath(config.baseURL, config.url);
  const url = buildURL(fullPath, config.params, config.paramsSerializer);

  // Expected browser to throw error if there is any wrong configuration value
  return new Request(url, options);
}

export default fetchAdapter;
