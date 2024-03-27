export declare module 'axios' {
  interface AxiosRequestConfig {
    fetchOptions?: Omit<
      RequestInit,
      'headers' | 'method' | 'body' | 'credentials'
    >;
  }
}
