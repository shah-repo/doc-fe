import { ApiActionMethod } from "../../../state/types";

interface Response {
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

export interface FBRequestTemplateUrl {
  url: string;
  values: Record<string, any>;
}

export interface FBRequestSet<Body> {
  url?: string;
  urlValues?: Record<string, any>;
  body?: Body;
  method?: ApiActionMethod;
}
