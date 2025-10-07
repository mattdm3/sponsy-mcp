export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  options?: GetOptions;
}

export interface GetOptions {
  params?: Record<string, string>;
  headers?: HeadersInit;
  body?: BodyInit;
}
