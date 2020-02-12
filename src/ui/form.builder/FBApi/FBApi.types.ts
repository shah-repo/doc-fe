export interface Response {
  abort: () => void;
  promise: Promise<any>;
}

export interface Adapter {
  get(path: string, data?: {}, options?: {}): Response;
  patch(path: string, data?: {}, options?: {}): Response;
  post(path: string, data?: {}, options?: {}): Response;
  put(path: string, data?: {}, options?: {}): Response;
  del(path: string, data?: {}, options?: {}): Response;
}
