import bind from '../helpers/bind';
import buildFullPath from '../helpers/buildFullPath';
import combineURLs from '../helpers/combineURLs';
import buildURL, { encode } from '../helpers/buildURL';
import settle from '../helpers/settle';
import isAbsoluteURL from '../helpers/isAbsoluteURL';

describe('bind', () => {
  test('should bind function to thisArg', () => {
    const thisArg = { value: 'test' };
    const fn = function () {
      return this.value;
    };
    const bindFn = bind(fn, thisArg);
    expect(bindFn()).toBe('test');
  });
});

describe('buildFullPath', () => {
  test('should build full path when relative path starts with /', () => {
    const baseURL = 'https://api.github.com';
    const relativePath = '/users';
    expect(buildFullPath(baseURL, relativePath)).toBe(
      'https://api.github.com/users',
    );
  });

  test('should build full path when relative path does not start with /', () => {
    const baseURL = 'https://api.github.com';
    const relativePath = 'users';
    expect(buildFullPath(baseURL, relativePath)).toBe(
      'https://api.github.com/users',
    );
  });

  test('should return baseURL when relative path is empty', () => {
    const baseURL = 'https://api.github.com';
    const relativePath = '';
    expect(buildFullPath(baseURL, relativePath)).toBe('https://api.github.com');
  });
});
/*
describe("buildURL", () => {
  test("should build URL when params are provided", () => {
    const baseURL = "https://api.github.com";
    const params = { id: 123 };
    const paramsSerializer = (params) =>
      Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    expect(buildURL(baseURL, params, paramsSerializer)).toBe(
      "https://api.github.com?id=123"
    );
  });

  test("should return baseURL when params are not provided", () => {
    const baseURL = "https://api.github.com";
    const paramsSerializer = (params) =>
      Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    expect(buildURL(baseURL, {}, paramsSerializer)).toBe(
      "https://api.github.com"
    );
  });

  test("should return encoded URL when params are special characters", () => {
    const baseURL = "https://api.github.com";
    const params = { id: "@#$%" };
    const paramsSerializer = (params: { id: string }) =>
      Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    expect(buildURL(baseURL, params, paramsSerializer)).toBe(
      "https://api.github.com?id=%40%23%24%25"
    );
  });

  test("should return URL with array params when params are an array", () => {
    const baseURL = "https://api.github.com";
    const params = { id: [123, 456] };
    const paramsSerializer = (params: { id: number[] }) =>
      Object.entries(params)
        .map(([key, value]) => `${key}=${value.join(",")}`)
        .join("&");
    expect(buildURL(baseURL, params, paramsSerializer)).toBe(
      "https://api.github.com?id=123,456"
    );
  });

  test("should return URL with date params when params are a date", () => {
    const baseURL = "https://api.github.com";
    const params = { date: new Date("2020-01-01") };
    const paramsSerializer = (params: { date: Date }) =>
      Object.entries(params)
        .map(([key, value]) => `${key}=${value.toISOString()}`)
        .join("&");
    expect(buildURL(baseURL, params, paramsSerializer)).toBe(
      "https://api.github.com?date=2020-01-01T00:00:00.000Z"
    );
  });

  test("should return URL with object params when params are an object", () => {
    const baseURL = "https://api.github.com";
    const params = { data: 123 };
    const paramsSerializer = (params) =>
      Object.entries(params)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join("&");
    expect(buildURL(baseURL, params, paramsSerializer)).toBe(
      "https://api.github.com?data=123"
    );
  });
}); */
describe('buildURL', () => {
  test('should return URL with no params when params are not provided', () => {
    const baseURL = 'https://api.github.com';
    expect(buildURL(baseURL)).toBe('https://api.github.com');
  });

  test('should return URL with params when params are provided', () => {
    const baseURL = 'https://api.github.com';
    const params = { id: 123 };
    expect(buildURL(baseURL, params)).toBe('https://api.github.com?id=123');
  });

  test('should return URL with serialized params when paramsSerializer is provided', () => {
    const baseURL = 'https://api.github.com';
    const params = { id: 123 };
    const paramsSerializer = (params) =>
      Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    expect(buildURL(baseURL, params, paramsSerializer)).toBe(
      'https://api.github.com?id=123',
    );
  });

  test('should return URL without hash when URL contains hash', () => {
    const baseURL = 'https://api.github.com#hash';
    const params = { id: 123 };
    expect(buildURL(baseURL, params)).toBe('https://api.github.com?id=123');
  });
});

describe('settle', () => {
  test('should resolve promise when request is successful', async () => {
    const mockResolve = jest.fn();
    const mockReject = jest.fn();
    const mockResponse = {
      data: 'data',
      status: 200,
      config: { validateStatus: () => true },
    };

    await settle(mockResolve, mockReject, mockResponse);

    expect(mockResolve).toHaveBeenCalledWith(mockResponse);
    expect(mockReject).not.toHaveBeenCalled();
  });

  test('should reject promise when request fails', async () => {
    const mockResolve = jest.fn();
    const mockReject = jest.fn();
    const mockResponse = {
      data: 'error',
      status: 500,
      config: { validateStatus: () => false },
    };

    await settle(mockResolve, mockReject, mockResponse);

    expect(mockReject).toHaveBeenCalled();
    expect(mockResolve).not.toHaveBeenCalled();
  });
});

describe('isAbsoluteURL', () => {
  test('should return true when URL is absolute', () => {
    const url = 'http://www.google.com';
    expect(isAbsoluteURL(url)).toBe(true);
  });

  test('should return false when URL is relative', () => {
    const url = '/path/to/resource';
    expect(isAbsoluteURL(url)).toBe(false);
  });
});

describe('combineURLs', () => {
  test('should combine URL and relative path correctly', () => {
    const baseURL = 'http://www.google.com';
    const relativePath = '/path/to/resource';
    expect(combineURLs(baseURL, relativePath)).toBe(
      'http://www.google.com/path/to/resource',
    );
  });
});

describe('encode', () => {
  test('should correctly encode a string', () => {
    const str = 'Hello World!';
    const encodedStr = encode(str);
    expect(encodedStr).toBe('Hello+World!');
  });
});
